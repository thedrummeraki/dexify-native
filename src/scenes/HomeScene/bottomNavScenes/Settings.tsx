import {useUserStore} from '@app/foundation/state/StaterinoProvider';
import {sharedStyles} from '@app/utils/styles';
import {SafeAreaView, View} from 'react-native';
import {Button, Text} from 'react-native-paper';

export default function Settings() {
  const {logout} = useUserStore();

  return (
    <SafeAreaView>
      <View style={sharedStyles.container}>
        <Text variant="titleLarge">Settings</Text>

        <Button mode="contained" onPress={logout}>
          Log out
        </Button>
      </View>
    </SafeAreaView>
  );
}
