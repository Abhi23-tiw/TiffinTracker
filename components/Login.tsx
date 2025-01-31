import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import {
  useFonts,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import { NavigationProp } from "@react-navigation/core";
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import AwesomeAlert from "react-native-awesome-alerts";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const Login = ({ navigation }: RouterProps) => {
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setShowAlert(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login/", {
        email,
        password,
      });

      // Update global state with user data
      setState((prevState) => ({
        ...prevState,
        user: data.user, // Assuming the response contains user details
        token: data.token, // Assuming the response contains a token
      }));

      // Save user data to local storage
      await AsyncStorage.setItem("@auth", JSON.stringify(data));
    } catch (error) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setShowAlert2(true)
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <LottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
          }}
          source={require("../assets/LoginAnimation.json")}
        />
        <View style={styles.top}>
          <Text style={styles.title}>Login with your details</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
          <Text style={styles.text2}>Forgot Password ? </Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <View>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.text}>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.loginText}>Create Account</Text>
            </TouchableOpacity>
            <AwesomeAlert
            show={showAlert}
            showProgress={false}
            message="Please fill out all the fields"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor="#4d12ac"
            onConfirmPressed={() => setShowAlert(false)}
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
            <AwesomeAlert
            show={showAlert2}
            showProgress={false}
            message="Invalid Credentials"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor="#4d12ac"
            onConfirmPressed={() => setShowAlert2(false)}
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
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#rgba(1, 11, 20, 255)",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: "Lato_700Bold",
    color: "#fff",
    marginBottom: 10,
  },
  top: {
    marginTop: 10,
    gap: 6,
  },
  section: {
    marginBottom: 6,
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
    fontFamily: "Lato_700Bold",
  },
  secondaryButton: {
    marginTop: 200, // Add space above the button
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  textContainer: {
    marginTop: 20, // Add space between button and text
    flexDirection: "row", // Align text and button horizontally
    justifyContent: "center", // Center the text and button
    alignItems: "center", // Vertically align them
  },
  text: {
    color: "white",
    textAlign: "center",
    fontFamily: "Lato_700Bold",
  },
  text2:{
    color: "white",
    textAlign: "center",
    fontFamily: "Lato_700Bold",
    left: 110
  },
  loginText: {
    color: "blue",
    textAlign: "center",
    fontFamily: "Lato_700Bold",
  },
});
