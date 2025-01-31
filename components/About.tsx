import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
    useFonts,
    Lato_400Regular,
    Lato_700Bold,
  } from "@expo-google-fonts/lato";

const About = () => {
    let [fontsLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold,
      });
    const handleLinkPress = () => {
        Linking.openURL('https://forms.gle/t6DVFNyigxC3Jexg8');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.heading}>
                <Text style={styles.title}>Tiffin Tracker</Text>
                <Text style={styles.version}>Version 1.0.0</Text>
                <Text style={styles.developer}>Developed by: 😊</Text>
                <Text style={styles.developerName}>Abhishrestha Tiwari</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.description}>Track your daily tiffin meals with this app, designed to help you organize and monitor your meals effortlessly. Whether you want to log your lunch, dinner, or snacks, this app will make it easy to track your intake.</Text>
                <Text style={styles.technology}>Developed using React Native </Text>
                <Text style={styles.featuresTitle}>Key Features</Text>
                <Text style={styles.feature}>1. Register and Login - Secure authentication process to protect your data.</Text>
                <Text style={styles.feature}>2. Add your daily meals - Quickly log your meals for accurate tracking.</Text>
                <Text style={styles.feature}>3. View your meal history - Easily review your meal logs from the past days.</Text>
                <Text style={styles.feature}>4. Edit and delete your meals - Full control to modify or remove meal entries.</Text>
                <Text style={styles.feature}>5. Custom Notifications - Stay on top of your meal logging with reminder notifications.</Text>
                <Text style={styles.feature}>6. Logout - Sign out securely to protect your account.</Text>
            </View>
            <View style={styles.improvement}>
                <Text style={styles.improvementTitle}>Improvements</Text>
                <Text style={styles.improvementText} onPress={handleLinkPress}>
                    Suggest improvements and features via this form.
                </Text>
            </View>
        </ScrollView>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "rgba(1, 11, 20, 255)",
        padding: 20,
    },
    heading: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: "Lato_700Bold",
        color: 'white',
    },
    version: {
        fontSize: 16,
        color: 'white',
    },
    developer: {
        fontSize: 18,
        color: 'white',
        fontFamily: "Lato_700Bold",
        marginTop: 10,
        marginBottom: 5,
    },
    developerName: {
        fontSize: 18,
        color: 'white',
        fontFamily: "Lato_700Bold",
        fontWeight: 'bold',
    },
    body: {
        marginTop: 20,
        marginBottom: 20,
        gap: 4
    },
    description: {
        fontSize: 16,
        color: 'white',
        marginBottom: 10,
        fontFamily: "Lato_400Regular",
        lineHeight: 24,
    },
    technology: {
        fontSize: 16,
        color: 'white',
        marginBottom: 24,
        fontFamily: "Lato_700Bold",
    },
    featuresTitle: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
        fontFamily: "Lato_700Bold",
    },
    feature: {
        fontSize: 16,
        color: 'white',
        marginBottom: 5,
        fontFamily: "Lato_400Regular",
        lineHeight: 25
    },
    improvement: {
        marginTop: 20,
    },
    improvementTitle: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
        fontFamily: "Lato_700Bold",
    },
    improvementText: {
        fontSize: 16,
        color: 'violet',
        textDecorationLine: 'underline',
        fontFamily: "Lato_700Bold",
        marginBottom: 30
    },
});
