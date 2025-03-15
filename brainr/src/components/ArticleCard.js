import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { SHADOWS, BORDER_RADIUS, SPACING } from '../utils/theme';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80; // Reduced threshold for easier swipe detection

const ArticleCard = ({ 
  article, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  onLike,
  onBookmark,
  onShare,
  isLiked,
  isBookmarked
}) => {
  console.log('ArticleCard rendering with article:', article ? article.title : 'undefined');
  const { colors } = useApp();
  
  const [showControls, setShowControls] = useState(false);
  const [swipeIndicator, setSwipeIndicator] = useState(null);
  const scrollViewRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const isScrolling = useRef(false);
  const swipeHandled = useRef(false);
  
  // Automatically hide swipe indicators after a short delay
  useEffect(() => {
    if (swipeIndicator) {
      const timer = setTimeout(() => {
        setSwipeIndicator(null);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [swipeIndicator]);
  
  // Handle tap on the card
  const handleCardTap = () => {
    setShowControls(!showControls);
  };
  
  // Handle touch start
  const handleTouchStart = (e) => {
    startX.current = e.nativeEvent.pageX;
    startY.current = e.nativeEvent.pageY;
    isScrolling.current = false;
    swipeHandled.current = false;
  };
  
  // Handle touch move
  const handleTouchMove = (e) => {
    if (isScrolling.current || swipeHandled.current) return;
    
    const dx = e.nativeEvent.pageX - startX.current;
    const dy = e.nativeEvent.pageY - startY.current;
    
    // Determine if this is a horizontal or vertical swipe
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      // Calculate the angle of the swipe
      const angle = Math.atan2(Math.abs(dy), Math.abs(dx)) * 180 / Math.PI;
      
      // Horizontal swipe detection (angle less than 30 degrees from horizontal)
      if (angle < 30) {
        // Only show left swipe indicator (for "read more")
        if (dx < -30) {
          setSwipeIndicator('left');
        } else {
          setSwipeIndicator(null);
        }
      } 
      // Vertical swipe detection (angle more than 60 degrees from horizontal)
      else if (angle > 60) {
        if (dy > 30) {
          setSwipeIndicator('down');
        } else if (dy < -30) {
          setSwipeIndicator('up');
        }
      } 
      // Diagonal movement - wait for clearer direction
      else {
        setSwipeIndicator(null);
      }
    }
  };
  
  // Handle touch end
  const handleTouchEnd = (e) => {
    if (isScrolling.current || swipeHandled.current) return;
    
    const dx = e.nativeEvent.pageX - startX.current;
    const dy = e.nativeEvent.pageY - startY.current;
    
    // Check if this was a tap (very small movement)
    if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
      handleCardTap();
      return;
    }
    
    // Calculate the angle of the swipe
    const angle = Math.atan2(Math.abs(dy), Math.abs(dx)) * 180 / Math.PI;
    
    // Handle swipe gestures with improved angle-based detection
    if (angle < 30 && Math.abs(dx) > SWIPE_THRESHOLD) {
      // Left swipe - for "read more"
      if (dx < 0) {
        console.log("Swipe LEFT detected - Read More");
        swipeHandled.current = true;
        if (onSwipeRight && article) {
          // Call onSwipeRight (which navigates to article detail)
          onSwipeRight(article);
        }
      }
    } else if (angle > 60 && Math.abs(dy) > SWIPE_THRESHOLD) {
      // Vertical swipe
      if (dy > 0) {
        console.log("Swipe DOWN detected");
        swipeHandled.current = true;
        if (onSwipeDown && article) {
          onSwipeDown(article);
        }
      } else if (dy < 0) {
        console.log("Swipe UP detected");
        swipeHandled.current = true;
        if (onSwipeUp && article) {
          onSwipeUp(article);
        }
      }
    }
    
    // The indicator will be cleared by the useEffect after timeout
  };
  
  if (!article) {
    return (
      <View style={[styles.fullScreenContainer, { backgroundColor: colors?.card || '#FFFFFF' }]}>
        <View style={styles.placeholderContainer}>
          <Text style={{ color: colors?.text || '#000000' }}>Loading article...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View 
      style={[styles.fullScreenContainer, { backgroundColor: colors?.card || '#FFFFFF' }]}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe indicators - only shown during active swipe */}
      {swipeIndicator === 'left' && (
        <View style={[styles.swipeIndicator, styles.rightSwipeIndicator]}>
          <Icon name="arrow-right-circle" size={60} color="#4CAF50" />
          <Text style={[styles.swipeText, { color: '#4CAF50' }]}>Read More</Text>
        </View>
      )}
      
      {swipeIndicator === 'up' && (
        <View style={[styles.swipeIndicator, styles.upSwipeIndicator]}>
          <Icon name="arrow-up-circle" size={60} color="#2196F3" />
          <Text style={[styles.swipeText, { color: '#2196F3' }]}>Next</Text>
        </View>
      )}
      
      {swipeIndicator === 'down' && (
        <View style={[styles.swipeIndicator, styles.downSwipeIndicator]}>
          <Icon name="arrow-down-circle" size={60} color="#FFC107" />
          <Text style={[styles.swipeText, { color: '#FFC107' }]}>Previous</Text>
        </View>
      )}
      
      {/* Article content */}
      <View style={styles.fullCardContent}>
        <View style={styles.imageContainer}>
          {article.thumbnail && article.thumbnail.source ? (
            <Image
              source={{ uri: article.thumbnail.source }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: colors?.inactive || '#E0E0E0' }]}>
              <Icon name="image" size={50} color={colors?.background || '#FFFFFF'} />
            </View>
          )}
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollContainer}
          scrollEnabled={!swipeIndicator} // Disable scrolling during swipe
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContentContainer}
          onScrollBeginDrag={() => {
            isScrolling.current = true;
            setSwipeIndicator(null);
          }}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors?.text || '#000000' }]}>
              {article.title || 'Untitled Article'}
            </Text>
            
            <Text style={[styles.excerpt, { color: colors?.textSecondary || '#666666' }]}>
              {article.extract || 'No description available.'}
            </Text>
          </View>
        </ScrollView>
        
        {/* Floating action buttons */}
        {showControls && (
          <SafeAreaView style={styles.floatingControls}>
            <View style={styles.controlsBackground}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onLike && article && onLike(article)}
              >
                <Icon 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={28} 
                  color={isLiked ? "#FF5252" : colors?.text || '#000000'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onBookmark && article && onBookmark(article)}
              >
                <Icon 
                  name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                  size={28} 
                  color={isBookmarked ? "#FFC107" : colors?.text || '#000000'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onShare && article && onShare(article)}
              >
                <Icon 
                  name="share-variant" 
                  size={28} 
                  color={colors?.text || '#000000'} 
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
        
        {/* Swipe instruction indicators */}
        <View style={styles.articleCounter}>
          <View style={styles.counterPill}>
            <Icon name="gesture-swipe" size={16} color="#FFFFFF" style={styles.counterIcon} />
            <Text style={styles.counterText}>Swipe to navigate</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    width: width,
    height: height,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  fullCardContent: {
    flex: 1,
    padding: 0,
  },
  imageContainer: {
    height: '45%',
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100, // Add extra padding at the bottom for better scrolling
  },
  textContainer: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
  },
  excerpt: {
    fontSize: 18,
    lineHeight: 26,
  },
  floatingControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlsBackground: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.medium,
  },
  actionButton: {
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
  },
  swipeIndicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leftSwipeIndicator: {
    left: 30,
    top: '45%',
  },
  rightSwipeIndicator: {
    right: 30,
    top: '45%',
  },
  upSwipeIndicator: {
    top: 40,
    left: '45%',
  },
  downSwipeIndicator: {
    bottom: 40,
    left: '45%',
  },
  swipeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  articleCounter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
  },
  counterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  counterIcon: {
    marginRight: 5,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ArticleCard;
