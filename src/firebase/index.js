import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDSTEOSJficRRLy42EgPEcB5F_FOJ2Xcyg',
  authDomain: 'fir-redux-toolkit-query.firebaseapp.com',
  projectId: 'fir-redux-toolkit-query',
  storageBucket: 'fir-redux-toolkit-query.appspot.com',
  messagingSenderId: '830149588039',
  appId: '1:830149588039:web:14e61f05c242c7fd54ed62',
  measurementId: 'G-LEGY0BX5LV'
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage, firebase as default }
