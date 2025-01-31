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
import { useFonts, Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import axios from "axios";

const ChangePassword = ({ navigation , route}) => {
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  const {email} = route.params;  
  
  const [password, setPassword] = useState("");  
  console.log(email);
  const [confirmPassword, setConfirmPassword] = useState("");  
  const [loading, setLoading] = useState(false);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/auth/reset-password",  // Update the URL based on your backend route
        { email, password }  // Send email and new password
      );
      Alert.alert("Success", "Password reset successfully!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.top}>
          <Text style={styles.title}>Change Password</Text>

          <View style={styles.section}>
           
            <TextInput
              style={styles.input}
              value={password}
              placeholder="New Password"
              placeholderTextColor="#999"
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
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
              <Text style={styles.buttonText}>Change Password</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

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
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
});
