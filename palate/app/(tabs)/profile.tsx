import { Text, View, StyleSheet, Image, ScrollView, Pressable, Animated, Easing, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Add interface for dish type
interface Dish {
  id: number;
  name: string;
  date: string;
}

export default function ProfileScreen() {
  const [savedDishes, setSavedDishes] = useState<Dish[]>([
    { id: 1, name: 'Mac & Cheese', date: 'Jan 10, 2025' },
    { id: 2, name: 'BBQ Baby Back Ribs', date: 'Jan 13, 2025' },
    { id: 3, name: 'Pad See-Ew', date: 'Jan 20, 2025' },
    { id: 4, name: 'Pad Kra Pao', date: 'Jan 27, 2025' },
    { id: 5, name: 'Pad Kra Pao', date: 'Jan 27, 2025' },
  ]);
  const [lastRemovedDish, setLastRemovedDish] = useState<Dish | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const slideAnims = useRef(new Map()).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Initialize animation values for each dish
  savedDishes.forEach(dish => {
    if (!slideAnims.has(dish.id)) {
      slideAnims.set(dish.id, new Animated.Value(0));
    }
  });

  const configureLayoutAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  };

  const removeDish = (dishId: number) => {
    const dishToRemove = savedDishes.find(dish => dish.id === dishId);
    
    fadeAnim.setValue(1); // Reset fade value
    
    Animated.timing(slideAnims.get(dishId), {
      toValue: -400,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start(() => {
      configureLayoutAnimation();
      setSavedDishes(prev => prev.filter(dish => dish.id !== dishId));
      setLastRemovedDish(dishToRemove || null);
      setShowUndo(true);
      
      // Start fade out after 4 seconds (1 second before hiding)
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }).start(() => {
          setShowUndo(false);
          setLastRemovedDish(null);
        });
      }, 4500);
    });
  };

  const undoRemove = () => {
    if (lastRemovedDish) {
      const insertIndex = savedDishes.findIndex(dish => {
        const currentDate = new Date(dish.date);
        const removedDate = new Date(lastRemovedDish.date);
        return currentDate > removedDate;
      });

      configureLayoutAnimation(); // Add smooth layout animation
      
      const newDishes = [...savedDishes];
      if (insertIndex === -1) {
        newDishes.push(lastRemovedDish);
      } else {
        newDishes.splice(insertIndex, 0, lastRemovedDish);
      }
      
      setSavedDishes(newDishes);
      slideAnims.set(lastRemovedDish.id, new Animated.Value(-400));
      
      Animated.timing(slideAnims.get(lastRemovedDish.id), {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }).start();
      
      setShowUndo(false);
      setLastRemovedDish(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image 
          source={require('../../assets/images/profile-picture.png')}
          style={styles.profile}
        />
        <Text style={styles.name}>Joe Bruin</Text>

        <Text style={styles.preferences}>My Preferences</Text>
        <View style={styles.flavorContainer}>
          <View style={styles.flavorButton}>
            <Image 
              source={require('../../assets/images/western-icon.png')}
              style={styles.flavorIcon}
            />
            <Text style={styles.flavorText}>western</Text>
          </View>
          <View style={styles.flavorButton}>
            <Image 
              source={require('../../assets/images/salty-icon.png')}
              style={styles.flavorIcon}
            />
            <Text style={styles.flavorText}>salty</Text>
          </View>
          <View style={styles.flavorButton}>
            <Image 
              source={require('../../assets/images/sweet-icon.png')}
              style={styles.flavorIcon}
            />
            <Text style={styles.flavorText}>sweet</Text>
          </View>
          <View style={styles.flavorButton}>
            <Image 
              source={require('../../assets/images/bitter-icon.png')}
              style={styles.flavorIcon}
            />
            <Text style={styles.flavorText}>bitter</Text>
          </View>
        </View>

        <Text style={styles.allergens}>My Allergens</Text>
        <View style={styles.allergenContainer}>
          <View style={styles.allergenButton}>
            <Image 
              source={require('../../assets/images/peanut-icon.png')}
              style={styles.allergenIcon}
            />
            <Text style={styles.allergenText}>peanut</Text>
          </View>
          <View style={styles.allergenButton}>
            <Image 
              source={require('../../assets/images/shellfish-icon.png')}
              style={styles.allergenIcon}
            />
            <Text style={styles.allergenText}>shellfish</Text>
          </View>
          <View style={styles.allergenButton}>
            <Image 
              source={require('../../assets/images/soybean-icon.png')}
              style={styles.allergenIcon}
            />
            <Text style={styles.allergenText}>soybean</Text>
          </View>
          <View style={styles.allergenButton}>
            <Image 
              source={require('../../assets/images/treenut-icon.png')}
              style={styles.allergenIcon}
            />
            <Text style={styles.allergenText}>tree nut</Text>
          </View>
        </View>

        <Text style={styles.savedDishes}>Saved Dishes</Text>
        <View style={styles.dishesContainer}>
          {savedDishes.map((dish) => (
            <Animated.View 
              key={dish.id} 
              style={[
                styles.dishItem,
                {
                  transform: [{
                    translateX: slideAnims.get(dish.id)
                  }]
                }
              ]}
            >
              <View style={styles.leftContent}>
                <Text style={styles.dishName}>{dish.name}</Text>
              </View>
              <View style={styles.rightContent}>
                <Text style={styles.date}>{dish.date}</Text>
                <Pressable 
                  onPress={() => removeDish(dish.id)}
                  style={({ pressed }) => [
                    styles.bookmarkButton,
                    pressed && styles.bookmarkPressed
                  ]}
                >
                  <Image 
                    source={require('../../assets/images/bookmark.png')}
                    style={styles.bookmarkIcon}
                  />
                </Pressable>
              </View>
            </Animated.View>
          ))}
        </View>
        
        {showUndo && (
          <Animated.View 
            style={[
              styles.undoButton,
              {
                opacity: fadeAnim
              }
            ]}
          >
            <Pressable onPress={undoRemove}>
              <Text style={styles.undoText}>Undo</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    width: 393,
    minHeight: 852,
    position: 'relative',
    paddingBottom: 40,
  },
  name: {
    color: '#000',
    fontSize: 32,
    fontWeight: 700,
    fontFamily: 'BodoniFLF',
    fontStyle: 'normal',
    position: 'absolute',
    top: 214,
    textAlign: 'center',
  },
  profile: {
    width: 110,
    height: 110,
    top: 88,
    alignSelf: 'center',
    borderRadius: 55,
  },
  preferences: {
    position: 'absolute',
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 24,
    fontWeight: 700,
    top: 267,
    left: 20,
  },
  flavorContainer: {
    position: 'absolute',
    top: 311,
    left: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: 169 * 2 + 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flavorButton: {
    width: 169,
    height: 36,
    backgroundColor: '#E9C46A',
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  flavorIcon: {
    width: 16,
    height: 16,
  },
  flavorText: {
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 16,
    fontWeight: '500',
  },
  allergens: {
    position: 'absolute',
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 24,
    fontWeight: 700,
    top: 415,
    left: 20,
  },
  allergenContainer: {
    position: 'absolute',
    top: 459,
    left: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: 169 * 2 + 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allergenButton: {
    width: 169,
    height: 36,
    backgroundColor: '#264653',
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  allergenIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  allergenText: {
    color: '#fff',
    fontFamily: 'BodoniFLF',
    fontSize: 16,
    fontWeight: '500',
  },
  savedDishes: {
    position: 'absolute',
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 24,
    fontWeight: 700,
    top: 563,
    left: 20,
  },
  dishesContainer: {
    position: 'absolute',
    top: 563 + 40,
    left: 20,
    width: 353,
    height: 200,
  },
  dishItem: {
    width: 353,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 35,
    gap: 17,
  },
  dishName: {
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    color: '#000',
    fontFamily: 'SegoeUI',
    fontSize: 12,
    fontWeight: '400',
  },
  bookmarkButton: {
    padding: 8,
    margin: -8,
  },
  bookmarkPressed: {
    opacity: 0.7,
  },
  bookmarkIcon: {
    width: 9,
    height: 15,
  },
  undoButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#264653',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
  },
  undoText: {
    color: '#fff',
    fontFamily: 'BodoniFLF',
    fontSize: 16,
    fontWeight: '500',
  },
});
