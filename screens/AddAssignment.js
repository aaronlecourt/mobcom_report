import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { firebase } from '../config';
import { Keyboard } from 'react-native';

const AddAssignmentScreen = ({ navigation }) => {
  const appRef = firebase.firestore().collection('assignments');

  const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);

  const showDateTimePicker = () => {
    setDateTimePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
  };

  const handleDateTimeConfirm = (dateTime) => {
    setDueDate(dateTime);
    hideDateTimePicker();
  };

  const [userInput, setUserInput] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [reminder, setReminder] = useState('');
  const [subject, setSubject] = useState('');
  const [submission, setSubmission] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [dateCompleted, setDateCompleted] = useState(null);
  const [archivedDate, setArchivedDate] = useState(null);

  const pushToFirebase = () => {
    if (!userInput || !description || !subject || !submission) {
      alert('Please fill in all fields');
      return;
    }

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const container = {
      createdAt: timestamp,
      userInput,
      description,
      dueDate: dueDate.toString(),
      reminder,
      subject,
      submission,
      isComplete,
      dateCompleted: dateCompleted ? dateCompleted.toString() : null,
      archivedDate: archivedDate ? archivedDate.toString() : null,
    };

    appRef.add(container).then(() => {
      alert('Successfully added!');
      setUserInput('');
      setDescription('');
      setDueDate(new Date());
      setReminder('');
      setSubject('');
      setSubmission('');
      setIsComplete(false);
      setDateCompleted(null);
      setArchivedDate(null);
      hideDateTimePicker();
      Keyboard.dismiss();
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', paddingTop: 16 }}>
        <Text>Add New Assignment</Text>
        <TextInput 
          placeholder='User Input'
          style={styles.inputText}
          onChangeText={(val) => setUserInput(val)}
          value={userInput}
        />
        <TextInput 
          placeholder='Description'
          style={styles.inputText}
          onChangeText={(val) => setDescription(val)}
          value={description}
        />
        <TouchableOpacity onPress={showDateTimePicker}>
          <Text>Show Date and Time Picker</Text>
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
