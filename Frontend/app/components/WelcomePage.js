import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import UserTypeButton from './UserTypeButton';
import { StackActions } from '@react-navigation/native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { theme } from '../theme';

const { width } = Dimensions.get('window')

const WelcomePage = ({ navigation }) => {
    const employee = async () => {
        navigation.dispatch(
            StackActions.replace('AppForm')
        );
    };
    const admin = async () => {
        navigation.dispatch(
            StackActions.replace('AdminForm')
        );
    };
    const employeer = async () => {
        navigation.dispatch(
            StackActions.replace('EmployeerAppForm')
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(1500)} style={styles.backgroundAccent1} />
            <Animated.View entering={FadeIn.duration(1500).delay(300)} style={styles.backgroundAccent2} />
            
            <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.logoContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Service Marketplace</Text>
                <Text style={styles.subtitle}>Select your role to get started</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(800).delay(200).springify()} style={styles.buttonContainer}>
                <UserTypeButton
                    lable='Customer'
                    onPress={employeer}
                    color={theme.colors.secondary} 
                />
                <UserTypeButton
                    lable='Worker'
                    onPress={employee}
                    color={theme.colors.violet} 
                />
                <UserTypeButton
                    lable='Admin'
                    onPress={admin}
                    color={theme.colors.tertiary} 
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    backgroundAccent1: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        borderRadius: theme.borderRadius.round,
    },
    backgroundAccent2: {
        position: 'absolute',
        bottom: -150,
        right: -100,
        width: 400,
        height: 400,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderRadius: theme.borderRadius.round,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
        zIndex: 10,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
        resizeMode: 'contain',
        marginBottom: theme.spacing.m,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.textDark,
        marginBottom: theme.spacing.s,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.textLight,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.l,
        zIndex: 10,
        gap: theme.spacing.m,
    }
});

export default WelcomePage;
