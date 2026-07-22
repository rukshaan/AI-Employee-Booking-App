//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import UserTypeButton from './UserTypeButton';
import { StackActions } from '@react-navigation/native';

const { width } = Dimensions.get('window')

// create a component
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
            <View style={styles.backgroundAccent1} />
            <View style={styles.backgroundAccent2} />
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Service Marketplace</Text>
                <Text style={styles.subtitle}>Select your role to get started</Text>
            </View>
            <View style={styles.buttonContainer}>
            <UserTypeButton
                lable='Admin'
                onPress={admin}
                color="#f43f5e" // Rose
            />
            <UserTypeButton
                lable='Worker'
                onPress={employee}
                color="#8b5cf6" // Violet
            />
            <UserTypeButton
                lable='Customer'
                onPress={employeer}
                color="#10b981" // Emerald
            />
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Clean white background
    },
    backgroundAccent1: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        backgroundColor: 'rgba(139, 92, 246, 0.1)', // Subtle violet glow
        borderRadius: 150,
    },
    backgroundAccent2: {
        position: 'absolute',
        bottom: -150,
        right: -100,
        width: 400,
        height: 400,
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // Subtle emerald glow
        borderRadius: 200,
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
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b', // Dark slate for premium feel
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b', // Lighter slate
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    }
});

//make this component available to the app
export default WelcomePage;
