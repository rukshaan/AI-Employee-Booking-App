import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const FormSubmitButton = ({ lable, submitting, onPress }) => {
    const backgroundColor = submitting ? '#8f9dff' : '#5b6cff';
    return (
        <TouchableOpacity
            onPress={!submitting ? onPress : null}
            style={[styles.container, { backgroundColor }]}
            activeOpacity={0.9}
        >
            <Text style={styles.text}>{lable}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#5b6cff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
    },
});

export default FormSubmitButton;
