import React from 'react';
import { View, Text, TouchableOpacity , TextInput } from 'react-native';
import { firebase } from '../config';
import { useState , useEffect} from 'react';

function AddTaskScreen() {
    const appRef = firebase.firestore().collection("Tasks");
    const [Tasks, setTasks] = useState("");
    const [DueDate, setDueDate] = useState("");
    const [DueTime, setDueTime] = useState("");
    const [Subject, setSubject] = useState("");
    const [Description, setDescription] = useState("");
    const [Submission, setSubmission] = useState("");
    const [IsComplete, setIsComplete] = useState("");
    const [Reminder, setReminder] = useState("");
    //Add to DB
    const addToDB = () => {
      if(!Tasks && !DueDate && !DueTime && !Subject && !Description && !Submission && !IsComplete && !Reminder){
        alert('Empty Field')
        return
      }
    
      const timeStamp = firebase.firestore.FieldValue.serverTimestamp();
      const container = {
        createdAt: timeStamp,
        Tasks:Tasks,
        DueDate: DueDate,
        DueTime: DueTime,
        Subject: Subject,
        Description: Description,
        Submission: Submission,
        IsComplete: IsComplete,
        Reminder: Reminder,
      };
  
      appRef
        .add(container)
        .then(() => {
          alert("Added a record to the Database");
          setTasks("");
          setDueDate("");
          setDueTime("");
          setSubject("");
          setDescription("");
          setSubmission("");
          setIsComplete("");
          setReminder("");
         // Pass the data to the Tasks component
         navigation.navigate('Tasks', { shouldRefresh: true });
        })
        .catch((error) => {
          console.log(error);
        });
    };
    
    //fetch from DB
    const [fetchData, setFetchData] = useState([]);
  
    const fetchFromDB = () => {
      appRef.orderBy("createdAt").onSnapshot((querySnapshot) => {
        const dataContainer = [];
        querySnapshot.forEach((document) => {
          const {
            createdAt,
            Tasks,
            DueDate,
            DueTime,
            Subject,
            Description,
            Submission,
            IsComplete,
            Reminder,
          } = document.data();
          dataContainer.push({
            id: document.id,
            createdAt,
            Tasks,
            DueDate,
            DueTime,
            Subject,
            Description,
            Submission,
            IsComplete,
            Reminder,
          });
        });
        setFetchData(dataContainer);
      });
    };
  
    useEffect(() => {
      fetchFromDB();
    }, []);
    
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
      <Text>Adding Screen</Text>
      <TextInput placeholder='Enter Tasks' style={{borderWidth:1, borderColor:'black', padding:10, margin:10}}
      onChangeText={(value) => setTasks(value)}
      value={Tasks}
      />
      <TextInput placeholder='Enter DueDate' style={{borderWidth:1, borderColor:'black', padding:10, margin:10}}
      onChangeText={(value) => setDueDate(value)}
      value={DueDate}
      />
      <TextInput placeholder='Enter DueTime' style={{borderWidth:1, borderColor:'black', padding:10, margin:10}}
      onChangeText={(value) => setDueTime(value)}
      value={DueTime}
      />
      <TextInput placeholder='Enter Subject' style={{borderWidth:1, borderColor:'black', padding:10, margin:10}}
      onChangeText={(value) => setSubject(value)}
      value={Subject}
      />
      <TextInput placeholder='Enter Description' style={{borderWidth:1, borderColor:'black', padding:10, margin:10}}
      onChangeText={(value) => setDescription(value)}
      value={Description}
      />
      <TextInput placeholder='Enter Submission' style={{borderWidth:1, borderColor:'black', padding:10, margin:10}}
      onChangeText={(value) => setSubmission(value)}
      value={Submission}
      />
      <TextInput placeholder='Enter IsComplete' style={{borderWidth:1, borderColor:'black', padding:10, margin:10}}
      onChangeText={(value) => setIsComplete(value)}
      value={IsComplete}
      />
      <TextInput placeholder='Enter Reminder' style={{borderWidth:1, borderColor:'black', padding:10, margin:10}}
      onChangeText={(value) => setReminder(value)}
      value={Reminder}
      />
        <TouchableOpacity onPress={addToDB}>
            <Text>Add to DB</Text>
        </TouchableOpacity>
       
    </View>
  );
}

export default AddTaskScreen;