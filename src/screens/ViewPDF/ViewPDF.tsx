import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text, PermissionsAndroid, Platform, Share } from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/AntDesign';
import FileViewer from 'react-native-file-viewer';
import PushNotification from 'react-native-push-notification';

const ViewPDF = () => {
  const route = useRoute();
  const { url } = route.params;
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     requestExternalStoragePermission();
  //   }
  // }, []);

  // const requestExternalStoragePermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: 'Storage Permission',
  //         message: 'This app needs access to your storage to download files.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //       Alert.alert('Permission Denied', 'You need to grant storage permission to download files.');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };
  const downloadPDF = async () => {
    setLoading(true);
    try {
      const fileName = url.split('/').pop();
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: url,
        toFile: downloadDest,
        background: true,
      };
      // console.log("option", options);

      // return
      const result = await RNFS.downloadFile(options).promise;
      console.log('PDF downloaded to:', downloadDest);
      Alert.alert('Download Successful', `PDF downloaded to ${downloadDest}`);

      // Notify user about the download location
      // PushNotification.localNotification({
      //   title: "Download Complete",
      //   message: `PDF has been downloaded to ${downloadDest}`,
      //   playSound: true,
      //   soundName: 'default',
      // });

      // Open the downloaded PDF
      // FileViewer.open(downloadDest)
      //   .then(() => {
      //     console.log('PDF opened successfully');
      //   })
      //   .catch(err => {
      //     console.error('Failed to open PDF:', err);
      //     Alert.alert('Error', 'Failed to open the downloaded PDF.');
      //   });


    } catch (error) {
      console.error('Download Error:', error);
      Alert.alert('Error', 'Failed to download PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const shareMessage = async () => {
    try {
      const result = await Share.share({
        // message: 'Check out this amazing content!',
        message: url,
        title: 'Share Content',
        url: 'https://example.com', // Optional URL to share
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type of: ' + result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={{ uri: url, cache: true }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`PDF loaded. Number of pages: ${numberOfPages}`);
          console.log(`File path: ${filePath}`);
        }}
        onError={(error) => {
          console.error('PDF Error:', error);
          Alert.alert('Error', 'Failed to load PDF. Please check the URL or your network connection.');
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
      <View style={styles.buttoncontainer}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareMessage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Sharing...' : ''}</Text>
          <Icon name='sharealt' color={'white'} size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadPDF}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Downloading...' : 'Download PDF'}{ }</Text>
          <Icon name='download' color={'white'} size={16} />
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  downloadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#e11e30',
    borderRadius: 50,
    alignItems: 'center',
    // margin: 10,
    width: '80%',
  },

  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#e11e30',
    borderRadius: 50,
    alignItems: 'center',
    // margin: 10,
    width: '12%',
    marginHorizontal: 10

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttoncontainer: {
    marginVertical: 10,
    flexDirection: 'row'
  },
});

export default ViewPDF;
