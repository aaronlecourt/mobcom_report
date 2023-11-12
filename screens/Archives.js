import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import ArchiveItem from '../components/ArchiveItem';

const ArchiveScreen = ({ route }) => {
  const { archive } = route.params || { archive: [] };

  // Function to save the archive data to a JSON file
  const saveArchiveToFile = async (archiveData) => {
    try {
      const archiveJson = JSON.stringify(archiveData);
      const filePath = `${FileSystem.documentDirectory}archive.json`;

      await FileSystem.writeAsStringAsync(filePath, archiveJson);

      console.log('Archive data saved to file:', filePath);
    } catch (error) {
      console.error('Error saving archive data:', error);
    }
  };

  // Use useEffect to save archive to file and log when archive changes
  useEffect(() => {
    // Save archive to file
    saveArchiveToFile(archive);

    // Log when archive changes
    console.log('Archive updated:', archive);
  }, [archive]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
      <ScrollView>
        {archive.length > 0 ? (
          archive.map((item) => (
            <ArchiveItem key={item.id} item={item} />
          ))
        ) : (
          <Text>No archived assignments</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ArchiveScreen;
