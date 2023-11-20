import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCD42vK1Fn4wP7bzRpHzqYoH82Y10F_xnM",
    authDomain: "mobcom-92291.firebaseapp.com",
    projectId: "mobcom-92291",
    storageBucket: "mobcom-92291.appspot.com",
    messagingSenderId: "303562753955",
    appId: "1:303562753955:web:4d0abc1e15c2af83f37c16",
    measurementId: "G-BDMHE7HW6V"
  };

if (!firebase.apps.length > 0) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };