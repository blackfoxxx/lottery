import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ColorPreviewProps {
  visible?: boolean;
}

const ColorPreview: React.FC<ColorPreviewProps> = ({ visible = false }) => {
  const { colors, isDarkMode } = useTheme();

  if (!visible) {
    return null;
  }

  const colorSamples = [
    { name: 'Primary', value: colors.primary, description: 'Backend-aligned red-orange' },
    { name: 'Background', value: colors.background, description: 'Backend soft background' },
    { name: 'Surface', value: colors.surface, description: 'Card/surface color' },
    { name: 'Text', value: colors.text, description: 'Primary text color' },
    { name: 'Text Secondary', value: colors.textSecondary, description: 'Secondary text' },
    { name: 'Border', value: colors.border, description: 'Border color' },
    { name: 'Success', value: colors.success, description: 'Success indicator' },
    { name: 'Warning', value: colors.warning, description: 'Warning indicator' },
    { name: 'Error', value: colors.error, description: 'Error indicator' },
    { name: 'Golden', value: colors.golden, description: 'Golden category' },
    { name: 'Silver', value: colors.silver, description: 'Silver category' },
    { name: 'Bronze', value: colors.bronze, description: 'Bronze category' },
    { name: 'Platinum', value: colors.platinum, description: 'Platinum category' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: colors.text }]}>
          🎨 Color Scheme Preview
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {isDarkMode ? 'Dark Theme' : 'Light Theme'} - Backend Aligned
        </Text>
        
        {colorSamples.map((color, index) => (
          <View key={index} style={[styles.colorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.colorInfo}>
              <View style={[styles.colorSwatch, { backgroundColor: color.value }]} />
              <View style={styles.colorDetails}>
                <Text style={[styles.colorName, { color: colors.text }]}>
                  {color.name}
                </Text>
                <Text style={[styles.colorValue, { color: colors.textSecondary }]}>
                  {color.value}
                </Text>
                <Text style={[styles.colorDescription, { color: colors.textSecondary }]}>
                  {color.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
        
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
          <Text style={[styles.summaryTitle, { color: colors.primary }]}>
            ✅ Backend Integration Complete
          </Text>
          <Text style={[styles.summaryText, { color: colors.text }]}>
            All colors now match the backend color scheme for perfect brand consistency.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  colorCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorDetails: {
    flex: 1,
  },
  colorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  colorValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  colorDescription: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  summaryCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ColorPreview;
