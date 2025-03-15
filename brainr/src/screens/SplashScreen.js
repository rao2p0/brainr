import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, LogBox } from 'react-native';
import { useApp } from '../context/AppContext';

// Ignore specific warnings that might be coming from dependencies
LogBox.ignoreLogs([
  'Require cycle:',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const SplashScreen = () => {
  console.log('SplashScreen rendering');
  const { colors } = useApp();
  
  useEffect(() => {
    console.log('SplashScreen mounted');
    return () => console.log('SplashScreen unmounted');
  }, []);

  console.log('SplashScreen colors:', colors);
  
  if (!colors) {
    console.error('Colors object is undefined in SplashScreen');
    return (
      <View style={[styles.container, { backgroundColor: '#121212' }]}>
        <Text style={[styles.logoText, { color: '#FFFFFF' }]}>Brainr</Text>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
        <Text style={[styles.tagline, { color: '#E0E0E0' }]}>
          Loading app resources...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { color: colors.primary }]}>Brainr</Text>
      </View>
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      <Text style={[styles.tagline, { color: colors.textSecondary }]}>
        Discover knowledge, one swipe at a time
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default SplashScreen;
