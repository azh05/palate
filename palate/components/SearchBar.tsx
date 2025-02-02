import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

export default function SearchBar() {
  const [url, setUrl] = useState('');

  const handleSearch = async () => {
    try {
      console.log("Sending URL:", url);
      const response = await fetch('http://localhost:9000/api/menu/recommend-dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          userName: 'John'
        }),
      });

      console.log("Response received");
      if (response.ok) {
        const data = await response.json();
        console.log("Recommendations received:", data);
        
        router.push({
          pathname: '/result',
          params: { 
            url: url,
            recommendations: JSON.stringify(data)
          }
        });
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process URL');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter URL..."
        value={url}
        onChangeText={setUrl}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Feather name="search" size={24} color="#264653" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 61,
    paddingHorizontal: 15,
    width: 353,
    height: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
});
