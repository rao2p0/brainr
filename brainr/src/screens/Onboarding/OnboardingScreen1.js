import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { SPACING, BORDER_RADIUS } from '../../utils/theme';

const OnboardingScreen1 = ({ navigation }) => {
  const { colors } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome to Brainr</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Discover knowledge, one swipe at a time
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={[styles.illustrationBox, { backgroundColor: colors.card }]}>
            {/* Replace with actual illustration or icon */}
            <Text style={[styles.illustrationText, { color: colors.primary }]}>🧠</Text>
          </View>
        </View>

        <View style={styles.description}>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            Brainr delivers a dynamic and engaging way to explore Wikipedia articles. 
            Swipe through visually appealing article cards to discover diverse topics.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.activeDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.paginationDot, { backgroundColor: colors.inactive }]} />
          <View style={[styles.paginationDot, { backgroundColor: colors.inactive }]} />
          <View style={[styles.paginationDot, { backgroundColor: colors.inactive }]} />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('Onboarding4')}
          >
            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Onboarding2')}
          >
            <Text style={[styles.nextButtonText, { color: '#FFFFFF' }]}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  illustrationBox: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationText: {
    fontSize: 100,
  },
  description: {
    marginTop: SPACING.xl,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: SPACING.md,
  },
  skipButtonText: {
    fontSize: 16,
  },
  nextButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen1;
