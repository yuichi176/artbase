/**
 * Password validation utility
 * Enforces strong password requirements for user authentication using Firebase's validatePassword API
 */

import { validatePassword, type Auth } from 'firebase/auth'

export interface PasswordValidationResult {
  isValid: boolean
  error: string | null
}

/**
 * Validates password strength using Firebase's validatePassword API
 *
 * Requirements (enforced by Firebase password policy):
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 *
 * @param auth - Firebase Auth instance
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export async function validatePasswordStrength(
  auth: Auth,
  password: string,
): Promise<PasswordValidationResult> {
  const status = await validatePassword(auth, password)

  if (!status.isValid) {
    if (status.meetsMinPasswordLength !== true) {
      return {
        isValid: false,
        error: 'パスワードは8文字以上で入力してください',
      }
    }

    if (status.containsUppercaseLetter !== true) {
      return {
        isValid: false,
        error: 'パスワードには大文字を1文字以上含めてください',
      }
    }

    if (status.containsLowercaseLetter !== true) {
      return {
        isValid: false,
        error: 'パスワードには小文字を1文字以上含めてください',
      }
    }

    if (status.containsNumericCharacter !== true) {
      return {
        isValid: false,
        error: 'パスワードには数字を1文字以上含めてください',
      }
    }
  }

  return {
    isValid: true,
    error: null,
  }
}
