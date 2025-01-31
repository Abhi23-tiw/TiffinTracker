import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Switch,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  useFonts,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Account: React.FC = ({ navigation }) => {
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
  const [email] = useState(user.email);

  const [isEnabled, setIsEnabled] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const loadNotificationPreference = async () => {
      const storedPreference = await AsyncStorage.getItem(
        "@notificationsEnabled"
      );
      if (storedPreference !== null) {
        setIsEnabled(JSON.parse(storedPreference));
      }
    };
    loadNotificationPreference();
  }, []);

  const saveNotificationPreference = async (value: boolean) => {
    await AsyncStorage.setItem("@notificationsEnabled", JSON.stringify(value));
  };

  const getPermissionAndSaveToken = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const granted = finalStatus === "granted";
      setPermissionGranted(granted);

      if (granted) {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Push Token:", token);

        try {
          await axios.post("/notifications/save-token", {
            email: user.email,
            token,
          });
          console.log("Push token saved successfully.");
        } catch (error) {
          console.error("Error saving push token:", error);
        }
      } else {
        console.log("Permission not granted for notifications.");
        try {
          await axios.post("/notifications/remove-token", {
            email: user.email,
          });
          console.log("Push token removed from the database.");
        } catch (error) {
          console.error("Error removing push token:", error);
        }
      }
    } else {
      console.log("Must use a physical device for Push Notifications.");
    }
  };

  const toggleSwitch = async () => {
    if (!isEnabled) {
      // Enable notifications
      await getPermissionAndSaveToken();

      if (permissionGranted) {
        setIsEnabled(true);
        await saveNotificationPreference(true);
        console.log("Notifications enabled.");
      } else {
        console.log("Permission not granted. Cannot enable notifications.");
      }
    } else {
      // Disable notifications
      setIsEnabled(false);
      await saveNotificationPreference(false); // Save preference as false
      console.log("Notifications disabled.");

      // Call API to remove push token when notifications are disabled
      try {
        await axios.post("/notifications/remove-token", {
          email: user.email,
        });
        console.log("Push token removed from the database.");
      } catch (error) {
        console.error("Error removing push token:", error);
      }
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications canceled.");
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
        // Handle what happens when the user taps on a notification
      }
    );

    return () => {
      subscription.remove(); // Clean up the listener
    };
  }, []);

  const [loading, setLoading] = useState(false);
  if (!user) {
    console.error("User data is not available");
    return null;
  }
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
  };

  const handleUpdate = () => {
    navigation.navigate("UpdateDetails");
  };

  const handleUser = () => {
    navigation.navigate("UpdateUser");
  };

  const openModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimer(10);
  };

  const [disabled, enables] = useState(true);
  useEffect(() => {
    let timer;

    if (isModalVisible) {
      timer = setTimeout(() => {
        enables(false);
      }, 10000);
    } else {
      enables(true);
      if (timer) {
        clearTimeout(timer);
      }
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isModalVisible]);

  const [timer, setTimer] = useState(10);
  useEffect(() => {
    if (isModalVisible) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isModalVisible]);

  const confirmDeletion = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete("/auth/delete-user", {
        data: { email },
      });
      setLoading(false);
      handleLogout();
    } catch (error) {
      setLoading(false);
      alert("Failed to delete the account. Please try again.");
      console.error("Error in account deletion:", error);
    }
    closeModal();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={["rgba(97, 126, 195, 0.8)", "transparent"]}
          style={styles.background}
        />
        <View style={styles.account}>
          <Text style={styles.textMain}>{state.user?.name}</Text>
        </View>
        <View style={styles.container2}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <TouchableOpacity style={styles.row} onPress={handleUser}>
              <View style={styles.rowContent}>
                <Ionicons name="person-circle" size={20} color="white" />
                <Text style={styles.rowText}>Username</Text>
              </View>
              <Text style={styles.text}>{state.user?.name.substr(0, 12)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.rowContent}>
                <Ionicons name="mail" size={20} color="white" />
                <Text style={styles.rowText}>Email</Text>
              </View>
              <Text style={styles.text}>{state.user?.email}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={handleUpdate}>
              <View style={styles.rowContent}>
                <Ionicons name="lock-closed" size={20} color="white" />
                <Text style={styles.rowText}>Change Password</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.rowContent}>
                <Ionicons name="notifications" size={20} color="white" />
                <Text style={styles.rowText}>Notifications</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#gray" }}
                  thumbColor={isEnabled ? "#blue" : "#f4f3f4"}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={{ marginLeft: 150 }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={openModal}>
              <View style={styles.rowContent}>
                <Ionicons name="trash" size={20} color="white" />
                <Text style={styles.rowText}>Delete Account</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={handleLogout}>
              <View style={styles.rowContent}>
                <Ionicons name="log-out" size={20} color="red" />
                <Text style={styles.rowText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.rowContent2}>
            <Text style={styles.rowText}>App Version 1.0.0</Text>
            <TouchableOpacity onPress={() => navigation.navigate("About")}>
              <Text style={styles.rowText}>About ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Ionicons name="help-circle-outline" size={70} color="red" />
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalSubtitle}>
              Deleting your account will permanently erase all your data. This
              action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeletion}
                disabled={disabled}
              >
                <Text style={styles.modalButtonText}>
                  {disabled ? `${timer}` : "Delete"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.keepButton]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Keep Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container2: {
    marginTop: 70,
  },
  textMain: {
    color: "white",
    fontSize: 30,
    fontFamily: "Lato_700Bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: "rgba(31, 37, 42, 255)",
    marginBottom: 10,
    borderRadius: 12,
    height: 55,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowContent2: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  rowText: {
    fontSize: 16,
    color: "white",
    marginLeft: 10,
    fontFamily: "Lato_700Bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Lato_700Bold",
    marginTop: 15,
    color: "black",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "Lato_700Bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    height: 43,
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "48%",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  keepButton: {
    backgroundColor: "green",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Lato_700Bold",
  },
  section: {
    padding: 15,
    gap: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Lato_700Bold",
    color: "white",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(1 ,11 , 20, 255)",
  },
  account: {
    padding: 20,
    marginTop: 60,
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  text: {
    color: "gray",
    fontSize: 14,
    fontFamily: "Lato_700Bold",
  },
});
