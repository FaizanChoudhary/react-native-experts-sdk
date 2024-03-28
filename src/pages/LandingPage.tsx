import {useNavigation, useRoute} from '@react-navigation/native';
import * as React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import SelfieSvg from './SelfieSvg';

const Home = () => {
  const {params} = useRoute();

  const navigation = useNavigation();
  const startDetection = () => navigation.navigate('CNICScanner');
  // const startScan = () => navigation.navigate('ScanDocument');

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={{flex: 1}}>
        <Text style={styles.title}>Face Detection</Text>
        <Text style={styles.subtitle}>ExpertsCloud</Text>
        <View style={styles.bottomContainer}>
          {/* <SelfieSvg size={300} style={styles.selfieSvg} /> */}
          {params?.photo ? (
            <Image
              style={styles.image}
              source={{
                uri: params.photo,
              }}
            />
          ) : (
            <SelfieSvg size={300} style={styles.selfieSvg} />
          )}

          <TouchableOpacity style={styles.btn} onPress={startDetection}>
            <Text style={styles.btnText}>START</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.btn} onPress={startScan}>
              <Text style={styles.btnText}>SCAN DOCUMENT</Text>
            </TouchableOpacity> */}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 50,
    color: '#1e293b',
    zIndex: 1,
  },
  image: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: 158,
    borderRadius: 200,
  },
  subtitle: {
    fontSize: 10,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20,
    color: '#1e293b',
    zIndex: 1,
  },
  selfieSvg: {
    position: 'absolute',
    bottom: 158,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 100,
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
});

export default Home;
