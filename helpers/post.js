import { db, fdb } from "./firebase";
import { getDatabase, ref, onValue, set, push, update, child, get } from 'firebase/database';
// import dayjs from "dayjs";

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
    PushPost: async (userid, posttext) => {
        try {
            const reference = ref(db, 'post/');
            push(reference, {
                userid: userid,
                posttext: posttext,
                utc: Date.now(),
                comments: {},
                likes: 0,
            });
            return true;
        } 
        catch (e) {
            console.log(e);
            return false;
        }
    },
    Likepost: (id, newlike) => {
        try {
            const reference = ref(db, 'post/'+id);
            update(reference, {
                likes: newlike,
            });
        } 
        catch (e) {
            console.log(e);
        }
    }
};