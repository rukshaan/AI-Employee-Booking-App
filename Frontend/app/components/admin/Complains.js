
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Complains = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complains</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Complains;

