import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { firebase } from '../config';
import AssignmentItem from '../components/AssignmentItem';
import { LineChart } from 'react-native-chart-kit';

function Analytics() {
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
          const { isComplete } = document.data();

          if (isComplete) {
            completedData.push(isComplete);
          } else {
            incompleteData.push(isComplete);
          }
        });

        setIncompleteAssignments(incompleteData);
        setCompletedAssignments(completedData);
      }
    );
  };

  const incompleteTasksCount = incompleteAssignments.length;
  const completedTasksCount = completedAssignments.length;

  // Chart Data
  const chartData = {
    labels: ['Not Complete', 'Complete'],
    datasets: [
      {
        data: [incompleteTasksCount, completedTasksCount],
      },
    ],
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
      {/* Display Analytics */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#008080' }}>Analytics</Text>
        <Text>Not Complete Tasks: {incompleteTasksCount}</Text>
        <Text>Complete Tasks: {completedTasksCount}</Text>
      </View>

      {/* Display Line Chart */}
      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 10, color: '#008080' }}>Task Completion Chart</Text>
        <LineChart
          data={chartData}
          width={300}
          height={200}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Additional UI or components for your Analytics screen */}
      {/* ... */}
    </ScrollView>
  );
}

export default Analytics;
