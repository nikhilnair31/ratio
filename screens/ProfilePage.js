import React, {useLayoutEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Input, Image } from 'react-native-elements';

const ProfilePage = ({navigation}) => {
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
            <Text style={styles.titleText}>This is ProfilePage</Text>
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
});
