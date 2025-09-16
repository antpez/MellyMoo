// Mock IAP service for development
// In production, you would use: import * as InAppPurchases from 'expo-in-app-purchases';

const InAppPurchases = {
  connectAsync: async () => {
    console.log('Mock IAP: Connected');
    return true;
  },
  getProductsAsync: async (productIds: string[]) => {
    console.log('Mock IAP: Getting products for:', productIds);
    return {
      responseCode: 0, // OK
      results: productIds.map(id => ({
        productId: id,
        price: '$2.99',
        title: 'Mock Product',
        description: 'Mock product description',
        type: 'non_consumable',
      })),
    };
  },
  purchaseItemAsync: async (productId: string) => {
    console.log('Mock IAP: Purchasing:', productId);
    return {
      responseCode: 0, // OK
      productId: productId,
      transactionId: `mock_${Date.now()}`,
    };
  },
  getPurchaseHistoryAsync: async () => {
    console.log('Mock IAP: Getting purchase history');
    return {
      responseCode: 0, // OK
      results: [],
    };
  },
  finishTransactionAsync: async (purchase: any, isConsumable: boolean) => {
    console.log('Mock IAP: Finishing transaction:', purchase.transactionId);
    return true;
  },
  disconnectAsync: async () => {
    console.log('Mock IAP: Disconnected');
    return true;
  },
  IAPResponseCode: {
    OK: 0,
    USER_CANCELLED: 1,
    ERROR: 2,
    DEFERRED: 3,
  },
};

export interface IAPProduct {
  productId: string;
  price: string;
  title: string;
  description: string;
  type: 'consumable' | 'non_consumable' | 'subscription';
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  transactionId?: string;
  error?: string;
}

export class IAPService {
  private static isInitialized = false;

  /**
   * Initialize the IAP service
   */
  static async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      await InAppPurchases.connectAsync();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.log('Error initializing IAP:', error);
      return false;
    }
  }

  /**
   * Get available products
   */
  static async getProducts(productIds: string[]): Promise<IAPProduct[]> {
    try {
      await this.initialize();
      
      const result = await InAppPurchases.getProductsAsync(productIds);
      
      if (result.responseCode === InAppPurchases.IAPResponseCode.OK && result.results) {
        return result.results.map((product: any) => ({
          productId: product.productId,
          price: product.price,
          title: product.title,
          description: product.description,
          type: product.type as 'consumable' | 'non_consumable' | 'subscription',
        }));
      }
      
      return [];
    } catch (error) {
      console.log('Error getting products:', error);
      return [];
    }
  }

  /**
   * Purchase a product
   */
  static async purchaseProduct(productId: string): Promise<PurchaseResult> {
    try {
      await this.initialize();
      
      const result = await InAppPurchases.purchaseItemAsync(productId);
      
      // For demo purposes, simulate a successful purchase
      // In a real app, you would handle the actual IAP response
      console.log('Purchase attempt for:', productId, 'Result:', result);
      
      return {
        success: true,
        productId: productId,
        transactionId: `demo_${Date.now()}`,
      };
    } catch (error) {
      console.log('Error purchasing product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Restore previous purchases
   */
  static async restorePurchases(): Promise<PurchaseResult[]> {
    try {
      await this.initialize();
      
      const result = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (result && result.responseCode === InAppPurchases.IAPResponseCode.OK && result.results) {
        return result.results.map((purchase: any) => ({
          success: true,
          productId: purchase.productId,
          transactionId: purchase.transactionId || purchase.transactionIdentifier,
        }));
      } else {
        return [{
          success: false,
          error: `Restore failed with code: ${result?.responseCode || 'unknown'}`,
        }];
      }
    } catch (error) {
      console.log('Error restoring purchases:', error);
      return [{
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }];
    }
  }

  /**
   * Finish a transaction (required for consumables)
   */
  static async finishTransaction(transactionId: string, isConsumable: boolean = false): Promise<boolean> {
    try {
      await this.initialize();
      
      // Create a mock purchase object for the finishTransactionAsync call
      const purchase = {
        transactionId,
        productId: '',
        transactionDate: Date.now(),
        transactionReceipt: '',
        transactionState: 1, // Purchased
      };
      
      await InAppPurchases.finishTransactionAsync(purchase as any, isConsumable);
      return true;
    } catch (error) {
      console.log('Error finishing transaction:', error);
      return false;
    }
  }

  /**
   * Disconnect from IAP service
   */
  static async disconnect(): Promise<void> {
    try {
      if (this.isInitialized) {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
      }
    } catch (error) {
      console.log('Error disconnecting IAP:', error);
    }
  }
}

// Product IDs for the app
export const PRODUCT_IDS = {
  THEME_BEACH: 'com.mellymoo.theme.beach',
  THEME_CANDY: 'com.mellymoo.theme.candy',
  THEME_SPACE: 'com.mellymoo.theme.space',
  COSTUME_PACK: 'com.mellymoo.costume.pack',
} as const;

// Product definitions
export const PRODUCTS = [
  {
    id: PRODUCT_IDS.THEME_BEACH,
    title: 'Beach Theme Pack',
    description: 'Beach background, items, special bubble, 10 stickers, 5 decorations, 3 costumes',
    price: '$2.99',
  },
  {
    id: PRODUCT_IDS.THEME_CANDY,
    title: 'Candy Land Theme Pack',
    description: 'Candy background, items, special bubble, 10 stickers, 5 decorations, 3 costumes',
    price: '$2.99',
  },
  {
    id: PRODUCT_IDS.THEME_SPACE,
    title: 'Space Theme Pack',
    description: 'Space background, items, special bubble, 10 stickers, 5 decorations, 3 costumes',
    price: '$2.99',
  },
  {
    id: PRODUCT_IDS.COSTUME_PACK,
    title: 'Dress-up Day Pack',
    description: '5 new costumes for Melly Moo',
    price: '$1.99',
  },
] as const;
