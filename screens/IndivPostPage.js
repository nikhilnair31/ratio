import React, { useState, useEffect, useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import { Button, Avatar, Text, Input, Image } from 'react-native-elements';
import dayjs from "dayjs";

const IndivPostPage = ({route, navigation}) => {
    const { postid, posttext, postdisplayname, postutc } = route.params.params;

    function utcToFormattedDate(utcDate) {
        var dat = new Date(utcDate)
        dat = dayjs(dat).format('hh:mm A · D MMM YY')
        console.log('dat: ', dat);
        return dat;
    }
    
    useEffect(() => {
        console.log('route: ', route);
        console.log('route.params.params: ', route.params.params);
        console.log('postid: ', postid);
        console.log('posttext: ', posttext);
        console.log('postdisplayname: ', postdisplayname);
        console.log('postutc: ', postutc);
    }, []);
    useLayoutEffect(() => {
        navigation.setOptions({
            // headerTitle: 'titit',
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: 'black',
            },     
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{postid}</Text>
            <Text style={styles.text}>{posttext}</Text>
            <Text style={styles.text}>{postdisplayname}</Text>
            <Text style={styles.text}>{utcToFormattedDate(postutc)}</Text>
        </View>
    )
}

export default IndivPostPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black', 
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white', 
    },
})
