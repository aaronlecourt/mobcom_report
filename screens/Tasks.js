import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AssignmentItem from '../components/AssignmentItem';
import { useNavigation } from '@react-navigation/native';

const timeOutDuration = 10000;

function Tasks({ navigation }) {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      dateCreated: '2023-11-11',
      dueDate: '2023-11-20',
      time: '10:00 AM',
      reminder: 5,
      subject: 'APPDEV1',
      description: 'Create a React App',
      submission: 'online',
      isComplete: false,
      dateCompleted: null,
      archiveDate: null,
      archived: false,
    },
    {
      id: 2,
      dateCreated: '2023-11-11',
      dueDate: '2023-11-20',
      time: '3:00 PM',
      reminder: null,
      subject: 'OPSYST1',
      description: 'Research on Linux OS',
      submission: '1/4',
      isComplete: false,
      dateCompleted: null,
      archiveDate: null,
      archived: false,
    },
    {
      id: 3,
      dateCreated: '2023-11-11',
      dueDate: '2023-11-20',
      time: '3:00 PM',
      reminder: null,
      subject: 'AUTHFL1',
      description: 'Create CFGs',
      submission: '1 whole',
      isComplete: false,
      dateCompleted: null,
      archiveDate: null,
      archived: false,
    },
  ]);
  const [archive, setArchive] = useState([]);
  const [timeoutIds, setTimeoutIds] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('white'); // Initial background color

  const handleAssignmentPress = (item) => {
    navigation.navigate(' ', { assignmentDetails: item });
  };

  const toggleCompletion = (itemId) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((item) => {
        if (item.id === itemId) {
          // Clear existing timeout if it exists
          if (timeoutIds[itemId]) {
            clearTimeout(timeoutIds[itemId]);
  
            // Remove the timeout ID from state
            setTimeoutIds((prevTimeoutIds) => {
              const { [itemId]: removedTimeoutId, ...rest } = prevTimeoutIds;
              return rest;
            });
          }
  
          const isComplete = !item.isComplete; // Toggle to its opposite value
          const dateCompleted = isComplete ? new Date().toString() : null;
          const archiveDate = isComplete
            ? new Date(Date.now() + timeOutDuration).toString()
            : null;
  
          let archived = item.archived;
  
          const newAssignment = {
            ...item,
            isComplete,
            dateCompleted,
            archiveDate,
          };
  
          console.log('Old Assignment:', item);
          console.log('New Assignment:', newAssignment);
  
          // If the assignment is marked as complete, schedule a new timeout after 10 seconds
          if (isComplete) {
            const timeoutId = setTimeout(() => {
              // After 10 seconds, change text color to orange
              setBackgroundColor('orange');
  
              // Set archived to true after the 10-second timeout
              archived = !archived;
  
              // Print the updated newAssignment with flipped archived value
              console.log('Updated New Assignment:', {
                ...newAssignment,
                archived,
              });
            }, timeOutDuration);
  
            // Save the timeoutId in state to manage and clear it if needed
            setTimeoutIds((prevTimeoutIds) => ({
              ...prevTimeoutIds,
              [itemId]: timeoutId,
            }));
          }
  
          return { ...newAssignment, archived };
        } else {
          return item;
        }
      })
    );
  };
   
  
  const incompleteAssignments = assignments.filter((item) => !item.isComplete);
  const completeAssignments = assignments.filter((item) => item.isComplete);

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: backgroundColor, color: '#5b5b5b' }}>
      <ScrollView>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#5b5b5b' }}>
            Assignments
          </Text>
          {incompleteAssignments.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleAssignmentPress(item)}>
              <AssignmentItem item={item} onToggleCompletion={() => toggleCompletion(item.id)} />
            </TouchableOpacity>
          ))}
        </View>
            {/* {console.warn('CHECK',assignments)} */}
        {completeAssignments.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#5b5b5b' }}>
              Complete
            </Text>
            {completeAssignments.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => handleAssignmentPress(item)}>
                <AssignmentItem item={item} onToggleCompletion={() => toggleCompletion(item.id)} />
              </TouchableOpacity>
            ))}
          </View>
        )}  
      </ScrollView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: '11%',
          right: 15,
          backgroundColor: 'blue',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
          borderRadius: 100,
          height: 70,
          width: 70,
          borderWidth: 10,
          borderColor: 'rgba(0,0,255,0.1)',
        }}
        onPress={() => {
          // navigation.navigate('AddTask');
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          <Ionicons name="ios-add" size={25} color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Tasks;