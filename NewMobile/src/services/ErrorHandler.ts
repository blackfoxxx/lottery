import { Alert } from 'react-native';

export interface ErrorInfo {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class AppError extends Error {
  public code?: string;
  public statusCode?: number;
  public details?: any;

  constructor(message: string, code?: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message, 'NETWORK_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed. Please log in again.') {
    super(message, 'AUTH_ERROR', 401);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Invalid input data.', details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Server error. Please try again later.', statusCode: number = 500) {
    super(message, 'SERVER_ERROR', statusCode);
  }
}

export class ErrorHandler {
  static handleError(error: any, showAlert: boolean = true): AppError {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error.response) {
      // HTTP error response
      const { status, data } = error.response;
      const message = data?.message || data?.error || `Server error (${status})`;
      
      switch (status) {
        case 400:
          appError = new ValidationError(message, data);
          break;
        case 401:
          appError = new AuthenticationError(message);
          break;
        case 404:
          appError = new AppError('Resource not found', 'NOT_FOUND', 404);
          break;
        case 500:
        case 502:
        case 503:
          appError = new ServerError(message, status);
          break;
        default:
          appError = new AppError(message, 'HTTP_ERROR', status);
      }
    } else if (error.request) {
      // Network error
      appError = new NetworkError();
    } else if (error.message) {
      // Generic error with message
      appError = new AppError(error.message, 'GENERIC_ERROR');
    } else {
      // Unknown error
      appError = new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
    }

    // Log error for debugging
    console.error('Error handled:', {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      details: appError.details,
      originalError: error,
    });

    // Show alert if requested
    if (showAlert) {
      this.showErrorAlert(appError);
    }

    return appError;
  }

  static showErrorAlert(error: AppError): void {
    Alert.alert(
      'Error',
      error.message,
      [
        { 
          text: 'OK', 
          style: 'default' 
        }
      ]
    );
  }

  static showSuccessAlert(title: string, message: string): void {
    Alert.alert(
      title,
      message,
      [
        { 
          text: 'OK', 
          style: 'default' 
        }
      ]
    );
  }

  static showConfirmAlert(
    title: string, 
    message: string, 
    onConfirm: () => void,
    onCancel?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: onCancel 
        },
        { 
          text: 'Confirm', 
          style: 'default',
          onPress: onConfirm 
        }
      ]
    );
  }
}

export default ErrorHandler;
