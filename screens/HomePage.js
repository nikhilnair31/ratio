import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Modal, StyleSheet, ScrollView, View, RefreshControl, Pressable } from 'react-native';
import { Text, Image } from 'react-native-elements';
import { db } from "../helpers/firebase";
import { ref, onValue, child } from 'firebase/database';
import Post from "../helpers/post.js";
import localStorage from '../helpers/localStorage';
import CustomListItem from '../components/CustomListItem.js';

const HomePage = ({route, navigation}) => {
    const [posts, setPosts] = useState([]);
    const [postId, setPostId] = useState('');
    const [postsLoading, setpostsLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [postIsDeleteableByCurrUser, setPostIsDeleteableByCurrUser] = useState(false);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const showMenuModal = (gotpostid, posteruid) => {
        localStorage.getLocalData('@expo:curruserdeets').then( curruserdeets => {
            let parsedjson = JSON.parse(curruserdeets);
            console.log('parsedjson.uid: ', parsedjson.uid, '\nposteruid: ', posteruid);
            if(parsedjson != null || parsedjson != undefined) {
                posteruid===parsedjson.uid ? setPostIsDeleteableByCurrUser(true) : setPostIsDeleteableByCurrUser(false);
            }
        });
        setModalVisible(!modalVisible);
        setPostId(gotpostid);
    }
    const deleteSelectedPost = () => {
        setModalVisible(!modalVisible);
        Post.DeletePost(postId, null);
    }
    const makeNewPost = () => {
        navigation.push('NewPostPage')
    }
    const seeIndivPost = (postid, postitem) => {
        console.log('postitem: ', postitem);
        navigation.push('IndivPostPage', {
            screen: 'IndivPostPage',
            params: { 
                postid: postid, 
                postuid: postitem.uid, 
                postdisplayname: postitem.displayName, 
                posttext: postitem.posttext, 
                postutc: postitem.utc, 
                postlikeamount: postitem.likes.amount, 
                postcommentamount: postitem.comments.amount, 
            },
        })
    }

    useEffect(() => { 
        console.log('posts.length: ', posts.length, '- postsLoading: ', postsLoading, '- refreshing: ', refreshing);
        if((posts.length <= 0 && !postsLoading) || refreshing){
            console.log('refreshing');
            // Post.GetPosts().then(dataArr => {
            //     setPosts(dataArr);
            //     setpostsLoading(true);
            // });
            onValue(child( ref(db), `post/`), (snapshot) => {
                let dataArr = [];
                const data = snapshot.val();
                if(data !== null) {
                    let dataValArr = Object.values(data)
                    let dataKeyArr = Object.keys(data)
                    for(var i=0; i<dataKeyArr.length; i++) {
                        dataArr.push({ id: dataKeyArr[i], item: dataValArr[i] })
                    }
                    dataArr.sort((a, b) => b.item.utc - a.item.utc)
                    setPosts(dataArr);
                    setpostsLoading(true);
                }
            });
        }
    }, [refreshing, postsLoading]);
    useLayoutEffect(() => {
        const stackNavigator = navigation.getParent();
        stackNavigator.setOptions({
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
                    <Image source={require('../assets/Slap.png')} style={styles.newpostbuttonimage} tintColor='#c23a5c'></Image>
                </Pressable>
            </View>
        );
    }
    else if(posts.length > 0) {
        return (
            <View style={styles.maincontainer}>
                <Modal animationType="fade" transparent={true} visible={modalVisible} statusBarTranslucent ={true} onRequestClose={() => setModalVisible(!modalVisible)} >
                    <View style={styles.modalcentercontainer}>
                        <View style={styles.modalinnercontainer}>
                            <Text style={styles.modaltitletext}>What do you want to do?</Text>
                            <View style={styles.modalbuttoncontainer}>
                                {
                                    postIsDeleteableByCurrUser && 
                                    <Pressable style={[styles.modalbuttons, styles.confirmdeletebutton]} onPress={deleteSelectedPost} >
                                        <Text style={styles.modalbuttontext}>Delete Post</Text>
                                    </Pressable>
                                }
                                <Pressable style={[styles.modalbuttons, styles.cancelbutton]} onPress={() => setModalVisible(!modalVisible)} >
                                    <Text style={styles.modalbuttontext}>Share</Text>
                                </Pressable>
                                <Pressable style={[styles.modalbuttons, styles.cancelbutton]} onPress={() => setModalVisible(!modalVisible)} >
                                    <Text style={styles.modalbuttontext}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView contentContainerStyle={styles.scrollView} style={styles.scrollContainer} refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> } >
                    {   
                        posts.map(({id, item}) => 
                            <CustomListItem key={id} id={id} item={item} seeIndivPost={seeIndivPost} showMenuModal={showMenuModal} refreshing={refreshing}/>
                        )
                    }
                </ScrollView>
                <Pressable style={styles.newpostbutton} onPress={makeNewPost}>
                    <Image source={require('../assets/Slap.png')} style={styles.newpostbuttonimage} tintColor='#c23a5c'></Image>
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

    modalcentercontainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },    
    modalinnercontainer: {
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 10,
        width: '50%',
        backgroundColor: "#0f0f0f",
        alignItems: "center",
    },
    modalbuttoncontainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    modalbuttons: {
        width: 100,
        padding: 15,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 10,
        alignItems: "center",
    },
    confirmdeletebutton: {
        backgroundColor: "#c23a5c",
    },
    cancelbutton: {
        backgroundColor: "white",
    },
    modalbuttontext: {
        color: "black",
        fontWeight: "bold",
    },
    modaltitletext: {
        fontSize: 16,
        marginBottom: 15,
        color: "white",
    }
});
