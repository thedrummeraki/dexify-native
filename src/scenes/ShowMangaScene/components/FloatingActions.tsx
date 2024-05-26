import React, {useState} from 'react';
import {FAB, Portal} from 'react-native-paper';

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  return (
    <Portal>
      <FAB.Group
        visible
        open={open}
        icon={open ? 'chevron-down' : 'plus'}
        actions={[
          {
            icon: 'download',
            onPress: () => {},
            label: 'Share...',
          },
          {
            icon: 'download',
            onPress: () => {},
            label: 'Download...',
          },
        ]}
        onPress={() => setOpen(current => !current)}
        onStateChange={() => {}}
      />
    </Portal>
  );
}
