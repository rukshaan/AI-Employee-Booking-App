

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from './components/WelcomePage';
import AppForm from './components/employee/AppForm';
import { useLogin } from './context/LoginProvider';
import AdminForm from './components/admin/AdminForm';
import EmployeerAppForm from './components/employer/EmployeerAppForm';
import AdminDrawerNavigator from './AdminDrawerNavigator';
import DrawerNavigator from './DrawerNavigator';
import EmployerDrawerNavigator from './EmployerDrawerNavigator';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={WelcomePage} name='WelcomePage' />
      <Stack.Screen component={AppForm} name='AppForm' />
      <Stack.Screen component={AdminForm} name='AdminForm' />
      <Stack.Screen component={EmployeerAppForm} name='EmployeerAppForm' />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { isLoggedIn, adminLoggedIn, employerLoggedIn } = useLogin();

  if (adminLoggedIn) {
    return <AdminDrawerNavigator />;
  }

  if (isLoggedIn) {
    return <DrawerNavigator />;
  }

  if (employerLoggedIn) {
    return <EmployerDrawerNavigator />;
  }

  return <StackNavigator />;
};

export default MainNavigator;
