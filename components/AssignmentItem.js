import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const AssignmentItem = ({ item, onToggleCompletion }) => {
  const navigation = useNavigation();
  const [localIsComplete, setLocalIsComplete] = useState(item.isComplete);

  const toggleCompletion = async () => {
    try {
      // Update the isComplete property in Firebase
      const appRef = firebase.firestore().collection('assignments');
      await appRef.doc(item.id).update({
        isComplete: !localIsComplete,
      });

      console.log('isComplete updated in Firebase');

      // Update local state after Firebase update
      setLocalIsComplete(prevIsComplete => !prevIsComplete);

      // Call onToggleCompletion with the updated item
      onToggleCompletion(item.id);
    } catch (error) {
      console.error('Error updating isComplete in Firebase: ', error);
    }
  };

  // console.log('Local isComplete:', localIsComplete); // Log the local isComplete

  if (!item) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(' ', { assignmentDetails: item })}
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
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: localIsComplete ? '#cecece' : '#5b5b5b' }}>
            {item.description}
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: localIsComplete ? '#cecece' : '#5b5b5b' }}>
            {item.subject}
          </Text>
        </View>

        <Text style={{ color: localIsComplete ? '#cecece' : '#5b5b5b' }}>
          {item.dueDate} at {item.time}
        </Text>

        {item.reminder && (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name="notifications-circle-sharp"
              size={15}
              color={localIsComplete ? '#cecece' : 'rgba(0,0,255,1)'}
            />
            <Text
              style={{
                color: localIsComplete ? '#cecece' : 'rgba(0,0,255,1)',
                fontStyle: 'italic',
                marginLeft: 5,
              }}
            >
              {item.reminder} minutes before due
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AssignmentItem;
