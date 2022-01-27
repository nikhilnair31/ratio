import firebase from 'firebase/compat/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

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

export let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} 
else {
    app = firebase.app();
}
export const db = app.database();
export const auth = getAuth();
export const githubProvider = new GithubAuthProvider();