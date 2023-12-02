import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import ArchiveItem from '../components/ArchiveItem';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { firebase } from '../config';

const ArchiveScreen = () => {
  const [archive, setArchive] = useState([]);

  useEffect(() => {
    // Fetch archived assignments from Firebase
    const archiveRef = firebase.firestore().collection('archives'); // Replace with your actual collection name

    const unsubscribe = archiveRef.orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
      const archivedData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          // Add other fields you want to retrieve
          description: data.description,
          subject: data.subject,
          dueDate: data.dueDate,
          time: data.time,
          reminder: data.reminder,
          // Add other fields as needed
        };
      });

      setArchive(archivedData);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect will run once, similar to componentDidMount

  const downloadArchive = async () => {
    const fileUri = FileSystem.documentDirectory + 'archive.json';
    const data = JSON.stringify(archive);
  
    await FileSystem.writeAsStringAsync(fileUri, data);
  
    Alert.alert(
      'Download Complete',
      'Archive downloaded to ' + fileUri,
      [
        { text: 'OK' }
      ]
    );
  };
  
  const shareArchive = async () => {
    const fileUri = FileSystem.documentDirectory + 'archive.json';
  
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }
  
    await Sharing.shareAsync(fileUri);
  };

  const clearArchive = () => {
    Alert.alert(
      'Clear Archive',
      'Are you sure you want to clear the archive?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            // Replace with your actual collection name
            const archiveRef = firebase.firestore().collection('archives');
  
            // Delete all documents in the archive
            const batch = firebase.firestore().batch();
  
            const snapshot = await archiveRef.get();
            snapshot.docs.forEach((doc) => {
              batch.delete(doc.ref);
            });
  
            await batch.commit();
  
            alert('Archive cleared');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 15 }}>
      <ScrollView>
        {archive.length > 0 ? (
          archive.map((item) => <ArchiveItem key={item.id} item={item} />)
        ) : (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No archived assignments.</Text>
            <Image
              source={{ uri: 'https://uploads-ssl.webflow.com/603c87adb15be3cb0b3ed9b5/610e3519a3183bc099ae844f_40.png' }}
              style={{ width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center', opacity: 0.5 }}
            />
          </View>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={styles.button} onPress={downloadArchive}>
          <Text style={styles.buttonText}>Download Archive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareArchive}>
          <Text style={styles.buttonText}>Share Archive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearArchive}>
          <Text style={styles.buttonText}>Clear Archive</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
      
    </View>
  );
};

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
  button: {
    backgroundColor: '#008080', // Change as desired
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    margin: 5,
    justifyContent:'center'
  },
  clearButton: {
    backgroundColor: '#ff0000', // Change as desired
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    margin: 5,
    justifyContent:'center'
  },
  buttonText: {
    color: 'white', // Change as desired
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'medium'
  },
};

export default ArchiveScreen;

