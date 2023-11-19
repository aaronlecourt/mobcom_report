import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const AssignmentItem = ({ item, onToggleCompletion }) => {
  const navigation = useNavigation();
  const [localIsComplete, setLocalIsComplete] = useState(item?.isComplete || false);

  const toggleCompletion = async () => {
    try {
      // Update the isComplete property in Firebase
      const appRef = firebase.firestore().collection('assignments');
      const updatedIsComplete = !localIsComplete;

      // Set dateCompleted based on isComplete value
      const updatedData = {
        isComplete: updatedIsComplete,
        dateCompleted: updatedIsComplete ? new Date().toISOString() : null, // Set to current date and time
      };

      await appRef.doc(item.id).update(updatedData);

      console.log('isComplete updated in Firebase');

      // Update local state after Firebase update
      setLocalIsComplete((prevIsComplete) => !prevIsComplete);

      // Call onToggleCompletion with the updated item
      onToggleCompletion(item.id);
    } catch (error) {
      console.error('Error updating isComplete in Firebase: ', error);
    }
  };

  // Format due date and time
  const dueDateTime = new Date(item?.dueDate || 0); // Use a default value if item or dueDate is undefined
  const formattedDueDate = dueDateTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = dueDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Convert dateCompleted to a serializable format
  const serializableDateCompleted = item?.dateCompleted ? item.dateCompleted.toISOString() : null;

  const reminderText =
    item?.reminder && item.reminder > 1
      ? `${item.reminder} minutes before due`
      : `${item.reminder} minute before due`;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(' ', { assignmentDetails: { ...item, dateCompleted: serializableDateCompleted } })
      }
      style={{
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        display: 'flex',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
      }}
    >
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
          name={localIsComplete ? 'ios-checkmark-circle' : 'arrow-forward-circle-outline'}
          size={28}
          color={localIsComplete ? '#cecece' : '#5b5b5b'}
        />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: localIsComplete ? '#cecece' : '#5b5b5b' }}>
          {item?.description?.length > 15 ? `${item.description.substring(0, 15)}...` : item?.description || 'No Description'}
        </Text>

          <Text style={{ fontWeight: 'bold', fontSize: 15, color: localIsComplete ? '#cecece' : '#5b5b5b' }}>
            {item?.subject || 'No Subject'}
          </Text>
        </View>

        <Text style={{ color: localIsComplete ? '#cecece' : '#5b5b5b' }}>
          {formattedDueDate} at {formattedTime}
        </Text>

        {item?.reminder && (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications-circle-sharp" size={15} color={localIsComplete ? '#cecece' : '#008080'} />
            <Text
              style={{
                color: localIsComplete ? '#cecece' : '#008080',
                fontStyle: 'italic',
                fontWeight: '600',
                marginLeft: 0,
              }}
            >
              {reminderText}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AssignmentItem;
