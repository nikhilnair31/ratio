import React, {useState, useLayoutEffect, useEffect} from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, Pressable } from 'react-native';
import { Text, Input, Image } from 'react-native-elements';
import { db } from "../helpers/firebase";
import { ref, push } from 'firebase/database';

const NewPostPage = ({navigation}) => {
    const [postText, setPostText] = useState('');
    
    const pushpost = () => {
        console.log('posttext: ', postText);
        const reference = ref(db, 'post/');
        push(reference, {
            userid: 'uid1',
            posttext: postText,
            utc: Date.now(),
            comments: {},
            likes: 0,
        });
        navigation.goBack();
    }

    useEffect(() => {
        console.log('posttext: ', postText);
        navigation.setOptions({
            title: '',
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: 'black',
            },
            headerLeft: () => {
                return (
                    <View style={{ marginLeft: 0 }} >
                        <Pressable style={{ marginRight: 15 }} onPress={() => navigation.goBack()}>
                            <Image source={require('../assets/Back.png')} style={styles.backbuttonimage} tintColor='white'></Image>
                        </Pressable>
                    </View>
                ) 
            },    
            headerRight: () => {
                return (
                    <View style={{ marginLeft: 0 }} >
                        <Pressable style={styles.pushpostbutton} onPress={pushpost}>
                            <Text style={styles.pushpostbuttontext}>Post</Text>
                        </Pressable>
                    </View>
                ) 
            },   
        });
    }, [postText, navigation]);

    return (
        <KeyboardAvoidingView behaviour='padding' enabled style={styles.container}>
            <Image source={require('../assets/SilIcon5C_512.png')} style={styles.logo}></Image>
            <Text h2 style={styles.titleText}>Post</Text>
            <View style={styles.inputContainer}>
                <Input autoFocus placeholder='post' type='post' style={styles.inputPost} value={postText} onChangeText={(text)=>setPostText(text)} />
            </View>
        </KeyboardAvoidingView>
    )
}

export default NewPostPage

const styles = StyleSheet.create({
    backbuttonimage: {
        width: 30,
        height: 30,
    },
    inputPost: {
        color: 'white',
    },
    container: {
        flex: 1,
        // padding:10,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 16,
        color: 'white',
    },
    inputContainer: {
        width: 300,
        margin: 30,
        alignItems: 'center',
    },
    pushpostbutton: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        height: 35,
        width: 70,
        borderRadius: 10,
        marginRight: 5,
    },
    pushpostbuttontext: {
        fontSize: 20,
        color: 'black',
    },
});
