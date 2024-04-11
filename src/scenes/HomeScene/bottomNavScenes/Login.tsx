import {AuthResponse} from '@app/api/mangadex/types';
import {usePostRequest} from '@app/api/utils';
import {useUserStore} from '@app/foundation/state/StaterinoProvider';
import {tokenInfoFromAuthResponse} from '@app/foundation/state/user';
import {sharedStyles} from '@app/utils/styles';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Button, Snackbar, Text, TextInput} from 'react-native-paper';

export default function Login() {
  const {login} = useUserStore();

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
      <View style={[sharedStyles.container, sharedStyles.flex]}>
        <Text variant="titleLarge">Login</Text>
        <TextInput
          dense
          mode="outlined"
          value={username}
          onChangeText={setUsername}
          placeholder="👤 username"
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
      </View>
    </SafeAreaView>
  );
}
