import { Text, View, StyleSheet, Image, Button, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
{ /* import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'; */}

export default function BruhScreen() {
    const navigation = useNavigation();


    const handleGoogleSignIn = async () => {
        alert('Button pressed!');
        try {
            alert('Starting Google Sign In...');
            await GoogleSignin.configure({
                iosClientId: '775475090794-r2qe2n51elgucqcsbom35j4dmqm00dqn.apps.googleusercontent.com',
                webClientId: '775475090794-r2qe2n51elgucqcsbom35j4dmqm00dqn.apps.googleusercontent.com',
                offlineAccess: true,
            });

            if (Platform.OS === 'android') {
                await GoogleSignin.hasPlayServices();
            }
            
            const userInfo = await GoogleSignin.signIn();
            
            alert('Sign in successful!');
            navigation.navigate('index' as never);
        } catch (error: any) {
            alert('Error: ' + JSON.stringify(error));
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                alert('User cancelled the login flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                alert('Operation is in progress already');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert('Play services not available or outdated');
            } else {
                alert('Something went wrong: ' + JSON.stringify(error));
            }
        }
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
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                <Image
                    source={require('../../assets/images/google-logo.png')}
                    style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <View style={styles.authButtonsContainer}>
                <TouchableOpacity style={[styles.authButton, styles.loginButton]}>
                    <Text style={[styles.authButtonText, styles.loginButtonText]}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.authButton}>
                    <Text style={styles.authButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
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
    },
});
