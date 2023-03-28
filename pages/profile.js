import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import auth from '../firebase';
const StyleProfileScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/photo2.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{auth.currentUser?.email}</Text>
          <Text style={styles.location}>Los Angeles, CA</Text>
        </View>
      </ImageBackground>
      <View style={styles.stats}>
        <Text style={styles.stat}>23K Followers</Text>
        <Text style={styles.stat}>3.2K Following</Text>
        <Text style={styles.stat}>7.5K Likes</Text>
      </View>
      <View style={styles.buttons}>
        <View style={[styles.button, styles.primaryButton]}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            Follow
          </Text>
        </View>
        <View style={[styles.button, styles.secondaryButton]}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Message
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  profileInfo: {
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  location: {
    fontSize: 16,
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ff6600',
  },
  stat: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#ff6600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff6600',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: '#000',
  },
  secondaryButtonText: {
    color: '#ff6600',
  },
});

export default StyleProfileScreen;