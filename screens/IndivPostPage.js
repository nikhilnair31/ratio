import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Pressable, View, Modal } from 'react-native';
import { Input, Text, Image } from 'react-native-elements';
import dayjs from "dayjs";
import Post from "../helpers/post.js";
import localStorage from '../helpers/localStorage';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';

const IndivPostPage = ({route, navigation}) => {
    const { postid, posttext, postdisplayname, postutc, postlikeamount, postcommentamount } = route.params.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [photoURL, setPhotoURL] = useState(null);
    const [likedPost, setLikedPost] = useState(false);
    const [likeColor, setLikeColor] = useState('white');
    const [currLikeAmount, setCurrLikeAmount] = useState(0);
    const [currCommentAmount, setCurrCommentAmount] = useState(0);
    const [commentText, setCommentText] = useState('');

    function utcToFormattedDate(utcDate) {
        var dat = new Date(utcDate)
        dat = dayjs(dat).format('hh:mm A · D MMM YY')
        return dat;
    }
    const deletePost = () => {
        setModalVisible(true);
        Post.DeletePost(postid, navigation);
    }
    const likePost = async () => {
        console.log('likePost id: ', postid, '\n postlikeamount: ', postlikeamount);
        if(!likedPost){
            setLikedPost(true);
            setLikeColor('#c23a5c');
            setCurrLikeAmount(postlikeamount+1);
            Post.Likepost(postid, postlikeamount+1);
        }
        else {
            setLikedPost(false);
            setLikeColor('white');
            setCurrLikeAmount(postlikeamount-1);
            Post.Dislikepost(postid, postlikeamount-1);
        }
    }
    const commentPost = () => {
        // console.log('id: ', id);
        // Post.Likepost(id, item.likes+1);
    }
    
    useEffect(() => {
        setCurrLikeAmount(postlikeamount);
        setCurrCommentAmount(postcommentamount);
        localStorage.getLocalData('@expo:curruserdeets').then( curruserdeets => {
            let parsedjson = JSON.parse(curruserdeets);
            console.log('parsedjson.photoURL: ', parsedjson.photoURL);
            if(parsedjson != null || parsedjson != undefined){
                setPhotoURL(parsedjson.photoURL);
            }
        });
        Post.UserIdsThatLikedThePost(postid).then(userIdsThatLikedThePost => {
            console.log('userIdsThatLikedThePost ', userIdsThatLikedThePost);
            if(userIdsThatLikedThePost){
                console.log('curr user liked the post ', postid);
                setLikedPost(true);
                setLikeColor('#c23a5c');
            }
        });
    }, []);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: 'black',
            },     
        });
    }, [navigation]);

    return (
        <View id={postid} style={styles.container}>
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)} >
                <View style={styles.modalcentercontainer}>
                    <View style={styles.modalinnercontainer}>
                        <Text style={styles.modaltitletext}>Are you sure you wish to delete the post?</Text>
                        <View style={styles.modalbuttoncontainer}>
                            <Pressable style={[styles.modalbuttons, styles.confirmdeletebutton]} onPress={() => setModalVisible(!modalVisible)} >
                                <Text style={styles.modalbuttontext}>Delete Post</Text>
                            </Pressable>
                            <Pressable style={[styles.modalbuttons, styles.cancelbutton]} onPress={() => setModalVisible(!modalVisible)} >
                                <Text style={styles.modalbuttontext}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.uppercontainer}>
                <Image source={require('../assets/heart2.png')} style={styles.pfpimage} />
                <Text style={styles.displaynametext}>{postdisplayname}</Text>
                <Pressable style={styles.deletebutton} onPress={deletePost} android_ripple={{borderless: true, radius: 50}}>
                    <MaterialCommunityIcons name="delete" color='white' size={25} style={styles.deleteicon}/>
                </Pressable>
            </ View>
            <Text style={styles.posttext}>{posttext}</Text>
            <Text style={styles.timetext}>{utcToFormattedDate(postutc)}</Text>
            <View style={styles.interactcontainer}>
                <Pressable style={styles.likebutton} onPress={likePost} android_ripple={{borderless: true, radius: 50}}>
                    <Image source={require('../assets/heart2.png')} style={styles.likebuttonimage} tintColor={likeColor}/>
                    <Text style={styles.likebuttontext}>{currLikeAmount}</Text>
                </Pressable>
                <Pressable style={styles.commentbutton} onPress={commentPost} android_ripple={{borderless: true, radius: 50}}>
                    <Image source={require('../assets/talkey2.png')} style={styles.commentbuttonimage}  />
                    <Text style={styles.commentbuttontext}>{currCommentAmount}</Text>
                </Pressable>
            </ View>
            <View style={styles.replycontainer}>
                <Input  style={styles.replyinput} placeholder="Comment" inputContainerStyle={{borderBottomWidth: 0}}
                    leftIcon={
                        photoURL===null ? <MaterialCommunityIcons name="account-circle" color='white' size={30} style={{marginEnd: 10}} /> : <Image style={styles.curruserpfpimage} source={{uri: photoURL}} />
                    } 
                    rightIcon={
                        <View style={{ marginLeft: 10 }} >
                            <Pressable style={styles.postcommentbutton} onPress={commentPost}>
                                <Text style={styles.postcommentbuttontext}>Post</Text>
                            </Pressable>
                        </View>
                    } 
                    onChangeText={value => setCommentText(value)} />
            </ View>
        </View>
    )
}

export default IndivPostPage

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black', 
        height: '100%',
    },
    uppercontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    interactcontainer: {
        backgroundColor: '#0f0f0f', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        // width: '50%',
        marginEnd: 15,
        marginStart: 15,
        paddingTop: 10,
        paddingBottom: 10,
        paddingEnd: 10,
        paddingStart: 10,
    },
    replycontainer: {
        // backgroundColor: '#0f0f0f', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingEnd: 10,
        paddingStart: 10,
    },

    pfpimage: {
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        marginEnd: 15,
        marginStart: 15,
        height: 40,
        width: 40,
    },
    curruserpfpimage: {
        padding: 20,
        marginEnd: 15,
        height: 40,
        width: 40,
    },
    likebuttonimage: {
       padding: 10,
       margin: 5,
       height: 25,
       width: 25,
       resizeMode : 'stretch',
    },
    commentbuttonimage: {
       padding: 10,
       margin: 5,
       height: 25,
       width: 25,
       resizeMode : 'stretch',
    },

    displaynametext: {
        color: 'white', 
        fontWeight: "normal",
        fontSize: 20,
    },
    posttext: {
        color: 'white', 
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingEnd: 15,
        paddingStart: 15,
    },
    timetext: {
        color: 'white', 
        fontWeight: "100",
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 20,
        paddingStart: 15,
        paddingEnd: 15,
    },
    likebuttontext: { 
        color: 'white',
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
        marginEnd: 10,
        marginStart: 10,
    },
    commentbuttontext: { 
        color: 'white',
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
        marginEnd: 10,
        marginStart: 10,
    },
    postcommentbuttontext: { 
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center'
    },
 
    likebutton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentbutton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deletebutton: {
        position: 'absolute',
        right: 15,
    },
    postcommentbutton: {
        backgroundColor: 'white', 
        borderRadius: 10,
        width: 60,
        padding: 10,
    },

    replyinput: {
        color: "white",
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
        width: '90%',
        backgroundColor: "#0f0f0f",
        alignItems: "center",
    },
    modalbuttoncontainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    modalbuttons: {
        width: 100,
        padding: 15,
        marginStart: 5,
        marginEnd: 5,
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
})
