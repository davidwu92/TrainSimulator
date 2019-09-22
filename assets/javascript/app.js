//getting firebase online
const firebaseConfig = {
  apiKey: "AIzaSyDxa85HqsmtpHbJ-eHnZfdph3aW6AaB7q8",
  authDomain: "trainsimulator-7c11c.firebaseapp.com",
  databaseURL: "https://trainsimulator-7c11c.firebaseio.com",
  projectId: "trainsimulator-7c11c",
  storageBucket: "",
  messagingSenderId: "576053015863",
  appId: "1:576053015863:web:75286b112e13a7409f96b2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
console.log(db)

