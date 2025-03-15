import axios from 'axios';

// Base URL for Wikipedia API
const API_BASE_URL = 'https://en.wikipedia.org/w/api.php';

/**
 * Service to handle Wikipedia API interactions
 */
const wikipediaService = {
  /**
   * Fetch random articles based on user topics
   * @param {Array} topics - Array of topic categories
   * @param {Number} limit - Number of articles to fetch (default: 5)
   * @returns {Promise} - Promise with article data
   */
  getRandomArticles: async (topics = [], limit = 5) => {
    try {
      // Request more articles than needed to account for filtering
      const requestLimit = limit * 3;
      
      // If user has selected topics, use them to fetch relevant articles
      if (topics && topics.length > 0) {
        // Use the first topic as a seed for related articles
        // We'll rotate through topics for variety
        const randomIndex = Math.floor(Math.random() * topics.length);
        const selectedTopic = topics[randomIndex];
        
        console.log(`Fetching articles related to topic: ${selectedTopic}`);
        
        const response = await axios.get(API_BASE_URL, {
          params: {
            action: 'query',
            generator: 'categorymembers',
            gcmtitle: `Category:${selectedTopic}`,
            gcmlimit: requestLimit,
            prop: 'info',
            inprop: 'url',
            format: 'json',
            origin: '*',
          },
        });

        if (response.data && response.data.query && response.data.query.pages) {
          // Convert object of pages to array
          const pages = Object.values(response.data.query.pages);
          
          // Randomize the order of results
          const shuffled = pages.sort(() => 0.5 - Math.random());
          
          // Map to match the format of random API results
          return shuffled.map(page => ({
            id: page.pageid,
            ns: page.ns,
            title: page.title,
            pageid: page.pageid
          }));
        }
        
        // Fallback to random if category search fails
        console.log('Category search returned no results, falling back to random');
      }
      
      // Default: get completely random articles
      const response = await axios.get(API_BASE_URL, {
        params: {
          action: 'query',
          list: 'random',
          rnlimit: requestLimit,
          rnnamespace: 0, // Only get articles, not talk pages etc.
          format: 'json',
          origin: '*',
        },
      });

      if (response.data && response.data.query && response.data.query.random) {
        return response.data.query.random;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching random articles:', error);
      throw error;
    }
  },

  /**
   * Get article content and images by page ID
   * @param {Number} pageId - Wikipedia page ID
   * @returns {Promise} - Promise with article data
   */
  getArticleContent: async (pageId) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          action: 'query',
          prop: 'extracts|pageimages|info',
          pageids: pageId,
          exintro: 1, // Get only the intro section
          explaintext: 1, // Get plain text, not HTML
          pithumbsize: 500, // Get thumbnail image of 500px width
          inprop: 'url', // Get the full URL to the article
          format: 'json',
          origin: '*',
        },
      });

      if (response.data && response.data.query && response.data.query.pages) {
        return response.data.query.pages[pageId];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching article content:', error);
      throw error;
    }
  },

  /**
   * Check if an article has a thumbnail image
   * @param {Object} article - Article object
   * @returns {Boolean} - True if article has a thumbnail
   */
  hasImage: (article) => {
    return article && 
           article.thumbnail && 
           article.thumbnail.source && 
           article.thumbnail.width > 100; // Ensure image is reasonably sized
  },

  /**
   * Fetch random articles that have images
   * @param {Array} topics - Array of topic categories
   * @param {Number} limit - Number of articles to fetch
   * @returns {Promise} - Promise with article data that includes images
   */
  getRandomArticlesWithImages: async (topics = [], limit = 5) => {
    try {
      // Get a batch of random articles, using user topics if available
      const randomArticles = await wikipediaService.getRandomArticles(topics, limit * 3);
      
      // Fetch content for all articles in parallel
      const articlesWithContent = await Promise.all(
        randomArticles.map(article => wikipediaService.getArticleContent(article.id))
      );
      
      // Filter to only include articles with valid images
      const articlesWithImages = articlesWithContent
        .filter(article => article !== null && wikipediaService.hasImage(article))
        .slice(0, limit); // Limit to requested number
      
      if (articlesWithImages.length < limit) {
        console.warn(`Only found ${articlesWithImages.length} articles with images out of ${limit} requested`);
      }
      
      return articlesWithImages;
    } catch (error) {
      console.error('Error fetching articles with images:', error);
      throw error;
    }
  },

  /**
   * Search for articles by query
   * @param {String} query - Search query
   * @param {Number} limit - Number of results to return (default: 10)
   * @returns {Promise} - Promise with search results
   */
  searchArticles: async (query, limit = 10) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          srlimit: limit,
          format: 'json',
          origin: '*',
        },
      });

      if (response.data && response.data.query && response.data.query.search) {
        return response.data.query.search;
      }
      
      return [];
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  },

  /**
   * Get popular categories from Wikipedia
   * @returns {Promise} - Promise with popular categories
   */
  getCategories: async () => {
    // This is a simplified version - in a real app, you might want to
    // fetch actual popular categories from Wikipedia
    return [
      { id: 1, name: 'Science' },
      { id: 2, name: 'History' },
      { id: 3, name: 'Technology' },
      { id: 4, name: 'Art' },
      { id: 5, name: 'Literature' },
      { id: 6, name: 'Sports' },
      { id: 7, name: 'Geography' },
      { id: 8, name: 'Music' },
      { id: 9, name: 'Film' },
      { id: 10, name: 'Food' },
    ];
  }
};

export default wikipediaService;
