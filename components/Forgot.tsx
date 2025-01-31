import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import axios from "axios";

const Forgot = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      return Alert.alert("Error", "Please enter your email.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Error", "Please enter a valid email address.");
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      Alert.alert("Success", "Password reset link sent to your email.");
      navigation.navigate("Reset" , { email });
      setEmail("");
    } catch (error) {
      Alert.alert("Error", "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.top}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address below to receive a password reset link.
          </Text>
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
          <TouchableOpacity
            style={styles.button}
            onPress={handlePasswordReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#011418",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  top: {
    marginTop: 150,
    gap: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Lato_700Bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Lato_400Regular",
    color: "#bbb",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    width: "100%",
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
    fontFamily: "Lato_400Regular",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
});
