import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";


const content = [
  'Monitor your daily, weekly, and monthly tiffin orders with ease.',
  'Visualize your orders on an intuitive calendar view.',
  'Stay on top of your meal plans and never miss a tiffin.',
];

const Onboarding1 = () => {
  let [fontsLoaded] = useFonts({
      Lato_400Regular,
      Lato_700Bold,
    });
  const animation = useRef<LottieView>(null);
  const navigation = useNavigation(); // For navigation to Register screen

  return (
    <View style={styles.container}>
      <Onboarding
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: 'rgba(1, 11, 20, 255)',
            image: (
              <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 350,
                  height: 400,
                }}
                source={require('../assets/ManageAnimation')}
              />
            ),
            title: 'Welcome to TiffinTracker',
            subtitle: 'Simplify your daily tiffin management effortlessly.',
          },
          
          {
            backgroundColor: 'rgba(1, 11, 20, 255)',
            image: (
              <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 300,
                  height: 200,
                }}
                source={require('../assets/SecondPageAnimation.json')}
              />
            ),
            title: 'Why TiffinTracker ?',
            subtitle: (
              <View>
                <View style={styles.cardContainer}>
                  {content.map((item, index) => (
                    <View style={styles.card} key={index}>
                      <Text style={styles.cardText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ),
          },
        ]}
        onDone={() => navigation.navigate('Register')} 
        onSkip={()=>navigation.navigate('Login')}
      />
    </View>
  );
};

export default Onboarding1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(1, 11, 20, 255)',
  },
  cardContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'column',
    gap: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent card
    borderRadius: 15,
    padding: 15,
  },
  cardText: {
    fontSize: 16,
    color: '#fff', // White text
    lineHeight: 22,
    fontFamily: "Lato_700Bold",
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    backgroundColor: '#4d12ac',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: "Lato_700Bold",
  },
});
