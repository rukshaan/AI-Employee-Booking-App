
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewItems = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Items</Text>
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

export default ViewItems;

