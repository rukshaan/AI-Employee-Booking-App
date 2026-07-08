import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeBtn from '../HomeBtn';
import AdminLogin from './AdminLogin';
import { StackActions } from '@react-navigation/native';

const AdminForm = ({ navigation }) => {
  const welcomePage = () => navigation.dispatch(StackActions.replace('WelcomePage'));

  return (
    <View style={styles.container}>
      <HomeBtn onPress={welcomePage} />
      <Text style={styles.heading}>Administrator</Text>
      <AdminLogin />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  heading: { fontSize: 30, fontWeight: 'bold', color: '#1b1b33' },
});

export default AdminForm;
