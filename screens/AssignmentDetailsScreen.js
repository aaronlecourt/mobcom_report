// AssignmentDetailsScreen.js
import React from 'react';
import { View, Text } from 'react-native';

const AssignmentDetailsScreen = ({ route }) => {
  const { assignmentDetails } = route.params;

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Assignment Details
      </Text>
      <Text>ID: {assignmentDetails.id}</Text>
      <Text>Date Created: {assignmentDetails.dateCreated}</Text>
      <Text>Due Date: {assignmentDetails.dueDate}</Text>
      <Text>Time: {assignmentDetails.time}</Text>
      <Text>Subject: {assignmentDetails.subject}</Text>
      <Text>Description: {assignmentDetails.description}</Text>
      <Text>Submission: {assignmentDetails.submission}</Text>
      <Text>Is Complete: {assignmentDetails.isComplete ? 'Yes' : 'No'}</Text>
      {assignmentDetails.isComplete && (
        <>
          <Text>Date Completed: {assignmentDetails.dateCompleted}</Text>
          <Text>Expected Archive Date: {assignmentDetails.archiveDate}</Text>
          <Text>Arch: {assignmentDetails.archived ? 'Yes' : 'No'}</Text>
        </>
      )}
    </View>
  );
};

export default AssignmentDetailsScreen;
