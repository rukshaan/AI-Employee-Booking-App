import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import { useLogin } from './context/LoginProvider';
import CustomerDashboard from './components/dashboards/CustomerDashboard';
import EmployerProfileEdit from './components/employer/EmployerProfileEdit';
import EmployeeComplain from './components/employer/EmployeeComplain';
import Employment from './components/employer/Employment';
import Discount from './components/employer/Discount';
import MyBookings from './components/employer/MyBookings';
import CustomerSettings from './components/employer/CustomerSettings';
import ChatRoom from './components/ChatRoom';

const Drawer = createDrawerNavigator();   

const CustomDrawer = (props) => {
  const { setEmployerLoggedIn, profile } = useLogin();
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            padding: 20,
            backgroundColor: '#f6f6f6',
            marginBottom: 20,
          }}>
          <View>
            <Image
              source={{ uri: profile?.profileImage || 'https://images.unsplash.com/photo-1624243225303-261cc3cd2fbc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
            <Text>{profile?.name || 'No name'}</Text>
            <Text>{profile?.email || 'No email'}</Text>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          left: 0,
          bottom: 50,
          backgroundColor: '#f6f6f6',
          padding: 20,
        }}
        onPress={() => setEmployerLoggedIn(false)}
      >
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
const EmployerDrawerNavigator = () => {
  const { isDarkMode, toggleTheme } = useLogin();

  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
            <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen component={CustomerDashboard} name='Dashboard' />
      <Drawer.Screen component={Employment} name='Create Booking' />
      <Drawer.Screen component={MyBookings} name='My Bookings' />
      <Drawer.Screen component={EmployerProfileEdit} name='Edit Profile' />
      <Drawer.Screen component={CustomerSettings} name='Settings' />
      <Drawer.Screen component={Discount} name='Discount' />
      <Drawer.Screen component={EmployeeComplain} name='Complain' />
      <Drawer.Screen component={ChatRoom} name='ChatRoom' options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
};

export default EmployerDrawerNavigator;