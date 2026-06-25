import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAUGJj6Lu-TQPTaCVLci6JmmNMddtHb9VM",
  authDomain: "sc-wave-player-hub.firebaseapp.com",
  projectId: "sc-wave-player-hub",
  storageBucket: "sc-wave-player-hub.firebasestorage.app",
  messagingSenderId: "997897586753",
  appId: "1:997897586753:web:e519a910d762db2b92dec0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
