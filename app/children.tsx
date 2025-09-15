import { KeyboardDismissView } from '@/src/components/ui/KeyboardDismissView';
import { ChildProfile, createChild, deleteChild, listChildren } from '@/src/services/children';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, FAB, List, Portal, TextInput } from 'react-native-paper';

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
    <KeyboardDismissView style={{ flex: 1 }}>
      <List.Section>
        {children.map((c) => (
          <List.Item key={c.id} title={c.name} right={() => <Button onPress={() => handleDelete(c.id)}>Delete</Button>} />
        ))}
      </List.Section>
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
  );
}
