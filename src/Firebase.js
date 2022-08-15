import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyDZg-4fp6ad1s0msDEzzHtmxSMhu3A548I",
    authDomain: "manage-process-app.firebaseapp.com",
    databaseURL: "gs://manage-process-app.appspot.com",
    projectId: "manage-process-app",
    storageBucket:"manage-process-app.appspot.com",
    messagingSenderId: "347368006183",
    appId: "1:347368006183:web:e3aca49c47d69ada976402"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);


const db = firebaseApp.firestore();
const auth = getAuth();

export default firebaseApp
export { auth, db }