import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Image, Text } from 'react-native';
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
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.body}</Text>
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
        height: ITEM_WIDTH + 100,
        borderRadius: 10,
        padding: 15,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '70%',
        marginBottom: 16
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        color: '#000',
        fontFamily: 'BodoniFLF',
        fontStyle: 'normal',
        lineHeight: undefined
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