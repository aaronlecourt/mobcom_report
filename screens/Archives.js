import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import ArchiveItem from '../components/ArchiveItem';

const ArchiveScreen = ({ route }) => {
  // Destructuring the 'archive' parameter from the route or setting it to an empty array if not present
  const { archive } = route.params || { archive: [] };

  // Function to save the archive data to a JSON file
  const saveArchiveToFile = async (archiveData) => {
    try {
      // Convert the archive data to a JSON string
      const archiveJson = JSON.stringify(archiveData);
      // Specify the file path in the app's document directory
      const filePath = `${FileSystem.documentDirectory}archive.json`;

      // Write the JSON string to the specified file path
      await FileSystem.writeAsStringAsync(filePath, archiveJson);

      // Log a message indicating that the archive data has been saved to a file
      console.log('Archive data saved to file:', filePath);
    } catch (error) {
      // Log an error message if there's an issue saving the archive data
      console.error('Error saving archive data:', error);
    }
  };

  // Use useEffect to save archive to file and log when archive changes
  useEffect(() => {
    // Save the current archive data to a JSON file when the component is rendered or when the 'archive' prop changes
    saveArchiveToFile(archive);

    // Log a message indicating that the archive has been updated whenever the 'archive' prop changes
    console.log('Archive updated:', archive);
  }, [archive]); // The effect will re-run whenever the 'archive' prop changes

  // Render the main view of the ArchiveScreen component
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
      <ScrollView>
        {/* Display archived assignments using the ArchiveItem component */}
        {archive.length > 0 ? (
          archive.map((item) => (
            <ArchiveItem key={item.id} item={item} />
          ))
        ) : (
          // Display a message if there are no archived assignments
          <Text>No archived assignments</Text>
        )}
      </ScrollView>
    </View>
  );
};

// Export the ArchiveScreen component as the default export
export default ArchiveScreen;
