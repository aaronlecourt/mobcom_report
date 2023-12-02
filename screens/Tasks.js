import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { firebase } from '../config';
import AssignmentItem from '../components/AssignmentItem';
import { Ionicons } from '@expo/vector-icons';

export default function Tasks({ navigation }) {
  const appRef = firebase.firestore().collection('assignments');

  const [incompleteAssignments, setIncompleteAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [missedAssignments, setMissedAssignments] = useState([]);

  useEffect(() => {
    pullDataFromFirestore();
  }, []);

  const pullDataFromFirestore = () => {
    appRef.orderBy('createdAt', 'desc').onSnapshot(
      querySnapshot => {
        const incompleteData = [];
        const completedData = [];
        const missedData = [];

        const today = new Date(); // Get current date and time

        querySnapshot.forEach((document) => {
          const { createdAt, description, dueDate, reminder, subject, submission, isComplete, dateCompleted, archivedDate, archived } = document.data();

          const assignment = {
            id: document.id,
            description,
            dueDate,
            reminder,
            subject,
            submission,
            isComplete,
            dateCompleted: dateCompleted ? new Date(dateCompleted) : null,
            archivedDate: archivedDate ? new Date(archivedDate) : null,
            createdAt,
            archived
          };

          if (isComplete) {
            completedData.push(assignment);
          } else {
            const assignmentDueDate = new Date(dueDate); // Convert dueDate string to Date object
            if (assignmentDueDate < today) {
              missedData.push(assignment);
            } else {
              incompleteData.push(assignment);
            }
          }
        });

        setIncompleteAssignments(incompleteData);
        setCompletedAssignments(completedData);
        setMissedAssignments(missedData);
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Display "No more tasks left to do" message when both sections are empty */}
    {incompleteAssignments.length === 0 && missedAssignments.length === 0 && (
      <View style={styles.noTasksContainer}>
        <Text style={styles.noTasksText}>Take a rest! No more tasks left to do.</Text>
        <Image
          source={{ uri: 'https://assets-global.website-files.com/603c87adb15be3cb0b3ed9b5/610e354b42d21a7b18a9270a_41.png' }}
          style={{ width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center', opacity: 0.5 }}
        />
      </View>
    )}
      {/* Remaining Tasks */}
    {incompleteAssignments.length > 0 && (
      <View style={{flex: 1,}}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 10, color: '#008080' }}>Remaining Tasks</Text>
        <ScrollView>
          {incompleteAssignments.map((item) => (
            <AssignmentItem
              key={`incomplete-${item.id}`}
              item={item}
              onToggleCompletion={(itemId) => {
                console.log('Toggle completion for item with ID:', itemId);
              }}
            />
          ))}
        </ScrollView>
      </View>
    )}

    {/* Display Missed Assignments */}
    {missedAssignments.length > 0 && (
      <View style={{}}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#008080' }}>Pending Tasks</Text>
        <ScrollView>
          {missedAssignments.map((item) => (
            <AssignmentItem
              key={`missed-${item.id}`}
              item={item}
              onToggleCompletion={(itemId) => {
                console.log('Toggle completion for missed item with ID:', itemId);
              }}
            />
          ))}
        </ScrollView>
      </View>
    )}

    {/* Completed Tasks */}
    {completedAssignments.length > 0 && (
      <View style={{ flex: 1, paddingBottom: 60 }}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#008080' }}>Completed</Text>
        <ScrollView>
          {completedAssignments.map((item) => (
            <AssignmentItem
              key={`completed-${item.id}`}
              item={item}
              onToggleCompletion={(itemId) => {
                console.log('Toggle completion for item with ID:', itemId);
              }}
            />
          ))}
        </ScrollView>
      </View>
    )}

      {/* Button for adding a new task */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: '11%',
          right: 15,
          backgroundColor: '#008080',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
          borderRadius: 100,
          height: 70,
          width: 70,
          borderWidth: 8,
          borderColor: 'rgba(0,128,128,0.3)',
        }}
        onPress={() => navigation.navigate('Add Assignment')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          <Ionicons name="ios-add" size={25} color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  noTasksContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 16,
    marginTop: 20,
    color: '#cecece',
    textAlign: 'center',
  },
};
