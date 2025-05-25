import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"

// Mock data for restaurant details
const mockRestaurants = {
  "1": {
    id: "1",
    name: "Pizza Palace",
    description: "The best pizza in town with authentic Italian recipes. Our chefs use only the freshest ingredients.",
    image: "https://via.placeholder.com/400x200",
    rating: 4.5,
    cuisine: "Italian",
    deliveryTime: "30-45 min",
    menu: [
      {
        id: "1-1",
        name: "Margherita Pizza",
        price: 12.99,
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
      },
      {
        id: "1-2",
        name: "Pepperoni Pizza",
        price: 14.99,
        description: "Pizza with tomato sauce, mozzarella, and pepperoni",
      },
      {
        id: "1-3",
        name: "Pasta Carbonara",
        price: 13.99,
        description: "Spaghetti with eggs, cheese, pancetta, and black pepper",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Burger King",
    description: "Home of the Whopper and many other delicious burgers. Taste our flame-grilled difference.",
    image: "https://via.placeholder.com/400x200",
    rating: 4.2,
    cuisine: "American",
    deliveryTime: "20-35 min",
    menu: [
      {
        id: "2-1",
        name: "Whopper",
        price: 6.99,
        description: "Flame-grilled beef patty with tomatoes, lettuce, onions",
      },
      { id: "2-2", name: "Chicken Fries", price: 4.99, description: "Crispy chicken strips in a fry shape" },
      { id: "2-3", name: "Onion Rings", price: 3.99, description: "Crispy fried onion rings" },
    ],
  },
}

const RestaurantDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { restaurantId } = route.params || {}

  // Get restaurant details from mock data
  const restaurant = mockRestaurants[restaurantId] || {
    name: "Restaurant Not Found",
    cuisine: "",
    rating: 0,
    deliveryTime: "",
    menu: [],
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.image || "https://via.placeholder.com/400x200" }} style={styles.coverImage} />

      <View style={styles.headerContainer}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
          {restaurant.rating > 0 && (
            <View style={styles.rating}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          )}
          <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
        </View>
        {restaurant.description && <Text style={styles.description}>{restaurant.description}</Text>}
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Menu</Text>
        {restaurant.menu.length === 0 ? (
          <Text style={styles.noMenu}>Menu not available</Text>
        ) : (
          restaurant.menu.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  // Add to cart functionality would go here
                  navigation.navigate("Cart")
                }}
              >
                <Icon name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cuisine: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  deliveryTime: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  menuContainer: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  noMenu: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#0077cc",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
})

export default RestaurantDetailScreen
