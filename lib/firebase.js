import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsAs2DypDdq3cukkvRqh83nhmc4qjBcFE",
  authDomain: "blogitout-e0d4a.firebaseapp.com",
  projectId: "blogitout-e0d4a",
  storageBucket: "blogitout-e0d4a.appspot.com",
  messagingSenderId: "110382216071",
  appId: "1:110382216071:web:990a1e9838841fddec1922",
  measurementId: "G-802KNCVZ5V",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

expost const auth = firebase.auth().signInWithPopup;
expost const firestore = firebase.firestore();
expost const storage = firebase.storage();

