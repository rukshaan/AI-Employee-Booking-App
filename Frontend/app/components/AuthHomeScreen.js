import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLogin } from '../context/LoginProvider';

const AuthHomeScreen = ({ role, onLogout }) => {
  const { profile } = useLogin();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>{role} Dashboard</Text>
      <Text style={styles.subtitle}>Signup and signin are enabled for this role.</Text>
      <Text style={styles.info}>{profile?.name || 'No name available'}</Text>
      <Text style={styles.info}>{profile?.email || 'No email available'}</Text>
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b1b33',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#1b1b33',
    marginBottom: 6,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#1b1b33',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthHomeScreen;
