import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SIZES } from '../constants';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameDrops: number;
  lastUpdate: number;
}

interface PerformanceMonitorProps {
  visible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  visible = __DEV__,
  position = 'top-right',
}) => {
  const { colors } = useTheme();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    frameDrops: 0,
    lastUpdate: Date.now(),
  });

  useEffect(() => {
    if (!visible) return;

    const startTime = performance.now();
    let frameCount = 0;
    let lastFrameTime = startTime;

    const updateMetrics = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      frameCount++;

      // Update metrics every second
      if (currentTime - metrics.lastUpdate > 1000) {
        setMetrics(prev => ({
          renderTime: Math.round(deltaTime * 100) / 100,
          memoryUsage: getMemoryUsage(),
          frameDrops: deltaTime > 16.67 ? prev.frameDrops + 1 : prev.frameDrops,
          lastUpdate: currentTime,
        }));
      }

      lastFrameTime = currentTime;
      requestAnimationFrame(updateMetrics);
    };

    const animationId = requestAnimationFrame(updateMetrics);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [visible, metrics.lastUpdate]);

  const getMemoryUsage = (): number => {
    // This is a simplified memory estimation
    // In a real app, you might use a native module for actual memory stats
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  };

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      zIndex: 9999,
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyle, top: 50, left: 10 };
      case 'top-right':
        return { ...baseStyle, top: 50, right: 10 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 50, left: 10 };
      case 'bottom-right':
        return { ...baseStyle, bottom: 50, right: 10 };
      default:
        return { ...baseStyle, top: 50, right: 10 };
    }
  };

  if (!visible) {
    return null;
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
    value: {
      color: colors.primary,
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container, getPositionStyle()]}>
      <Text style={[styles.title, dynamicStyles.text]}>⚡ Performance</Text>
      
      <View style={styles.metric}>
        <Text style={[styles.label, dynamicStyles.text]}>Render:</Text>
        <Text style={[styles.value, dynamicStyles.value]}>
          {metrics.renderTime}ms
        </Text>
      </View>

      <View style={styles.metric}>
        <Text style={[styles.label, dynamicStyles.text]}>Memory:</Text>
        <Text style={[styles.value, dynamicStyles.value]}>
          {metrics.memoryUsage}MB
        </Text>
      </View>

      <View style={styles.metric}>
        <Text style={[styles.label, dynamicStyles.text]}>Drops:</Text>
        <Text style={[styles.value, dynamicStyles.value]}>
          {metrics.frameDrops}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusSmall,
    borderWidth: 1,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
    marginBottom: SIZES.marginSmall,
    textAlign: 'center',
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: SIZES.fontSmall - 2,
  },
  value: {
    fontSize: SIZES.fontSmall - 2,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});

export default PerformanceMonitor;
