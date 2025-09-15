import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function Support() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Support</Text>
      <Text style={{ marginBottom: 24 }}>
        Need help with Melly Moo? Contact us at support@mellymoo.com
      </Text>
      <Button mode="contained" onPress={() => {}}>Send Email</Button>
    </View>
  );
}
