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

interface Preference {
  id: string;
  name: string;
  selected: boolean;
}

interface Allergen {
  id: string;
  name: string;
  selected: boolean;
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
  const [showPreferencesDropdown, setShowPreferencesDropdown] = useState(false);
  const [preferences, setPreferences] = useState<Preference[]>([
    { id: 'western', name: 'western', selected: false },
    { id: 'salty', name: 'salty', selected: false },
    { id: 'sweet', name: 'sweet', selected: false },
    { id: 'savory', name: 'savory', selected: false },
    { id: 'bitter', name: 'bitter', selected: false },
    { id: 'vegan', name: 'vegan', selected: false },
    { id: 'vegetarian', name: 'vegetarian', selected: false },
    { id: 'italian', name: 'italian', selected: false },
    { id: 'chinese', name: 'chinese', selected: false },
  ]);
  const [showAllergensDropdown, setShowAllergensDropdown] = useState(false);
  const [allergens, setAllergens] = useState<Allergen[]>([
    { id: 'peanut', name: 'peanut', selected: false },
    { id: 'shellfish', name: 'shellfish', selected: false },
    { id: 'soybean', name: 'soybean', selected: false },
    { id: 'treenut', name: 'tree nut', selected: false },
    { id: 'milk', name: 'milk', selected: false },
    { id: 'eggs', name: 'eggs', selected: false },
    { id: 'wheat', name: 'wheat', selected: false },
    { id: 'sesame', name: 'sesame', selected: false },
  ]);

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

  const togglePreference = (id: string) => {
    setPreferences(preferences.map(pref => 
      pref.id === id ? { ...pref, selected: !pref.selected } : pref
    ));
  };

  const getPreferenceIcon = (id: string) => {
    switch (id) {
      case 'western':
        return require('../../assets/images/western-icon.png');
      case 'salty':
        return require('../../assets/images/salty-icon.png');
      case 'sweet':
        return require('../../assets/images/sweet-icon.png');
      case 'savory':
        return require('../../assets/images/savory-icon.png');
      case 'bitter':
        return require('../../assets/images/bitter-icon.png');
      case 'vegan':
        return require('../../assets/images/vegan-icon.png');
      case 'vegetarian':
        return require('../../assets/images/vegetarian-icon.png');
      case 'italian':
        return require('../../assets/images/italian-icon.png');
      case 'chinese':
        return require('../../assets/images/chinese-icon.png');
    }
  };

  const toggleAllergen = (id: string) => {
    setAllergens(allergens.map(allergen => 
      allergen.id === id ? { ...allergen, selected: !allergen.selected } : allergen
    ));
  };

  const getAllergenIcon = (id: string) => {
    switch (id) {
      case 'peanut':
        return require('../../assets/images/peanut-icon.png');
      case 'shellfish':
        return require('../../assets/images/shellfish-icon.png');
      case 'soybean':
        return require('../../assets/images/soybean-icon.png');
      case 'treenut':
        return require('../../assets/images/treenut-icon.png');
      case 'milk':
        return require('../../assets/images/milk-icon.png');
      case 'eggs':
        return require('../../assets/images/eggs-icon.png');
      case 'wheat':
        return require('../../assets/images/wheat-icon.png');
      case 'sesame':
        return require('../../assets/images/sesame-icon.png');
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

        <View style={styles.preferencesHeader}>
          <Text style={styles.preferences}>My Preferences</Text>
          <Pressable 
            style={styles.editButton}
            onPress={() => setShowPreferencesDropdown(!showPreferencesDropdown)}
          >
            <Text style={styles.editButtonText}>
              {showPreferencesDropdown ? 'Done' : 'Edit'}
            </Text>
          </Pressable>
        </View>

        {showPreferencesDropdown && (
          <View style={styles.dropdownContainer}>
            {preferences.map((pref) => (
              <Pressable
                key={pref.id}
                style={[
                  styles.dropdownItem,
                  pref.selected && styles.dropdownItemSelected
                ]}
                onPress={() => togglePreference(pref.id)}
              >
                <Text style={[
                  styles.dropdownItemText,
                  pref.selected && styles.dropdownItemTextSelected
                ]}>
                  {pref.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.flavorContainer}>
          {preferences.filter(pref => pref.selected).map((pref) => (
            <View key={pref.id} style={styles.flavorButton}>
              <Image 
                source={getPreferenceIcon(pref.id)}
                style={styles.flavorIcon}
              />
              <Text style={styles.flavorText}>{pref.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.allergensHeader}>
          <Text style={styles.allergens}>My Allergens</Text>
          <Pressable 
            style={styles.editButton}
            onPress={() => setShowAllergensDropdown(!showAllergensDropdown)}
          >
            <Text style={styles.editButtonText}>
              {showAllergensDropdown ? 'Done' : 'Edit'}
            </Text>
          </Pressable>
        </View>

        {showAllergensDropdown && (
          <View style={styles.dropdownContainer}>
            {allergens.map((allergen) => (
              <Pressable
                key={allergen.id}
                style={[
                  styles.dropdownItem,
                  allergen.selected && styles.dropdownItemSelected
                ]}
                onPress={() => toggleAllergen(allergen.id)}
              >
                <Text style={[
                  styles.dropdownItemText,
                  allergen.selected && styles.dropdownItemTextSelected
                ]}>
                  {allergen.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.allergenContainer}>
          {allergens.filter(allergen => allergen.selected).map((allergen) => (
            <View key={allergen.id} style={styles.allergenButton}>
              <Image 
                source={getAllergenIcon(allergen.id)}
                style={styles.allergenIcon}
              />
              <Text style={styles.allergenText}>{allergen.name}</Text>
            </View>
          ))}
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
    marginTop: 16,
    textAlign: 'center',
    width: '100%',
    left: 0,
  },
  profile: {
    width: 110,
    height: 110,
    marginTop: 88,
    alignSelf: 'center',
    borderRadius: 55,
  },
  preferencesHeader: {
    marginTop: 16,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferences: {
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 24,
    fontWeight: '700',
  },
  editButton: {
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  dropdownItemSelected: {
    backgroundColor: '#E9C46A',
  },
  dropdownItemText: {
    fontFamily: 'BodoniFLF',
    fontSize: 16,
    color: '#000',
  },
  dropdownItemTextSelected: {
    fontWeight: '700',
  },
  flavorContainer: {
    marginTop: 16,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: 169 * 2 + 10,
    justifyContent: 'flex-start',
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
  allergensHeader: {
    marginTop: 16,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allergens: {
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 24,
    fontWeight: 700,
  },
  allergenContainer: {
    marginTop: 16,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: 169 * 2 + 10,
    justifyContent: 'flex-start',
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
    color: '#000',
    fontFamily: 'BodoniFLF',
    fontSize: 24,
    fontWeight: 700,
    marginTop: 16,
    marginLeft: 20,
  },
  dishesContainer: {
    marginTop: 16,
    marginHorizontal: 20,
    width: 353,
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
