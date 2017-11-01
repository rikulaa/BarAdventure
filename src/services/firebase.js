import * as firebase from 'firebase';
import {
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_DATABASE_URL, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET
} from '../../env';

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
};

export default firebaseApp = firebase.initializeApp(firebaseConfig);