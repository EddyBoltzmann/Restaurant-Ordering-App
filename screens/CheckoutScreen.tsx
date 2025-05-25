"use client"

import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useState } from "react"

const CheckoutScreen = () => {
  const navigation = useNavigation()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckout = () => {
    // Simple validation
    if (!formData.name || !formData.address || !formData.phone) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    // Card validation if card payment selected
    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv) {
        Alert.alert("Missing Payment Information", "Please fill in all payment fields.")
        return
      }
    }

    // Process payment
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)

      // Show success message and navigate to order confirmation
      Alert.alert("Order Placed Successfully", "Your order has been placed and will be delivered soon.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ])
    }, 2000)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Delivery Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter your full address"
            multiline
            numberOfLines={3}
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "card" && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod("card")}
          >
            <Icon name="credit-card" size={24} color={paymentMethod === "card" ? "#0077cc" : "#666"} />
            <Text style={[styles.paymentOptionText, paymentMethod === "card" && styles.paymentOptionTextSelected]}>
              Credit Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "cash" && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod("cash")}
          >
            <Icon name="dollar-sign" size={24} color={paymentMethod === "cash" ? "#0077cc" : "#666"} />
            <Text style={[styles.paymentOptionText, paymentMethod === "cash" && styles.paymentOptionTextSelected]}>
              Cash on Delivery
            </Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === "card" && (
          <View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your card number"
                keyboardType="number-pad"
                value={formData.cardNumber}
                onChangeText={(text) => handleInputChange("cardNumber", text)}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChangeText={(text) => handleInputChange("cardExpiry", text)}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="number-pad"
                  maxLength={3}
                  value={formData.cardCvv}
                  onChangeText={(text) => handleInputChange("cardCvv", text)}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>$17.98</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>$3.99</Text>
        </View>

        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>$21.97</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={isProcessing}>
        <Text style={styles.checkoutButtonText}>{isProcessing ? "Processing..." : "Place Order"}</Text>
        {!isProcessing && <Icon name="check" size={16} color="#fff" />}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    marginHorizontal: 8,
  },
  paymentOptionSelected: {
    borderColor: "#0077cc",
    backgroundColor: "rgba(0, 119, 204, 0.1)",
  },
  paymentOptionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  paymentOptionTextSelected: {
    color: "#0077cc",
    fontWeight: "500",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  summaryTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    backgroundColor: "#0077cc",
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
})

export default CheckoutScreen
