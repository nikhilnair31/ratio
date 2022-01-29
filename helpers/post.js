import { db } from "./firebase";
import { getDatabase, ref, onValue, set, setValue, push, update, child, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

let path = [];
let parent = '';

function getParent(path, json, value) {
    try {
        for (var key in json) {
            if (typeof json[key] === 'object') {
                path.push(key.toString());
                getParent(path, json[key], value);
                path.pop();
            } else {
                if (json[key] == value) {
                   parent = path[0];
                }
            }
        }
    } 
    catch (e) {
        console.log(e);
    }
}

export default {
    AddUserData: async (userdeets) => {
        try {
            let curruserdeets = {
                uid: userdeets.uid,
                displayName: userdeets.providerData[0].displayName,
                email: userdeets.providerData[0].email,
                phoneNumber: userdeets.providerData[0].phoneNumber,
                providerId: userdeets.providerData[0].providerId,
                photoURL: userdeets.providerData[0].photoURL,
            }
            console.log('AddUserData curruserdeets: ', curruserdeets);
            await AsyncStorage.setItem('@expo:curruserdeets', JSON.stringify(curruserdeets));
            await AsyncStorage.setItem('@expo:displayName', curruserdeets.displayName);
            await AsyncStorage.setItem('@expo:uid', curruserdeets.uid);
            await AsyncStorage.setItem('@expo:photoURL', curruserdeets.photoURL);
            set( ref(db, 'user/'+curruserdeets.uid), curruserdeets);
        } 
        catch (e) {
            console.log(e);
        }
    },
    GetPosts: async () => {
        try {
            // let data;
            // let lastKey;
            let dataarr;
            let posts = []

            onValue(child(db, `post/`), (snapshot) => {
                const data = snapshot.val();
                dataarr = Object.values(data)
                dataarr.forEach((item) => {
                    posts.push({ userid: item.userid, posttext: item.posttext, utc: item.utc });
                    lastKey = item.utc;
                });
                // console.log('data: ', data);
                // console.log('dataarr: ', dataarr);
                // console.log('posts: ', posts);
                return { posts };
            });
        } 
        catch (e) {
            console.log(e);
        }
    },
    PushPost: async (posttext) => {
        try {
            const savedcurruserdeets = await AsyncStorage.getItem('@expo:curruserdeets');
            let parsedjson = JSON.parse(savedcurruserdeets);
            console.log('parsedjson.uid: ', parsedjson.uid, '\nparsedjson.displayName: ', parsedjson.displayName);

            const pushref = ref(db, 'post/');
            push(pushref, {
                userid: parsedjson.uid,
                displayname: parsedjson.displayName,
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
    UserIdsThatLikedThePost: async (postid) => {
        try {
            const savedcurruserdeets = await AsyncStorage.getItem('@expo:curruserdeets');
            let parsedjson = JSON.parse(savedcurruserdeets);
            console.log('parsedjson.uid: ', parsedjson.uid);

            let useridsthatlikedthepost = []
            const dbRef = ref(db);
            onValue(child(dbRef, `post/`+postid+'/likes/userids/'), (snapshot) => {
                let snapval = snapshot.val();
                let arrayofobj = snapval!==null ? Object.values(snapval) : null;
                useridsthatlikedthepost = arrayofobj!==null ? arrayofobj.map(function (el) { return el.userid; }) : null;
                return useridsthatlikedthepost;
            });
            
            const found = useridsthatlikedthepost!==null ? useridsthatlikedthepost.find(element => element === parsedjson.uid) : undefined;
            if(found!==undefined)
                return true;
            else 
                return false;
        } 
        catch (e) {
            console.log(e);
        }
    },
    Likepost: async (postid, newlikeamount) => {
        try {
            const savedcurruserdeets = await AsyncStorage.getItem('@expo:curruserdeets');
            let parsedjson = JSON.parse(savedcurruserdeets);
            console.log('parsedjson.uid: ', parsedjson.uid);

            update( ref(db, 'post/'+postid+'/likes/') , {
                amount: newlikeamount,
            });
        
            push( ref(db, 'post/'+postid+'/likes/userids/'), {
                userid: parsedjson.uid,
            });
        } 
        catch (e) {
            console.log(e);
        }
    },
    Dislikepost: async (postid, newlikeamount) => {
        try {
            const savedcurruserdeets = await AsyncStorage.getItem('@expo:curruserdeets');
            let parsedjson = JSON.parse(savedcurruserdeets);
            console.log('parsedjson.uid: ', parsedjson.uid);

            update( ref(db, 'post/'+postid+'/likes/') , {
                amount: newlikeamount,
            });

            let snapval;
            onValue( ref(db, 'post/'+postid+'/likes/userids/'), (snapshot) => {
                snapval = snapshot.val();
            });
            getParent(path, snapval, parsedjson.uid);
            console.log('Dislikepost parent', parent);
            set( ref(db, 'post/'+postid+'/likes/userids/'+parent), null);
        } 
        catch (e) {
            console.log(e);
        }
    },
    DeletePost: (postid, navigation) => {
        try {
            set( ref(db, 'post/'+postid), null);
            if(navigation!==null) navigation.goBack();
        } 
        catch (e) {
            console.log(e);
        }
    },
};