import React, {useLayoutEffect, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Image } from 'react-native-elements';
import localStorage from '../helpers/localStorage';
import githubSignIn from '../helpers/github';

const SplashScreen = ({navigation}) => {

    useEffect(() => {
        localStorage.getLocalData('@expo:GithubToken')
        .then( savedtoken =>{
            if(savedtoken != null || savedtoken != undefined){
                console.log('savedtoken: ', savedtoken);
                githubSignIn(savedtoken, navigation);
            }
            else{
                localStorage.wait(2000).then(() => {
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
        <View behaviour='padding' enabled style={styles.container}>
            <Image source={require('../assets/AssMark2.png')} style={styles.logo} tintColor='#c23a5c'></Image>
            <Text h2 style={styles.titleText}>ratio:</Text>
        </View>
    );
}
export default SplashScreen

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
});
