import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import ElevatedCards from '../components/ElevatedCards';
import SnapCarousel from '../components/SnapCarousel';
import AvoidDropdowns from '../components/AvoidDropdowns';

const carouselItems = [
  {
    title: "Chicken",
    body: "Chicken Taco",
    imgUrl: "https://tarateaspoon.com/wp-content/uploads/2024/04/Beef-Taco-Meat-sz-05-sq-feature.jpg"
  },
  {
    title: "Kale",
    body: "Kale Salad",
    imgUrl: "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/leafy-green.png"
  },
  {
    title: "Gluten Free Pizza",
    body: "Pizza (no gluten)",
    imgUrl: "https://www.glutenfreepalate.com/wp-content/uploads/2018/08/Gluten-Free-Pizza-3.2-735x486.jpg"
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
    title: "Lobster (🔥)",
    content: "These dishes contain high levels of spice that might not suit your palate.",
    items: [
    ]
  },
  {
    title: "Ice Cream (🌶️)",
    content: "Contains lactose and milk proteins that you might want to avoid.",
    items: [
    ]
  },
  {
    title: "Salmon",
    content: "Fresh seafood dishes that might not match your preferences.",
    items: [
    ]
  }
];

export default function RecommendationsScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [recommendations, setRecommendations] = useState(null);
  const [allergens, setAllergens] = useState(null);
  const [otherDishes, setOtherDishes] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  useEffect(() => {
    if (params.recommendations) {
      const data = JSON.parse(params.recommendations as string);
      
      if(data && data.dishes) {
        console.log(data.dishes)
        if(JSON.stringify(data.dishes) === JSON.stringify({"dishes": []})) {
          setRecommendations({
            carouselItems: carouselItems,
            avoidItems: avoidItems,
            otherItems: otherItems
          });
          return;
        }  else {
          // Take first 3 dishes and format them for carousel
        const carouselDishes = data.dishes.slice(2, 5).map((dish: {name: string, description: string, image: string}) => ({
          title: dish.name,
          body: dish.description || "No description available",
          imgUrl: dish.image || (Math.random() < 0.5 ? "https://static.wikia.nocookie.net/chickenlittle/images/0/04/Chicken_Little.jpg/revision/latest?cb=20170302012156" : "https://static.wikia.nocookie.net/yugioh/images/4/49/Carrotman-OW.png/revision/latest?cb=20140110201135")
        }));

        // Format avoid items from dishes that are not recommended
        const avoidDishes = data.dishes
          .filter((dish: {isRecommended: string}) => dish.isRecommended === "0")
          .slice(10, 20)
          .map((dish: {name: string, description: string, items?: string[]}, index: number) => ({
            title: dish.name,
            content: dish.description || "These items might not suit your preferences",
            items: dish.items || []
          }));

        // Randomly sample 7 dishes for other items
        const foodEmojis = ["🍜", "🍛", "🍝", "🍲", "🥘", "🥗", "🍱", "🍚", "🥪", "🌮", "🌯", "🥙", "🥩", "🍗", "🍖"];
        const shuffled = [...data.dishes].sort(() => 0.5 - Math.random());
        const randomOtherDishes = shuffled.slice(0, 7).map(dish => ({
          emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
          title: dish.name
        }));
        
        setRecommendations({
          carouselItems: carouselDishes,
          avoidItems: avoidDishes,
          otherItems: randomOtherDishes
        });

        }
        
      }
    }
  }, [params.recommendations]);

  if (!recommendations) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>You might like...</Text>
      </View>
      <View style={styles.carouselContainer}>
        <SnapCarousel items={recommendations.carouselItems || carouselItems} />
      </View>
      <View style={styles.avoidContainer}>
          <Text style={styles.avoidText}>
            Please avoid...
          </Text>
      </View>
      <View style={styles.avoidContainer}>
        <AvoidDropdowns items={recommendations.avoidItems || avoidItems} />
      </View>

      <View style={styles.otherTextContainer}>
        <Text style={styles.otherText}>{"Other dishes..."}</Text>
      </View>

      <View style={styles.elevatedCardsContainer}>
        <ElevatedCards items={recommendations.otherItems || otherItems}/>
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
