<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Iraqi E-commerce Lottery Mobile App - React Native

This is a React Native mobile application built with Expo for an Iraqi e-commerce lottery system.

## Project Overview
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: React Hooks and Context API
- **API Communication**: Axios
- **Local Storage**: AsyncStorage
- **UI Components**: React Native core components with custom styling

## Key Features
1. **Authentication System**
   - Login and Registration screens
   - JWT token management
   - Secure storage of user credentials

2. **Product Management**
   - Product listing with category filtering
   - Product details view
   - Category-based browsing
   - Real-time data from backend API

3. **Lottery Ticket System**
   - Ticket generation for product purchases
   - Ticket history and management
   - Category-based ticket filtering

4. **User Interface**
   - Modern, responsive design
   - Arabic language support
   - Dark/Light theme support
   - Smooth animations and transitions

## API Integration
- Backend API URL: `http://192.168.0.196:8000/api`
- Endpoints: `/login`, `/register`, `/products`, `/categories`, `/tickets`
- Authentication: Bearer token in headers

## Code Style Guidelines
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error handling
- Use async/await for API calls
- Implement loading states for all API operations
- Use proper navigation patterns
- Maintain clean component structure with separation of concerns

## File Structure
- `/src/components/` - Reusable UI components
- `/src/screens/` - Screen components
- `/src/services/` - API services and utilities
- `/src/navigation/` - Navigation configuration
- `/src/types/` - TypeScript type definitions
- `/src/utils/` - Utility functions and helpers
