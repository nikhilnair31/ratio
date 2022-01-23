import React, {useState, useLayoutEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Input, Image } from 'react-native-elements';

const LoginPage = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const signIn = () => {

    }
    const register = () => {
        navigation.navigate('RegisterPage')
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
            <StatusBar style="auto" />
            <Image source={require('../assets/AssMark2.png')} style={styles.logo} tintColor='#c23a5c'></Image>
            <Text h2 style={styles.titleText}>ratio:</Text>
            <View style={styles.inputContainer}>
                <Input placeholder='email' type='email' value={email} onChangeText={(text)=>setEmail(text)} />
                <Input placeholder='password' secureTextEntry type='password' value={password} onChangeText={(text)=>setPassword(text)} />
            </View>
            <Pressable style={styles.button} onPress={register}>
                <Text style={styles.text}>Register</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={gotohome}>
                <Text style={styles.text}>Home</Text>
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
