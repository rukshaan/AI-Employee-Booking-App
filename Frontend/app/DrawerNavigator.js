import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useLogin } from './context/LoginProvider';
import Client from './api/Client';
import WorkerDashboard from './components/dashboards/WorkerDashboard';
import EmployeeProfileEdit from './components/employee/EmployeeProfileEdit';
import MyBookings from './components/employee/MyBookings';
import WorkerSettings from './components/employee/WorkerSettings';
import ChatRoom from './components/ChatRoom';

const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const { setIsLoggedIn, profile } = useLogin();
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
        onPress={async () => {
          if (profile?.id) {
            try {
              await Client.put(`/employees/${profile.id}/status`, { status: 'Offline' });
            } catch (err) {
              console.log('Error setting offline status', err);
            }
          }
          setIsLoggedIn(false);
        }}
      >
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerNavigator = () => {
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
      <Drawer.Screen component={WorkerDashboard} name='Dashboard' />
      <Drawer.Screen component={MyBookings} name='Booking Requests' />
      <Drawer.Screen component={EmployeeProfileEdit} name='Edit Profile' />
      <Drawer.Screen component={WorkerSettings} name='Settings' />
      <Drawer.Screen component={ChatRoom} name='ChatRoom' options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;