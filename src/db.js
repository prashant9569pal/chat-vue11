import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
const firebaseConfig = {
  apiKey: 'AIzaSyB28S7UoEDmxQGaYj5OgQvlvwlhMiawwWM',
  authDomain: 'chat-app-c4a2a.firebaseapp.com',
  projectId: 'chat-app-c4a2a',
  storageBucket: 'chat-app-c4a2a.appspot.com',
  messagingSenderId: '833618146010',
  appId: '1:833618146010:web:9456c58cd6f2318444abe3'
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

const db = getDatabase(firebaseApp)

export default db
