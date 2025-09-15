import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

const shopItems = [
  { id: 'theme_beach', title: 'Beach Theme Pack', description: 'Beach background, items, special bubble, 10 stickers, 5 decorations, 3 costumes', price: '$2.99' },
  { id: 'theme_candy', title: 'Candy Land Theme Pack', description: 'Candy background, items, special bubble, 10 stickers, 5 decorations, 3 costumes', price: '$2.99' },
  { id: 'theme_space', title: 'Space Theme Pack', description: 'Space background, items, special bubble, 10 stickers, 5 decorations, 3 costumes', price: '$2.99' },
  { id: 'costume_pack', title: 'Dress-up Day Pack', description: '5 new costumes for Melly Moo', price: '$1.99' },
];

export default function Shop() {
  function handlePurchase(itemId: string) {
    // Stub: In real app, this would trigger native IAP
    console.log('Purchase:', itemId);
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Shop</Text>
      {shopItems.map((item) => (
        <Card key={item.id} style={{ marginBottom: 16 }}>
          <Card.Title title={item.title} subtitle={item.price} />
          <Card.Content>
            <Text>{item.description}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => handlePurchase(item.id)}>Purchase</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}
