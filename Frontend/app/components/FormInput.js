import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const FormInput = (props) => {
    const { placeholder, lable, error } = props;
    return (
        <View style={styles.wrapper}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{lable}</Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
            <TextInput
                {...props}
                placeholder={placeholder}
                placeholderTextColor="#8a8fb3"
                style={[styles.input, error ? styles.inputError : null]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 14,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontWeight: '700',
        color: '#2b2f4b',
        fontSize: 13,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        flexShrink: 1,
        textAlign: 'right',
    },
    input: {
        borderWidth: 1,
        borderColor: '#dce2ff',
        height: 48,
        borderRadius: 14,
        fontSize: 15,
        paddingHorizontal: 14,
        backgroundColor: '#ffffff',
        color: '#1f2340',
        shadowColor: '#6b7cff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    inputError: {
        borderColor: '#ef4444',
    },
});

export default FormInput;
