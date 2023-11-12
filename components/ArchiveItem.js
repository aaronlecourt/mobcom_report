// Import necessary React and React Native components
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Functional component for displaying individual archived items
const ArchiveItem = ({ item }) => {
  return (
    // Main container view for an archived item
    <View
      style={{
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
      }}
    >
      {/* Left side view for description, subject, and date/time */}
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        {/* Row with description and subject, justified space-between */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#cecece' }}>
            {item.description}
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#cecece' }}>{item.subject}</Text>
        </View>
        {/* Text displaying due date and time */}
        <Text style={{ color: '#cecece' }}>
          {item.dueDate} at {item.time}
        </Text>
        {/* Check if there's a reminder */}
        {item.reminder && (
          // View for displaying reminder icon and text
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications-circle-sharp" size={15} color="#cecece" />
            <Text style={{ color: '#cecece', fontStyle: 'italic' }}>
              {item.reminder} minutes before due
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Export the ArchiveItem component as the default export
export default ArchiveItem;
