// import Firebase SDK: app, auth, and firestore
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// Function that will initialize our Firestore Database
const firebaseConfig = {
  apiKey: "AIzaSyA07tVyC7yxTabwL5wa4xhbSi1c5V276fw",
  authDomain: "assignmentappfinals.firebaseapp.com",
  projectId: "assignmentappfinals",
  storageBucket: "assignmentappfinals.appspot.com",
  messagingSenderId: "357801281999",
  appId: "1:357801281999:web:2d57a8e2dcd48e495f2aba"
};

// Checks whether there is already a Firestore Database initialized
if (!firebase.apps.length > 0) {
    firebase.initializeApp(firebaseConfig)
}

// Export firebase
export { firebase }