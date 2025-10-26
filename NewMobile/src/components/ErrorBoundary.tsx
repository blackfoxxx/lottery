import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './CustomButton';
import { SIZES } from '../constants';

interface Props {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<ErrorBoundaryState>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || null,
    });

    // Log to crash analytics service in production
    if (!__DEV__) {
      // logErrorToService(error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent {...this.state} />;
      }

      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorEmoji}>😵</Text>
              <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
              <Text style={styles.errorMessage}>
                We're sorry, but something unexpected happened. Please try reloading the app.
              </Text>

              {__DEV__ && this.state.error && (
                <View style={styles.debugContainer}>
                  <Text style={styles.debugTitle}>Debug Information:</Text>
                  <Text style={styles.debugText}>
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text style={styles.debugText}>
                      {this.state.errorInfo}
                    </Text>
                  )}
                </View>
              )}

              <CustomButton
                title="Reload App"
                onPress={this.handleReload}
                style={styles.reloadButton}
              />

              {__DEV__ && (
                <CustomButton
                  title="Continue with Error"
                  onPress={() => this.setState({ hasError: false })}
                  variant="outline"
                  style={styles.continueButton}
                />
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.paddingLarge,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: SIZES.marginLarge,
  },
  errorTitle: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: SIZES.marginMedium,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: SIZES.fontMedium,
    color: '#666666',
    textAlign: 'center',
    marginBottom: SIZES.marginXLarge,
    lineHeight: 24,
  },
  debugContainer: {
    backgroundColor: '#F2F2F7',
    padding: SIZES.paddingMedium,
    borderRadius: SIZES.borderRadiusMedium,
    marginBottom: SIZES.marginLarge,
    width: '100%',
  },
  debugTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: '#000000',
    marginBottom: SIZES.marginSmall,
  },
  debugText: {
    fontSize: SIZES.fontSmall,
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: SIZES.marginSmall,
  },
  reloadButton: {
    marginBottom: SIZES.marginMedium,
  },
  continueButton: {
    marginTop: SIZES.marginSmall,
  },
});

export default ErrorBoundary;
