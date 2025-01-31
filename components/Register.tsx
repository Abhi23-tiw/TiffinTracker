import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import React, { useContext, useState} from "react";
import { useFonts , Lato_400Regular , Lato_700Bold} from "@expo-google-fonts/lato";
import { NavigationProp } from '@react-navigation/core';
import { AuthContext } from "../context/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from 'lottie-react-native';
import AwesomeAlert from "react-native-awesome-alerts";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Register = ({ navigation }: RouterProps) => {
   let [fontsLoaded] = useFonts({
      Lato_400Regular,
      Lato_700Bold
    });
  const [state, setState] = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [msg , setMsg] = useState(false);
  const [message, setMessage] = useState("");

  
  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill out all the fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register/", {
        name,
        email,
        password,
      });
      
      await AsyncStorage.setItem('@auth', JSON.stringify({
        user: data.user,
        token: data.token,
      }));

      

      setShowAnimation(true)
      setTimeout(() => {
        setShowAnimation(true);
        setState((prevState) => ({
          ...prevState,
          user: data.user, // Assuming the response contains user details
          token: data.token, // Assuming the response contains a token
        }));
      }, 2700);
      
      
    } catch (error) {
      
      setMessage(error.response?.data?.message)
      setMsg(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <View style={styles.container}>
        {showAnimation ? (
        <View style={styles.container}>
        <LottieView
          autoPlay
          loop={false}
          style={{
            height: 500,
          }}
          source={require("../assets/successAnimation.json")}
        />
        <Text style={styles.successText}>Account Created Successfully!</Text>
      </View>
        
      ):(
        <ScrollView>
          <LottieView
            autoPlay
            style={{
              width: 200,
              height: 200,
            }}
            source={require('../assets/RegisterAnimation.json')}
          />
        <View style={styles.top}>
          <Text style={styles.title}>Create account</Text>
        </View>

        <View style={styles.section}>
          <TextInput
            style={styles.input}
            value={name}
            placeholder="Name"
            placeholderTextColor="#999"
            onChangeText={setName}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email"
            placeholderTextColor="#999"
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.section}>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Password"
            placeholderTextColor="#999"
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity onPress={handleSubmit}>
          <View style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
              </View>
          </TouchableOpacity>
          
        )}

        <View style={styles.textContainer}>
          <Text style={styles.text}>Already Registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <AwesomeAlert
            show={msg}
            showProgress={false}
            message={message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor="#4d12ac"
            onConfirmPressed={() => setMsg(false)}
            messageStyle={{
              fontSize: 18,
              color: "black",
              textAlign: "center",
              fontFamily: "Lato_700Bold",
              marginBottom: 10,
            }}
            confirmButtonTextStyle={{
              fontFamily: "Lato_700Bold",
            }}
          />
        </View>
        </ScrollView>)}
      </View>
   
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#rgba(1, 11, 20, 255)",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  successText: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: "Lato_700Bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Lato_700Bold",
    color: "#fff",
    marginBottom: 10,
  },
  top: {
    marginTop: 10,
    marginBottom: 8, // Add space below the subtitle section
  },
  section: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#1e1e1e",
    color: "#fff",
    fontSize: 16,
    fontFamily: "Lato_700Bold"
  },
  button: {
    marginTop: 130, // Add space above the button
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato_700Bold"
  },
  textContainer: {
    marginTop: 20, 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center",
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontFamily: "Lato_700Bold"
  },
  loginText: {
    color: 'blue',
    textAlign: 'center',
    fontFamily: "Lato_700Bold"
  },
});
