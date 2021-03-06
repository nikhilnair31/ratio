import React, {useLayoutEffect, useEffect} from 'react';
import { Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Text, Image } from 'react-native-elements';
import localStorage from '../helpers/localStorage';
import githubSignIn from '../helpers/github';

const LoginPage = ({navigation}) => {
    
    useEffect(() => {
        localStorage.getLocalData('@expo:GithubToken')
        .then( savedtoken =>{
            if(savedtoken != null || savedtoken != undefined){
                console.log('savedtoken: ', savedtoken);
                githubSignIn(savedtoken, navigation);
            }
            else{
                localStorage.wait(5000).then(() => {
                    navigation.replace('Login');
                });
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
