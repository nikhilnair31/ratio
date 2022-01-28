import * as AuthSession from 'expo-auth-session';
import firebase from 'firebase/compat/app';
import { GithubAuthProvider } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useProxy = Platform.select({ web: false, default: true });
const redirectUrl = AuthSession.makeRedirectUri({ useProxy });
console.log('redirectUrl: ', redirectUrl);

const githubClientIdSecret = { id: '3f69d11b0a1b3b70c654', secret: '01eff770156512ddf124b8912479e267145970c6', };
const githubScopeFields = [ 'user', 'public_repo' ];
const githubAuthDomain = `https://github.com/login/oauth/`;

async function createTokenWithCode(clientIdSecret, code) {
    const url = `https://github.com/login/oauth/access_token` +
        `?client_id=${clientIdSecret.id}` +
        `&client_secret=${clientIdSecret.secret}` +
        `&code=${code}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return res.json();
}
async function redirectSignInGithub (authDomain, clientIdSecret, githubScopeFields) {
    const authUrl = `${authDomain}/authorize` +
        `?client_id=${clientIdSecret.id}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&scope=${encodeURIComponent(githubScopeFields.join(' '))}`
    const {type, params} = await AuthSession.startAsync({authUrl});
    console.log('signInWithGitHub: A: ', { type, params });

    if (type === 'success') {
        const { token_type, scope, access_token } = await createTokenWithCode(clientIdSecret, params.code);
        console.log('signInWithGitHub: B: ', { token_type, scope, access_token, });
        return access_token;
    }
}
async function getGithubUserInfo (githubaccesstoken) {  
    console.log('githubaccesstoken: ', githubaccesstoken);    
    const url = 'https://api.github.com/user';
    const header = {
        Authorization: `Bearer ${githubaccesstoken}`,
        'Client-ID': githubClientIdSecret.id,
    };
    fetch(url, {
        method: 'GET',
        headers: header,
    })
    .then(response => response.json())
    .then(response => {
        const userResponse = response;
        // console.log('userResponse: ', userResponse);
        return userResponse;
    })
    .catch(error => {
        console.log('error: ', error);
    });
}
async function githubSignIn(token, navigation) {
    try {
        if (!token) {
            const token = await redirectSignInGithub(githubAuthDomain, githubClientIdSecret, githubScopeFields);
            const person = await getGithubUserInfo(token);
            console.log('githubSignIn \ntoken: ',token,'\nperson: ',person);
            if (token) {
                await AsyncStorage.setItem('@expo:GithubToken', token);
                return githubSignIn(token, navigation);
            } else {
                return;
            }
        }
        console.log('githubSignIn tokey: ', token);

        const credential = GithubAuthProvider.credential(token);
        console.log('githubSignIn credential: ', credential);
        const userCredential = await firebase.auth().signInWithCredential(credential);
        console.log('githubSignIn userCredential.additionalUserInfo.profile.name: ', userCredential.additionalUserInfo.profile.name);

        const { providerId, uid, email, displayName, photoURL } = firebase.auth().currentUser;
        console.log('githubSignIn providerId: ', providerId, '\nuid: ', uid, '\nemail: ', email, '\ndisplayName: ', displayName, '\nphotoURL: ', photoURL);
        await AsyncStorage.setItem('@expo:displayName', displayName);
        await AsyncStorage.setItem('@expo:uid', uid);
        await AsyncStorage.setItem('@expo:photoURL', photoURL);
        gotohome( displayName, navigation );
    } 
    catch ({ message }) {
        console.warn('message: ', message);
    }
}
const gotohome = (savedisplayname, navigation) => {
    savedisplayname = savedisplayname !== undefined ? savedisplayname : '';
    navigation.replace('HomePage', {
        screen: 'Home',
        params: { saveddispname: savedisplayname, },
    })
}

export default githubSignIn;