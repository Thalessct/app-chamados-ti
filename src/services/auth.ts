import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionUser, StoredUser } from '../types/user';

const USERS_KEY = '@chamados_ti:users';
const SESSION_KEY = '@chamados_ti:session';

export type AuthField = 'name' | 'email' | 'password' | 'form';

export type AuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; field: AuthField; message: string };

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Projeto acadêmico sem backend: as contas ficam apenas no aparelho.
// Em produção, a senha nunca deve ser guardada assim: use uma API com hash
// de senha e armazene só o token de sessão (ex.: expo-secure-store).

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toSession(user: StoredUser): SessionUser {
  const { password: _password, ...session } = user;
  return session;
}

async function readUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}

export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    const email = normalizeEmail(data.email);
    const users = await readUsers();

    if (users.some((user) => user.email === email)) {
      return {
        ok: false,
        field: 'email',
        message: 'Este e-mail já está cadastrado. Entre com a sua senha.',
      };
    }

    const user: StoredUser = {
      id: String(Date.now()),
      name: data.name.trim(),
      email,
      password: data.password,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    await AsyncStorage.setItem(SESSION_KEY, user.id);

    return { ok: true, user: toSession(user) };
  } catch {
    return {
      ok: false,
      field: 'form',
      message: 'Não foi possível criar a conta agora. Tente novamente.',
    };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const users = await readUsers();
    const user = users.find(
      (item) => item.email === normalizeEmail(email) && item.password === password
    );

    if (!user) {
      return {
        ok: false,
        field: 'form',
        message: 'E-mail ou senha incorretos. Confira os dados e tente de novo.',
      };
    }

    await AsyncStorage.setItem(SESSION_KEY, user.id);
    return { ok: true, user: toSession(user) };
  } catch {
    return {
      ok: false,
      field: 'form',
      message: 'Não foi possível entrar agora. Tente novamente.',
    };
  }
}

export async function restoreSession(): Promise<SessionUser | null> {
  try {
    const sessionId = await AsyncStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;

    const users = await readUsers();
    const user = users.find((item) => item.id === sessionId);

    if (!user) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return null;
    }

    return toSession(user);
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
