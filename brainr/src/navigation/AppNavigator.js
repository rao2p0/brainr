import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen1 from '../screens/Onboarding/OnboardingScreen1';
import OnboardingScreen2 from '../screens/Onboarding/OnboardingScreen2';
import OnboardingScreen3 from '../screens/Onboarding/OnboardingScreen3';
import OnboardingScreen4 from '../screens/Onboarding/OnboardingScreen4';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import BookmarksScreen from '../screens/Bookmarks/BookmarksScreen';
import ArticleDetailScreen from '../screens/Home/ArticleDetailScreen';

// Import icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom tab navigator for main app screens
 */
const MainTabNavigator = () => {
  console.log('MainTabNavigator rendering');
  const { colors } = useApp();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: 'transparent',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Bookmarks" 
        component={BookmarksScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bookmark" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Onboarding stack navigator
 */
const OnboardingNavigator = () => {
  console.log('OnboardingNavigator rendering');
  const { colors } = useApp();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
      <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
      <Stack.Screen name="Onboarding4" component={OnboardingScreen4} />
    </Stack.Navigator>
  );
};

/**
 * Main app navigator
 */
const AppNavigator = () => {
  console.log('AppNavigator rendering');
  const { colors, isOnboardingCompleted, isLoading, theme } = useApp();
  
  console.log('AppNavigator state:', { isLoading, isOnboardingCompleted, theme });
  
  useEffect(() => {
    console.log('AppNavigator mounted');
    return () => console.log('AppNavigator unmounted');
  }, []);
  
  // Fallback UI in case of issues
  if (!colors) {
    console.error('Colors object is undefined in AppNavigator');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Loading app...</Text>
      </View>
    );
  }
  
  return (
    <>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !isOnboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="ArticleDetail" 
              component={ArticleDetailScreen}
              options={{
                headerShown: true,
                headerTitle: '',
                headerTransparent: true,
                headerTintColor: colors.text,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
