import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import ArchiveItem from '../components/ArchiveItem';
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
};

export default ArchiveScreen;
