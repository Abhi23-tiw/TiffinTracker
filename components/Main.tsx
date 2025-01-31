import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "../context/authContext";
import { Menu, months } from "../tiffins";
import { useFonts, Quicksand_400Regular } from "@expo-google-fonts/quicksand";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import * as Haptics from "expo-haptics";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AwesomeAlert from "react-native-awesome-alerts";
import Messages from "./Messages";

const Main = ({ navigation }) => {
  const [showAlert, setShowAlert] = useState(false);
  let [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });
  const [state] = useContext(AuthContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [value, setValue] = useState(0);
  const [time, setTime] = useState("Morning");
  const [img, setImg] = useState("🌄");
  const [food, setFood] = useState("Lunch");
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const user = state.user;
  const firstLetter = user.name.charAt(0).toUpperCase();
  const [email] = useState(user.email);
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const [tiffinsData, setTiffinsData] = useState("1");
  const [number_of_tiffin, setnumber_of_tiffin] = useState("1");
  const [refreshing, setRefreshing] = useState(false);

  // Determine time of day and corresponding emoji
  useEffect(() => {
    const now = new Date();
    let hours = now.getHours();
    if (hours >= 12 && hours < 16) {
      setTime("Afternoon");
      setImg("☀️");
      setFood("Dinner");
    } else if (hours >= 16 && hours < 20) {
      setFood("Dinner");
      setTime("Evening");
      setImg("🌆");
    } else if (hours >= 20 || hours < 4) {
      setTime("Night");
      setImg("🌃");
      setFood("Lunch");
    } else {
      setTime("Morning");
      setImg("🌄");
    }
  }, []);

  const getFood = () => {
    const today = new Date().getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayName = dayNames[today];
    const time = new Date().getHours();
    if (Menu[currentDayName]) {
      if (time > 3 && time < 0) {
        setItem(Menu[currentDayName].lunch);
      } else {
        setItem(Menu[currentDayName].dinner);
      }
    }
  };

  useEffect(() => {
    getFood();
  }, [time]);

  const YearPicker = () => {
      <View style={styles.yearPicker}>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
        >
          {years.map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>
      </View>
  }


  // Decrease tiffin count
  const decrementValue = () => {
    setValue((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Increase tiffin count
  const incrementValue = () => {
    setValue((prev) => prev + 1);
  };

  const fetchTiffinData = async (date) => {
    try {
      const number_of_tiffin = await axios.get(
        `tiffins/tiffins-by-date?date=${date}&email=${email}`
      );

      setnumber_of_tiffin(number_of_tiffin.data.data.tiffins);
      if (number_of_tiffin.data.success) {
        setTiffinsData(number_of_tiffin.data.data);
      } else {
        setTiffinsData("1");
      }
    } catch (error) {
      setTiffinsData("1");
    }
  };

  // Save tiffin count
  const saveTiffin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      setLoading(true);

      const { data } = await axios.post("/tiffins/create-tiffin", {
        tiffins: value,
        date: currentDay,
        email: state.user.email,
      });

      if (data.success) {
        setValue(data.tiffin.tiffins);
        setShowAlert(true);
      } else {
        alert("Failed to update tiffin count.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(true);
      fetchTiffinData(currentDay);
      setRefreshing(false);
    }
  };
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    fetchTiffinData(currentDay);
  }, [currentDay]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTiffinData(currentDay);
    setRefreshing(false);
  };

  const renderMonth = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.monthItem,
        index === selectedMonth ? styles.selectedMonth : {},
      ]}
      onPress={() => setSelectedMonth(index)}
    >
      <Text
        style={[
          styles.monthText,
          index === selectedMonth ? styles.selectedMonthText : {},
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const [totalTiffins, setTotalTiffins] = useState(0);
  useEffect(() => {
    getTiffinsByMonth();
  }, [selectedMonth , selectedYear]);
  const getTiffinsByMonth = async () => {
    try {
      const response = await axios.get(`/tiffins/total-tiffins`, {
        params: { email, month: selectedMonth + 1, year: selectedYear }
      });
  
      setTotalTiffins(response.data.totalTiffins || 0);
      console.log("Total tiffins:", response.data.totalTiffins);
    } catch (error) {
      console.error("Error fetching total tiffins:", error);
      setTotalTiffins(0); 
    }
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 2020 + 1 },
    (_, i) => 2020 + i
  );

  return (
    <ScrollView
      style={styles.container1}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <LinearGradient
          colors={["#4d12ac", "transparent"]}
          style={styles.background}
        />

        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.profileImage}>
            <Text
              style={styles.profilePicText}
              onPress={() => navigation.navigate("Account")}
            >
              {firstLetter}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.greeting}>
              Good {time} {img}
            </Text>
            <Text style={styles.userName}>{state.user?.name || "Guest"}</Text>
          </View>
          <Ionicons
            name="share-social-outline"
            size={28}
            color="white"
            style={styles.icon}
          />
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            Statistics <Ionicons name="bar-chart" size="20" />
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.monthText}>{selectedYear}</Text>
      </TouchableOpacity>

      {/* Modal to select year */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
        <LinearGradient
            colors={["#4d12ac", "transparent"]} // Example gradient colors
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Select Year</Text>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
            >
              {years.map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year} style = {styles.pickerback}/>
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
        </View>

        {/* Main Section */}
        <View>
          <FlatList
            data={months}
            horizontal
            keyExtractor={(item) => item}
            renderItem={renderMonth}
            contentContainerStyle={styles.monthPicker}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Main Content Section */}
        <View style={styles.mainContentSection}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Total Tiffins - {totalTiffins}</Text>
            <Text style={styles.cardText}>Today - {number_of_tiffin}</Text>
          </View>
          <View style={styles.card2}>
            <Text style={styles.cardText}>Total Expense </Text>
            <Text style={styles.cardText2}>{totalTiffins * 60} </Text>
          </View>
        </View>

        <View style={styles.userSelection}>
          <Text style={styles.currentDate}>Today's {food} :</Text>
          <View style={styles.food}>
            <Text style={styles.foodItem}>"{item}"</Text>
          </View>

          <Text style={styles.selectionPrompt}>Select Number of Tiffins</Text>
          <View style={styles.tiffinSelector}>
            <TouchableOpacity
              style={styles.tiffinButton}
              onPress={decrementValue}
            >
              <Text style={styles.tiffinButtonText}>
                <Ionicons name="remove-circle" size="28" />
              </Text>
            </TouchableOpacity>
            <Text style={styles.tiffinCount}>{value}</Text>
            <TouchableOpacity
              style={styles.tiffinButton}
              onPress={incrementValue}
            >
              <Text style={styles.tiffinButtonText}>
                <Ionicons name="add-circle" size="28" />
              </Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <View style={styles.save}>
            <TouchableOpacity onPress={saveTiffin}>
              <Text style={styles.saveText}>
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            message="Tiffin count updated successfully!"
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
        </View>
        <Messages />
      </View>
    </ScrollView>
  );
};

