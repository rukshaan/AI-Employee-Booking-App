//import liraries
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// create a component
const UserTypeButton = ({ lable, submitting, onPress, color }) => {
    const defaultColor = color || '#3b82f6';
    const backgroundColor = submitting ? 'rgba(59, 130, 246, 0.4)' : defaultColor;
    return (
        <TouchableOpacity onPress={!submitting ? onPress : null} style={[styles.container, { backgroundColor }]}>
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: '600', letterSpacing: 0.5 }}>{lable}</Text>
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width * 0.9,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
        borderWidth: 0, // removed border for cleaner look
    },
});

//make this component available to the app
export default UserTypeButton;
