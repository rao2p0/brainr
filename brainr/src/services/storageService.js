import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  THEME: 'brainr_theme',
  TOPICS: 'brainr_topics',
  BOOKMARKS: 'brainr_bookmarks',
  ONBOARDING: 'brainr_onboarding_completed',
};

/**
 * Get theme mode from storage
 * @returns {Promise<String>} - 'dark' or 'light'
 */
export const getThemeMode = async () => {
  try {
    console.log('getThemeMode: Attempting to get theme from storage');
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    console.log('getThemeMode: Retrieved theme:', theme);
    return theme;
  } catch (error) {
    console.error('getThemeMode error:', error);
    return null;
  }
};

/**
 * Set theme mode in storage
 * @param {String} theme - 'dark' or 'light'
 */
export const setThemeMode = async (theme) => {
  try {
    console.log('setThemeMode: Setting theme to:', theme);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    console.log('setThemeMode: Theme saved successfully');
  } catch (error) {
    console.error('setThemeMode error:', error);
  }
};

/**
 * Get user topics from storage
 * @returns {Promise<Array>} - Array of topic IDs
 */
export const getUserTopics = async () => {
  try {
    console.log('getUserTopics: Attempting to get topics from storage');
    const topicsJson = await AsyncStorage.getItem(STORAGE_KEYS.TOPICS);
    console.log('getUserTopics: Retrieved topics JSON:', topicsJson);
    const topics = topicsJson ? JSON.parse(topicsJson) : [];
    console.log('getUserTopics: Parsed topics:', topics);
    return topics;
  } catch (error) {
    console.error('getUserTopics error:', error);
    return [];
  }
};

/**
 * Save user topics to storage
 * @param {Array} topics - Array of topic IDs
 */
export const saveUserTopics = async (topics) => {
  try {
    console.log('saveUserTopics: Saving topics:', topics);
    await AsyncStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
    console.log('saveUserTopics: Topics saved successfully');
  } catch (error) {
    console.error('saveUserTopics error:', error);
  }
};

/**
 * Get bookmarks from storage
 * @returns {Promise<Array>} - Array of bookmarked articles
 */
export const getBookmarks = async () => {
  try {
    console.log('getBookmarks: Attempting to get bookmarks from storage');
    const bookmarksJson = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    console.log('getBookmarks: Retrieved bookmarks JSON:', bookmarksJson);
    const bookmarks = bookmarksJson ? JSON.parse(bookmarksJson) : [];
    console.log('getBookmarks: Parsed bookmarks count:', bookmarks.length);
    return bookmarks;
  } catch (error) {
    console.error('getBookmarks error:', error);
    return [];
  }
};

/**
 * Save bookmark to storage
 * @param {Object} article - Article to bookmark
 */
export const saveBookmark = async (article) => {
  try {
    console.log('saveBookmark: Saving bookmark for article:', article.pageid);
    const bookmarksJson = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    const bookmarks = bookmarksJson ? JSON.parse(bookmarksJson) : [];
    
    // Check if already bookmarked
    if (!bookmarks.some(bookmark => bookmark.pageid === article.pageid)) {
      // Create a standardized bookmark object with all necessary fields
      const bookmarkData = {
        pageid: article.pageid,
        title: article.title,
        extract: article.extract,
        thumbnail: article.thumbnail,
        url: article.url || `https://en.wikipedia.org/?curid=${article.pageid}`,
        timestamp: new Date().toISOString(),
      };
      
      bookmarks.push(bookmarkData);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      console.log('saveBookmark: Bookmark saved successfully');
    } else {
      console.log('saveBookmark: Article already bookmarked');
    }
  } catch (error) {
    console.error('saveBookmark error:', error);
  }
};

/**
 * Remove bookmark from storage
 * @param {Number} pageId - Wikipedia page ID to remove
 */
export const removeBookmark = async (pageId) => {
  try {
    console.log('removeBookmark: Removing bookmark for article:', pageId);
    const bookmarksJson = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (bookmarksJson) {
      const bookmarks = JSON.parse(bookmarksJson);
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.pageid !== pageId);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
      console.log('removeBookmark: Bookmark removed successfully');
    }
  } catch (error) {
    console.error('removeBookmark error:', error);
  }
};

/**
 * Check if onboarding is completed
 * @returns {Promise<Boolean>} - Whether onboarding is completed
 */
export const isOnboardingCompleted = async () => {
  try {
    console.log('isOnboardingCompleted: Checking onboarding status');
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
    console.log('isOnboardingCompleted: Retrieved status:', completed);
    return completed === 'true';
  } catch (error) {
    console.error('isOnboardingCompleted error:', error);
    return false;
  }
};

/**
 * Set onboarding completed status
 * @param {Boolean} completed - Whether onboarding is completed
 */
export const setOnboardingCompleted = async (completed) => {
  try {
    console.log('setOnboardingCompleted: Setting onboarding completed to:', completed);
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, completed.toString());
    console.log('setOnboardingCompleted: Onboarding status saved successfully');
  } catch (error) {
    console.error('setOnboardingCompleted error:', error);
  }
};

/**
 * Clear all app data from storage
 */
export const clearAllData = async () => {
  try {
    console.log('clearAllData: Clearing all app data');
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.THEME,
      STORAGE_KEYS.TOPICS,
      STORAGE_KEYS.BOOKMARKS,
      STORAGE_KEYS.ONBOARDING,
    ]);
    console.log('clearAllData: All data cleared successfully');
  } catch (error) {
    console.error('clearAllData error:', error);
  }
};

// Export all functions as a single object
export default {
  getThemeMode,
  setThemeMode,
  getUserTopics,
  saveUserTopics,
  getBookmarks,
  saveBookmark,
  removeBookmark,
  isOnboardingCompleted,
  setOnboardingCompleted,
  clearAllData,
};
