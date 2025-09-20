import { KeyboardDismissView } from '@/src/components/ui/KeyboardDismissView';
import { ChildProfile, createChild, deleteChild, listChildren } from '@/src/services/children';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, FAB, List, Portal, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChildrenScreen() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');

  async function refresh() {
    const data = await listChildren();
    setChildren(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd() {
    await createChild({ name });
    setName('');
    setVisible(false);
    refresh();
  }

  async function handleDelete(id: string) {
    await deleteChild(id);
    refresh();
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <KeyboardDismissView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Button 
            mode="text" 
            onPress={() => router.back()}
            icon="arrow-left"
            textColor="#666"
          >
            Back
          </Button>
          <Text variant="headlineSmall" style={styles.title}>Manage Children</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
        <List.Section>
          {children.map((c) => (
            <List.Item key={c.id} title={c.name} right={() => <Button onPress={() => handleDelete(c.id)}>Delete</Button>} />
          ))}
        </List.Section>
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Add Child</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Name" value={name} onChangeText={setName} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={handleAdd} disabled={!name.trim()}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB icon="plus" onPress={() => setVisible(true)} style={{ position: 'absolute', right: 16, bottom: 16 }} />
    </KeyboardDismissView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60, // Same width as back button for centering
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});
