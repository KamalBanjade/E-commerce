import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzG6aHCwxS8-L9g_i8dMnhV0dymQlEQRE",
    authDomain: "ecommerce-96e2a.firebaseapp.com",
    projectId: "ecommerce-96e2a",
    storageBucket: "ecommerce-96e2a.appspot.com",
    messagingSenderId: "752461170853",
    appId: "1:752461170853:web:a99908f85e18aa7834a54c",
    measurementId: "G-9JP6SL467V"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
