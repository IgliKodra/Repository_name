import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollViewBase,
  Image,
} from "react-native";
import { getDatabase, ref, set, onValue } from "@firebase/database";
import { getAuth } from "@firebase/auth";
import fApp from "./firebase";
import { AuthContext } from "./auth-contex";

const auth = getAuth(fApp);
const db = getDatabase(fApp);

const Quiz = () => {
  const [user, setUser] = useContext(AuthContext);
  const [word, setWord] = useState("");
  const [nyja, setN] = useState("");
  const [selected, setSelected] = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const getRandom = () => {
    return Math.floor(Math.random() * 199 + 1);
  };

  const writeUserData = (a) => {
    set(ref(db, "users/" + a.uid), {
      username: a.email,
      email: a.email,
      profile_picture: "./pp.jpg",
      correct: correct,
      wrong: wrong,
      rank: 0,
    });
  };

  const getData = (a) => {
    const starCountRef = ref(db, "users/" + a.uid);
    onValue(starCountRef, (snapshot) => {
      setCorrect(snapshot.val().correct);
      setWrong(snapshot.val().wrong);
    });
  };

  const check = () => {
    if (selected == nyja) {
      setCorrect(correct + 1);
      // console.log("correct : " + correct);
    } else {
      setWrong(wrong + 1);
      // console.log("wrong : " + wrong);
    }
    writeUserData(user.user)
  };

  const getWord = (a) => {
    const starCountRef = ref(db, "Fjalet/" + a);
    onValue(starCountRef, (snapshot) => {
      setWord(snapshot.val().Fjala);
      setN(snapshot.val().Nyja);
    });
  };

  useEffect(() => {
    getData(user.user);
    getWord(0);
    setSelected("");
  }, []);

  function onPress(){
    check();
    // writeUserData(user.user);
    // getData(user.user);
    getWord(getRandom());
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.word}>{word}</Text>
      
      {/* Zgjedh nyjen */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setSelected("der")}>
          <Text style={styles.buttonText}>der</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setSelected("die")}>
          <Text style={styles.buttonText}>die</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setSelected("das")}>
          <Text style={styles.buttonText}>das</Text>
        </TouchableOpacity>

      </View>
      
      {/* Select button */}
      <TouchableOpacity style={styles.selectButton} onPress={()=>onPress()}>
        <Text style={styles.selectButtonText}>Select {selected}?</Text>
      </TouchableOpacity>
      
      {/* Basic information */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Correct:</Text>
        <Text style={styles.statsNumberTextGreen}>{correct}</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Wrong:</Text>
        <Text style={styles.statsNumberTextRed}>{wrong}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={()=> {console.log(correct);console.log(wrong)}} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  word: {
    fontSize: 35,
    marginBottom: 20,
    fontWeight: "bold",
    color: "white",
  },
  buttonsContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#123456",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
  },
  selectButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#008080", 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  selectButtonText: {
    color: "#ffffff",
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statsText: {
    fontSize: 18,
    marginRight: 5,
    color: "white",
  },
  statsNumberTextGreen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  statsNumberTextRed: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
});

export default Quiz;
