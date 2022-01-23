import React from 'react'
import { StyleSheet, Pressable, TouchableOpacity, View } from 'react-native'
import { ListItem, Text, Input, Image } from 'react-native-elements';
import Post from "../helpers/post.js";
import dayjs from "dayjs";

const CustomListItem = ({id, item}) => {
    
    const likePost = () => {
        console.log('id: ', id);
        Post.Likepost(id, item.likes+1);
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

    return (
        <ListItem containerStyle={styles.lisItem}>
            <ListItem.Content style={styles.lisItemContent}>
                <ListItem.Content style={styles.lisItemContentUp}>
                    <ListItem.Subtitle style={styles.lisItemUser}>{item.userid}</ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.lisItemUser}> · </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.lisItemTime}>{ timeDifference(item.utc) }</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Title numberOfLines={10} ellipsizeMode='tail' style={styles.lisItemPosttext}>{item.posttext}</ListItem.Title>
            </ListItem.Content>
            <TouchableOpacity style={styles.likebutton} activeOpacity={0.5} onPress={likePost}>
                <Image source={require('../assets/heart2.png')} style={styles.likebuttonimage} />
                <Text style={styles.likebuttontext}>{item.likes}</Text>
            </TouchableOpacity>
            <Pressable style={styles.commentbutton} onPress={commentPost} android_ripple={{borderless: true, radius: 50}}>
                <Image source={require('../assets/talkey2.png')} style={styles.commentbuttonimage}  />
                {
                    item.comments!==undefined ? 
                    <Text style={styles.commentbuttontext}>{item.comments.length}</Text> : <Text style={styles.commentbuttontext}>{0}</Text>
                }
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
