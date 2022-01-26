import React, {useState, useLayoutEffect} from 'react';
import { Pressable, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Input, Image } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, githubProvider } from '../helpers/firebase';
import signInWithGitHub from '../helpers/github';
import firebase from 'firebase/compat/app';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import 'firebase/compat/firestore';

const github = { id: '3f69d11b0a1b3b70c654', secret: '01eff770156512ddf124b8912479e267145970c6', };
const githubFields = [ 'user', 'public_repo' ];
const auth0Domain = `https://github.com/login/oauth/`;

const LoginPage = ({navigation}) => {
    const [tokenstate, settokenState] = useState(null);
    
    async function getGithubUserInfo (twitchToken) {  
        console.log('twitchToken: ', twitchToken);    
        const url = 'https://api.github.com/user';
        const header = {
            Authorization: `Bearer ${twitchToken}`,
            'Client-ID': github.id,
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
    };
    async function githubSignIn(token) {
        try {
            if (!token) {
                const token = await signInWithGitHub(auth0Domain, github, githubFields);
                const person = await getGithubUserInfo(token);
                console.log('token: ',token,'\nperson: ',person);
                if (token) {
                    await AsyncStorage.setItem('@expo:GithubToken', token);
                    return githubSignIn(token);
                } else {
                    return;
                }
            }
            settokenState(token);
            console.log('tokey: ', token);

            const credential = GithubAuthProvider.credential(token);
            console.log('credential: ', credential);
            const userCredential = await firebase.auth().signInWithCredential(credential);
            console.log('userCredential: ', userCredential);
            return userCredential;
        } 
        catch ({ message }) {
            console.warn('message: ', message);
        }
    }

    const gotohome = () => {
        // Use replace instead to remove the go back arrow
        navigation.replace('HomePage')
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView behaviour='padding' enabled style={styles.container}>
            <Image source={require('../assets/AssMark2.png')} style={styles.logo} tintColor='#c23a5c'></Image>
            <Text h2 style={styles.titleText}>ratio:</Text>
            {/* <View style={styles.inputContainer}>
                <Input placeholder='email' type='email' value={email} onChangeText={(text)=>setEmail(text)} />
                <Input placeholder='password' secureTextEntry type='password' value={password} onChangeText={(text)=>setPassword(text)} />
                {!confirm && <Input placeholder='+91 - XXXXXXXXXX' value={phonenumber} onChangeText={text => setPhonenumber(text)} />}
                {confirm && <Input placeholder='XXXXXX' value={code} onChangeText={text => setCode(text)} />}
            </View> */}
            {/* {
                !confirm && 
                <Pressable style={styles.button} onPress={()=>signInWithPhoneNumber()}>
                    <Text style={styles.text}>Phone Sign In</Text>
                </Pressable>
            }
            {
                confirm && 
                <Pressable style={styles.button} onPress={()=>confirmCode()}>
                    <Text style={styles.text}>Confirm Code</Text>
                </Pressable>
            } */}
            <Pressable style={styles.button} onPress={()=>githubSignIn()}>
                <Text style={styles.text}>Github Login</Text>
            </Pressable>
            {
                tokenstate && 
                <Pressable style={styles.button} onPress={gotohome}>
                    <Text style={styles.text}>Home</Text>
                </Pressable>
            }
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
