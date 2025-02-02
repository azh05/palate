import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function ImageUploadButton() {
  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Navigate to result page with the image URI
      router.push({
        pathname: '/result',
        params: { imageUri: result.assets[0].uri }
      });
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