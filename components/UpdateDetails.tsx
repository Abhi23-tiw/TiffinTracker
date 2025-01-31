import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { useFonts , Lato_400Regular , Lato_700Bold} from "@expo-google-fonts/lato";
import * as Haptics from 'expo-haptics';

const UpdateDetails: React.FC = () => {
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold
  });
  const context = useContext(AuthContext);
  if (!context) {
    console.error('AuthContext is not available');
    return null;
  }

  const [state, setState] = context;
  const user = state.user;

  if (!user) {
    console.error('User data is not available');
    return null;
  }

  const [email] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (!password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put('/auth/update-password', {
        email, 
        password,
      });
      setLoading(false);
      setState({ ...state, user: data.updatedUser });
      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.line} />
          </View>
          {/* Confirm Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.line} />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Password'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(1, 11, 20, 255)',
    padding: 20,
  },
  line: {
    height: 2,
    backgroundColor: 'purple',
    marginVertical: 6,
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 1,
    fontFamily: "Lato_700Bold",
  },
  input: {
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 1,
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  button: {
    backgroundColor: 'violet',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: "Lato_700Bold",
  },
});
