import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "../context/authContext";
import { Calendar } from "react-native-calendars";
import LottieView from "lottie-react-native";
import moment from "moment";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Lato_400Regular,
  Lato_700Bold,
  useFonts,
} from "@expo-google-fonts/lato";
import AwesomeAlert from "react-native-awesome-alerts";

const Cale = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["35%"]; // Define snap points for the Bottom Sheet

  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });
  const context = useContext(AuthContext);
  const [state, setState] = context;
  const user = state.user;
  const [email] = useState(user.email);
  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);
  const [tiffinsData, setTiffinsData] = useState("1");
  const [refreshing, setRefreshing] = useState(false);
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTiffinData = async (date) => {
    try {
      const response = await axios.get(
        `tiffins/tiffins-by-date?date=${date}&email=${email}`
      );
      if (response.data.success) {
        setTiffinsData(response.data.data);
      } else {
        setTiffinsData(null);
      }
    } catch (error) {
      setTiffinsData(null);
    }
  };

  const saveTiffinOnThisDay = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      setLoading(true);

      const { data } = await axios.post("/tiffins/create-tiffin", {
        tiffins: value,
        date: selectedDate,
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
    }
    bottomSheetRef.current?.close();
  };

  const handlePlusButtonPress = () => {
    bottomSheetRef.current?.expand(); // Open the Bottom Sheet
  };
  const decrementValue = () => {
    setValue((prev) => (prev > 0 ? prev - 1 : 0));
  };
  const [showAlert, setShowAlert] = useState(false);
  // Increase tiffin count
  const incrementValue = () => {
    setValue((prev) => prev + 1);
  };
  useEffect(() => {
    fetchTiffinData(selectedDate);
  }, [selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTiffinData(selectedDate);
    bottomSheetRef.current?.close();
    setRefreshing(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Tiffins Calendar</Text>
            <LottieView
              autoPlay
              style={{
                width: 150,
                height: 100,
              }}
              source={require("../assets/calendarAnimation.json")}
            />
          </View>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#4CAF50" },
            }}
            theme={{
              backgroundColor: "#010B14",
              calendarBackground: "#010B14",
              textSectionTitleColor: "#AAB2C0",
              selectedDayBackgroundColor: "#4CAF50",
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: "#FF5722",
              dayTextColor: "#AAB2C0",
              textDisabledColor: "#333D4B",
              arrowColor: "#FFFFFF",
              monthTextColor: "#FFFFFF",
              indicatorColor: "#FFFFFF",
            }}
            style={styles.calendar}
          />
          <View style={styles.bottom}>
            <Text style={styles.selectedDate}>
              Selected Date: {moment(selectedDate).format("MMMM DD, YYYY")}
            </Text>
            <View style={styles.count}>
              <View style={styles.row}>
                <Text style={styles.tiffinText}>
                  Tiffins: {tiffinsData ? tiffinsData.tiffins : "null"}
                </Text>
                <Text style={styles.tiffinText}>
                  Cost: {tiffinsData ? tiffinsData.tiffins * 60 : "null"}
                </Text>
              </View>
              <View style={styles.lineSeparator} />
              <Text style={styles.tiffinsBelowText}>
                {tiffinsData
                  ? `Total Tiffins Ordered: ${tiffinsData.tiffins}`
                  : "No tiffins ordered on this date"}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handlePlusButtonPress}>
            <Text style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={65} color="white" />
            </Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
      {/* Bottom Sheet */}
      
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "#1E1E2C" }}
        
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.sheetTitle}>Adjust Tiffin Count</Text>
          <Text style={styles.sheetSubtitle}>
            Set the number of tiffins for{" "}
            {moment(selectedDate).format("MMMM DD, YYYY")}
          </Text>

          <View style={styles.tiffinSelector}>
            <TouchableOpacity
              style={styles.tiffinButton}
              onPress={decrementValue}
            >
              <Ionicons name="remove-circle" size={40} color="#FF5722" />
            </TouchableOpacity>
            <Text style={styles.tiffinCount}>{value}</Text>
            <TouchableOpacity
              style={styles.tiffinButton}
              onPress={incrementValue}
            >
              <Ionicons name="add-circle" size={40} color="#4CAF50" />
            </TouchableOpacity>
            
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveTiffinOnThisDay}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
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
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Cale;

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    backgroundColor: "#1E1E2C",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: "Lato_700Bold",
    marginBottom: 10,
  },
  sheetSubtitle: {
    fontSize: 16,
    color: "#AAB2C0",
    fontFamily: "Lato_400Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  tiffinSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E2E3E",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  tiffinButton: {
    paddingHorizontal: 10,
  },
  tiffinCount: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "Lato_700Bold",
    marginHorizontal: 15,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Lato_700Bold",
  },

  container: {
    flex: 1,
    backgroundColor: "#010B14",
  },
  container1: {
    flex: 1,
    backgroundColor: "#010B14",
  },
  headerContainer: {
    flexDirection: "row",
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Lato_700Bold",
  },
  selectionPrompt: {
    fontSize: 16,
    marginBottom: 15,
    fontFamily: "Lato_700Bold",
  },
  calendar: {
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  selectedDate: {
    marginTop: 20,
    fontSize: 18,
    color: "#AAB2C0",
    fontFamily: "Lato_700Bold",
    textAlign: "center",
  },
  electionPrompt: {
    fontSize: 16,
    color: "white",
    marginBottom: 15,
    fontFamily: "Lato_700Bold",
  },
  bottom: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
    marginTop: 16,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  count: {
    padding: 15,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  lineSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },
  tiffinsBelowText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Lato_700Bold",
  },
  addButton: {
    flex: 1,
    textAlign: "right",
    padding: 30,
  },
  tiffinText: {
    fontSize: 18,
    color: "#AAB2C0",
    fontFamily: "Lato_700Bold",
  },
});
