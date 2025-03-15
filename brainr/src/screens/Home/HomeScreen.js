import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import wikipediaService from '../../services/wikipediaService';
import ArticleCard from '../../components/ArticleCard';
import { useApp } from '../../context/AppContext';
import { SPACING } from '../../utils/theme';

const HomeScreen = () => {
  const [articles, setArticles] = useState([]);
  const [preloadedArticles, setPreloadedArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedArticles, setLikedArticles] = useState({});
  
  const navigation = useNavigation();
  const { colors, userTopics, addBookmark, removeBookmark, isBookmarked, bookmarks } = useApp();
  
  // Load saved articles from AsyncStorage
  const loadSavedArticles = async () => {
    try {
      const likedData = await AsyncStorage.getItem('likedArticles');
      
      if (likedData) {
        setLikedArticles(JSON.parse(likedData));
      }
    } catch (error) {
      console.error('Error loading saved articles:', error);
    }
  };
  
  // Load initial articles
  const fetchInitialArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching articles with user topics:', userTopics);
      
      // Fetch 10 articles with images, using user topics if available
      const articlesWithImages = await wikipediaService.getRandomArticlesWithImages(userTopics, 10);
      
      if (articlesWithImages && articlesWithImages.length > 0) {
        setArticles(articlesWithImages);
        setCurrentIndex(0);
        preloadMoreArticles();
      } else {
        setError('Failed to fetch articles. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('An error occurred while fetching articles. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Preload more articles
  const preloadMoreArticles = async () => {
    try {
      // Fetch 5 more articles with images, using user topics if available
      const articlesWithImages = await wikipediaService.getRandomArticlesWithImages(userTopics, 5);
      
      if (articlesWithImages && articlesWithImages.length > 0) {
        setPreloadedArticles(prev => [...prev, ...articlesWithImages]);
      }
    } catch (error) {
      console.error('Error preloading more articles:', error);
    }
  };
  
  // Handle swipe left (skip)
  const handleSwipeLeft = (article) => {
    goToNextArticle();
  };
  
  // Handle swipe right (read more)
  const handleSwipeRight = (article) => {
    navigation.navigate('ArticleDetail', { article });
  };
  
  // Handle swipe up (next article)
  const handleSwipeUp = (article) => {
    goToNextArticle();
  };
  
  // Handle swipe down (previous article)
  const handleSwipeDown = (article) => {
    goToPreviousArticle();
  };
  
  // Go to next article
  const goToNextArticle = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (preloadedArticles.length > 0) {
      // We've reached the end of our current batch, add preloaded articles
      setArticles([...articles, ...preloadedArticles]);
      setPreloadedArticles([]);
      setCurrentIndex(currentIndex + 1);
      
      // Preload more articles for next time
      preloadMoreArticles();
    }
  };
  
  // Go to previous article
  const goToPreviousArticle = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // Handle like/unlike article
  const handleLikeArticle = async (article) => {
    try {
      const isLiked = likedArticles[article.pageid];
      const updatedLikedArticles = { ...likedArticles };
      
      if (isLiked) {
        delete updatedLikedArticles[article.pageid];
      } else {
        updatedLikedArticles[article.pageid] = {
          id: article.pageid,
          title: article.title,
          extract: article.extract,
          thumbnail: article.thumbnail,
          timestamp: new Date().toISOString(),
        };
      }
      
      setLikedArticles(updatedLikedArticles);
      await AsyncStorage.setItem('likedArticles', JSON.stringify(updatedLikedArticles));
    } catch (error) {
      console.error('Error saving liked article:', error);
    }
  };
  
  // Handle bookmark/unbookmark article
  const handleBookmarkArticle = async (article) => {
    try {
      const bookmarked = isBookmarked(article.pageid);
      
      if (bookmarked) {
        await removeBookmark(article.pageid);
      } else {
        await addBookmark(article);
      }
    } catch (error) {
      console.error('Error saving bookmarked article:', error);
    }
  };
  
  // Handle share article
  const handleShareArticle = (article) => {
    // In a real app, you would implement sharing functionality here
    console.log('Share article:', article.title);
    // You could use the Share API from react-native
    // Share.share({ message: article.extract, url: article.fullurl });
  };
  
  // Load data when component mounts
  useEffect(() => {
    loadSavedArticles();
    fetchInitialArticles();
  }, []);
  
  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // If we have no articles, fetch them
      if (articles.length === 0 && !loading) {
        fetchInitialArticles();
      }
    }, [articles.length, loading])
  );
  
  // Show loading indicator
  if (loading && articles.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors?.background || '#FFFFFF' }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors?.primary || '#007AFF'} />
          <Text style={[styles.loadingText, { color: colors?.text || '#000000' }]}>
            Loading interesting articles...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Show error message
  if (error && articles.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors?.background || '#FFFFFF' }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors?.error || '#FF3B30' }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors?.primary || '#007AFF' }]}
            onPress={fetchInitialArticles}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Get current article
  const currentArticle = articles[currentIndex];
  
  return (
    <View style={[styles.container, { backgroundColor: colors?.background || '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Article Card */}
      {currentArticle && (
        <ArticleCard
          article={currentArticle}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
          onLike={handleLikeArticle}
          onBookmark={handleBookmarkArticle}
          onShare={handleShareArticle}
          isLiked={likedArticles[currentArticle.pageid] !== undefined}
          isBookmarked={isBookmarked(currentArticle.pageid)}
        />
      )}
    </View>
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
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
