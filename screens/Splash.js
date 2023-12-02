import React from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View, Platform } from 'react-native';

export default function SplashScreen() {
    return (
      <View style={styles.container}>
        <LottieView source={require('./animation.json')} autoPlay loop style={{ width: 140, height: 140 }}/>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#008080',
    },
  });