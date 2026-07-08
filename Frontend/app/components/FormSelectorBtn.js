import React from 'react';
import { Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';

const FormSelectorBtn = ({ lable, backgroundColor, style, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View style={[styles.container, { backgroundColor }, style]}>
                <Text style={styles.label}>{lable}</Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    label: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default FormSelectorBtn;
