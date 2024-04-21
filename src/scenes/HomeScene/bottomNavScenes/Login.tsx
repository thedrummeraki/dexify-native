import {AuthResponse} from '@app/api/mangadex/types';
import {usePostRequest} from '@app/api/utils';
import {useUserStore} from '@app/foundation/state/StaterinoProvider';
import {tokenInfoFromAuthResponse} from '@app/foundation/state/user';
import {usePlatformName} from '@app/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, Platform, SafeAreaView, View} from 'react-native';
import {
  Button,
  Caption,
  Snackbar,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

export default function Login() {
  const {login} = useUserStore();
  const theme = useTheme();
  const platform = usePlatformName();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbardMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [post] = usePostRequest<AuthResponse>();

  useEffect(() => {
    setSubmitEnabled(password.length >= 8 && Boolean(username));
  }, [username, password]);

  const onLoginPressed = useCallback(() => {
    setSubmitEnabled(false);
    setSubmitting(true);
    post('https://api.mangadex.org/auth/login', {
      username,
      password,
    })
      .then(result => {
        setSubmitEnabled(result?.result === 'error');
        if (result?.result === 'ok') {
          const tokenInfo = tokenInfoFromAuthResponse(result);

          login({username}, tokenInfo);
        } else if (result?.result === 'error') {
          setSnackbarVisible(true);
          setSnackbardMessage('Invalid login credentials.');
          setSubmitEnabled(true);
        }
      })
      .catch(() => setSubmitEnabled(true))
      .finally(() => setSubmitting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  return (
    <SafeAreaView style={sharedStyles.flex}>
      <View
        style={[
          sharedStyles.container,
          sharedStyles.flex,
          {justifyContent: 'center'},
        ]}>
        <Surface
          elevation={4}
          style={[sharedStyles.container, sharedStyles.roundBorders]}>
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing(3),
              },
            ]}>
            <Image
              source={{uri: 'https://mangadex.org/img/avatar.png'}}
              style={{borderRadius: 100, height: 40, aspectRatio: 1}}
            />
            <Text variant="headlineMedium">Dexify</Text>
          </View>
          <Caption>Your unoffical Mangadex {platform} reader.</Caption>
          <TextInput
            dense
            mode="outlined"
            value={username}
            autoComplete="email"
            autoCapitalize="none"
            onChangeText={setUsername}
            placeholder="👤 username"
            outlineStyle={sharedStyles.roundBorders}
          />
          <TextInput
            dense
            secureTextEntry
            mode="outlined"
            textContentType="password"
            passwordRules="required"
            keyboardType="default"
            autoComplete="password"
            placeholder="🤫 password"
            value={password}
            onChangeText={setPassword}
            outlineStyle={sharedStyles.roundBorders}
          />
          <Button
            loading={submitting}
            disabled={!submitEnabled}
            mode="contained"
            icon="lock"
            onPress={onLoginPressed}>
            Sign in
          </Button>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}>
            {snackbarMessage}
          </Snackbar>
        </Surface>
      </View>
    </SafeAreaView>
  );
}
