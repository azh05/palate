import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface DishItem {
  emoji: string;
  title: string;
}

interface ElevatedCardsProps {
  items: DishItem[];
  headerText?: string;
}

export default function ElevatedCards({ items }: ElevatedCardsProps) {
    return (
        <View>
            <ScrollView style={styles.cardContainer} horizontal={true}>
                {items.map((item, index) => (
                    <View key={index} style={[styles.card, styles.cardElevated]}>
                        <Text style={styles.emoji}>{item.emoji}</Text>
                        <Text style={styles.cardText}>{item.title}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 90,
        height: 90, 
        flex: 1,
        alignItems: 'center',
        margin: 4, 
        borderRadius: 8,
        justifyContent: 'center', // Changed from space-between to center
        padding: 6,
    },
    cardContainer: {
        padding: 4,
    },
    cardElevated: {
        elevation: 4, // for Android
        shadowColor: '#000', // for iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: '#E9C46A',
    },
    cardText: {
        fontFamily: 'BodoniFLF',
        marginBottom: 2,
        color: '#000',
        fontWeight: '700'
    },
    emoji: {
        fontSize: 28,
        marginTop: 2,
        marginBottom: 8
    }
})