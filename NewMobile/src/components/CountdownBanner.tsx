import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Draw } from '../types';
import { SIZES } from '../constants';

interface CountdownBannerProps {
  draw?: Draw | null;
  loading?: boolean;
  onPress?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const CountdownBanner: React.FC<CountdownBannerProps> = ({ 
  draw, 
  loading = false,
  onPress 
}) => {
  const { colors, isDarkMode } = useTheme();
  const { t, isRTL } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!draw || !draw.draw_date) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const drawTime = new Date(draw.draw_date).getTime();
      const difference = drawTime - now;

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        total: difference,
      });
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [draw]);

  useEffect(() => {
    // Pulse animation for urgency (when less than 24 hours)
    if (timeRemaining.total > 0 && timeRemaining.days === 0 && timeRemaining.hours < 24) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [timeRemaining.days, timeRemaining.hours]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t('loading')}
        </Text>
      </View>
    );
  }

  if (!draw) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="calendar-outline" size={32} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          {t('noUpcomingDraws')}
        </Text>
        <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
          {t('checkBackLater')}
        </Text>
      </View>
    );
  }

  const getCategoryColor = (categoryName: string): [string, string] => {
    const name = categoryName.toLowerCase();
    const colorMap: { [key: string]: [string, string] } = {
      bronze: ['#ea580c', '#fb923c'],
      silver: ['#6b7280', '#9ca3af'],
      golden: ['#f59e0b', '#fbbf24'],
      gold: ['#f59e0b', '#fbbf24'],
      platinum: ['#94a3b8', '#cbd5e1'],
    };
    return colorMap[name] || [colors.primary, colors.primary];
  };

  const gradientColors: [string, string] = getCategoryColor(draw.category_name);
  const isUrgent = timeRemaining.days === 0 && timeRemaining.hours < 24;

  return (
    <TouchableOpacity 
      activeOpacity={onPress ? 0.7 : 1} 
      onPress={onPress}
      style={styles.touchable}
    >
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={[styles.content, isRTL && styles.contentRTL]}>
            {/* Header */}
            <View style={[styles.header, isRTL && styles.headerRTL]}>
              <View style={[styles.headerLeft, isRTL && styles.headerRTL]}>
                <Ionicons name="trophy" size={24} color="#FFFFFF" />
                <Text style={styles.title}>{t('nextDraw')}</Text>
              </View>
              <View style={[styles.badge, isUrgent && styles.urgentBadge]}>
                <Text style={styles.badgeText}>
                  {isUrgent ? '🔥 ' : ''}{t('upcoming')}
                </Text>
              </View>
            </View>

            {/* Category */}
            <Text style={styles.categoryName}>
              {draw.category_name} {draw.category?.icon || '🎟️'}
            </Text>

            {/* Countdown Timer */}
            <View style={[styles.timerContainer, isRTL && styles.timerContainerRTL]}>
              <View style={styles.timerLabel}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={styles.timerLabelText}>{t('drawIn')}</Text>
              </View>
              <View style={[styles.timer, isRTL && styles.timerRTL]}>
                {timeRemaining.days > 0 && (
                  <View style={styles.timeUnit}>
                    <Text style={styles.timeValue}>{timeRemaining.days}</Text>
                    <Text style={styles.timeLabel}>{t('days')}</Text>
                  </View>
                )}
                <View style={styles.timeUnit}>
                  <Text style={styles.timeValue}>{timeRemaining.hours.toString().padStart(2, '0')}</Text>
                  <Text style={styles.timeLabel}>{t('hours')}</Text>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeValue}>{timeRemaining.minutes.toString().padStart(2, '0')}</Text>
                  <Text style={styles.timeLabel}>{t('minutes')}</Text>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeValue}>{timeRemaining.seconds.toString().padStart(2, '0')}</Text>
                  <Text style={styles.timeLabel}>{t('seconds')}</Text>
                </View>
              </View>
            </View>

            {/* Prize Info */}
            <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
              <View style={styles.infoItem}>
                <Ionicons name="gift-outline" size={18} color="#FFFFFF" />
                <Text style={styles.infoLabel}>{t('prizePool')}:</Text>
                <Text style={styles.infoValue}>{draw.prize_amount}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Ionicons name="ticket-outline" size={18} color="#FFFFFF" />
                <Text style={styles.infoLabel}>{t('totalTickets')}:</Text>
                <Text style={styles.infoValue}>{draw.total_tickets.toLocaleString()}</Text>
              </View>
            </View>

            {/* View Details Indicator */}
            {onPress && (
              <View style={[styles.viewDetails, isRTL && styles.viewDetailsRTL]}>
                <Text style={styles.viewDetailsText}>{t('viewDetails')}</Text>
                <Ionicons 
                  name={isRTL ? "chevron-back" : "chevron-forward"} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: SIZES.marginMedium,
  },
  container: {
    borderRadius: SIZES.borderRadiusMedium,
    padding: SIZES.paddingLarge,
    marginBottom: SIZES.marginMedium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  gradient: {
    borderRadius: SIZES.borderRadiusMedium,
    overflow: 'hidden',
  },
  content: {
    padding: SIZES.paddingLarge,
  },
  contentRTL: {
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.marginSmall,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: SIZES.fontLarge,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  badgeText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryName: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SIZES.marginMedium,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timerContainer: {
    marginBottom: SIZES.marginMedium,
  },
  timerContainerRTL: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  timerLabelText: {
    fontSize: SIZES.fontMedium,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerRTL: {
    flexDirection: 'row-reverse',
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  timeLabel: {
    fontSize: SIZES.fontSmall - 2,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  timeSeparator: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.7,
    marginHorizontal: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.borderRadiusSmall,
    padding: SIZES.paddingMedium,
    marginTop: SIZES.marginSmall,
  },
  infoRowRTL: {
    flexDirection: 'row-reverse',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  infoDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  infoLabel: {
    fontSize: SIZES.fontSmall,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  infoValue: {
    fontSize: SIZES.fontMedium,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: SIZES.marginSmall,
  },
  viewDetailsRTL: {
    flexDirection: 'row-reverse',
  },
  viewDetailsText: {
    fontSize: SIZES.fontSmall,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
  },
  loadingText: {
    fontSize: SIZES.fontMedium,
    marginTop: SIZES.marginSmall,
  },
  emptyContainer: {
    paddingVertical: SIZES.paddingXLarge,
  },
  emptyTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    marginTop: SIZES.marginMedium,
    marginBottom: SIZES.marginSmall,
  },
  emptyDescription: {
    fontSize: SIZES.fontMedium,
    textAlign: 'center',
  },
});

export default CountdownBanner;
