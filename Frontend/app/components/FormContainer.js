import React from 'react';
import { StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

const FormContainer = ({ children }) => {
    return (
        <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        flex: 1,
        backgroundColor: '#f7f8ff',
    },
    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 10,
        paddingBottom: 30,
    },
});

export default FormContainer;
