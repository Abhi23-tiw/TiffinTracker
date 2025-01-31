import React, { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../context/authContext";
import {
  useFonts,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import axios from "axios";
import * as Haptics from "expo-haptics";

const UpdateUser: React.FC = () => {
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });
  const context = useContext(AuthContext);
  if (!context) {
    console.error("AuthContext is not available");
    return null;
  }

  const [state, setState] = context;
  const user = state.user;

  if (!user) {
    console.error("User data is not available");
    return null;
  }

  // Local state
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      setLoading(true);
      const { data } = await axios.put("/auth/update-username", {
        name,
        email,
      });
      setLoading(false);
      setState({ ...state, user: data.updatedUser });
      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          {/* Current Username */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current</Text>
            <Text style={styles.currentUsername}>{user.name}</Text>
            {/* Display current username */}
          </View>

          {/* New Username */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New</Text>
            <TextInput
              value={name}
              placeholderTextColor="gray"
              style={styles.input}
              onChangeText={(text) => setName(text)}
            />
            <View style={styles.line} />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Updating..." : "Update Username"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(1, 11, 20, 255)",
    padding: 20,
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 1,
    fontFamily: "Lato_700Bold",
  },
  input: {
    color: "white",
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  currentUsername: {
    color: "white",
    fontSize: 16,
    paddingVertical: 10,
    fontFamily: "Lato_700Bold",
  },
  line: {
    height: 2,
    backgroundColor: "purple",
    marginVertical: 6,
  },
  button: {
    backgroundColor: "aqua",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontFamily: "Lato_700Bold",
  },
});
