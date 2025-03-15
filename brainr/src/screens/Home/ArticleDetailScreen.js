import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Share,
  Linking,
  SafeAreaView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../../context/AppContext';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../utils/theme';

const ArticleDetailScreen = ({ route, navigation }) => {
  const { article } = route.params || {};
  const { colors, addBookmark, removeBookmark, isBookmarked } = useApp();
  const [bookmarked, setBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if article is bookmarked
  useEffect(() => {
    if (!article || !article.pageid) {
      navigation.goBack();
      return;
    }

    const checkBookmarkStatus = async () => {
      const status = await isBookmarked(article.pageid);
      setBookmarked(status);
    };
    
    checkBookmarkStatus();
  }, [article, isBookmarked, navigation]);

  // Handle bookmark button press
  const handleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(article.pageid);
    } else {
      await addBookmark(article);
    }
    setBookmarked(!bookmarked);
  };

  // Handle share button press
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this interesting article: ${article.title}\n${article.fullurl}`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  // Handle open in browser
  const handleOpenInBrowser = () => {
    if (article.fullurl) {
      Linking.openURL(article.fullurl);
    }
  };

  // If no article data, show loading or error
  if (!article) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Article data not available</Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          {article.thumbnail && article.thumbnail.source && !imageError ? (
            <Image
              source={{ uri: article.thumbnail.source }}
              style={styles.heroImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: colors.inactive }]}>
              <Icon name="image" size={60} color={colors.background} />
            </View>
          )}
          <View style={[styles.imageDarkOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]} />
          
          {/* Title overlay */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{article?.title || 'Untitled Article'}</Text>
          </View>
        </View>
        
        {/* Article content */}
        <View style={styles.contentContainer}>
          {/* Action buttons */}
          <View style={[styles.actionButtons, { backgroundColor: colors.surface }]}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleBookmark}
            >
              <Icon 
                name={bookmarked ? "bookmark" : "bookmark-outline"} 
                size={28} 
                color={bookmarked ? colors.primary : colors.text} 
              />
              <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                {bookmarked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleShare}
            >
              <Icon name="share-variant" size={28} color={colors.text} />
              <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                Share
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleOpenInBrowser}
            >
              <Icon name="open-in-new" size={28} color={colors.text} />
              <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                Browser
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Article text */}
          <Text style={[styles.articleText, { color: colors.text }]}>
            {article?.extract || 'No content available for this article.'}
          </Text>
          
          {/* Read more link */}
          <TouchableOpacity 
            style={[styles.readMoreButton, { backgroundColor: colors.primary }]}
            onPress={handleOpenInBrowser}
          >
            <Text style={styles.readMoreButtonText}>Read Full Article on Wikipedia</Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  actionButton: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 12,
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  readMoreButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: SPACING.md,
  },
  button: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ArticleDetailScreen;
