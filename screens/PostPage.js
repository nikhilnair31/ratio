import React, { useEffect, useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import { Button, Avatar, Text, Input, Image } from 'react-native-elements';

const PostPage = ({route, navigation}) => {
    const { chat_ID, chat_Name } = route.params;

    const backToHome = () => {
        alert('newchat')
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: chat_Name,
            headerTintColor: 'white'
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.chatContainer}>
                <Text>{chat_ID}</Text>
                <Text>{chat_Name}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>01</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>10</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>11</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PostPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatContainer: {
        flex: 1,
        padding: 180,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        padding: 0,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: { 
        flex: 0, 
        flexDirection: 'row', 
    },
    button: {
        backgroundColor: "pink",
        margin: 0,
        padding: 20,
        borderRadius: 20
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 20,
        backgroundColor: "green",
        color: "white"
    }
})
