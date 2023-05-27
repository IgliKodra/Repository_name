import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { getDatabase, set, ref } from '@firebase/database';
import { AuthContext } from './auth-contex';
import fApp from './firebase';

const auth = getAuth(fApp);
const db = getDatabase(fApp);

function Login() {
  const [user, setUser] = useContext(AuthContext);
  const [name, setName] = useState('q@gmail.com');
  const [pass, setPass] = useState('111111');
  const [hidden, setHidden] = useState(true);

  const validate = () => {
    if (!name) {
      window.alert("Input a valid email");
      return false;
    }
    if (!pass) {
      window.alert("Input a valid password");
      return false;
    }
    return true;
  };

  const logIn = async () => {
    if (validate()) {
      try {
        setUser(await signInWithEmailAndPassword(auth, name, pass).catch(()=>{
          Alert.alert('User does not exist!');
          return null;
        }));
        if(user !== null){
          Alert.alert('User logged in successfully!');
        }
      } catch (error) {
        Alert.alert(error);
      }
    }
  };

  function writeUserData(uid) {
    set(ref(db, 'users/' + uid), {
      username: name,
      email: name,
      profile_picture: './pp.jpg',
      correct: 0,
      wrong: 0,
      rank: 0,
    }).then(() => {
      Alert.alert('User created successfully!');
    });
  }

  const signUp = async () => {
    if (validate()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, name, pass);
        await writeUserData(userCredential.user.uid);
        setUser(userCredential);
        logIn();
      } catch (error) {
        Alert.alert(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>WELCOME</Text>

        <Text style={styles.text}>Enter your email:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#c5cdd9"
            style={styles.input}
            onChangeText={setName}
            value={name}
          />
        </View>

        <Text style={styles.text}>Enter your password:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#c5cdd9"
            style={styles.input}
            onChangeText={setPass}
            value={pass}
            secureTextEntry={hidden}
          />
          <TouchableOpacity style={styles.toggleButton} onPress={() => setHidden(!hidden)}>
            <Text style={styles.toggleButtonText}>{hidden ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={logIn} style={styles.button}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signUp} style={styles.button}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    width: '100%',
    height: '100%',
  },
  safeArea: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  text: {
    color: '#FFFFFF',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    borderColor: '#000000',
    backgroundColor: '#000000',
    height: 40,
    color: '#FFFFFF',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -11 }],
  },
  toggleButtonText: {
    color: '#FFFFFF',
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#123456',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Login;
