// Import necessary React and React Native components
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Functional component for displaying individual assignments
const AssignmentItem = ({ item, onToggleCompletion }) => {
  // Local state to track completion status
  const [isComplete, setIsComplete] = useState(item.isComplete);

  useEffect(() => {
    // Update the local completion status when the item prop changes
    setIsComplete(item.isComplete);
  }, [item]);

  // Function to toggle completion status
  const toggleCompletion = () => {
    // Toggle the completion status locally
    setIsComplete(!isComplete);
    // Call the callback to update the parent component's state
    onToggleCompletion(item.id);
  };

  return (
    // Main container view for an assignment item
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
        {/* Ionicons for displaying completion status */}
        <Ionicons
          name={isComplete ? 'ios-checkmark-circle' : 'arrow-forward-circle-outline'}
          size={28}
          color={isComplete ? '#cecece' : '#5b5b5b'}
        />
      </TouchableOpacity>

      {/* Assignment details */}
      <View style={{ flex: 1 }}>
        {/* Row with description and subject, justified space-between */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Text for displaying description */}
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: isComplete ? '#cecece' : '#5b5b5b' }}>
            {item.description}
          </Text>
          {/* Text for displaying subject */}
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: isComplete ? '#cecece' : '#5b5b5b' }}>
            {item.subject}
          </Text>
        </View>

        {/* Text for displaying due date and time */}
        <Text style={{ color: isComplete ? '#cecece' : '#5b5b5b' }}>
          {item.dueDate} at {item.time}
        </Text>

        {/* Check if there's a reminder */}
        {item.reminder && (
          // View for displaying reminder icon and text
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {/* Ionicons for displaying reminder icon */}
            <Ionicons name="notifications-circle-sharp" size={15} color={isComplete ? '#cecece' : 'rgba(0,0,255,1)'} />
            {/* Text for displaying reminder minutes before due */}
            <Text style={{ color: isComplete ? '#cecece' : 'rgba(0,0,255,1)', fontStyle: 'italic' }}>
              {item.reminder} minutes before due
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Export the AssignmentItem component as the default export
export default AssignmentItem;
