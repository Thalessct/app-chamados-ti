import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { SessionUser } from '../types/user';

export type AuthField = 'name' | 'email' | 'password' | 'form';

export type AuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; field: AuthField; message: string };

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

function toSession(user: User): SessionUser {
  return {
    id: user.uid,
    name: user.displayName ?? user.email?.split('@')[0] ?? 'Usuário',
    email: user.email ?? '',
    createdAt: user.metadata.creationTime
      ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR')
      : '',
  };
}

function toFailure(error: unknown): AuthResult {
  const code = (error as { code?: string }).code;

  switch (code) {
    case 'auth/email-already-in-use':
      return { ok: false, field: 'email', message: 'Este e-mail já está cadastrado. Entre com a sua senha.' };
    case 'auth/invalid-email':
      return { ok: false, field: 'email', message: 'Digite um e-mail válido, como nome@empresa.com.' };
    case 'auth/weak-password':
      return { ok: false, field: 'password', message: 'A senha é muito fraca. Use pelo menos 6 caracteres.' };
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return { ok: false, field: 'form', message: 'E-mail ou senha incorretos. Confira os dados e tente de novo.' };
    case 'auth/too-many-requests':
      return { ok: false, field: 'form', message: 'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.' };
    case 'auth/network-request-failed':
      return { ok: false, field: 'form', message: 'Sem conexão com a internet. Verifique a rede e tente de novo.' };
    default:
      return { ok: false, field: 'form', message: 'Algo deu errado. Tente novamente.' };
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      data.email.trim(),
      data.password
    );
    await updateProfile(credential.user, { displayName: data.name.trim() });
    return { ok: true, user: toSession(credential.user) };
  } catch (error) {
    return toFailure(error);
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { ok: true, user: toSession(credential.user) };
  } catch (error) {
    return toFailure(error);
  }
}

export async function restoreSession(): Promise<SessionUser | null> {
  await auth.authStateReady();
  return auth.currentUser ? toSession(auth.currentUser) : null;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}