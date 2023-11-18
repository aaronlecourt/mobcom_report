import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, StatusBar, Animated } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { firebase } from '../config';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

const AddAssignmentScreen = ({ navigation }) => {
  const appRef = firebase.firestore().collection('assignments');
  const subjectsRef = firebase.firestore().collection('subjects');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [buttonText, setButtonText] = useState('Show Date and Time Picker');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [submission, setSubmission] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [dateCompleted, setDateCompleted] = useState(null);
  const [archivedDate, setArchivedDate] = useState(null);
  const [archived, setArchived] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [isAddSubjectModalVisible, setAddSubjectModalVisible] = useState(false);
  const [isSubFormatModalVisible, setSubFormatModalVisible] = useState(false);
  const [selectedSubmissionFormat, setSelectedSubmissionFormat] = useState('');
  const [submissionFormats, setSubmissionFormats] = useState([
    { id: '1', name: '1/4 sheet' },
    { id: '2', name: '1/2 sheet' },
    { id: '3', name: '1 whole sheet' },
    { id: '4', name: 'Bond paper' },
    { id: '5', name: 'Online' },
  ]);
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snapshot = await subjectsRef.get();
        const subjectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching subjects: ', error);
      }
    };

    fetchSubjects();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    updateStatusBarStyle(!isModalVisible);
  };

  const toggleSubFormatModal = () => {
    setSubFormatModalVisible(!isSubFormatModalVisible);
    updateStatusBarStyle(!isSubFormatModalVisible);
  };
  
  const toggleAddSubjectModal = () => {
    setAddSubjectModalVisible(!isAddSubjectModalVisible);
    updateStatusBarStyle(!isAddSubjectModalVisible);
  };
  
  const updateStatusBarStyle = (isModalOpen) => {
    // Update status bar style
    StatusBar.setBarStyle(isModalOpen ? 'light-content' : 'dark-content');
  
    // Update status bar background color and opacity
    StatusBar.setBackgroundColor(isModalOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent', true);
  };
  

  const addNewSubject = async () => {
    if (newSubject.trim() === '') {
      alert('Please enter a subject name');
      return;
    }

    try {
      await subjectsRef.add({ name: newSubject });
      alert('Subject added successfully!');
      setNewSubject('');

      // Fetch updated list of subjects
      const snapshot = await subjectsRef.get();
      const subjectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error adding subject: ', error);
    }
  };

  const pushToFirebase = () => {
    // Check if subject is selected
    if (!description || !dueDate || !dueTime || !selectedSubject || !submission) {
      alert('Please fill in all fields, including the due date and subject');
      return;
    }

    // Parse the string dueDate and dueTime to Date objects
    const parsedDueDate = new Date(dueDate);
    const parsedDueTime = new Date(dueTime);

    if (isNaN(parsedDueDate.getTime()) || isNaN(parsedDueTime.getTime())) {
      alert('Invalid due date or time format');
      return;
    }

    const timestamp = new Date().toISOString(); // Convert the current date to string
    const container = {
      createdAt: timestamp,
      description,
      dueDate: parsedDueDate.toISOString(), // Save as a string
      dueTime: parsedDueTime.toISOString(), // Save as a string
      reminder,
      subject: selectedSubject,
      submission,
      isComplete,
      dateCompleted: dateCompleted ? dateCompleted.toISOString() : null,
      archivedDate: archivedDate ? archivedDate.toISOString() : null,
      archived,
    };

    appRef
      .add(container)
      .then(() => {
        setSelectedSubject('');
        setSelectedSubmissionFormat('');
        setSubmission('');
        alert('Successfully added!');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setReminder('');
        setSelectedSubject('');
        setSubmission('');
        setIsComplete(false);
        setDateCompleted(null);
        setArchivedDate(null);
        setArchived(false);
        hideDatePicker();
        hideTimePicker();
        setButtonText('Show Date and Time Picker');
        Keyboard.dismiss();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  // Function to handle the selection of submission format
  const handleSubmissionFormatSelection = (format) => {
    setSelectedSubmissionFormat(format.name);
    toggleSubFormatModal();
    setSubmission(format.name);
  };

  const handleDateConfirm = (dateTime) => {
    setDueDate(dateTime);
    hideDatePicker();
    setButtonText(dateTime.toLocaleString());
  };

  const handleTimeConfirm = (dateTime) => {
    setDueTime(dateTime);
    hideTimePicker();
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      // Remove the subject from the database
      await subjectsRef.doc(subjectId).delete();
  
      // Update the list of subjects
      const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
      setSubjects(updatedSubjects);
    } catch (error) {
      console.error('Error deleting subject: ', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={{ width: '100%', paddingTop: 16 }}>
        <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={toggleAddSubjectModal} style={styles.customPicker}>
                <Text style={{ color: '#5b5b5b' }}>{selectedSubject || 'Select a subject'}</Text>
                <Ionicons name="chevron-down" size={15} color="#5b5b5b" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput 
          placeholder='Enter Assignment here...'
          placeholderTextColor='#cecece'
          style={styles.inputTextDesc}
          onChangeText={(val) => setDescription(val)}
          value={description}
        />

        {/* Add New Subject */}
        <TouchableOpacity onPress={toggleModal} style={styles.addSubjectContainer1}>
            <Ionicons name="add-outline" size={25} color="blue" style={{ marginRight: 5 }} />
            <Text style={styles.addSubjectText}>Add New Subject</Text>
        </TouchableOpacity>

        {/* Show Date Picker */}
        <TouchableOpacity onPress={showDatePicker} style={styles.addSubjectContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar-outline" size={20} color="blue" style={{ marginRight: 10 }} />
                <Text style={styles.inputLabel}>Due Date</Text>
            </View>
          <Text style={styles.buttonText2}>
            {dueDate ? `${dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Select a Date'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />

        {/* Show Time Picker */}
        <TouchableOpacity onPress={showTimePicker} style={styles.addSubjectContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time-outline" size={20} color="blue" style={{ marginRight: 10 }} />
                <Text style={styles.inputLabel}>Due Time</Text>
            </View>
          <Text style={styles.buttonText2}>
            {dueTime ? `${dueTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : 'Select Time'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />

        <View style={styles.addSubjectContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="alarm-outline" size={20} color="blue" style={{ marginRight: 10 }} />
                <Text style={styles.inputLabel}>Set Reminder before Due</Text>
            </View>
            <TextInput 
                placeholder={reminder ? `${reminder}` : 'in minutes'}
                placeholderTextColor='#cecece'
                style={styles.buttonText2}
                onChangeText={(val) => setReminder(val)}
                value={reminder}
                keyboardType='numeric'
            />
        </View>

        {/* <TextInput 
          placeholder='Submission'
          style={styles.inputText}
          onChangeText={(val) => setSubmission(val)}
          value={submission}
        /> */}

        {/* Submission Format Container */}
      <TouchableOpacity onPress={toggleSubFormatModal} style={styles.addSubjectContainer2}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="document-attach-outline" size={20} color="blue" style={{ marginRight: 10 }} />
          <Text style={styles.inputLabel}>Submission Format</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#cecece' }}>{selectedSubmissionFormat || 'Select Submission Format'}</Text>
          <Ionicons name="chevron-down" size={15} color="#cecece" style={{ marginLeft: 5 }} />
        </View>
      </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={pushToFirebase}
        >
          <Text style={styles.buttonText}>Add Assignment</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding a new subject */}
      <Modal    isVisible={isModalVisible} 
                onBackdropPress={toggleModal}
                animationIn="fadeIn" 
                animationOut="fadeOut"  
                animationInTiming={10}
                animationOutTiming={10}
                backdropOpacity={0.5}
                useNativeDriver={true}>
        <Animated.View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Subject</Text>
            <Ionicons
              name="close-outline"
              size={25}
              color="#cecece"
              onPress={toggleModal}
              style={{ marginBottom: 15 }}
            />
          </View>
          <TextInput 
            placeholder='Subject Name'
            style={styles.modalInput}
            onChangeText={(val) => setNewSubject(val)}
            value={newSubject}
          />
          <TouchableOpacity onPress={addNewSubject} style={styles.modalButton}>
            <Text style={styles.buttonText}>Add Subject</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      {/* Modal for selecting a subject */}
      <Modal    isVisible={isAddSubjectModalVisible} 
                onBackdropPress={toggleAddSubjectModal}
                animationIn="fadeIn" 
                animationOut="fadeOut"  
                animationInTiming={10}
                animationOutTiming={10} 
                backdropOpacity={0.5}
                useNativeDriver={true}>
        <Animated.View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose a Subject</Text>
            <Ionicons
              name="close-outline"
              size={25}
              color="#5b5b5b"
              onPress={toggleAddSubjectModal}
              style={{ marginBottom: 15 }}
            />
          </View>
          
          {/* Render your subject list here */}
          <View style={styles.subjectContainer}>
            {subjects.map(subject => (
                <TouchableOpacity
                key={subject.id}
                style={styles.subjectItem}
                onPress={() => {
                    setSelectedSubject(subject.name);
                    toggleAddSubjectModal();
                }}
                >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: '400' }}>{subject.name}</Text>
                    <Ionicons
                    name="close-outline"
                    size={20}
                    color="white"
                    style={{ marginLeft: 10 }}
                    onPress={() => handleDeleteSubject(subject.id)}
                    />
                </View>
                </TouchableOpacity>
            ))}
            </View>
        </Animated.View>
      </Modal>


      {/* Submission Format Modal */}
      <Modal
        isVisible={isSubFormatModalVisible}
        onBackdropPress={toggleSubFormatModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={10}
        animationOutTiming={10}
        backdropOpacity={0.5}
        useNativeDriver={true}
      >
        <Animated.View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Submission Format</Text>
            <Ionicons
              name="close-outline"
              size={25}
              color="#5b5b5b"
              onPress={toggleSubFormatModal}
              style={{ marginBottom: 15 }}
            />
          </View>

          {/* Render your submission format list here */}
          <View style={styles.subjectContainer}>
            {submissionFormats.map((format) => (
              <TouchableOpacity
                key={format.id}
                style={styles.subjectItem}
                onPress={() => handleSubmissionFormatSelection(format)} // Use the new function
              >
                <Text style={{ color: 'white', fontWeight: '400' }}>{format.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputText: {
    borderRadius: 10, 
    fontSize: 16,
    width: '100%',
    borderBottomWidth: 1.5,
    paddingHorizontal: 5,
    paddingVertical: 14,
    borderColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTextDesc: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 2,
    fontSize: 25,
    fontWeight:'bold',
    width: '100%',
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  addSubjectText: {
    color: 'blue',
    fontSize: 16,
    fontWeight:'500'
  },
  addSubjectContainer2: {
    borderBottomWidth: 1.5,
    paddingHorizontal: 5,
    paddingVertical: 16,
    borderColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  addSubjectContainer1: {
    borderBottomWidth: 1.5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addSubjectContainer: {
    borderBottomWidth: 1.5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  customPicker: {
    borderWidth:1,
    borderColor: 'rgba(0,0,0,0.125)',
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 16,
    alignSelf: 'flex-start'
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical:5,
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText2: {
    color: '#cecece',
    paddingVertical: 10,
    fontSize: 15,
    // fontWeight: '500',
  },
  // Modal styles
  modalContainer: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#5b5b5b',
  },
  modalInput: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    fontSize: 16,
    borderRadius: 10,
    width: '100%',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: 'blue',
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    marginTop: 8,
  },
  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // Add this line
  },
  subjectItem: {
    backgroundColor:'blue',
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  inputLabel:{
    fontSize: 16,
    color: 'blue',
    fontWeight:'500',
  },
});

export default AddAssignmentScreen;
