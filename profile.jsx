import React, { useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { getAuth, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue, remove } from '@firebase/database';
import fApp from './firebase';
import { AuthContext } from './auth-contex';

const auth = getAuth(fApp);
const db = getDatabase(fApp);

function Profile() {
  const [user, setUser] = useContext(AuthContext);
  const starCountRef = ref(db, 'users/' + user.user.uid);
  const [name, setName] = useState('');
  const [pp, setPp] = useState('');
  const [rank, setRank] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  useEffect(() => {
    onValue(starCountRef, (snapshot) => {
      const userData = snapshot.val();
      setName(String(userData.username));
      setPp(String(userData.profile_photo));
      setRank(userData.rank);
      setCorrect(userData.correct);
      setWrong(userData.wrong);
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* Profile Pic */}
        <Image style={styles.image} source={require('./pp.png')} />
        
        {/* Account information */}
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Correct:</Text>
          <Text style={styles.value}>{correct}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Wrong:</Text>
          <Text style={styles.value}>{wrong}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Rank:</Text>
          <Text style={styles.value}>{rank}</Text>
        </View>

        {/* Sign out button */}
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Delete user button */}
        <TouchableOpacity style={styles.button} 
        onPress={() => {
          try{

            let path = ref(db, 'users/' + user.user.uid);
          auth.currentUser.delete().then(() => {
            alert("User deleted successfully");
            setUser(null);
            remove(path);
            });
          }catch{
            
          }
            }}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  image: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#000000',
    height: 100,
    width: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  button: {
    width: 200,
    height: 50,
    marginVertical: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#123456',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
