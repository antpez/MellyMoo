import { IAPService, PRODUCT_IDS, PRODUCTS } from '@/src/services/iap';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { ActivityIndicator, Button, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    initializeShop();
  }, []);

  async function initializeShop() {
    try {
      await IAPService.initialize();
      const loadedProducts = await IAPService.getProducts(Object.values(PRODUCT_IDS));
      
      if (loadedProducts.length > 0) {
        setProducts(loadedProducts.map(p => ({
          id: p.productId,
          title: p.title,
          description: p.description || 'Premium content',
          price: p.price || 'Loading...'
        })));
      }
    } catch (error) {
      console.error('Failed to initialize shop:', error);
      Alert.alert('Error', 'Failed to load shop. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(productId: string) {
    try {
      setPurchasing(productId);
      const result = await IAPService.purchaseProduct(productId);
      
      if (result.success) {
        Alert.alert('Success', `Purchase successful! Product: ${result.productId}`);
      } else {
        Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  }

  async function handleRestorePurchases() {
    try {
      setLoading(true);
      const results = await IAPService.restorePurchases();
      
      if (results.length > 0) {
        Alert.alert('Success', `Restored ${results.length} purchase(s) successfully!`);
      } else {
        Alert.alert('No Purchases', 'No previous purchases found to restore.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    title: {
      marginBottom: 16,
      textAlign: 'center',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    card: {
      marginBottom: 16,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
    footerText: {
      textAlign: 'center',
      marginTop: 20,
      color: isDark ? '#CCCCCC' : '#666',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/grownups.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <ScrollView 
          style={dynamicStyles.container} 
          contentContainerStyle={dynamicStyles.loadingContainer}
        >
          <ActivityIndicator size="large" style={{ marginBottom: 16 }} />
          <Text style={{ color: isDark ? '#CCCCCC' : '#000000' }}>Loading products...</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/grownups.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
      >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logo: {
    width: 200,
    height: 120,
    maxWidth: '80%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
});