import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import data from '../app/data';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 80;
const ITEM_MARGIN = 5;
const SNAP_INTERVAL = ITEM_WIDTH + (ITEM_MARGIN * 2);

interface CarouselItem {
  title: string;
  body: string;
  imgUrl: string;
}

interface SnapCarouselProps {
  items: CarouselItem[];
}

export default function SnapCarousel({ items }: SnapCarouselProps) {
    const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);

    const toggleBookmark = (index: number) => {
        setBookmarkedItems(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL} // Makes it snap to each item
            decelerationRate="fast" // Makes the snapping feel more snappy
            snapToAlignment="center" // Centers the snapped item
        >
            {items.map((item, index) => (
                <View key={index} style={styles.view}>
                    <Image 
                        source={{ uri: item.imgUrl }}
                        style={styles.image}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                        <TouchableOpacity 
                            style={styles.bookmarkButton}
                            onPress={() => toggleBookmark(index)}
                        >
                            <Ionicons 
                                name={bookmarkedItems.includes(index) ? "bookmark" : "bookmark-outline"} 
                                size={24} 
                                color="black" 
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.descriptionContainer}>
                        <Text style={styles.description}>{item.body}</Text>
                    </ScrollView>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: '#E9C46A',
        width: ITEM_WIDTH,
        margin: ITEM_MARGIN,
        height: ITEM_WIDTH + 200,
        borderRadius: 10,
        padding: 15,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '70%',
        marginBottom: 16
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        fontFamily: 'BodoniFLF',
        fontStyle: 'normal',
        flex: 1
    },
    bookmarkButton: {
        padding: 8,
        marginRight: -8
    },
    descriptionContainer: {
        maxHeight: '20%'
    },
    description: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Segoe UI',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: undefined
    }
});