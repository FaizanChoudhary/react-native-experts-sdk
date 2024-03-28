import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import {Text, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useNavigation} from '@react-navigation/native';
import {PERMISSIONS, check, request} from 'react-native-permissions';
import Svg, {Path} from 'react-native-svg';
// import {scanFaces} from 'vision-camera-trustee-face-detector-v3';
// import {scanFaces, Face} from 'vision-camera-face-detector';

const {width: windowWidth} = Dimensions.get('window');

const detectionReducer = (state, action) => {
  switch (action.type) {
    case 'FACE_DETECTED':
      return {...state, faceDetected: true};
    case 'PROCESS_COMPLETE':
      return {...state, processComplete: true};
    default:
      throw new Error('Unexpected action type.');
  }
};

const Home = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [state, dispatch] = useReducer(detectionReducer, initialState);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigation = useNavigation();
  const device = useCameraDevice('front');
  const rect = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const grants = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          setHasPermission(grants === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.warn(err);
          return;
        }
      } else {
        const result = await check(PERMISSIONS.IOS.CAMERA);
        if (result === 'granted') {
          setHasPermission(result === 'granted');
          ///
        } else {
          request(PERMISSIONS.IOS.CAMERA).then(result => {
            console.log('result =>', result);
            setHasPermission(result === 'granted');
          });
        }
      }
    };

    requestPermissions();
  }, []);

  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setTimeout(() => {
        // delay so we can see progress fill aniamtion (500ms)
        navigation.navigate('Home', {
          photo: photo.uri,
        });
      }, 750);
    }
  };

  // const onFacesDetected = frame => {
  //   console.log('====================================');
  //   console.log(frame);
  //   console.log('====================================');
  //   if (frame.faces.length > 0) {
  //     dispatch({type: 'FACE_DETECTED'});
  //     captureImage();
  //   }
  // };
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    console.log(frame.toString());
  }, []);

  if (!hasPermission) {
    return <Text style={{color: 'black'}}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: PREVIEW_MARGIN_TOP,
          backgroundColor: 'white',
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
          backgroundColor: 'white',
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
          backgroundColor: 'white',
          zIndex: 10,
        }}
      />
      <View
        style={{
          width: '100%',
          height: PREVIEW_SIZE * 1.5,
        }}>
        <Camera
          ref={cameraRef}
          style={styles.cameraPreview}
          device={device}
          isActive={!!device}
          frameProcessor={frameProcessor}
          //pixel format should be either yuv or rgb
          pixelFormat="yuv"
        />
        <CameraPreviewMask width={'100%'} style={styles.circularProgress} />
        <AnimatedCircularProgress
          style={styles.circularProgress}
          size={PREVIEW_SIZE}
          width={5}
          backgroundWidth={7}
          fill={state.progressFill}
          tintColor="#3485FF"
          backgroundColor="#e8e8e8"
        />
      </View>
      <View
        ref={rect}
        style={{
          position: 'absolute',
          borderWidth: 2,
          borderColor: 'white',
        }}
      />
      <View style={styles.promptContainer}>
        <Text style={styles.faceStatus}>
          {!state.faceDetected && promptsText.noFaceDetected}
        </Text>
        <Text style={styles.actionPrompt}>
          {state.faceDetected && promptsText.performActions}
        </Text>
        <Text style={styles.action}>Align face in center</Text>
      </View>
    </View>
  );
};

const CameraPreviewMask = props => (
  <Svg width={300} height={300} viewBox="0 0 300 300" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M150 0H0v300h300V0H150zm0 0c82.843 0 150 67.157 150 150s-67.157 150-150 150S0 232.843 0 150 67.157 0 150 0z"
      fill="#fff"
    />
  </Svg>
);
const promptsText = {
  noFaceDetected: 'No face detected',
  performActions: 'Perform the following actions:',
};
const PREVIEW_MARGIN_TOP = 100;
const PREVIEW_SIZE = 300;

const detectionsList = ['BLINK'];
const initialState = {
  faceDetected: false,
  promptText: promptsText.noFaceDetected,
  detectionsList,
  currentDetectionIndex: 0,
  progressFill: 0,
  processComplete: false,
};

const styles = StyleSheet.create({
  actionPrompt: {
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  promptContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: PREVIEW_MARGIN_TOP + PREVIEW_SIZE,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  faceStatus: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
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
  },
  action: {
    color: 'grey',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  topLayer: {
    zIndex: 10,
  },
});

export default Home;
