import * as SecureStore from 'expo-secure-store';

const GITHUB_TOKEN_KEY = 'arise_github_token_v1';

export async function saveGithubToken(token: string): Promise<void> {
  const trimmed = token.trim();
  if (!trimmed) return;

  await SecureStore.setItemAsync(GITHUB_TOKEN_KEY, trimmed, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
}

export async function getGithubToken(): Promise<string | null> {
  return SecureStore.getItemAsync(GITHUB_TOKEN_KEY);
}

export async function deleteGithubToken(): Promise<void> {
  await SecureStore.deleteItemAsync(GITHUB_TOKEN_KEY);
}
