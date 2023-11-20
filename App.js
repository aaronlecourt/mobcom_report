// Import necessary React and React Navigation components
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//screen imports
import TasksScreen from './screens/Tasks';
import AnalyticsScreen from './screens/Analytics';
import ArchiveScreen from './screens/Archives';
import AssignmentDetailsScreen from './screens/AssignmentDetailsScreen';

import { Ionicons } from '@expo/vector-icons';
import AddTaskScreen from './screens/AddTaskScreen';

// Initialize Bottom Tab Navigator and Native Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Define icons for each tab
const screenOptions = {
  Tasks: 'ios-checkmark-circle',
  Analytics: 'ios-analytics',
  Archive: 'ios-archive',
};

// Main App component
const App = () => {
  return (
    // Wrap the app with NavigationContainer
    <NavigationContainer>
      {/* Stack Navigator for handling screens and transitions */}
      <Stack.Navigator initialRouteName="Main" screenOptions={{ animation: 'slide_from_right' }}>
        {/* Main screen with Bottom Tab Navigator */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        {/* Screen for displaying assignment details */}
        <Stack.Screen
          name="AssignmentDetails"
          component={AssignmentDetailsScreen}
        />

          <Stack.Screen
          name="AddTasks"
          component={AddTaskScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Bottom Tab Navigator component
const TabNavigator = ({ navigation, route }) => {
  return (
    // Bottom Tab Navigator with screen options
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Customize tab icons
        tabBarIcon: ({ color, size }) => {
          const iconName = screenOptions[route.name];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Customize tab bar style
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#fff',
          paddingBottom: 15,
          paddingTop: 10,
          height: 70,
        },
        tabBarActiveTintColor: 'blue', // Active tab color
        tabBarInactiveTintColor: 'grey', // Inactive tab color
        tabBarLabelStyle: {
          fontSize: 13,
        },
      })}
    >
      {/* Screen for displaying tasks */}
      <Tab.Screen name="Tasks">
        {() => <TasksScreen navigation={navigation} route={route} />}
        {/* {() => <TasksScreen navigation={navigation} route={route} />}: This is a functional component that renders the TasksScreen. It passes the navigation and route props to TasksScreen, allowing it to access navigation functions and route parameters. */}
      </Tab.Screen>

      {/* Screen for analytics */}
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />

      {/* Screen for displaying archived tasks */}
      <Tab.Screen name="Archive">
        {(props) => <ArchiveScreen {...props} route={route} />}
        {/* {(props) => <ArchiveScreen {...props} route={route} />}: This is a functional component that renders the ArchiveScreen. It uses the spread operator ({...props}) to pass down all the navigation props (like navigation, route, etc.) to the ArchiveScreen, and it also explicitly passes the route prop. */}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Export the App component as the default export
export default App;
