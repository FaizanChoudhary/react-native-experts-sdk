import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';

const {width: windowWidth} = Dimensions.get('window');

// TODO: Thresholds are different for MLKit Android
// TODO: Camera preview size takes actual specified size and not the entire screen.

export default function Document() {
  const navigation = useNavigation();

  const scanDocument = () => navigation.navigate('Detection');

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: PREVIEW_MARGIN_TOP,
          // backgroundColor: 'white',
          zIndex: 10,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: PREVIEW_MARGIN_TOP,
          left: 0,
          width: (windowWidth - PREVIEW_SIZE) / 2,
          height: PREVIEW_SIZE,
          // backgroundColor: 'white',
          zIndex: 10,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: PREVIEW_MARGIN_TOP,
          right: 0,
          width: (windowWidth - PREVIEW_SIZE) / 2 + 1,
          height: PREVIEW_SIZE,
          // backgroundColor: 'white',
          zIndex: 10,
        }}
      />
      <View
        style={{
          flex: 1,
          width: '100%',
          height: PREVIEW_SIZE,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IDCardPreviewMask width={'100%'} style={styles.circularProgress} />
      </View>

      <View
        style={{
          position: 'absolute',
          borderWidth: 2,
          borderColor: 'white',
        }}
      />
      <View style={styles.promptContainer}>
        <Text style={styles.faceStatus}>Thank You!</Text>
        <Text style={styles.actionPrompt}>Verifying photo based identity</Text>

        {/* {!loader && (
          <>
            <Text style={styles.actionPrompt}>
              {state.faceDetected && promptsText.performActions}
            </Text>
            <Text style={styles.action}>
              {state.faceDetected &&
                detections[state.detectionsList[state.currentDetectionIndex]]
                  .promptText}
            </Text>
          </>
        )} */}
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.btn} onPress={scanDocument}>
          <Text style={styles.btnText}>Ethy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CameraPreviewMask = (props: SvgProps) => (
  <Svg width={300} height={300} viewBox="0 0 300 300" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M150 0H0v300h300V0H150zm0 0c82.843 0 150 67.157 150 150s-67.157 150-150 150S0 232.843 0 150 67.157 0 150 0z"
      fill="#fff"
    />
  </Svg>
);

const IDCardPreviewMask = (props: SvgProps) => (
  <Svg width={300} height={280} viewBox="0 0 300 280" fill="none" {...props}>
    <Rect x="20" y="20" width="260" height="940" rx="10" ry="10" fill="#000" />
  </Svg>
);

const PREVIEW_MARGIN_TOP = 120;
const PREVIEW_SIZE = 300;

const styles = StyleSheet.create({
  actionPrompt: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    padding: 20,
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  promptContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: PREVIEW_MARGIN_TOP + PREVIEW_SIZE,
    height: '100%',
    width: '100%',
    // backgroundColor: 'white',
    color: 'black',
  },
  faceStatus: {
    fontSize: 28,
    textAlign: 'center',
    paddingTop: 20,
    color: 'black',
  },
  cameraPreview: {
    flex: 1,
  },
  circularProgress: {
    position: 'absolute',
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    top: PREVIEW_MARGIN_TOP,
    alignSelf: 'center',
    zIndex: 10,
  },
  action: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    color: 'grey',
  },
  topLayer: {
    zIndex: 10,
  },
  btn: {
    width: 300,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    backgroundColor: '#334155',
  },
  btnText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 80,
  },
});
