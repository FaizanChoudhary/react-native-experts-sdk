import {useNavigation} from '@react-navigation/native';
import {Camera, FaceDetectionResult} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import LottieView from 'lottie-react-native';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Svg, {Path, SvgProps} from 'react-native-svg';
// import Video from 'react-native-video';

const {width: windowWidth} = Dimensions.get('window');

// TODO: Thresholds are different for MLKit Android
// TODO: Camera preview size takes actual specified size and not the entire screen.

interface FaceDetection {
  bounds: {
    origin: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
  };
}

interface Action<T extends keyof Actions> {
  type: T;
  value: Actions[T];
}
interface Actions {
  FACE_DETECTED: 'yes' | 'no';
}

const detectionReducer = (
  state: typeof initialState,
  action: Action<keyof Actions>,
): typeof initialState => {
  switch (action.type) {
    case 'FACE_DETECTED':
      if (action.value === 'yes') {
        return {
          ...state,
          faceDetected: true,
          processComplete: true,
          progressFill: 100,
        };
      } else {
        // Reset
        return initialState;
      }
    default:
      throw new Error('Unexpeceted action type.');
  }
};

const promptsText = {
  noFaceDetected:
    "Please center your face in the camera preview and align it with the screen's center.",
  performActions: 'Please hold a second while we are verifying you.',
};

const initialState = {
  faceDetected: false,
  promptText: promptsText.noFaceDetected,
  currentDetectionIndex: 0,
  progressFill: 0,
  processComplete: false,
};

export default function Liveness() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const [state, dispatch] = useReducer(detectionReducer, initialState);
  const rect = useRef<View>(null);
  const cameraRef = useRef<Camera>(null);
  const [capturedImage, setCapturedImage] = useState('');
  const [loader, setLoader] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const requestPermissions = async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermissions();
  }, []);

  const drawFaceRect = (face: FaceDetection) => {
    rect.current?.setNativeProps({
      width: face.bounds.size.width,
      height: face.bounds.size.height,
      top: face.bounds.origin.y,
      left: face.bounds.origin.x,
    });
  };

  const onFacesDetected = (result: FaceDetectionResult) => {
    if (result.faces.length !== 1) {
      dispatch({type: 'FACE_DETECTED', value: 'no'});
      return;
    }
    //@ts-ignore
    const face: FaceDetection = result.faces[0];
    drawFaceRect(face);
    // Get the center coordinates of the screen
    const screenCenterX = windowWidth / 2;
    const screenCenterY = PREVIEW_MARGIN_TOP + PREVIEW_SIZE / 2;

    // Calculate the deviation of face from the screen center
    const deviationX = Math.abs(
      face.bounds.origin.x + face.bounds.size.width / 2 - screenCenterX,
    );
    const deviationY = Math.abs(
      face.bounds.origin.y + face.bounds.size.height / 2 - screenCenterY,
    );

    // Define a threshold for deviation (adjust as needed)
    const deviationThreshold = 30; // Adjust this value as per your requirement

    // Check if the deviation of face from the screen center is within the threshold
    if (deviationX <= deviationThreshold && deviationY <= deviationThreshold) {
      if (!state.faceDetected) {
        dispatch({type: 'FACE_DETECTED', value: 'yes'});
      }
    } else {
      dispatch({type: 'FACE_DETECTED', value: 'no'});
    }
  };

  useEffect(() => {
    const captureImage = async () => {
      if (cameraRef.current) {
        setTimeout(() => {
          // delay so we can see progress fill aniamtion (500ms)
          setLoader(true);
        }, 1050);
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
    if (state.processComplete && !capturedImage) {
      captureImage();
    }
  }, [capturedImage, state.processComplete]);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (animate) {
    return (
      <View style={styles.container}>
        <View style={styles.topBlock} />
        <View style={styles.leftBlock} />
        <View style={styles.rightBlock} />
        <View style={styles.mainContainer}>
          <CameraPreviewMask width={'100%'} style={styles.circularProgress} />
          <LottieView
            style={{
              width: '100%',
              height: '100%',
              marginTop: PREVIEW_MARGIN_TOP * 2,
            }}
            source={require('../assets/Face.json')}
            autoPlay
          />
        </View>
        <View ref={rect} style={styles.marker} />
        <View style={styles.promptContainer}>
          <Text style={styles.faceStatus}>Let's take a selfie</Text>
          <Text style={styles.actionPrompt}>
            Keep a natural expression, find balanced light and remove any
            glasses and hats
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setAnimate(false)}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBlock} />
      <View style={styles.leftBlock} />
      <View style={styles.rightBlock} />
      <View
        style={{
          width: '100%',
          height: '70%',
        }}>
        {loader && (
          <LottieView
            style={styles.circularProgress}
            source={require('../assets/Verifi.json')}
            autoPlay
          />
        )}
        <Camera
          ref={cameraRef}
          style={[styles.cameraPreview, {opacity: loader ? 0 : 10}]}
          type={Camera.Constants.Type.front}
          onFacesDetected={onFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.accurate,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 0,
            tracking: false,
          }}>
          <CameraPreviewMask width={'100%'} style={styles.circularProgress} />

          <AnimatedCircularProgress
            style={styles.circularProgress}
            size={PREVIEW_SIZE}
            width={5}
            backgroundWidth={7}
            fill={state.progressFill}
            tintColor="#3485FF"
            backgroundColor="#e8e8e8"
            onAnimationComplete={() => console.log('Done')}
          />
        </Camera>
      </View>

      <View ref={rect} style={styles.marker} />
      <View style={styles.promptContainer}>
        {!state.faceDetected && !loader ? (
          <Text style={styles.faceStatus}>
            Please{' '}
            <Text style={{fontWeight: 'bold', color: '#6b5b95'}}>center</Text>{' '}
            your face in the{' '}
            <Text style={{fontWeight: 'bold', color: '#6b5b95'}}>
              camera view
            </Text>
            .
          </Text>
        ) : loader ? (
          <>
            <Text style={styles.faceStatus}>Thank You!</Text>
            <Text style={styles.actionPrompt}>
              Verifying photo based identity
            </Text>
          </>
        ) : null}

        {state.faceDetected && !loader && (
          <>
            <Text style={styles.actionPrompt}>
              Please{' '}
              <Text style={{fontWeight: 'bold', color: '#6b5b95'}}>hold</Text> a
              second while we are{' '}
              <Text style={{fontWeight: 'bold', color: '#6b5b95'}}>
                verifying
              </Text>
              .
            </Text>
          </>
        )}
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
    backgroundColor: '#fff',
  },
  topBlock: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: PREVIEW_MARGIN_TOP,
    backgroundColor: 'white',
    zIndex: 10,
  },
  marker: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
  },
  leftBlock: {
    position: 'absolute',
    top: PREVIEW_MARGIN_TOP,
    left: 0,
    width: (windowWidth - PREVIEW_SIZE) / 2,
    height: PREVIEW_SIZE,
    backgroundColor: 'white',
    zIndex: 10,
  },
  rightBlock: {
    position: 'absolute',
    top: PREVIEW_MARGIN_TOP,
    right: 0,
    width: (windowWidth - PREVIEW_SIZE) / 2 + 1,
    height: PREVIEW_SIZE,
    backgroundColor: 'white',
    zIndex: 10,
  },
  mainContainer: {
    width: '100%',
    height: PREVIEW_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: PREVIEW_MARGIN_TOP + PREVIEW_SIZE,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    color: 'black',
  },
  faceStatus: {
    fontSize: 25,
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
    marginBottom: 100,
  },
});
