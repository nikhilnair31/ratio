import { db } from "./firebase";
import { getDatabase, ref, onValue, set, setValue, push, update, child, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
    GetPosts: async () => {
        try {
            let data;
            let dataarr;
            let lastKey;
            let posts = []

            const dbRef = ref(db);
            onValue(child(dbRef, `post/`), (snapshot) => {
                const data = snapshot.val();
                console.log('data: ', data);
                dataarr = Object.values(data)
                console.log('dataarr: ', dataarr);
                dataarr.forEach((item) => {
                    posts.push({ userid: item.userid, posttext: item.posttext, utc: item.utc });
                    lastKey = item.utc;
                });
                console.log('posts: ', posts);
                return { posts };
            });
        } 
        catch (e) {
            console.log(e);
        }
    },
    PushPost: async (posttext) => {
        try {
            const saveduserid = await AsyncStorage.getItem('@expo:uid');
            const saveddisplayname = await AsyncStorage.getItem('@expo:displayName');
            const pushref = ref(db, 'post/');
            push(pushref, {
                userid: saveduserid,
                displayname: saveddisplayname,
                posttext: posttext,
                utc: Date.now(),
                comments: {
                    amount: 0
                },
                likes: {
                    amount: 0
                },
            });
            return true;
        } 
        catch (e) {
            console.log(e);
            return false;
        }
    },
    Likepost: async (postid, newlikeamount) => {
        try {
            const saveduserid = await AsyncStorage.getItem('@expo:uid');
            console.log('likePost saveduserid: ', saveduserid);
            update( ref(db, 'post/'+postid) , {
                likes: {
                    amount: newlikeamount,
                },
            });
        
            const postref = ref(db, 'post/'+postid+'/likes/userids');
            push(postref, {
                userid: saveduserid,
            });
        } 
        catch (e) {
            console.log(e);
        }
    },
    UserIdsThatLikedThePost: async (postid) => {
        try {
            const saveduserid = await AsyncStorage.getItem('@expo:uid');
            let useridsthatlikedthepost = []
            const dbRef = ref(db);
            onValue(child(dbRef, `post/`+postid+'/likes/userids/'), (snapshot) => {
                let snapval = snapshot.val();
                console.log('snapval: ', snapval);
                let arrayofobj = snapval!==null ? Object.values(snapval) : null;
                console.log('arrayofobj: ', arrayofobj);
                useridsthatlikedthepost = arrayofobj!==null ? arrayofobj.map(function (el) { return el.userid; }) : null;
                console.log('useridsthatlikedthepost: ', useridsthatlikedthepost);
                return useridsthatlikedthepost;
            });
            const found = useridsthatlikedthepost!==null ? useridsthatlikedthepost.find(element => element === saveduserid) : undefined;
            if(found!==undefined){
                console.log('found: ', found);
                return true;
            }
            else false;
        } 
        catch (e) {
            console.log(e);
        }
    },
};