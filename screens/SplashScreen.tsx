"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"

const SplashScreen = () => {
  const navigation = useNavigation<any>()

  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      // Navigate to the main app screen after the splash screen
      navigation.replace("Main") // Replace 'Main' with your main screen name
    }, 2000) // Adjust the timeout as needed
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
})

export default SplashScreen
