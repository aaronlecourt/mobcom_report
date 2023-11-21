import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../config';

const ArchiveItem = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalData, setAdditionalData] = useState(null); // State to hold additional data
  const archivesRef = firebase.firestore().collection('archives');
  const formattedDueDate = new Date(item.dueDate).toLocaleString();

  const [submissionFormats, setSubmissionFormats] = useState([
    { id: "1", name: "1/4 sheet" },
    { id: "2", name: "1/2 sheet" },
    { id: "3", name: "1 whole sheet" },
    { id: "4", name: "Bond paper" },
    { id: "5", name: "Online" },
  ]);

  const getSubmissionFormatName = (submissionId) => {
    const format = submissionFormats.find((format) => format.id === submissionId);
    return format ? format.name : 'Unknown Format';
  };
  
  useEffect(() => {
    // Fetch additional data when the component mounts
    fetchAdditionalData();
  }, []);

  const fetchAdditionalData = async () => {
    try {
      const doc = await archivesRef.doc(item.id).get(); // Assuming your item has an 'id' property
      if (doc.exists) {
        // Set additional data in the state
        setAdditionalData(doc.data());
      } else {
        console.log('Document not found!');
      }
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    updateStatusBarStyle(!isModalOpen);
  };

  const updateStatusBarStyle = (isModalOpen) => {
    // Update status bar style
    StatusBar.setBarStyle(isModalOpen ? 'light-content' : 'dark-content');

    // Update status bar background color and opacity
    StatusBar.setBackgroundColor(
      isModalOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
      true
    );
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderColor: '#cecece',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1, paddingHorizontal: 5 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#5b5b5b' }}>
                {item.description}
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#5b5b5b' }}>
                {item.subject}
              </Text>
            </View>
            <Text style={{ color: '#5b5b5b' }}>
              {formattedDueDate}
            </Text>
            {item.reminder && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="notifications-circle-sharp" size={15} color="#5b5b5b" />
                <Text style={{ color: '#5b5b5b', fontStyle: 'italic' }}>
                  {item.reminder} minutes before due
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPressOut={toggleModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.desc}>{item.description}</Text>
              <Text></Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.archiveLabel}>Subject:</Text>
                <Text>{item.subject}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.archiveLabel}>Due Date:</Text>
                <Text>{formattedDueDate}</Text>
              </View>
            {item.reminder && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.archiveLabel}>Reminder:</Text>
                <Text>{item.reminder} mins before due</Text>
              </View>
            )}
            {additionalData && (
              <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.archiveLabel}>Submission Type:</Text>
                <Text>{getSubmissionFormatName(additionalData.submission)}</Text>
              </View>

              <Text></Text>
            
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.archiveLabel}>Archived on:</Text>
                <Text>{new Date(additionalData.archivedDate).toLocaleString()}</Text>
              </View>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={{color:'#fff', fontSize: 16, fontWeight: 'bold'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  archiveLabel:{
    fontWeight:'bold',
    color: '#008080'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  closeButton: {
    backgroundColor: "#008080",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 5,
    borderColor: 'rgba(0,128,128,0.3)'
  },
  desc: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080'
  },
});

export default ArchiveItem;
