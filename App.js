import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TasksScreen from './screens/Tasks';
import AnalyticsScreen from './screens/Analytics';
import ArchiveScreen from './screens/Archives';
import AssignmentDetailsScreen from './screens/AssignmentDetailsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  Tasks: 'ios-checkmark-circle',
  Analytics: 'ios-analytics',
  Archive: 'ios-archive',
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={{ animation: 'slide_from_right' }}>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AssignmentDetails"
          component={AssignmentDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TabNavigator = ({ navigation, route }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = screenOptions[route.name];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#fff',
          paddingBottom: 15,
          paddingTop: 10,
          height: 70,
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 13,
        },
      })}
    >
      <Tab.Screen name="Tasks">
        {() => <TasksScreen navigation={navigation} route={route} />}
      </Tab.Screen>
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Archive">
        {(props) => <ArchiveScreen {...props} route={route} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default App;