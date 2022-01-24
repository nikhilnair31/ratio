import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { Share, TouchableOpacity, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Avatar, Button, Text, Input, Image } from 'react-native-elements';
import { captureRef } from 'react-native-view-shot';
import * as Linking from 'expo-linking';

const SearchPage = ({navigation}) => {
    const viewRef = useRef();

    const goToProfileTab = () => {
        navigation.replace('ProfilePage')
    }
    const test = async () => { 
        Linking.openURL(`instagram://user?username=apple`)
        // const uri = await captureRef(viewRef, {
        //     format: 'png',
        //     quality: 0.5,
        // });
        // const encodedURL = encodeURIComponent(uri)
        // let instagramURL = 'instagram://library?AssetPath='+encodedURL; 
        // console.log('instagramURL: ', instagramURL); 
        // Linking.openURL(instagramURL); 
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
        <KeyboardAvoidingView behaviour='padding' enabled style={styles.container} ref={viewRef}>
            <Text style={styles.titleText}>This is SearchPage</Text>
            <Button onPress={test} title="Share" />
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
