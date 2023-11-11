import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AssignmentItem = ({ item, onToggleCompletion }) => {
  const [isComplete, setIsComplete] = useState(item.isComplete);

  useEffect(() => {
    // Update the completion status when the item prop changes
    setIsComplete(item.isComplete);
  }, [item]);

  const toggleCompletion = () => {
    // Toggle the completion status locally
    setIsComplete(!isComplete);
    // Call the callback to update the parent component's state
    onToggleCompletion(item.id);
  };

  return (
    <View
      style={{
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        display: 'flex',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
      }}
    >
      {/* Toggleable circle button */}
      <TouchableOpacity
        style={{
          marginRight: 10,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={toggleCompletion}
      >
        <Ionicons
          name={isComplete ? 'ios-checkmark-circle' : 'arrow-forward-circle-outline'}
          size={28}
          color={isComplete ? '#cecece' : '#5b5b5b'}
        />
      </TouchableOpacity>

      {/* Assignment details */}
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: isComplete ? '#cecece' : '#5b5b5b' }}>
            {item.description}
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: isComplete ? '#cecece' : '#5b5b5b' }}>{item.subject}</Text>
        </View>
        <Text style={{ color: isComplete ? '#cecece' : '#5b5b5b' }}>
          {item.dueDate} at {item.time}
        </Text>
        {/* has reminder */}
        {item.reminder && (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications-circle-sharp" size={15} color={isComplete ? '#cecece' : 'rgba(0,0,255,1)'} />
            <Text style={{ color: isComplete ? '#cecece' : 'rgba(0,0,255,1)', fontStyle: 'italic' }}>{item.reminder} minutes before due</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AssignmentItem;
