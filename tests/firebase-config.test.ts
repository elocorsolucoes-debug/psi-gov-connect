import { describe, it, expect } from 'vitest';

describe('Firebase Environment Variables', () => {
  it('should have all required Firebase env vars set', () => {
    const required = [
      'EXPO_PUBLIC_FIREBASE_API_KEY',
      'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
      'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'EXPO_PUBLIC_FIREBASE_APP_ID',
    ];

    for (const key of required) {
      const val = process.env[key];
      expect(val, `${key} should be set`).toBeTruthy();
      expect(val!.length, `${key} should not be empty`).toBeGreaterThan(0);
    }
  });

  it('should have a valid Firebase API key format', () => {
    const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '';
    // Firebase API keys start with "AIza"
    expect(apiKey.startsWith('AIza'), 'API key should start with AIza').toBe(true);
  });

  it('should have a valid Firebase project ID', () => {
    const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '';
    // Project IDs are lowercase alphanumeric with hyphens
    expect(projectId.length).toBeGreaterThan(3);
    expect(projectId).toMatch(/^[a-z0-9-]+$/);
  });
});
