import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native'
import { ListItem, Text, Image } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Post from "../helpers/post.js";

const CustomListItem = ({seeIndivPost, id, item}) => {
    const [likedPost, setLikedPost] = useState(false);
    const [likeColor, setLikeColor] = useState('white');

    const likePost = async () => {
        console.log('likePost id: ', id, '\n item.likes.amount: ', item.likes.amount);
        if(!likedPost){
            setLikedPost(true);
            setLikeColor('#c23a5c');
            Post.Likepost(id, item.likes.amount+1);
        }
        else {
            setLikedPost(false);
            setLikeColor('white');
            Post.Likepost(id, item.likes.amount-1);
        }
    }
    const commentPost = () => {
        // console.log('id: ', id);
        // Post.Likepost(id, item.likes+1);
    }
    const timeDifference = (utc) => {
        // dayjs(item.utc).format("YYYY-MM-DD")
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
    
        var now = Math.floor(Date.now())
        var elapsed = now - utc;
        // console.log(elapsed, '=', now, '-', utc);
    
        if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' s';   
        }
        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + ' m';   
        }
        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' h';   
        }
        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + ' d';   
        }
        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + ' month';   
        }
        else {
            //return 'around ' + Math.round(elapsed/msPerYear ) + ' years ago'; 
            return Math.round(elapsed/msPerYear ) + ' year';   
        }
    }

    useEffect(() => { 
        Post.UserIdsThatLikedThePost(id).then(userIdsThatLikedThePost => {
            console.log('userIdsThatLikedThePost ', userIdsThatLikedThePost);
            if(userIdsThatLikedThePost){
                console.log('curr user liked the post ', id);
                setLikedPost(true);
                setLikeColor('#c23a5c');
            }
        });
    }, []);

    return (
        <ListItem button onPress={()=>seeIndivPost(id , item.posttext, item.displayname, item.utc)} containerStyle={styles.lisItem}>
            <ListItem.Content style={styles.lisItemContent}>
                <ListItem.Content style={styles.lisItemContentUp}>
                    <ListItem.Subtitle style={styles.lisItemUser}>{item.displayname}</ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.lisItemUser}> · </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.lisItemTime}>{ timeDifference(item.utc) }</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Title numberOfLines={10} ellipsizeMode='tail' style={styles.lisItemPosttext}>{item.posttext}</ListItem.Title>
            </ListItem.Content>

            <Pressable style={styles.likebutton} onPress={likePost} android_ripple={{borderless: true, radius: 50}}>
                <Image source={require('../assets/heart2.png')} style={styles.likebuttonimage} tintColor={likeColor}/>
                <Text style={styles.likebuttontext}>{item.likes.amount}</Text>
            </Pressable>
            <Pressable style={styles.commentbutton} onPress={commentPost} android_ripple={{borderless: true, radius: 50}}>
                <Image source={require('../assets/talkey2.png')} style={styles.commentbuttonimage}  />
                <Text style={styles.commentbuttontext}>{item.comments.amount}</Text>
            </Pressable>
        </ListItem>
    )
}
export default CustomListItem

const styles = StyleSheet.create({
    lisItem: {
        backgroundColor:"#0f0f0f", 
        borderRadius:10,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    lisItemContent: {
        fontSize: 20,
        fontWeight: "normal",
        backgroundColor:"#0f0f0f", 
        borderRadius:10,
    },
    lisItemContentUp: {
        display: 'flex',
        flexDirection: 'row',
    },
    lisItemUser: {
        fontSize: 18,
        fontWeight: "normal",
        color: '#8a8a8a',
    },
    lisItemPosttext: {
        fontSize: 20,
        fontWeight: "normal",
        color: 'white',
    },
    lisItemTime: {
        fontSize: 16,
        fontWeight: "normal",
        color: '#8a8a8a',
    },
 
    likebutton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likebuttonimage: {
       padding: 10,
       margin: 5,
       height: 25,
       width: 25,
       resizeMode : 'stretch',
    },
    likebuttontext: { 
        color: 'white',
        fontWeight: "bold",
    },
 
    commentbutton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentbuttonimage: {
       padding: 10,
       margin: 5,
       height: 25,
       width: 25,
       resizeMode : 'stretch',
    },
    commentbuttontext: { 
        color: 'white',
        fontWeight: "bold",
    },
})
