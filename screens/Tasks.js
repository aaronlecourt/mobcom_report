// Import necessary React and React Native components
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { firebase } from '../config';
import AssignmentItem from '../components/AssignmentItem'; // Import the AssignmentItem component
import { Ionicons } from '@expo/vector-icons';

// Functional component for handling tasks
export default function Tasks({ navigation }) {
  const appRef = firebase.firestore().collection('assignments');

  const [incompleteAssignments, setIncompleteAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);

  useEffect(() => {
    pullDataFromFirestore();
  }, []);

  const pullDataFromFirestore = () => {
    appRef.orderBy('createdAt', 'desc').onSnapshot(
      querySnapshot => {
        const incompleteData = [];
        const completedData = [];

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
            incompleteData.push(assignment);
          }
        });

        setIncompleteAssignments(incompleteData);
        setCompletedAssignments(completedData);
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 16, flex: 1 }}>
        {incompleteAssignments.length > 0 ? (
          <>
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 10 }}>Remaining Tasks</Text>
            <FlatList
              data={incompleteAssignments}
              renderItem={({ item }) => (
                <AssignmentItem
                  key={`incomplete-${item.id}`} // Ensure a unique key for incomplete assignments
                  item={item}
                  onToggleCompletion={(itemId) => {
                    console.log('Toggle completion for item with ID:', itemId);
                  }}
                />
              )}
              keyExtractor={(item) => `incomplete-${item.id}`} // Ensure a unique key for incomplete assignments
            />
          </>
        ) : (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>Take a rest! No more tasks left to do.</Text>
            <Image
              source={{ uri: 'https://assets-global.website-files.com/603c87adb15be3cb0b3ed9b5/610e354b42d21a7b18a9270a_41.png' }}
              style={{ width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center', opacity: 0.5}}
            />
            
          </View>
        )}

        {completedAssignments.length > 0 && (
          <>
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Completed</Text>
            <FlatList
              data={completedAssignments}
              renderItem={({ item }) => (
                <AssignmentItem
                  key={`completed-${item.id}`} // Ensure a unique key for completed assignments
                  item={item}
                  onToggleCompletion={(itemId) => {
                    console.log('Toggle completion for item with ID:', itemId);
                  }}
                />
              )}
              keyExtractor={(item) => `completed-${item.id}`} // Ensure a unique key for completed assignments
            />
          </>
        )}
      </View>
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
