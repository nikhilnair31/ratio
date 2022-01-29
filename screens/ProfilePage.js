import React, {useEffect, useState } from 'react';
import { Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Text, Image } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import localStorage from '../helpers/localStorage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';

const ProfilePage = ({navigation}) => {
    const [photoURL, setPhotoURL] = useState(null);
    const [displayName, setDisplayName] = useState('');

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
        localStorage.getLocalData('@expo:curruserdeets').then( curruserdeets => {
            let parsedjson = JSON.parse(curruserdeets);
            console.log('parsedjson: ', parsedjson);
            if(parsedjson != null || parsedjson != undefined){
                setPhotoURL(parsedjson.photoURL);
                setDisplayName(parsedjson.displayName);
            }
        });
    }, []);
    
    return (
        <KeyboardAvoidingView behaviour='padding' enabled style={styles.container}>
            { photoURL===null ? <MaterialCommunityIcons name="account-circle" color='white' size={30} style={{marginEnd: 10}} /> : <Image style={styles.pfp} source={{uri: photoURL}} /> }
            <Text style={styles.titleText}>{displayName}</Text>
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
    pfp: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    titleText: {
        fontSize: 24,
        color: 'white',
        margin: 10,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
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
