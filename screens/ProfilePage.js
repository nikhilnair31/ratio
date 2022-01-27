import React, {useLayoutEffect, useEffect, useState} from 'react';
import { Pressable, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Avatar, Text, Input, Image } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';

const ProfilePage = ({navigation}) => {
    const [photoURL, setPhotoURL] = useState('');

    async function getLocalData (key) {
        try {
            const value = await AsyncStorage.getItem(key);
            console.log('getLocalData value: ', value);
            if (value !== null) return value;
        } catch (error) {
            console.log('getLocalData error: ', error);
        }
    }
    async function signOutAsync() {
        try {
            await AsyncStorage.removeItem('@expo:GithubToken');
            firebase.auth().signOut().then(dt => {
                console.log('dt: ', dt);
                navigation.navigate('Login')
            });
        } catch ({ message }) {
            console.log('signOutAsync error: ',message);
        }
    }

    useEffect(() => {
        getLocalData('@expo:photoURL')
        .then( savedphotoURL =>{
            if(savedphotoURL != null || savedphotoURL != undefined){
                console.log('savedphotoURL: ', savedphotoURL);
                setPhotoURL(savedphotoURL);
            }
        });
    }, []);
    useLayoutEffect(() => {
        const stackNavigator = navigation.getParent();
        stackNavigator.setOptions({
            title: 'profile',
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: 'black',
            }   
        });
    }, [navigation]);
    
    return (
        <KeyboardAvoidingView behaviour='padding' enabled style={styles.container}>
            <Avatar rounded source={{uri: photoURL}} />
            <Text style={styles.titleText}>This is ProfilePage</Text>
            <Pressable style={styles.button} onPress={()=>signOutAsync()}>
                <Text style={styles.text}>Logout</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

export default ProfilePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 16,
        color: 'white',
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
        letterSpacing: 0.25,
        color: 'white',
    },
});
