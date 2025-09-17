import { IAPService, PRODUCTS, PRODUCT_IDS } from '@/src/services/iap';
import { ParentGateService } from '@/src/services/parent-gate';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Card, Text, useTheme } from 'react-native-paper';

type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
};

export default function Shop() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';

  const [products, setProducts] = useState<Product[]>([...PRODUCTS]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    checkParentVerification();
    loadProducts();
  }, []);

  async function checkParentVerification() {
    const verified = await ParentGateService.isParentVerified();
    if (!verified) {
      router.replace('/grownups/parent-gate');
    }
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const productIds = Object.values(PRODUCT_IDS);
      const iapProducts = await IAPService.getProducts(productIds);
      
      // Update products with real IAP data
      const updatedProducts = PRODUCTS.map(product => {
        const iapProduct = iapProducts.find(p => p.productId === product.id);
        return {
          ...product,
          price: iapProduct?.price || product.price,
        };
      });
      
      setProducts(updatedProducts);
    } catch (error) {
      console.log('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products. Using demo mode.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(itemId: string) {
    setPurchasing(itemId);
    
    try {
      const result = await IAPService.purchaseProduct(itemId);
      
      if (result.success) {
        Alert.alert(
          'Purchase Successful!',
          'Thank you for your purchase. The content has been added to your collection.',
          [
            {
              text: 'OK',
              onPress: () => {
                // TODO: Grant the purchased content to the user
                console.log('Granting content for:', itemId);
              }
            }
          ]
        );
      } else {
        Alert.alert('Purchase Failed', result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.log('Error purchasing:', error);
      Alert.alert('Purchase Error', 'An error occurred during purchase. Please try again.');
    } finally {
      setPurchasing(null);
    }
  }

  async function handleRestorePurchases() {
    setLoading(true);
    
    try {
      const results = await IAPService.restorePurchases();
      
      if (results.length > 0 && results[0].success) {
        Alert.alert('Purchases Restored', 'Your previous purchases have been restored.');
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
      }
    } catch (error) {
      console.log('Error restoring purchases:', error);
      Alert.alert('Restore Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    title: {
      marginBottom: 16,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    card: {
      marginBottom: 16,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
    footerText: {
      textAlign: 'center',
      color: isDark ? '#999999' : '#666',
      marginTop: 16,
    },
  });

  if (loading) {
    return (
      <ScrollView 
        style={dynamicStyles.container} 
        contentContainerStyle={dynamicStyles.loadingContainer}
      >
        <ActivityIndicator size="large" style={{ marginBottom: 16 }} />
        <Text style={{ color: isDark ? '#CCCCCC' : '#000000' }}>Loading products...</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={dynamicStyles.container}>
      <Text variant="headlineMedium" style={dynamicStyles.title}>Shop</Text>
      
      {/* Restore Purchases Button */}
      <Button 
        mode="outlined" 
        onPress={handleRestorePurchases}
        style={{ marginBottom: 16 }}
        disabled={loading}
      >
        Restore Purchases
      </Button>
      
      {products.map((item) => (
        <Card key={item.id} style={dynamicStyles.card}>
          <Card.Title title={item.title} subtitle={item.price} />
          <Card.Content>
            <Text style={{ color: isDark ? '#CCCCCC' : '#000000' }}>{item.description}</Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              onPress={() => handlePurchase(item.id)}
              disabled={purchasing === item.id}
              loading={purchasing === item.id}
            >
              {purchasing === item.id ? 'Purchasing...' : 'Purchase'}
            </Button>
          </Card.Actions>
        </Card>
      ))}
      
      <Text variant="bodySmall" style={dynamicStyles.footerText}>
        All purchases are processed securely through your device's app store.
      </Text>
    </ScrollView>
  );
}
