// Import necessary React and React Native components and libraries
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icon usage
import AssignmentItem from '../components/AssignmentItem'; // Import custom AssignmentItem component
import { useNavigation } from '@react-navigation/native';

// Set the timeout duration for assignment completion
const timeOutDuration = 10000; //10seconds for demo

//other timeout values: 10sec = 10000, 30sec=30000, 1hr = 1 * 60 * 60 * 1000, 1day = 1 * 24 * 60 * 60 * 1000, 10days = 10 * 24 * 60 * 60 * 1000, 15days = 15 * 24 * 60 * 60 * 1000, 30days = 30 * 24 * 60 * 60 * 1000

// Functional component for displaying tasks and assignments
function Tasks({ navigation, route }) {
  // State variables to manage assignments, archive, timeouts, and background color
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
  ]); // Initial assignments data
  const [archive, setArchive] = useState([]); // Archived assignments
  const [timeoutIds, setTimeoutIds] = useState({}); // Timeout IDs for managing timeouts
  const [backgroundColor, setBackgroundColor] = useState('white'); // Initial background color

  // Function to handle navigation to AssignmentDetails screen on assignment press
  const handleAssignmentPress = (item) => {
    navigation.navigate('AssignmentDetails', { assignmentDetails: item });
  };

  // Effect to update navigation params when the 'archive' state changes
  useEffect(() => {
    navigation.setParams({ archive });
  }, [archive]);

  // Function to toggle completion status of an assignment
  const toggleCompletion = (itemId) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((item) => {
        if (item.id === itemId) {
          // Clear existing timeout if it exists
          if (timeoutIds[itemId]) {
            clearTimeout(timeoutIds[itemId]);
            setTimeoutIds((prevTimeoutIds) => {
              const { [itemId]: removedTimeoutId, ...rest } = prevTimeoutIds;
              return rest;
            });
          }

          // Update assignment details based on completion status
          const isComplete = !item.isComplete;
          const dateCompleted = isComplete ? new Date().toString() : null;
          const archiveDate = isComplete ? new Date(Date.now() + timeOutDuration).toString() : null;

          let archived = item.archived;

          const newAssignment = {
            ...item,
            isComplete,
            dateCompleted,
            archiveDate,
          };

          // If the assignment is marked as complete, schedule a new timeout after 10 seconds
          if (isComplete) {
            const timeoutId = setTimeout(() => {
              archived = !archived;

              // Move the completed assignment to the archive array
              setArchive((prevArchive) => [...prevArchive, { ...newAssignment, archived }]);
              
              // Remove the completed assignment from the assignments array
              setAssignments((prevAssignments) => prevAssignments.filter((a) => a.id !== itemId));
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

  // Filter assignments based on completion status
  const incompleteAssignments = assignments.filter((item) => !item.isComplete);
  const completeAssignments = assignments.filter((item) => item.isComplete);

  // Render the component
  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: backgroundColor, color: '#5b5b5b' }}>
      <ScrollView>
        {/* Display incomplete assignments */}
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

        {/* Display complete assignments if any */}
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

        {/* Display archived assignments */}
        {/* <Archives archive={archive} /> */}

      </ScrollView>

      {/* Button for adding a new task */}
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

// Export the component as the default export
export default Tasks;
