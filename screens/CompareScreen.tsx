import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useComparison } from "../contexts/ComparisonContext";
import { useCart } from "../contexts/CartContext";

export default function CompareScreen({ navigation }: any) {
  const { compareList, removeFromCompare, clearCompare } = useComparison();
  const { addToCart } = useCart();

  if (compareList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>⚖️</Text>
        <Text style={styles.emptyTitle}>No Products to Compare</Text>
        <Text style={styles.emptyText}>
          Add products to comparison to see them side by side
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Compare Products</Text>
        <TouchableOpacity onPress={clearCompare}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.comparisonTable}>
          {/* Product Images Row */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Product</Text>
            </View>
            {compareList.map((product) => (
              <View key={product.id} style={styles.productCell}>
                <Image
                  source={{ uri: product.images[0] || "https://via.placeholder.com/150" }}
                  style={styles.productImage}
                />
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => removeFromCompare(product.id)}
                >
                  <Text style={styles.removeIconText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Price Row */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Price</Text>
            </View>
            {compareList.map((product) => (
              <View key={product.id} style={styles.valueCell}>
                <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Rating Row */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Rating</Text>
            </View>
            {compareList.map((product) => (
              <View key={product.id} style={styles.valueCell}>
                <Text style={styles.valueText}>⭐ {product.rating.toFixed(1)}</Text>
              </View>
            ))}
          </View>

          {/* Stock Row */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Stock</Text>
            </View>
            {compareList.map((product) => (
              <View key={product.id} style={styles.valueCell}>
                <Text
                  style={[
                    styles.valueText,
                    product.stock > 0 ? styles.inStock : styles.outOfStock,
                  ]}
                >
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </Text>
              </View>
            ))}
          </View>

          {/* Category Row */}
          {compareList.some((p) => p.category) && (
            <View style={styles.row}>
              <View style={styles.labelCell}>
                <Text style={styles.labelText}>Category</Text>
              </View>
              {compareList.map((product) => (
                <View key={product.id} style={styles.valueCell}>
                  <Text style={styles.valueText}>{product.category || "N/A"}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Brand Row */}
          {compareList.some((p) => p.brand) && (
            <View style={styles.row}>
              <View style={styles.labelCell}>
                <Text style={styles.labelText}>Brand</Text>
              </View>
              {compareList.map((product) => (
                <View key={product.id} style={styles.valueCell}>
                  <Text style={styles.valueText}>{product.brand || "N/A"}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Row */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Action</Text>
            </View>
            {compareList.map((product) => (
              <View key={product.id} style={styles.valueCell}>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    product.stock === 0 && styles.addButtonDisabled,
                  ]}
                  onPress={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  <Text style={styles.addButtonText}>
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1a1a2e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  clearButton: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "600",
  },
  comparisonTable: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  labelCell: {
    width: 100,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  productCell: {
    width: 180,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    position: "relative",
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a2e",
    textAlign: "center",
  },
  removeIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  removeIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  valueCell: {
    width: 180,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  inStock: {
    color: "#4caf50",
  },
  outOfStock: {
    color: "#f44336",
  },
  addButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
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
