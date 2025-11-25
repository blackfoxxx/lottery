import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

export default function WishlistScreen({ navigation }: any) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  function handleRemove(productId: number, productName: string) {
    Alert.alert(
      "Remove from Wishlist",
      `Remove ${productName} from your wishlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromWishlist(productId),
        },
      ]
    );
  }

  function handleAddToCart(product: any) {
    addToCart(product);
    Alert.alert("Added to Cart", `${product.name} has been added to your cart`);
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>❤️</Text>
        <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
        <Text style={styles.emptyText}>
          Save your favorite products to easily find them later
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate("Products")}
        >
          <Text style={styles.shopButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        <Text style={styles.subtitle}>{wishlist.length} items saved</Text>
      </View>

      <View style={styles.productList}>
        {wishlist.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetail", { productId: product.id })}
            >
              <Image
                source={{ uri: product.images[0] || "https://via.placeholder.com/150" }}
                style={styles.productImage}
              />
            </TouchableOpacity>

            <View style={styles.productInfo}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProductDetail", { productId: product.id })}
              >
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
              </TouchableOpacity>

              <View style={styles.ratingRow}>
                <Text style={styles.stars}>⭐ {product.rating.toFixed(1)}</Text>
                <Text style={styles.stock}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Text>
              </View>

              <Text style={styles.price}>${product.price.toFixed(2)}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.addToCartButton]}
                  onPress={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <Text style={styles.addToCartText}>
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={() => handleRemove(product.id, product.name)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#1a1a2e",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
  },
  productList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stars: {
    fontSize: 13,
    color: "#666",
  },
  stock: {
    fontSize: 12,
    color: "#4caf50",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  addToCartButton: {
    backgroundColor: "#e74c3c",
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  removeButton: {
    backgroundColor: "#f0f0f0",
  },
  removeText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f5f5f5",
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
