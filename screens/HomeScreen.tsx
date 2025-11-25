import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LotteryWinnerBanner from '../components/LotteryWinnerBanner';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface LotteryDraw {
  id: string;
  name: string;
  prize: string;
  drawDate: string;
  ticketsIssued: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
}

export default function HomeScreen({ navigation }: any) {
  const [lotteryDraws, setLotteryDraws] = useState<LotteryDraw[]>([
    {
      id: '1',
      name: 'Golden Draw',
      prize: '$10,000',
      drawDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 37 + 1000 * 60 * 60 * 2).toISOString(),
      ticketsIssued: 15420,
    },
  ]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Nike Air Max 270',
      price: 149.99,
      originalPrice: 179.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max',
      price: 1299.99,
      originalPrice: 1399.99,
      image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb',
      rating: 4.8,
    },
    {
      id: '3',
      name: 'Samsung Galaxy S24',
      price: 1199.99,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
      rating: 4.7,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Animated values for countdown
  const scaleAnims = useRef({
    days: new Animated.Value(1),
    hours: new Animated.Value(1),
    minutes: new Animated.Value(1),
    seconds: new Animated.Value(1),
  }).current;

  const prevTime = useRef(timeRemaining);

  useEffect(() => {
    if (lotteryDraws.length > 0) {
      const timer = setInterval(() => {
        calculateTimeRemaining(lotteryDraws[currentIndex].drawDate);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lotteryDraws, currentIndex]);

  useEffect(() => {
    // Animate when time changes
    Object.keys(timeRemaining).forEach((key) => {
      const timeKey = key as keyof typeof timeRemaining;
      if (prevTime.current[timeKey] !== timeRemaining[timeKey]) {
        Animated.sequence([
          Animated.timing(scaleAnims[timeKey], {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnims[timeKey], {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
    prevTime.current = timeRemaining;
  }, [timeRemaining]);

  const calculateTimeRemaining = (drawDate: string) => {
    const now = new Date().getTime();
    const draw = new Date(drawDate).getTime();
    const distance = draw - now;

    if (distance > 0) {
      setTimeRemaining({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>${item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Ionicons name="cart" size={16} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const currentDraw = lotteryDraws[currentIndex];

  return (
    <ScrollView style={styles.container}>
      {/* Lottery Banner */}
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={['#1e3a8a', '#3b82f6', '#1e3a8a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <View style={styles.titleRow}>
                <Ionicons name="trophy" size={32} color="#fbbf24" />
                <View style={styles.titleTextContainer}>
                  <Text style={styles.bannerTitle}>{currentDraw.name}</Text>
                  <Text style={styles.bannerPrize}>{currentDraw.prize} Grand Prize</Text>
                </View>
              </View>

              <View style={styles.ticketsInfo}>
                <Ionicons name="ticket" size={16} color="#93c5fd" />
                <Text style={styles.ticketsText}>
                  {currentDraw.ticketsIssued.toLocaleString()} tickets issued
                </Text>
              </View>

              <View style={styles.countdownContainer}>
                <Text style={styles.countdownLabel}>DRAW IN:</Text>
                <View style={styles.countdownTime}>
                  <Animated.View style={{ transform: [{ scale: scaleAnims.days }] }}>
                    <Text style={styles.countdownNumber}>{timeRemaining.days}d</Text>
                  </Animated.View>
                  <Animated.View style={{ transform: [{ scale: scaleAnims.hours }] }}>
                    <Text style={styles.countdownNumber}>{timeRemaining.hours}h</Text>
                  </Animated.View>
                  <Animated.View style={{ transform: [{ scale: scaleAnims.minutes }] }}>
                    <Text style={styles.countdownNumber}>{timeRemaining.minutes}m</Text>
                  </Animated.View>
                  <Animated.View style={{ transform: [{ scale: scaleAnims.seconds }] }}>
                    <Text style={styles.countdownNumber}>{timeRemaining.seconds}s</Text>
                  </Animated.View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewTicketsButton}
                onPress={() => navigation.navigate('LotteryPurchase')}
              >
                <Text style={styles.viewTicketsButtonText}>Buy Tickets</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bannerRight}>
              <View style={styles.trophyCircle}>
                <Ionicons name="trophy" size={48} color="#fbbf24" />
                <Text style={styles.trophyText}>Win Amazing Prizes</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Winner Announcement Banner */}
      <LotteryWinnerBanner />

      {/* Featured Products Carousel */}
      <View style={styles.carouselSection}>
        <View style={styles.carouselHeader}>
          <Text style={styles.carouselTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        />
      </View>

      {/* New Arrivals Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Arrivals</Text>
        <Text style={styles.sectionSubtitle}>Check out our latest products</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.shopButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Shop Premium Products</Text>
        <Text style={styles.featuresSubtitle}>Win Amazing Prizes</Text>
        <Text style={styles.featuresDescription}>
          Discover exclusive products and earn lottery tickets with every purchase.
        </Text>
      </View>

      {/* Info Cards */}
      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <Ionicons name="cart" size={32} color="#3b82f6" />
          <Text style={styles.infoCardTitle}>Premium Products</Text>
          <Text style={styles.infoCardDescription}>
            Curated selection from trusted brands
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="ticket" size={32} color="#fbbf24" />
          <Text style={styles.infoCardTitle}>Lottery Tickets</Text>
          <Text style={styles.infoCardDescription}>
            Earn tickets with every purchase
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="star" size={32} color="#10b981" />
          <Text style={styles.infoCardTitle}>Best Deals</Text>
          <Text style={styles.infoCardDescription}>
            Exclusive discounts and offers
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  bannerContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerGradient: {
    padding: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleTextContainer: {
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerPrize: {
    fontSize: 14,
    color: '#93c5fd',
    marginTop: 2,
  },
  ticketsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketsText: {
    color: '#93c5fd',
    fontSize: 12,
    marginLeft: 6,
  },
  countdownContainer: {
    marginBottom: 16,
  },
  countdownLabel: {
    color: '#93c5fd',
    fontSize: 12,
    marginBottom: 4,
  },
  countdownTime: {
    flexDirection: 'row',
    gap: 8,
  },
  countdownNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewTicketsButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewTicketsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fbbf24',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  trophyText: {
    color: '#fbbf24',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  carouselSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  featuresSection: {
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuresSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 12,
  },
  featuresDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCards: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
  },
  infoCardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
