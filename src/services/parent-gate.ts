import AsyncStorage from '@react-native-async-storage/async-storage';

const PARENT_VERIFIED_KEY = 'parent_verified';
const PARENT_VERIFICATION_EXPIRES_KEY = 'parent_verification_expires';
const VERIFICATION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class ParentGateService {
  /**
   * Check if parent is currently verified and not expired
   */
  static async isParentVerified(): Promise<boolean> {
    try {
      const verified = await AsyncStorage.getItem(PARENT_VERIFIED_KEY);
      const expiresAt = await AsyncStorage.getItem(PARENT_VERIFICATION_EXPIRES_KEY);
      
      if (verified !== 'true') {
        return false;
      }
      
      if (!expiresAt) {
        // No expiration set, consider expired
        await this.clearVerification();
        return false;
      }
      
      const expirationTime = parseInt(expiresAt, 10);
      const now = Date.now();
      
      if (now > expirationTime) {
        // Verification expired
        await this.clearVerification();
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Error checking parent verification:', error);
      return false;
    }
  }

  /**
   * Verify parent and set expiration time
   */
  static async verifyParent(): Promise<boolean> {
    try {
      const expirationTime = Date.now() + VERIFICATION_DURATION;
      
      await AsyncStorage.setItem(PARENT_VERIFIED_KEY, 'true');
      await AsyncStorage.setItem(PARENT_VERIFICATION_EXPIRES_KEY, expirationTime.toString());
      
      return true;
    } catch (error) {
      console.log('Error verifying parent:', error);
      return false;
    }
  }

  /**
   * Clear parent verification
   */
  static async clearVerification(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PARENT_VERIFIED_KEY);
      await AsyncStorage.removeItem(PARENT_VERIFICATION_EXPIRES_KEY);
    } catch (error) {
      console.log('Error clearing parent verification:', error);
    }
  }

  /**
   * Get time remaining until verification expires
   */
  static async getTimeRemaining(): Promise<number> {
    try {
      const expiresAt = await AsyncStorage.getItem(PARENT_VERIFICATION_EXPIRES_KEY);
      
      if (!expiresAt) {
        return 0;
      }
      
      const expirationTime = parseInt(expiresAt, 10);
      const now = Date.now();
      const remaining = expirationTime - now;
      
      return Math.max(0, remaining);
    } catch (error) {
      console.log('Error getting time remaining:', error);
      return 0;
    }
  }

  /**
   * Format time remaining as human-readable string
   */
  static async getTimeRemainingFormatted(): Promise<string> {
    const remaining = await this.getTimeRemaining();
    
    if (remaining === 0) {
      return 'Expired';
    }
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  }
}
