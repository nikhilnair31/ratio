import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, Pressable } from 'react-native';
import { Text, Image } from 'react-native-elements';
import { db } from "../helpers/firebase";
import { ref, onValue, child } from 'firebase/database';
import CustomListItem from '../components/CustomListItem.js';

const HomePage = ({route, navigation}) => {
    const [posts, setPosts] = useState([]);
    const [postsLoading, setpostsLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const { saveddispname } = route.params;

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const makeNewPost = () => {
        navigation.push('NewPostPage')
    }

    useEffect(() => { 
        console.log('posts.length: ', posts.length, '- postsLoading: ', postsLoading);
        if(posts.length <= 0 && !postsLoading){
            let lastKey;
            const dbRef = ref(db);
            onValue(child(dbRef, `post/`), (snapshot) => {
                let dataArr = [];
                const data = snapshot.val();
                if(data !== null) {
                    // console.log('data: ', data);
                    let dataValArr = Object.values(data)
                    let dataKeyArr = Object.keys(data)
                    for(var i=0; i<dataKeyArr.length; i++) {
                        dataArr.push({ id: dataKeyArr[i], item: dataValArr[i] })
                        lastKey = dataValArr[i].utc;
                    }
                    // console.log('dataKeyArr: ', dataKeyArr);
                    // console.log('dataValArr: ', dataValArr);
                    // console.log('dataArr: ', dataArr);
                    dataArr.sort((a, b) => b.item.utc - a.item.utc)
                    // console.log('dataArr: ', dataArr);
                    setPosts(dataArr);
                    setpostsLoading(true);
                }
            });
        }
    }, [refreshing, postsLoading]);
    useLayoutEffect(() => {
        // console.log('saveddispname: ', JSON.stringify(saveddispname));
        const stackNavigator = navigation.getParent();
        stackNavigator.setOptions({
            // title: 'hey '+JSON.stringify(saveddispname).split(" ")[0].replace(/["']/g, "").toLowerCase(),
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: 'black',
            },     
        });
    }, [navigation]);

    if(posts.length <= 0) {
        return (
            <View style={styles.waitcontainer}>
                <Text style={styles.waitText}>Wait ✋</Text>
                <Pressable style={styles.newpostbutton} onPress={makeNewPost}>
                    <Image source={require('../assets/Slap.png')} style={styles.newpostbuttonimage} tintColor='black'></Image>
                </Pressable>
            </View>
        );
    }
    else if(posts.length > 0) {
        return (
            <View style={styles.maincontainer}>
                <ScrollView contentContainerStyle={styles.scrollView} style={styles.scrollContainer} refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> } >
                    {   
                        posts.map(({id, item}) => 
                            <CustomListItem key={id} id={id} item={item} />
                        )
                    }
                </ScrollView>
                <Pressable style={styles.newpostbutton} onPress={makeNewPost}>
                    <Image source={require('../assets/Slap.png')} style={styles.newpostbuttonimage} tintColor='black'></Image>
                </Pressable>
            </View>
        );
    }
}
export default HomePage

const styles = StyleSheet.create({
    maincontainer: {
        backgroundColor: 'black', 
        height: '100%',
    },
    waitcontainer: {
        flex: 1,
        backgroundColor: 'black', 
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeAvatarIcon: {
        width: 40, 
        height: 40, 
        borderRadius: 40/2, 
        marginLeft : 15
    },
    scrollView: {
        backgroundColor: 'black',
    },
    scrollContainer: {
        backgroundColor: 'black',
    },
    waitText: {
        backgroundColor: 'black',
        color: 'white',
        fontSize: 20
    },

    newpostbutton: {
        position: 'absolute',
        backgroundColor:'white',
        height:60,
        borderRadius: 50,
        bottom: 20,
        right: 20,
    },
    newpostbuttonimage: {
        width: 60,
        height: 60,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