export default Main;

const styles = StyleSheet.create({
  foodItem: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#010b14",
    borderRadius: 10,
    alignItems: "center",
    
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Lato_700Bold",
    marginBottom: 10,
    color: 'white'
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f8f8f8', // Light background color
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Light border color
    marginVertical: 10,
    paddingLeft: 15,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#4d12ac",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "Lato_700Bold",
  },
  save: {
    backgroundColor: "blue",
    height: 48,
    width: 150,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  yearPicker: {
    height: 50,
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#010b14",
    
  },
  saveText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lato_700Bold",
  },
  food: {
    width: "100%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
  },
  pickerback:{
    backgroundColor: "aqua",
    fontSize: 15,
    padding: 10,
    fontFamily: "Lato_700Bold", 
  },
  userSelection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    height: 290,
  },
  userSelection2: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    height: 420,
  },
  currentDate: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 0,
    textAlign: "left",
    width: "100%",
  },
  selectionPrompt: {
    fontSize: 16,
    color: "white",
    marginBottom: 15,
    fontFamily: "Lato_700Bold",
  },
  tiffinSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tiffinButton: {
    padding: 5,
  },
  tiffinButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lato_400Regular",
  },
  tiffinCount: {
    color: "white",
    fontSize: 25,
    fontFamily: "Lato_700Bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#010b14",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  container1: {
    flex: 1,
    backgroundColor: "#010b14",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 120,
  },
  headerSection: {
    flexDirection: "row",
    marginTop: -25,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(79, 12, 236, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicText: {
    color: "#fff",
    fontSize: 27,
    fontFamily: "Lato_700Bold",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  greeting: {
    color: "white",
    fontSize: 16,
    fontWeight: "300",
    fontFamily: "Lato_400Regular",
  },
  userName: {
    color: "white",
    fontSize: 25,
    fontFamily: "Lato_700Bold",
  },
  icon: {
    marginLeft: 10,
  },
  statsSection: {
    padding: 10,
    marginBottom: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lato_700Bold",
  },
  monthPicker: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  monthItem: {
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: 50,
  },
  selectedMonth: {
    backgroundColor: "#4d12ac",
  },
  monthText: {
    color: "#AAB2C0",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  mainContentSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    marginHorizontal: 5,
    padding: 20,
    height: 160,
    gap: 70
  },
  card2: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    marginHorizontal: 5,
    padding: 20,
    height: 160,
  },
  cardText: {
    color: "#AAB2C0",
    fontSize: 18,
    fontFamily: "Lato_700Bold",
  },
  cardText2: {
    color: "#AAB2C0",
    fontSize: 35,
    fontFamily: "Lato_700Bold",
    textAlign: "center",
    marginTop: 15,
  },
});
