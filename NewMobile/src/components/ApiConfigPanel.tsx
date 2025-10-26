import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { apiManager } from '../services/ApiManager';

interface ApiConfigPanelProps {
  visible: boolean;
  onClose: () => void;
}

const ApiConfigPanel: React.FC<ApiConfigPanelProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadApiStatus();
    }
  }, [visible]);

  const loadApiStatus = async () => {
    const status = apiManager.getApiStatus();
    const connectivity = await apiManager.testConnectivity();
    setApiStatus({ ...status, ...connectivity });
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await apiManager.testConnectivity();
      setApiStatus(() => ({ ...apiStatus, ...result }));
      Alert.alert(
        'Connection Test',
        result.recommendation,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to test API connection');
    } finally {
      setTesting(false);
    }
  };

  const dynamicStyles = StyleSheet.create({
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    header: {
      borderBottomColor: colors.border,
    },
    title: {
      color: colors.text,
    },
    section: {
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      color: colors.text,
    },
    statusItem: {
      color: colors.textSecondary,
    },
    button: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: colors.background,
    },
    closeButton: {
      backgroundColor: colors.surface,
    },
    closeButtonText: {
      color: colors.text,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, dynamicStyles.overlay]}>
        <View style={[styles.container, dynamicStyles.container]}>
          <View style={[styles.header, dynamicStyles.header]}>
            <Text style={[styles.title, dynamicStyles.title]}>
              🌐 Real-Time API Status
            </Text>
          </View>

          <View style={styles.content}>
            {/* API Status Section */}
            <View style={[styles.section, dynamicStyles.section]}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Connection Status
              </Text>
              {apiStatus && (
                <>
                  <Text style={[styles.statusItem, dynamicStyles.statusItem]}>
                    📡 Real API: {apiStatus.realApi ? '✅ Connected' : '❌ Disconnected'}
                  </Text>
                  <Text style={[styles.statusItem, dynamicStyles.statusItem]}>
                    💡 {apiStatus.recommendation}
                  </Text>
                </>
              )}
            </View>

            {/* Actions Section */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.button, dynamicStyles.button]}
                onPress={testConnection}
                disabled={testing}
              >
                <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
                  {testing ? '🔄 Testing...' : '🧪 Test Connection'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.closeButton, dynamicStyles.closeButton]}
                onPress={onClose}
              >
                <Text style={[styles.closeButtonText, dynamicStyles.closeButtonText]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ApiConfigPanel;
