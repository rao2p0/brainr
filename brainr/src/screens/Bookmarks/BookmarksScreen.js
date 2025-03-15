import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../../context/AppContext';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../utils/theme';

const BookmarksScreen = ({ navigation }) => {
  const { colors, bookmarks, removeBookmark } = useApp();
  const [loading, setLoading] = useState(true);
  const [sortedBookmarks, setSortedBookmarks] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

  useEffect(() => {
    // Simulate loading bookmarks
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Sort bookmarks based on timestamp
    if (bookmarks && bookmarks.length > 0) {
      const sorted = [...bookmarks].sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
      setSortedBookmarks(sorted);
    } else {
      setSortedBookmarks([]);
    }
  }, [bookmarks, sortOrder]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  // Handle remove bookmark
  const handleRemoveBookmark = async (pageId) => {
    await removeBookmark(pageId);
  };

  // Handle article press
  const handleArticlePress = (article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="bookmark-outline" size={80} color={colors.inactive} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Bookmarks Yet</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Use the bookmark button on articles you want to save for later
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
          <Image
            source={{ uri: item.thumbnail.source }}
            style={styles.thumbnailImage}
            resizeMode="cover"
            onError={(e) => console.log('Error loading bookmark thumbnail:', e.nativeEvent.error)}
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
        <Text style={[styles.bookmarkDate, { color: colors.textSecondary }]}>
          Saved on {formatDate(item.timestamp)}
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
      {bookmarks.length > 0 && (
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Your Bookmarks ({bookmarks.length})
          </Text>
          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={toggleSortOrder}
          >
            <Icon 
              name={sortOrder === 'newest' ? 'sort-calendar-descending' : 'sort-calendar-ascending'} 
              size={24} 
              color={colors.primary} 
            />
            <Text style={[styles.sortText, { color: colors.primary }]}>
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={sortedBookmarks}
        renderItem={renderBookmarkItem}
        keyExtractor={item => item.pageid.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    marginLeft: 5,
    fontSize: 14,
  },
  listContent: {
    padding: SPACING.medium,
    paddingBottom: SPACING.large * 2,
    flexGrow: 1,
  },
  bookmarkItem: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  thumbnail: {
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkContent: {
    flex: 1,
    padding: SPACING.small,
    justifyContent: 'space-between',
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookmarkExcerpt: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookmarkDate: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  removeButton: {
    padding: SPACING.small,
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.medium,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.large,
    paddingTop: SPACING.extraLarge * 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SPACING.medium,
    marginBottom: SPACING.small,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookmarksScreen;
