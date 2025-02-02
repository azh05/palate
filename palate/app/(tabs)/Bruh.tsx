import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/'); 
  };

  return (
    <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../../assets/images/palate-logo-bed.png')} 
                    style={styles.logoBed}
                />
                <Image 
                    source={require('../../assets/images/palate-logo.png')} 
                    style={styles.logo}
                />
            </View>
            <Text style={styles.text}>Let's explore your Palate.</Text>
            <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
                <Image
                    source={require('../../assets/images/google-logo.png')}
                    style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <View style={styles.authButtonsContainer}>
                <TouchableOpacity style={[styles.authButton, styles.loginButton]} onPress={handleLogin}>
                    <Text style={[styles.authButtonText, styles.loginButtonText]}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
                    <Text style={styles.authButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
    </ View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: 393,
        height: 852,
        backgroundColor: '#fff',
        position: 'relative',
    }, 
    text: {
        position: 'absolute',
        top: 326,
        left: 19,
        color: '#000',
        fontSize: 40,
        fontFamily: 'BodoniFLF',
        fontWeight: '700',
    },
    logoContainer: {
        position: 'absolute',
        top: 200,
        left: 19,
        width: 110,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoBed: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    logo: {
        width: 56.64,
        height: 91,
        position: 'absolute',
    },
    googleButton: {
        top: 434,
        left: 20,
        right: 20,
        height: 40,
        width: 353,
        backgroundColor: '#D9D9D9',
        borderRadius: 24,
        position: 'relative', // For absolute positioning of children
    },
    googleIcon: {
        position: 'absolute',
        left: 16,
        width: 24,
        height: 24,
        top: 8,
    },
    googleButtonText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: '#000000',
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'SegoeUI',
        lineHeight: 40,
    },
    authButtonsContainer: {
        position: 'absolute',
        top: 486,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    authButton: {
        width: 167,
        height: 40,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E9C46A',
    },
    authButtonText: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'SegoeUI',
        color: '#000000',
    },
    loginButton: {
        backgroundColor: '#264653',
    },
    loginButtonText: {
        color: '#FFFFFF',
    }
});


// return (
//         <View style={styles.container}>
//             <View style={styles.logoContainer}>
//                 <Image 
//                     source={require('../../assets/images/palate-logo-bed.png')} 
//                     style={styles.logoBed}
//                 />
//                 <Image 
//                     source={require('../../assets/images/palate-logo.png')} 
//                     style={styles.logo}
//                 />
//             </View>
//             <Text style={styles.text}>Let's explore your Palate.</Text>
//             <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
//                 <Image
//                     source={require('../../assets/images/google-logo.png')}
//                     style={styles.googleIcon}
//                 />
//                 <Text style={styles.googleButtonText}>Continue with Google</Text>
//             </TouchableOpacity>
//             <View style={styles.authButtonsContainer}>
//                 <TouchableOpacity style={[styles.authButton, styles.loginButton]}>
//                     <Text style={[styles.authButtonText, styles.loginButtonText]}>Log In</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.authButton}>
//                     <Text style={styles.authButtonText}>Sign Up</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );

/* 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Bodoni-Bold',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#e9c46a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  loginText: {
    fontSize: 18,
    fontFamily: 'Bodoni-Bold',
    color: '#000',
  },
}); */