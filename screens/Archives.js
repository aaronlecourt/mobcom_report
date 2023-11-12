import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import ArchiveItem from '../components/ArchiveItem';

const ArchiveScreen = ({ route }) => {
  const { archive } = route.params || { archive: [] };

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
