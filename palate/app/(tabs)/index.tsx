import { View, Text, StyleSheet } from 'react-native';
import SearchBar from '../../components/SearchBar';
import ImageUploadButton from '../../components/ImageUploadButton';
import FadeView from '../../components/FadeView';

export default function IndexPage() {
  return (
    <FadeView style={styles.container}>
      <Text style={styles.title}>What's on your Palate?</Text>
      <SearchBar />
      <Text style={styles.orText}>or</Text>
      <ImageUploadButton />
    </FadeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Bodoni-Bold',
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    width: 353,
    height: 97,
    lineHeight: 40,  // setting to fontSize for 'normal' line height
    fontStyle: 'normal',
  },
  orText: {
    alignSelf: 'stretch',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Bodoni-Bold',  // using our bold font
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 16,  // normal line height
    marginVertical: 20,
  },
});
