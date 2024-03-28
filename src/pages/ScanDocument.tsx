import * as React from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';

const ScanDocument = () => {
  const [scannedImage, setScannedImage] = React.useState();

  const scanDocument = async () => {
    if (
      Platform.OS === 'android' &&
      (await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      )) !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      Alert.alert(
        'Error',
        'User must grant camera permissions to use document scanner.',
      );
      return;
    }
    const {scannedImages} = await DocumentScanner.scanDocument({
      croppedImageQuality: 50,
    });
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0]);
    }
  };

  React.useEffect(() => {
    // call scanDocument on load
    scanDocument();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {scannedImage && (
        <Image
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
          source={{uri: scannedImage}}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});

export default ScanDocument;
