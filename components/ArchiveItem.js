import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ArchiveItem = ({ item }) => {
  return (
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
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#cecece' }}>
            {item.description}
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#cecece' }}>{item.subject}</Text>
        </View>
        <Text style={{ color: '#cecece' }}>
          {item.dueDate} at {item.time}
        </Text>
        {/* has reminder */}
        {item.reminder && (
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

export default ArchiveItem;
