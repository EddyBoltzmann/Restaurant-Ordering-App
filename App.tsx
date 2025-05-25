import { SafeAreaView, StatusBar, StyleSheet, useColorScheme } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/Feather"

// Import screens
import SplashScreen from "./screens/SplashScreen"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import HomeScreen from "./screens/HomeScreen"
import RestaurantsScreen from "./screens/RestaurantsScreen"
import RestaurantDetailScreen from "./screens/RestaurantDetailScreen"
import CartScreen from "./screens/CartScreen"
import CheckoutScreen from "./screens/CheckoutScreen"
import AccountScreen from "./screens/AccountScreen"

// Define the type for our screen params
type RootStackParamList = {
  Splash: undefined
  Auth: undefined
  Login: undefined
  Register: undefined
  Main: undefined
  Home: undefined
  Restaurants: undefined
  RestaurantDetail: { restaurantId: string }
  Cart: undefined
  Checkout: undefined
  Account: undefined
}

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

// Main tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string

          if (route.name === "Home") {
            iconName = "home"
          } else if (route.name === "Restaurants") {
            iconName = "coffee"
          } else if (route.name === "Cart") {
            iconName = "shopping-cart"
          } else if (route.name === "Account") {
            iconName = "user"
          } else {
            iconName = "circle" // fallback icon
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#0077cc",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  )
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark"

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="RestaurantDetail"
            component={RestaurantDetailScreen}
            options={{
              headerShown: true,
              title: "Restaurant Details",
            }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{
              headerShown: true,
              title: "Checkout",
            }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
