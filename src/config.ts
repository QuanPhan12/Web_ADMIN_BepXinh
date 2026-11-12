import { initializeApp } from 'firebase/app'
import { browserSessionPersistence, connectAuthEmulator, getAuth, setPersistence } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const app = initializeApp({
  apiKey: 'AIzaSyD2gLs0h5pICB_dyIAjEpHxnIbunLvPrVQ',
  appId: '1:955775168150:web:f661fb103e9ed7cd329cb7',
  projectId: import.meta.env.VITE_USE_EMULATORS === 'true' ? 'demo-bepxinh' : 'bepxinh-b0be7',
  authDomain: 'bepxinh-b0be7.firebaseapp.com',
})
export const auth = getAuth(app)
export const db = getFirestore(app)
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
export const authReady = setPersistence(auth, browserSessionPersistence)
