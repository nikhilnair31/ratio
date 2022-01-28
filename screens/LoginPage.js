import React, {useState, useLayoutEffect, useEffect} from 'react';
import { Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Text, Image } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import signInWithGitHub from '../helpers/github';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import { GithubAuthProvider } from 'firebase/auth';

const githubClientIdSecret = { id: '3f69d11b0a1b3b70c654', secret: '01eff770156512ddf124b8912479e267145970c6', };
const githubScopeFields = [ 'user', 'public_repo' ];
const githubAuthDomain = `https://github.com/login/oauth/`;

const LoginPage = ({navigation}) => {
    
    async function getLocalData (key) {
        try {
            const value = await AsyncStorage.getItem(key);
            console.log('getLocalData value: ', value);
            if (value !== null) return value;
        } catch (error) {
            console.log('getLocalData error: ', error);
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
    async function githubSignIn(token) {
        try {
            if (!token) {
                const token = await signInWithGitHub(githubAuthDomain, githubClientIdSecret, githubScopeFields);
                const person = await getGithubUserInfo(token);
                console.log('githubSignIn \ntoken: ',token,'\nperson: ',person);
                if (token) {
                    await AsyncStorage.setItem('@expo:GithubToken', token);
                    return githubSignIn(token);
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
            gotohome( displayName );
        } 
        catch ({ message }) {
            console.warn('message: ', message);
        }
    }

    const gotohome = (savedisplayname) => {
        savedisplayname = savedisplayname !== undefined ? savedisplayname : '';
        navigation.replace('HomePage', {
            screen: 'Home',
            params: { saveddispname: savedisplayname, },
        })
    }

    useEffect(() => {
        getLocalData('@expo:GithubToken')
        .then( savedtoken =>{
            if(savedtoken != null || savedtoken != undefined){
                console.log('savedtoken: ', savedtoken);
                githubSignIn(savedtoken);
            }
        });
    }, []);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView behaviour='padding' enabled style={styles.container}>
            <Image source={require('../assets/AssMark2.png')} style={styles.logo} tintColor='#c23a5c'></Image>
            <Text h2 style={styles.titleText}>ratio:</Text>
            <Pressable style={styles.button} onPress={()=>githubSignIn()}>
                <Text style={styles.text}>Github Login</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
}
export default LoginPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        margin:20,
        alignItems: 'center',
        color: 'white',
        fontSize: 30,
    },
    inputContainer: {
        width: 250,
        margin:5,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'transparent',
        borderColor: '#c23a5c', 
        borderWidth: 3,
    },
    text: {
        fontSize: 12,
        lineHeight: 25,
        width: 70,
        textAlign: 'center',
        // fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
