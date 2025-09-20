import { IAPService, PRODUCT_IDS } from '@/src/services/iap';
import { ParentGateService } from '@/src/services/parent-gate';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { ActivityIndicator, Button, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
});

export default function GrownupsIndex() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';

  const [isVerified, setIsVerified] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  async function checkVerificationStatus() {
    const verified = await ParentGateService.isParentVerified();
    setIsVerified(verified);
    
    if (verified) {
      const remaining = await ParentGateService.getTimeRemainingFormatted();
      setTimeRemaining(remaining);
      await initializeShop();
    }
  }

  async function initializeShop() {
    try {
      setLoading(true);
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

  async function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You will need to verify again to access parent features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await ParentGateService.clearVerification();
            setIsVerified(false);
            setTimeRemaining('');
          }
        }
      ]
    );
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    card: {
      padding: 20,
      marginBottom: 20,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
    title: {
      marginBottom: 16,
      textAlign: 'center',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    text: {
      marginBottom: 16,
      textAlign: 'center',
      color: isDark ? '#CCCCCC' : '#000000',
    },
    smallText: {
      textAlign: 'center',
      color: isDark ? '#999999' : '#666',
      marginBottom: 20,
    },
    footerText: {
      textAlign: 'center',
      marginTop: 20,
      color: isDark ? '#CCCCCC' : '#666',
    },
  });

  if (isVerified) {
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
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Verification Status */}
          <Card style={[dynamicStyles.card, { alignItems: 'center', marginBottom: 20 }]}>
            <Text variant="headlineMedium" style={[dynamicStyles.title, { textAlign: 'center' }]}>
              Parent Access Verified
            </Text>
            <Text variant="bodySmall" style={[dynamicStyles.smallText, { textAlign: 'center' }]}>
              Verification expires: {timeRemaining}
            </Text>
          </Card>

          {/* Shop Section */}
          <Text variant="headlineMedium" style={[dynamicStyles.title, { textAlign: 'center', marginBottom: 16 }]}>
            Shop
          </Text>
          
          {/* Restore Purchases Button */}
          <Button 
            mode="outlined" 
            onPress={handleRestorePurchases}
            style={{ marginBottom: 16 }}
            disabled={loading}
          >
            Restore Purchases
          </Button>
          
          {/* Products */}
          {loading ? (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <ActivityIndicator size="large" style={{ marginBottom: 16 }} />
              <Text style={{ color: isDark ? '#CCCCCC' : '#000000' }}>Loading products...</Text>
            </View>
          ) : (
            products.map((item) => (
              <Card key={item.id} style={[dynamicStyles.card, { marginBottom: 16 }]}>
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
            ))
          )}
          
          <Text variant="bodySmall" style={[dynamicStyles.footerText, { textAlign: 'center', marginTop: 20 }]}>
            All purchases are processed securely through your device's app store.
          </Text>

          {/* Action Buttons */}
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Button 
              mode="outlined" 
              onPress={handleLogout} 
              style={{ marginBottom: 12 }}
            >
              Logout
            </Button>
            <Button onPress={() => router.push('/grownups/privacy')}>Privacy Policy</Button>
            <Button onPress={() => router.push('/grownups/support')}>Support</Button>
          </View>
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
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Text style={[dynamicStyles.text, { textAlign: 'center' }]}>This area is for parents and guardians only.</Text>
        <Button mode="contained" onPress={() => router.push('/grownups/parent-gate')} style={{ marginBottom: 12 }}>
          Enter Parent Gate
        </Button>
        <Button onPress={() => router.push('/grownups/privacy')}>Privacy Policy</Button>
        <Button onPress={() => router.push('/grownups/support')}>Support</Button>
      </ScrollView>
    </SafeAreaView>
  );
}