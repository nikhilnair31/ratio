import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import auth from '@react-native-firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyDeHyeqvHV_zypBrH1xglk84uTa820RhLg",
    authDomain: "ratio22122.firebaseapp.com",
    databaseURL: "https://ratio22122-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ratio22122",
    storageBucket: "ratio22122.appspot.com",
    messagingSenderId: "370585798414",
    appId: "1:370585798414:web:96a799a33be7fdee69b95f",
    measurementId: "G-CE5W58SRYH",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const fdb = getFirestore();
export const db = getDatabase();

// export const authf = firebase.auth();
export const googleProvider = auth.GoogleAuthProvider;
export const githubProvider = auth.GithubAuthProvider;