import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Lato_400Regular,
  Lato_700Bold,
  useFonts,
} from "@expo-google-fonts/lato";

const sendMessage = async (phoneNumber, message) => {
  const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
    message
  )}`;
  const isAvailable = await Linking.canOpenURL(url);

  if (isAvailable) {
    Linking.openURL(url);
  } else {
    Alert.alert("Please Install Whatsapp to Send Message");
  }
};

const Messages = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [order, setOrder] = useState([]);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+917408567311");
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    // Check for cancel and order conditions
    if (order.includes("Cancel") && order.includes("Order")) {
      setOrder([]); // Reset order to avoid conflicting selections
    }
  }, [order]);

  useEffect(() => {
    // Set default message based on selected options and order
    if (order.includes("Cancel")) {
      if (
        selectedOptions.includes("Afternoon") &&
        selectedOptions.includes("Night")
      ) {
        setMessage("Aunty ji aaj ka dono tiffin cancel kar dijiyega");
      } else if (selectedOptions.includes("Afternoon")) {
        setMessage("Aunty ji dopahar ka tiffin cancel kar dijiyega");
      } else if (selectedOptions.includes("Night")) {
        setMessage("Aunty ji raat ka tiffin cancel kar dijiyega");
      } else {
        setMessage(""); // Clear message if no option is selected
      }
    } else if (order.includes("Order")) {
      if (
        selectedOptions.includes("Afternoon") &&
        selectedOptions.includes("Night")
      ) {
        setMessage("Aunty ji aaj ka dono tiffin rahega");
      } else if (selectedOptions.includes("Afternoon")) {
        setMessage("Aunty ji dopahar ka tiffin rahega");
      } else if (selectedOptions.includes("Night")) {
        setMessage("Aunty ji raat ka tiffin rahega");
      } else {
        setMessage(""); // Clear message if no option is selected
      }
    }
  }, [selectedOptions, order]);

  if (!fontsLoaded) {
    return null; // Optionally return a loader
  }

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const toggleOrder = (option) => {
    if (order.includes(option)) {
      setOrder(order.filter((item) => item !== option));
    } else {
      setOrder([...order, option]);
    }
  };

  return (
    <View style={styles.userSelection2}>
      <Text style={styles.heading}>Send Message:</Text>
      <TextInput
        style={styles.inputText}
        placeholder="Write Message"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={message}
        onChangeText={setMessage}
      />
      <View style={styles.messages}>
        <Text style={styles.text}>
          At which time do you want to cancel / order your tiffin?
        </Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOptions.includes("Afternoon") && styles.selectedOption,
            ]}
            onPress={() => toggleOption("Afternoon")}
          >
            <Text style={styles.optionText}>Afternoon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOptions.includes("Night") && styles.selectedOption,
            ]}
            onPress={() => toggleOption("Night")}
          >
            <Text style={styles.optionText}>Night</Text>
          </TouchableOpacity>
        </View>
        {/* Order / Cancel */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              order.includes("Cancel") && styles.selectedOption2,
            ]}
            onPress={() => toggleOrder("Cancel")}
          >
            <Text style={styles.optionText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              order.includes("Order") && styles.selectedOption,
            ]}
            onPress={() => toggleOrder("Order")}
          >
            <Text style={styles.optionText}>Order</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => sendMessage(phoneNumber, message)}
        disabled={message.trim().length === 0}
      >
        <Ionicons name="logo-whatsapp" size={28} color="white" />
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  heading: {
    color: "white",
    fontFamily: "Lato_700Bold",
    fontSize: 18,
    marginBottom: 12,
  },
  userSelection2: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    height: 420,
    gap: 10,
  },
  inputText: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    borderWidth: 1.4,
    borderColor: "aqua",
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: "white",
    fontSize: 16,
    height: 58,
    fontFamily: "Lato_700Bold",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lato_700Bold",
  },
  messages: {
    flex: 1,
    gap: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 0.4,
    borderColor: "aqua",
  },
  selectedOption2: {
    flex: 1,
    backgroundColor: "rgba(215, 18, 18, 0.93)",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "rgba(124, 29, 165, 0.4)",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    borderRadius: 20,
    paddingVertical: 12,
    marginTop: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lato_700Bold",
    marginLeft: 10,
  },
});
