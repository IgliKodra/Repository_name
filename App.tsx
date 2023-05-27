/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {AuthContext} from './auth-contex';
import fApp from './firebase';
import Login from './login';
import Main from './main';
import Profile from './profile';

function App(): JSX.Element {
  const [user, setUser] = React.useState(null);

  return (
    <AuthContext.Provider value={[user, setUser]}>
      {user ? <Main /> : <Login />}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({});

export default App;
