// Firebase initialization and configuration
// Include the Firebase scripts in your HTML file before using this code
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js'

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-gDAwCx9wq_NkYmetL1D87rbTHuNNUqE",
    authDomain: "mock-master-4f4a2.firebaseapp.com",
    projectId: "mock-master-4f4a2",
    storageBucket: "mock-master-4f4a2.firebasestorage.app",
    messagingSenderId: "84908806280",
    appId: "1:84908806280:web:25c07b2c936812dd324f3d"
  };
  
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // User Signup function
  function signup(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("User signed up:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error during signup:", error.message);
      });
  }
  
  // User Login function
  function login(email, password) {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error during login:", error.message);
      });
  }
  
  // Add question to Firestore
  function addQuestion(question, options, correctOption, tags) {
    db.collection("questions").add({
      question,
      options,
      correctOption,
      tags
    })
      .then(() => {
        console.log("Question added successfully");
      })
      .catch((error) => {
        console.error("Error adding question:", error.message);
      });
  }
  
  // Fetch random 10 questions by tags
  function fetchQuestionsByTags(tags) {
    db.collection("questions").where("tags", "array-contains-any", tags).get()
      .then((querySnapshot) => {
        let questions = [];
        querySnapshot.forEach((doc) => {
          questions.push({ id: doc.id, ...doc.data() });
        });
  
        // Shuffle and select 10 questions
        questions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
        console.log("Fetched questions:", questions);
        return questions;
      })
      .catch((error) => {
        console.error("Error fetching questions:", error.message);
      });
  }