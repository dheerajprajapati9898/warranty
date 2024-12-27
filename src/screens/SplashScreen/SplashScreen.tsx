import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  View,
  BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import axios from 'axios';
import RemoteUrls from '../apiUrl';
function SplashScreen(): React.JSX.Element {
  const navigation = useNavigation();
  useEffect(() => {
    setupMultiLanguageDatabase();
    // fetchenglishlanguagebydefault()
    setTimeout(() => {
      getinitdata();
    }, 2000);
    const getinitdata = async () => {
      const isLogin = await AsyncStorage.getItem('isLogin');
      const isRooted = await AsyncStorage.getItem('rooted');

      if (isLogin === 'true') {
        navigation.replace('MPIN_Login');
      } else {
        navigation.replace('Login');
      }
    };
  }, []);
  const [multilaugagaeloading, setmultilaugagaeloading] = useState(false);

  const fetchenglishlanguagebydefault = async () => {
    try {
      setmultilaugagaeloading(true);
      const response = await axios.get(RemoteUrls.postMultiLanguageUrl, {
        headers: {
          Accept: '*/*',
        },
      });
      // Assuming response.data is an object
      const data = response.data;
      const datavlue = data['english.json'];
      const cleanedString = datavlue.replace(/^"|"$/g, '');
      const jsonObject = JSON.parse(cleanedString);
      // return
      const items = Object.entries(jsonObject).map(([key, value]) => ({
        key,
        value,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setmultilaugagaeloading(false);
    }
  };
  return (
    <>
      <View
        style={{
          backgroundColor: 'black',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{width: '80%', height: '5%'}}
          source={require('./../../assets/images/logo/splashscreen.jpg')}
        />

        <ActivityIndicator size="large" color="white" />
      </View>
    </>
  );
}

export default SplashScreen;
