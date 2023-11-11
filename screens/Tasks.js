import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AssignmentItem from '../components/AssignmentItem';
import { useNavigation } from '@react-navigation/native';

function Tasks() {
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
    },
  ]);

  const navigation = useNavigation();

  const handleAssignmentPress = (item) => {
    navigation.navigate(' ', { assignmentDetails: item });
  };

  const toggleCompletion = (itemId) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((item) =>
        item.id === itemId ? { ...item, isComplete: !item.isComplete } : item
      )
    );
  };

  // filter sections based on the current assignments state
  // add for previous (missed) assignments
  const incompleteAssignments = assignments.filter((item) => !item.isComplete);
  const completeAssignments = assignments.filter((item) => item.isComplete);

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#fff', color: '#5b5b5b' }}>
      <ScrollView>
        {/* Render "Assignments" section */}
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

      {/* Add Button */}
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