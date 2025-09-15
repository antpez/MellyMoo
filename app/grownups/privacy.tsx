import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

export default function Privacy() {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Privacy Policy</Text>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Data Collection</Text>
      <Text style={{ marginBottom: 16 }}>
        Melly Moo collects no personal information. All data is stored locally on your device.
        Child names are nicknames only and never shared.
      </Text>
      
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Analytics</Text>
      <Text style={{ marginBottom: 16 }}>
        Optional analytics are device-local only. No data is uploaded without explicit parental consent.
      </Text>
      
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>COPPA Compliance</Text>
      <Text style={{ marginBottom: 16 }}>
        This app is designed for children and complies with COPPA. No personal data is collected from children.
      </Text>
    </ScrollView>
  );
}
