// Import necessary React and React Native components
import React from 'react';
import { View, Text } from 'react-native';

// Functional component to display assignment details
const AssignmentDetailsScreen = ({ route }) => {
  // Extract assignment details from route parameters
  const { assignmentDetails } = route.params;

  // Extracting time from the due date
  const dueDateTime = new Date(assignmentDetails.dueDate);
  const formattedDueDate = dueDateTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Extracting time from the due date
  const formattedDueTime = dueDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Render the assignment details
  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
      {/* Title */}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
      Description: {assignmentDetails.description}
      </Text>

      {/* Display assignment details */}
      <Text>Due Date: {formattedDueDate}</Text>
      <Text>Time: {formattedDueTime}</Text>
      <Text>Subject: {assignmentDetails.subject}</Text>
      <Text>Reminder: {assignmentDetails.reminder}</Text>
      <Text>Submission: {assignmentDetails.submission}</Text>
      <Text>{assignmentDetails.dateCompleted}</Text>

      {/* Display completion status */}
      <Text>Is Complete: {assignmentDetails.isComplete ? 'Yes' : 'No'}</Text>

      {/* Display additional details if the assignment is complete */}
      {assignmentDetails.isComplete && (
        <>
          <Text>Date Completed: {assignmentDetails.dateCompleted}</Text>
          {/* Note: 'archiveDate' was not present in the provided details */}
        </>
      )}
    </View>
  );
};

// Export the component as the default export
export default AssignmentDetailsScreen;
