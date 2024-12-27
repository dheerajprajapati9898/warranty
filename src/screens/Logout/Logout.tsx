import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {clearLoginTables, updateLoginItem} from './../../db/Login/Login';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import {clearStateTable} from '../../db/Registration/StateDb';
import {clearPinCodeTable} from '../../db/Registration/PinCodeDb';
import {clearTractorMakeTable} from '../../db/Registration/TractorMakeDb';
import {clearTractorModelTable} from '../../db/Registration/TractorModelDb';
import {clearBrandNasadmeTable} from '../../db/Registration/BrandName';
import {clearProductNameTable} from '../../db/Registration/ProductNameDb';
import {clearVehicleVariantTable} from '../../db/Registration/VehicleVariant';
import {clearOldTyreCompanyTable} from '../../db/Registration/OldTyreCompany';
import {clearOldTyreBrandNameTable} from '../../db/Registration/OldTyreBrandName';
import {clearVehicleTypeTable} from '../../db/Registration/VehicleTypeDb';
import {clearTyreSizeTable} from '../../db/Registration/TyreSizeDb';
import {setIsLogin} from '../../components/SharedPreference';
import NetInfo from '@react-native-community/netinfo';
const Logout = () => {
  const navigation = useNavigation();
  const [languagedata, setlanguagedata] = useState(null);
  const fetchingthelanguagedata = async () => {
    try {
      const dsasdas = await getAllMultiLanguageItems();
      const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
      const hheo = JSON.parse(removedTing);

      setlanguagedata(hheo);
    } catch (error) {
      console.log(error);
    }
  };
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    setupMultiLanguageDatabase();
    fetchingthelanguagedata();
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Initial check when component mounts
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
    const savedUserId = await AsyncStorage.getItem('userid');
    try {
      if (Platform.OS === 'android') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      } else {
        navigation.push('Login');
      }
    } catch (e) {
      console.log('Failed to clear AsyncStorage.');
    }
  };
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.headerText}>
            {languagedata.lbl_Afterlogoutdataisstillstoreinthesystem}
          </Text>
          {/* <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        placeholderTextColor="#999"
        maxLength={4}
      /> */}
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>{languagedata.button_Logout}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Logout;
