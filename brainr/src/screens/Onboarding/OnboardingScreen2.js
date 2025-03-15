import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../../context/AppContext';
import { SPACING, BORDER_RADIUS } from '../../utils/theme';

const OnboardingScreen2 = ({ navigation }) => {
  const { colors } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Swipe Actions</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Navigate content with intuitive gestures
          </Text>
        </View>

        <View style={styles.swipeActionsContainer}>
          {/* Swipe Left */}
          <View style={[styles.swipeAction, { backgroundColor: colors.card }]}>
            <Icon name="gesture-swipe-left" size={40} color="#FF5252" />
            <Text style={[styles.swipeActionTitle, { color: colors.text }]}>Swipe Left</Text>
            <Text style={[styles.swipeActionDescription, { color: colors.textSecondary }]}>
              Skip this article
            </Text>
          </View>

          {/* Swipe Right */}
          <View style={[styles.swipeAction, { backgroundColor: colors.card }]}>
            <Icon name="gesture-swipe-right" size={40} color="#4CAF50" />
            <Text style={[styles.swipeActionTitle, { color: colors.text }]}>Swipe Right</Text>
            <Text style={[styles.swipeActionDescription, { color: colors.textSecondary }]}>
              Read more details
            </Text>
          </View>

          {/* Swipe Up */}
          <View style={[styles.swipeAction, { backgroundColor: colors.card }]}>
            <Icon name="gesture-swipe-up" size={40} color="#2196F3" />
            <Text style={[styles.swipeActionTitle, { color: colors.text }]}>Swipe Up</Text>
            <Text style={[styles.swipeActionDescription, { color: colors.textSecondary }]}>
              Next article
            </Text>
          </View>

          {/* Swipe Down */}
          <View style={[styles.swipeAction, { backgroundColor: colors.card }]}>
            <Icon name="gesture-swipe-down" size={40} color="#FFC107" />
            <Text style={[styles.swipeActionTitle, { color: colors.text }]}>Swipe Down</Text>
            <Text style={[styles.swipeActionDescription, { color: colors.textSecondary }]}>
              Previous article
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, { backgroundColor: colors.inactive }]} />
          <View style={[styles.paginationDot, styles.activeDot, { backgroundColor: colors.primary }]} />
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
            onPress={() => navigation.navigate('Onboarding3')}
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
  swipeActionsContainer: {
    marginTop: SPACING.xl,
  },
  swipeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  swipeActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: SPACING.lg,
  },
  swipeActionDescription: {
    fontSize: 14,
    marginLeft: 'auto',
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

export default OnboardingScreen2;
