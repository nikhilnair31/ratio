import React, {useLayoutEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Avatar, Button, Text, Input, Image } from 'react-native-elements';

const SearchPage = ({navigation}) => {
    const goToProfileTab = () => {
        navigation.replace('ProfilePage')
    }

    useLayoutEffect(() => {
        const stackNavigator = navigation.getParent();
        stackNavigator.setOptions({
            title: 'search',
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: 'black',
            }      
        });
    }, [navigation]);
    
    return (
        <KeyboardAvoidingView behaviour='padding' enabled style={styles.container}>
            <Text style={styles.titleText}>This is SearchPage</Text>
        </KeyboardAvoidingView>
    );
}

export default SearchPage

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
