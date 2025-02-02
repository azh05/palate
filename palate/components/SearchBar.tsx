import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SearchBar() {
  return (
    <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Paste menu link here..."
        placeholderTextColor="#666"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 61,
    paddingHorizontal: 15,
    width: 353,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
}); 