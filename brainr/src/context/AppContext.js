import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme, Text, View } from 'react-native';
import storageService from '../services/storageService';
import { COLORS } from '../utils/theme';

// Create context
const AppContext = createContext();

/**
 * App context provider to manage global state
 */
export const AppProvider = ({ children }) => {
  console.log('AppProvider rendering');
  
  // State
  const [theme, setTheme] = useState('dark');
  const [colors, setColors] = useState(COLORS.dark);
  const [userTopics, setUserTopics] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get device color scheme
  const deviceTheme = useColorScheme();
  console.log('Device theme:', deviceTheme);

  // Initialize app state
  useEffect(() => {
    console.log('AppProvider useEffect running');
    
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Load theme preference
        console.log('Loading theme preference...');
        const savedTheme = await storageService.getThemeMode();
        console.log('Saved theme:', savedTheme);
        
        const finalTheme = savedTheme || deviceTheme || 'dark';
        console.log('Final theme:', finalTheme);
        
        setTheme(finalTheme);
        setColors(COLORS[finalTheme]);
        
        // Load user topics
        console.log('Loading user topics...');
        const topics = await storageService.getUserTopics();
        console.log('User topics:', topics);
        setUserTopics(topics);
        
        // Load bookmarks
        console.log('Loading bookmarks...');
        const savedBookmarks = await storageService.getBookmarks();
        console.log('Bookmarks count:', savedBookmarks?.length || 0);
        setBookmarks(savedBookmarks);
        
        // Check onboarding status
        console.log('Checking onboarding status...');
        const onboardingCompleted = await storageService.isOnboardingCompleted();
        console.log('Onboarding completed:', onboardingCompleted);
        setIsOnboardingCompleted(onboardingCompleted);
        
        console.log('App initialization complete');
      } catch (error) {
        console.error('Error initializing app:', error);
        setHasError(true);
        setErrorMessage(error.message || 'Unknown error during initialization');
      } finally {
        console.log('Setting isLoading to false');
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, [deviceTheme]);

  /**
   * Toggle theme between dark and light
   */
  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setColors(COLORS[newTheme]);
    await storageService.setThemeMode(newTheme);
  };

  /**
   * Update user topics
   * @param {Array} topics - Array of topic IDs
   */
  const updateUserTopics = async (topics) => {
    setUserTopics(topics);
    await storageService.saveUserTopics(topics);
  };

  /**
   * Add a bookmark
   * @param {Object} article - Article to bookmark
   */
  const addBookmark = async (article) => {
    const updatedBookmarks = [...bookmarks, article];
    setBookmarks(updatedBookmarks);
    await storageService.saveBookmark(article);
  };

  /**
   * Remove a bookmark
   * @param {Number} pageId - Wikipedia page ID to remove
   */
  const removeBookmark = async (pageId) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.pageid !== pageId);
    setBookmarks(updatedBookmarks);
    await storageService.removeBookmark(pageId);
  };

  /**
   * Check if an article is bookmarked
   * @param {Number} pageId - Wikipedia page ID to check
   * @returns {Boolean} - Whether article is bookmarked
   */
  const isBookmarked = (pageId) => {
    return bookmarks.some(bookmark => bookmark.pageid === pageId);
  };

  /**
   * Complete onboarding
   */
  const completeOnboarding = async () => {
    setIsOnboardingCompleted(true);
    await storageService.setOnboardingCompleted(true);
  };

  // Context value
  const contextValue = {
    theme,
    colors,
    toggleTheme,
    userTopics,
    updateUserTopics,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    isOnboardingCompleted,
    completeOnboarding,
    isLoading,
    hasError,
    errorMessage
  };

  console.log('AppProvider context value:', {
    theme,
    colors: Object.keys(colors),
    userTopics: userTopics.length,
    bookmarks: bookmarks.length,
    isOnboardingCompleted,
    isLoading,
    hasError
  });

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8d7da' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#721c24', marginBottom: 10 }}>
          Error Initializing App
        </Text>
        <Text style={{ fontSize: 16, color: '#721c24', textAlign: 'center' }}>
          {errorMessage}
        </Text>
      </View>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to use app context
 * @returns {Object} - App context
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('useApp must be used within an AppProvider');
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
