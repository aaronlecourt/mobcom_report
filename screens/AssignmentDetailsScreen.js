// Import necessary React and React Native components
import React from 'react';
import { View, Text } from 'react-native';

// Functional component to display assignment details
const AssignmentDetailsScreen = ({ route }) => {
  // Extract assignment details from route parameters
  const { assignmentDetails } = route.params;

  // Render the assignment details
  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
      {/* Title */}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Assignment Details
      </Text>

      {/* Display assignment details */}
      <Text>ID: {assignmentDetails.id}</Text>
      <Text>Date Created: {assignmentDetails.dateCreated}</Text>
      <Text>Due Date: {assignmentDetails.dueDate}</Text>
      <Text>Time: {assignmentDetails.time}</Text>
      <Text>Subject: {assignmentDetails.subject}</Text>
      <Text>Description: {assignmentDetails.description}</Text>
      <Text>Submission: {assignmentDetails.submission}</Text>

      {/* Display completion status */}
      <Text>Is Complete: {assignmentDetails.isComplete ? 'Yes' : 'No'}</Text>

      {/* Display additional details if the assignment is complete */}
      {assignmentDetails.isComplete && (
        <>
          <Text>Date Completed: {assignmentDetails.dateCompleted}</Text>
          <Text>Expected Archive Date: {assignmentDetails.archiveDate}</Text>
        </>
      )}
    </View>
  );
};

// Export the component as the default export
export default AssignmentDetailsScreen;
