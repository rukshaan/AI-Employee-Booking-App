import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { theme } from '../theme';

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
                placeholderTextColor={theme.colors.textLight}
                style={[styles.input, error ? styles.inputError : null]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: theme.spacing.m,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    label: {
        fontWeight: '700',
        color: theme.colors.textDark,
        fontSize: 14,
        letterSpacing: 0.2,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 12,
        flexShrink: 1,
        textAlign: 'right',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        height: 56, // Slightly taller for premium feel
        borderRadius: theme.borderRadius.l,
        fontSize: 16,
        paddingHorizontal: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        color: theme.colors.textDark,
        ...theme.shadows.soft,
    },
    inputError: {
        borderColor: theme.colors.error,
        borderWidth: 1.5,
    },
});

export default FormInput;
