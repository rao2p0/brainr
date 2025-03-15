import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../../context/AppContext';
import { SPACING, BORDER_RADIUS } from '../../utils/theme';

const OnboardingScreen3 = ({ navigation }) => {
  const { colors } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Action Buttons</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Interact with articles using these controls
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          {/* Like Button */}
          <View style={[styles.actionItem, { backgroundColor: colors.card }]}>
            <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(255, 82, 82, 0.2)' }]}>
              <Icon name="heart" size={32} color="#FF5252" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Like</Text>
              <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>
                Save articles you enjoy to your liked collection
              </Text>
            </View>
          </View>

          {/* Bookmark Button */}
          <View style={[styles.actionItem, { backgroundColor: colors.card }]}>
            <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.2)' }]}>
              <Icon name="bookmark" size={32} color="#2196F3" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Bookmark</Text>
              <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>
                Save articles to read later in your bookmarks
              </Text>
            </View>
          </View>

          {/* Share Button */}
          <View style={[styles.actionItem, { backgroundColor: colors.card }]}>
            <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
              <Icon name="share-variant" size={32} color="#4CAF50" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Share</Text>
              <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>
                Share interesting articles with friends
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, { backgroundColor: colors.inactive }]} />
          <View style={[styles.paginationDot, { backgroundColor: colors.inactive }]} />
          <View style={[styles.paginationDot, styles.activeDot, { backgroundColor: colors.primary }]} />
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
            onPress={() => navigation.navigate('Onboarding4')}
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
  actionsContainer: {
    marginTop: SPACING.xl,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
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

export default OnboardingScreen3;
