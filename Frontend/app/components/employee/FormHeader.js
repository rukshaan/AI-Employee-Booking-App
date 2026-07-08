import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const FormHeader = ({
  leftHeading,
  rightHeading,
  subHeading,
  rightHeaderOpacity,
  leftHeaderTranslateX,
  rightHeaderTranslateY,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge}> 
        <Text style={styles.badgeText}>Access Portal</Text>
      </View>
      <View style={styles.headingRow}>
        <Animated.View
          style={[
            styles.textContainer,
            { transform: [{ translateX: leftHeaderTranslateX || 0 }] },
          ]}
        >
          <Text style={styles.heading}>{leftHeading}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: rightHeaderOpacity || 1,
              transform: [{ translateY: rightHeaderTranslateY || 0 }],
            },
          ]}
        >
          <Text style={styles.heading}>{rightHeading}</Text>
        </Animated.View>
      </View>

      {subHeading ? <Text style={styles.subHeading}>{subHeading}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
    marginBottom: 8,
  },
  badgeText: {
    color: '#5b6cff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  textContainer: {
    marginVertical: 2,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2450',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FormHeader;
