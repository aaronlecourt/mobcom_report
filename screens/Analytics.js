// Analytics.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Analytics() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
      <Text>Analytics Screen</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Analytics;
