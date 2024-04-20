import {useState} from 'react';
import {FAB, PaperProvider, Portal} from 'react-native-paper';

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  return (
    <Portal>
      <FAB.Group
        open={open}
        visible
        icon={open ? 'chevron-down' : 'plus'}
        actions={[
          {
            icon: 'book-open-blank-variant',
            onPress: () => {},
            label: 'Read now',
          },
        ]}
        onPress={() => setOpen(current => !current)}
        onStateChange={() => {}}
      />
    </Portal>
  );
}
