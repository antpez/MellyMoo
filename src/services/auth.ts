export type AuthUser = { id: string } | null;

let currentUser: AuthUser = { id: 'local-user' };

export async function signUpWithEmail(_email: string, _password: string) {
  return { id: 'local-user' };
}

export async function signInWithEmail(_email: string, _password: string) {
  return { id: 'local-user' };
}

export async function signOut() {
  currentUser = { id: 'local-user' };
}

export function onAuthStateChange(callback: (user: AuthUser) => void) {
  callback(currentUser);
  return () => {};
}

export async function ensureProfileRow(_userId: string) {
  // no-op for local mode
}
