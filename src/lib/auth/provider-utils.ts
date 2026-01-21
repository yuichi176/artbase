import type { User as FirebaseUser } from 'firebase/auth'

// Provider IDs used by Firebase Auth
export const PROVIDER_IDS = {
  EMAIL_PASSWORD: 'password',
  GOOGLE: 'google.com',
} as const

/**
 * Get all linked provider IDs for a Firebase user
 * @param user Firebase user object
 * @returns Array of linked provider IDs
 */
export function getLinkedProviders(user: FirebaseUser | null): string[] {
  if (!user) return []
  return user.providerData.map((provider) => provider.providerId)
}

/**
 * Check if Email/Password authentication is linked
 * @param user Firebase user object
 * @returns true if Email/Password is linked
 */
export function isEmailPasswordLinked(user: FirebaseUser | null): boolean {
  const providers = getLinkedProviders(user)
  return providers.includes(PROVIDER_IDS.EMAIL_PASSWORD)
}

/**
 * Check if Google authentication is linked
 * @param user Firebase user object
 * @returns true if Google is linked
 */
export function isGoogleLinked(user: FirebaseUser | null): boolean {
  const providers = getLinkedProviders(user)
  return providers.includes(PROVIDER_IDS.GOOGLE)
}

/**
 * Get Japanese display name for a provider ID
 * @param providerId Firebase provider ID
 * @returns Japanese display name
 */
export function getProviderDisplayName(providerId: string): string {
  switch (providerId) {
    case PROVIDER_IDS.EMAIL_PASSWORD:
      return 'メール/パスワード'
    case PROVIDER_IDS.GOOGLE:
      return 'Google'
    default:
      return providerId
  }
}

/**
 * Get provider info for a specific provider ID
 * @param user Firebase user object
 * @param providerId Provider ID to search for
 * @returns Provider info or null if not found
 */
export function getProviderInfo(user: FirebaseUser | null, providerId: string) {
  if (!user) return null
  return user.providerData.find((provider) => provider.providerId === providerId) || null
}

/**
 * Get email address for Email/Password provider
 * @param user Firebase user object
 * @returns Email address or null if not linked
 */
export function getEmailPasswordEmail(user: FirebaseUser | null): string | null {
  const providerInfo = getProviderInfo(user, PROVIDER_IDS.EMAIL_PASSWORD)
  return providerInfo?.email || null
}

/**
 * Get email address for Google provider
 * @param user Firebase user object
 * @returns Email address or null if not linked
 */
export function getGoogleEmail(user: FirebaseUser | null): string | null {
  const providerInfo = getProviderInfo(user, PROVIDER_IDS.GOOGLE)
  return providerInfo?.email || null
}

/**
 * Get Firebase error message in Japanese
 * @param errorCode Firebase error code
 * @returns Japanese error message
 */
export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に別のアカウントで使用されています'
    case 'auth/weak-password':
      return 'パスワードは6文字以上で設定してください'
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません'
    case 'auth/requires-recent-login':
      return 'セキュリティのため、再度ログインしてください'
    case 'auth/provider-already-linked':
      return 'この認証方法は既に連携されています'
    case 'auth/popup-closed-by-user':
      return 'ログインがキャンセルされました'
    case 'auth/popup-blocked':
      return 'ポップアップがブロックされました。ブラウザの設定を確認してください'
    case 'auth/credential-already-in-use':
      return 'この認証情報は既に使用されています'
    default:
      return '予期しないエラーが発生しました'
  }
}
