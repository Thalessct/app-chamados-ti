import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDzNP2d0xmE2y5-37nEFiSkU2D0i2u03Us",
  authDomain: "chamados-ti-c7a63.firebaseapp.com",
  projectId: "chamados-ti-c7a63",
  storageBucket: "chamados-ti-c7a63.firebasestorage.app",
  messagingSenderId: "472984153618",
  appId: "1:472984153618:web:bba1992e15567ff253b2cb",
  measurementId: "G-7Y0S46W4RT"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuth(): Auth {
  if (Platform.OS === 'web') return getAuth(app);

  try {
    // Persistência explícita: sem ela, o usuário é deslogado ao fechar o app.
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Fast Refresh: o auth já foi inicializado.
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);