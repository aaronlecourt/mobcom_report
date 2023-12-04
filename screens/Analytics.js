import React, { useEffect, useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { firebase } from '../config';

const screenWidth = Dimensions.get("window").width;

function Analytics() {
  const [newAssignmentsCount, setNewAssignmentsCount] = useState(0);
  const [missedAssignmentsCount, setMissedAssignmentsCount] = useState(0);
  const [finishedAssignmentsCount, setFinishedAssignmentsCount] = useState(0);
  const [archivedAssignmentsCount, setArchivedAssignmentsCount] = useState(0);

  const [data, setData] = useState({
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      { data: [0, 0, 0, 0, 0, 0, 0], color: () => '#cecece', label: 'Actual'},
      { data: [0, 0, 0, 0, 0, 0, 0], color: () => '#cecece', label: 'Ideal'},
      {
        data: [0], // This will force the Y-axis to start from 0
        color: (opacity = 1) => `rgba(0, 0, 0, 0)`, // Set color to transparent
        strokeWidth: 0
      }
    ]
  });
  useEffect(() => {
    const fetchData = () => {
      try {
        const appRef = firebase.firestore().collection('assignments');
  
        // Listen for real-time updates
        appRef.onSnapshot((snapshot) => {
          if (!snapshot.empty) {
            let totalData = new Array(7).fill(snapshot.size);
            let idealData = [...totalData]; // Copy totalData for the ideal burndown
  
            const currentDate = new Date();
  
            setNewAssignmentsCount(snapshot.docs.filter(doc => !doc.data().isComplete && new Date(doc.data().dueDate) >= currentDate).length);
            setMissedAssignmentsCount(snapshot.docs.filter(doc => !doc.data().isComplete && new Date(doc.data().dueDate) < currentDate).length);
            setFinishedAssignmentsCount(snapshot.docs.filter(doc => doc.data().isComplete).length);
  
            // Fetch and count the archived assignments from the 'archives' collection
            const archivesRef = firebase.firestore().collection('archives');
            archivesRef.onSnapshot((archivesSnapshot) => {
              setArchivedAssignmentsCount(archivesSnapshot.size);
            });
  
            snapshot.forEach((doc) => {
              const assignment = doc.data();
              const createdAt = new Date(assignment.createdAt);
              const dayOfWeek = createdAt.getDay();
            
              if (assignment.isComplete) {
                for (let i = dayOfWeek; i < totalData.length; i++) {
                  totalData[i]--;
                }
              }
            });
            
            // Calculate the ideal burndown
            const decrement = snapshot.size / 6;
            for (let i = 1; i < idealData.length; i++) {
              idealData[i] = idealData[i - 1] - decrement;
            }
  
            setData({
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                { data: totalData, color: () => '#008080', label: 'Actual'},
                { data: idealData, color: () => '#cecece', label: 'Ideal'},
                {
                  data: [0], // This will force the Y-axis to start from 0
                  color: (opacity = 1) => `rgba(0, 0, 0, 0)`, // Set color to transparent
                  strokeWidth: 0
                }
              ]
            });
          } else {
            console.log('No documents found in the collection.');
          }
        });
  
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', }}>
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#008080' }}>
          Burndown Chart for This Week's Tasks
        </Text>
      </View>
      <LineChart
        data={data}
        width={screenWidth}
        height={250}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
          fillShadowGradientOpacity: 0,
          yAxisInterval: 1,
        }}
      />

      <View style={{ paddingHorizontal: 50}}>
        <View style={{ padding: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ display:'flex', flexDirection: 'row', alignItems: 'center'}}>
            <View style={{height: 15, width: 15, borderRadius: 50, backgroundColor: '#cecece'}}></View>
            <Text style={{ marginLeft: 10, fontWeight: 'medium', color: '#5b5b5b' }}>Ideal Burndown</Text>
          </View>
          <View style={{ display:'flex', flexDirection: 'row', alignItems: 'center'}}>
            <View style={{height: 15, width: 15, borderRadius: 50, backgroundColor: '#008080'}}></View>
            <Text style={{ marginLeft: 10, fontWeight: 'medium', color: '#5b5b5b' }}>Actual Burndown</Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
        <View style={{ padding: 10, width: '50%', aspectRatio: 1 }}>
          <View style={{ marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#cecece', padding: 15 }}>
            <Text style={{ fontWeight: 'bold', color: '#008080' }}>Remaining Assignments</Text>
            <Text style={{ fontSize: 50, color: '#3b3b3b', fontWeight:'bold' }}>{newAssignmentsCount}</Text>
          </View>
          <View style={{ marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#cecece', padding: 15 }}>
            <Text style={{ fontWeight: 'bold', color: '#008080' }}>Pending or Missed</Text>
            <Text style={{ fontSize: 50, color: '#3b3b3b', fontWeight:'bold' }}>{missedAssignmentsCount}</Text>
          </View>
        </View>
        <View style={{ padding: 10, width: '50%', aspectRatio: 1 }}>
          <View style={{ marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#cecece', padding: 15 }}>
            <Text style={{ fontWeight: 'bold', color: '#008080' }}>Finished Assignments</Text>
            <Text style={{ fontSize: 50, color: '#3b3b3b', fontWeight:'bold' }}>{finishedAssignmentsCount}</Text>
          </View>
          <View style={{ marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#cecece', padding: 15 }}>
            <Text style={{ fontWeight: 'bold', color: '#008080' }}>Archived Assignments</Text>
            <Text style={{ fontSize: 50, color: '#3b3b3b', fontWeight:'bold' }}>{archivedAssignmentsCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Analytics;