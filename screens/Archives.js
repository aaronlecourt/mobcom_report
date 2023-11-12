// Import necessary React and React Native components
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import ArchiveItem from '../components/ArchiveItem';

// Functional component for displaying archived assignments
const ArchiveScreen = ({ route }) => {
  // Extract the 'archive' parameter from the route or set it to an empty array if not present
  const { archive } = route.params || { archive: [] };

  return (
    // Main container view for the ArchiveScreen
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
      {/* Scrollable view for displaying archived assignments */}
      <ScrollView>
        {/* Check if there are archived assignments */}
        {archive.length > 0 ? (
          // Map through the archived assignments and render ArchiveItem component for each
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
