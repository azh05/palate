import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import ElevatedCards from '../components/ElevatedCards';
import SnapCarousel from '../components/SnapCarousel';
import AvoidDropdowns from '../components/AvoidDropdowns';

const carouselItems = [
  {
    title: "First Item",
    body: "Description here",
    imgUrl: "https://example.com/image.jpg"
  },
  {
    title: "Second Item",
    body: "Description here",
    imgUrl: "https://example.com/image.jpg"
  },
  {
    title: "Third Item",
    body: "Description here",
    imgUrl: "https://example.com/image.jpg"
  },
  // ... more items
];

const otherItems = [
  {
    emoji: "🌮",
    title: "Tacos"
  },
  {
    emoji: "🌮",
    title: "Tacos"
  },
  {
    emoji: "🌮",
    title: "Tacos"
  }, 
  {
    emoji: "🌮",
    title: "Tacos"
  },
  {
    emoji: "🌮",
    title: "Tacos"
  },
  {
    emoji: "🌮",
    title: "Tacos"
  },
  {
    emoji: "🌮",
    title: "Tacos"
  }
];

const avoidItems = [
  {
    title: "Spicy Foods",
    content: "These dishes contain high levels of spice that might not suit your palate.",
    items: [
      "Hot Wings",
      "Curry (High Spice)",
      "Jalapeño Poppers",
      "Spicy Ramen"
    ]
  },
  {
    title: "Dairy Products",
    content: "Contains lactose and milk proteins that you might want to avoid.",
    items: [
      "Heavy Cream Sauces",
      "Cheese-based Dishes",
      "Milk-based Desserts"
    ]
  },
  {
    title: "Seafood",
    content: "Fresh seafood dishes that might not match your preferences.",
    items: [
      "Raw Oysters",
      "Sushi with Raw Fish",
      "Shellfish Dishes"
    ]
  }
];

export default function RecommendationsScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerBackTitle: 'Back',
    });
  }, [navigation]);


  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>You might like...</Text>
      </View>
      <View style={styles.carouselContainer}>
        <SnapCarousel items={carouselItems} />
      </View>
      <View style={styles.avoidContainer}>
          <Text style={styles.avoidText}>
            Please avoid...
          </Text>
      </View>
      <View style={styles.avoidContainer}>
        <AvoidDropdowns items={avoidItems} />
      </View>

      <View style={styles.otherTextContainer}>
        <Text style={styles.otherText}>{"Other dishes..."}</Text>
      </View>

      <View style={styles.elevatedCardsContainer}>
        <ElevatedCards items={otherItems}/>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E9C46A',
    marginBottom: 20,
    alignSelf: 'stretch',
    fontFamily: 'BodoniFLF',
    fontStyle: 'normal',
    lineHeight: undefined,
    paddingHorizontal: 8
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16, // Added margin between carousel and elevated cards
  },
  elevatedCardsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  avoidContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  avoidText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#264653',
    marginBottom: 20,
    alignSelf: 'stretch',
    fontFamily: 'BodoniFLF',
    fontStyle: 'normal',
    lineHeight: undefined,
    paddingHorizontal: 8
  }, 
  otherText: {
    fontFamily: 'BodoniFLF',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: undefined,
    paddingHorizontal: 4,
    marginBottom: 16,
   color: '#E9C46A',
},
  otherTextContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'flex-start',
  },
});
