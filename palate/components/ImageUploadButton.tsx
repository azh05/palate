import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';

/* 
/api/menu/recommend-dishes?userName=John
have to encode image as base64 string 
*/

export default function ImageUploadButton() {
  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
        base64: true, // Enable base64
      });

      if (!result.canceled) {
        // If image wasn't picked with base64, convert it
        let base64Image = result.assets[0].base64;
        if (!base64Image) {
          const uri = result.assets[0].uri;
          base64Image = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        console.log("Image encoded");
        // Send to backend
        const response = await fetch('http://localhost:9000/api/menu/recommend-dishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: `data:image/jpeg;base64,${base64Image}`, 
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
              imageUri: result.assets[0].uri,
              recommendations: JSON.stringify(data)
            }
          });
        } else {
          throw new Error('Failed to get recommendations');
        }
      }
    } catch (error) {
      console.error('Detailed error:', error);
      alert(`Failed to process image: ${error.message}`);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.uploadButton}
      onPress={handleImageUpload}
    >
      <Feather name="upload" size={24} color="#fff" />
      <Text style={styles.uploadText}>Upload Image</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#264653',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 