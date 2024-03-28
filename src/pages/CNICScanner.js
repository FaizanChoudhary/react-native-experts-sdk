import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';

const CNICScanner = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const navigation = useNavigation();

  const takeFrontImage = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: true,
        width: 500,
        height: 300,
      });
      setFrontImage(image);
    } catch (error) {
      console.log(error);
    }
  };

  const takeBackImage = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: true,
        width: 500,
        height: 300,
      });
      setBackImage(image);
    } catch (error) {
      console.log(error);
    }
  };

  const validateAndCrop = () => {
    // Check if both front and back images are taken
    // if (!frontImage || !backImage) {
    //   alert('Please take both front and back images.');
    //   return;
    // }
    navigation.navigate('Detection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={takeFrontImage}>
          {frontImage ? (
            <Image source={{uri: frontImage.path}} style={styles.image} />
          ) : (
            <>
              <Text style={styles.placeholderText}>
                Tap to capture CNIC front
              </Text>
              <Video
                source={require('../assets/front.mp4')} // Path to your video file
                style={styles.video}
                repeat={true} // Set to true for looping
                resizeMode="cover" // Adjust the video's aspect ratio
                muted={true} // Mute the audio if needed
              />
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageContainer} onPress={takeBackImage}>
          {backImage ? (
            <Image source={{uri: backImage.path}} style={styles.image} />
          ) : (
            <>
              <Text style={styles.placeholderText}>
                Tap to capture CNIC back
              </Text>
              <Video
                source={require('../assets/back.mp4')} // Path to your video file
                style={styles.video}
                repeat={true} // Set to true for looping
                resizeMode="cover" // Adjust the video's aspect ratio
                muted={true} // Mute the audio if needed
              />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.btn} onPress={validateAndCrop}>
          <Text style={styles.btnText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 100,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 100,
  },
  imageContainer: {
    width: 300,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  video: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: 'white',
    position: 'absolute',
    top: 90,
    zIndex: 10,
  },
  btn: {
    width: 300,
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#334155',
    borderRadius: 50,
  },
  btnText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
});

export default CNICScanner;
