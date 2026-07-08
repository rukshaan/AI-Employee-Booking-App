import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const HomeBtn = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.touchable}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.8}
        >
            <Image
                source={require('../../assets/homeBtn.png')}
                style={styles.logo}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 44,
        marginBottom: 12,
        padding: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.9)',
        shadowColor: '#5b6cff',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 6,
        elevation: 3,
    },
    logo: {
        width: width * 0.12,
        height: width * 0.12,
        resizeMode: 'contain',
    },
});

export default HomeBtn;
