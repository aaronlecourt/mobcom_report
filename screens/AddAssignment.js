import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { firebase } from '../config';
import { Keyboard } from 'react-native';

const AddAssignmentScreen = ({ navigation }) => {
  const appRef = firebase.firestore().collection('assignments');

  const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [buttonText, setButtonText] = useState('Show Date and Time Picker');

  const showDateTimePicker = () => {
    setDateTimePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
  };

  const handleDateTimeConfirm = (dateTime) => {
    setDueDate(dateTime);
    hideDateTimePicker();
    setButtonText(dateTime.toLocaleString());
  };

  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState('');
  const [subject, setSubject] = useState('');
  const [submission, setSubmission] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [dateCompleted, setDateCompleted] = useState(null);
  const [archivedDate, setArchivedDate] = useState(null);
  const [archived, setArchived] = useState(false);

  const pushToFirebase = () => {
    if (!description || !dueDate || !subject || !submission) {
      alert('Please fill in all fields, including the due date');
      return;
    }
  
    // Parse the string dueDate to a Date object
    const parsedDueDate = new Date(dueDate);
  
    if (isNaN(parsedDueDate.getTime())) {
      alert('Invalid due date format');
      return;
    }
  
    const timestamp = new Date().toISOString(); // Convert the current date to string
    const container = {
      createdAt: timestamp,
      description,
      dueDate: parsedDueDate.toISOString(), // Save as a string
      reminder,
      subject,
      submission,
      isComplete,
      dateCompleted: dateCompleted ? dateCompleted.toISOString() : null,
      archivedDate: archivedDate ? archivedDate.toISOString() : null,
      archived,
    };
  
    appRef
      .add(container)
      .then(() => {
        alert('Successfully added!');
        setDescription('');
        setDueDate(''); // Clear the dueDate input after successful submission
        setReminder('');
        setSubject('');
        setSubmission('');
        setIsComplete(false);
        setDateCompleted(null);
        setArchivedDate(null);
        setArchived(false);
        hideDateTimePicker();
        setButtonText('Show Date and Time Picker');
        Keyboard.dismiss();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', paddingTop: 16 }}>
        <Text>Add New Assignment</Text>
        <TextInput 
          placeholder='Description'
          style={styles.inputText}
          onChangeText={(val) => setDescription(val)}
          value={description}
        />
        <TouchableOpacity onPress={showDateTimePicker}>
          <Text>{buttonText}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          mode="datetime"
          onConfirm={handleDateTimeConfirm}
          onCancel={hideDateTimePicker}
        />
        <TextInput 
          placeholder='Reminder'
          style={styles.inputText}
          onChangeText={(val) => setReminder(val)}
          value={reminder}
        />
        <TextInput 
          placeholder='Subject'
          style={styles.inputText}
          onChangeText={(val) => setSubject(val)}
          value={subject}
        />
        <TextInput 
          placeholder='Submission'
          style={styles.inputText}
          onChangeText={(val) => setSubmission(val)}
          value={submission}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={pushToFirebase}
        >
          <Text>Add to Database</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 35
  },
  inputText: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    fontSize: 16,
    width: '100%'
  },
  submitButton: {
    backgroundColor: 'gray',
    padding: 16,
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    marginTop: 8
  }
});

export default AddAssignmentScreen;
