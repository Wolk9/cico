import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // uw Firebase configuratie gegevens hier
  apiKey: "AIzaSyAfS-I1miPzZZA5Mc9Knj6oKIQw_C-dsUk",
  authDomain: "clockinout-wolk9.firebaseapp.com",
  projectId: "clockinout-wolk9",
  storageBucket: "clockinout-wolk9.appspot.com",
  messagingSenderId: "795930777692",
  appId: "1:795930777692:web:418b79366fdb7ab9772e99",
  measurementId: "G-F7DN5X0377"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
