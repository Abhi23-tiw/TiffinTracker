import React, { useState, useRef } from "react";
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
import LottieView from "lottie-react-native";

const Forgot = ({ navigation, route }) => {
  let [fontsLoaded] = useFonts({ Lato_400Regular, Lato_700Bold });

  const { email } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  const handleChange = (value, index) => {
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation in OTP input
  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      let newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1].focus();
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/auth/forgot-password", { email });

      Alert.alert("OTP Resent", response.data.message);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/verify-otp", {
        email,
        otp: otp.join(""), // Convert array to string
      });
      Alert.alert("Success", "OTP Verified Successfully!");
      navigation.navigate("otpverified", { email });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <LottieView
            autoPlay
            style={{
              width: 200,
              height: 200,
              marginLeft: 90,
              marginTop: 10
            }}
            source={require('../assets/emaiSentAnimation.json')}
          />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.top}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We’ve sent a code to <Text style={styles.email}>{email}</Text>
          </Text>
          <View style={styles.section}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
              />
            ))}
          </View>
          <Text style={styles.resendText}>
            Didn’t get a code?
            <Text style={styles.resendLink} onPress={handleResend}>
              {" "}
              Click to resend.
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleOtpVerification}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
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
    marginTop: 10,
    gap: 15,
    alignItems: "center",
  },
  email: {
    color: "aqua",
    fontSize: 15,
    fontFamily: "Lato_700Bold",
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    backgroundColor: "#1e1e1e",
  },
  resendText: {
    color: "#bbb",
    fontSize: 14,
    marginVertical: 10,
    fontFamily: "Lato_700Bold",
  },
  resendLink: {
    color: "#3b82f6",
    fontSize: 14,
    fontFamily: "Lato_700Bold",
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
