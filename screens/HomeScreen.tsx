import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"

const HomeScreen = () => {
  const navigation = useNavigation()

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Fast Delivery • Delicious Food • Great Rewards</Text>
          </View>
          <Text style={styles.title}>Delicious Food, Delivered to Your Door</Text>
          <Text style={styles.subtitle}>
            Order from your favorite restaurants, discover new cuisines, and enjoy the convenience of food delivery.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Restaurants")}>
              <Text style={styles.primaryButtonText}>Browse Restaurants</Text>
              <Icon name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Account")}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <FeatureCard
          icon="utensils"
          title="Wide Selection"
          description="From local favorites to international cuisines, we've got all your cravings covered."
        />
        <FeatureCard
          icon="truck"
          title="Fast Delivery"
          description="We partner with the best delivery services to ensure your food arrives fresh and on time."
        />
        <FeatureCard
          icon="credit-card"
          title="Secure Payments"
          description="We support all major credit cards and payment gateways for a seamless checkout experience."
        />
        <FeatureCard
          icon="arrow-right"
          title="Easy Ordering"
          description="Our intuitive interface makes it easy to find what you're looking for and place your order quickly."
        />
      </View>
    </ScrollView>
  )
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={24} color="#333" />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroContainer: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    minHeight: 400,
  },
  heroContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    color: "#0077cc",
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
    maxWidth: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#0077cc",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
  },
  secondaryButton: {
    borderColor: "#0077cc",
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: "#0077cc",
    fontWeight: "bold",
  },
  featuresContainer: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
})

export default HomeScreen
