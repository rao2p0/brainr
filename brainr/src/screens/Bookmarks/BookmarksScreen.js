import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../../context/AppContext';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../utils/theme';

const BookmarksScreen = ({ navigation }) => {
  const { colors, bookmarks, removeBookmark } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading bookmarks
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle remove bookmark
  const handleRemoveBookmark = async (pageId) => {
    await removeBookmark(pageId);
  };

  // Handle article press
  const handleArticlePress = (article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="bookmark-outline" size={80} color={colors.inactive} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Bookmarks Yet</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Swipe right on articles you want to save for later
      </Text>
    </View>
  );

  // Render bookmark item
  const renderBookmarkItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.bookmarkItem, { backgroundColor: colors.card }]}
      onPress={() => handleArticlePress(item)}
    >
      <View style={[styles.thumbnail, { backgroundColor: colors.inactive }]}>
        {item.thumbnail && item.thumbnail.source ? (
          <FastImage
            source={{ uri: item.thumbnail.source }}
            style={styles.thumbnailImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Icon name="image" size={30} color={colors.background} />
        )}
      </View>
      <View style={styles.bookmarkContent}>
        <Text style={[styles.bookmarkTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.bookmarkExcerpt, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.extract ? item.extract.substring(0, 100) + '...' : 'No description available.'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveBookmark(item.pageid)}
      >
        <Icon name="bookmark-remove" size={24} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your bookmarks...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmarkItem}
        keyExtractor={(item) => item.pageid.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          bookmarks.length > 0 ? (
            <Text style={[styles.headerText, { color: colors.text }]}>
              Your Saved Articles ({bookmarks.length})
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
  },
  bookmarkItem: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  thumbnail: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 80,
    height: 80,
  },
  bookmarkContent: {
    flex: 1,
    padding: SPACING.md,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookmarkExcerpt: {
    fontSize: 12,
    lineHeight: 18,
  },
  removeButton: {
    padding: SPACING.md,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default BookmarksScreen;
