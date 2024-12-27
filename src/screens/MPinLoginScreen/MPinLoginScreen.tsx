import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setupLoginDatabase,
  getAllLoginItems,
  clearLoginTable,
  clearLoginTables,
} from './../../db/Login/Login';
import {
  setupPinDatabase,
  insertPinItems,
  getAllPinItems,
  clearPinTable,
} from './../../db/pin/pin';
import styles from './styles';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  getAllMultiLanguageItems,
  setupMultiLanguageDatabase,
} from '../../db/multilanguage/multilanguage';
import NetInfo from '@react-native-community/netinfo';
import {ScrollView} from 'react-native-gesture-handler';
import {AESExtensions} from '../AESExtensions';
import {isEmulator, isRooted} from 'react-native-root-protection';

const MPinLoginScreen = () => {
  const [mpin, setMPin] = useState(['', '', '', '']);
  const [getpin, setgetpin] = useState();
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
  const checkDeviceSecurity = () => {
    const isCompromised = isRooted() || isEmulator();
    if (isCompromised) {
      Alert.alert(
        'Security Alert',
        'Your device appears to be rooted or running on an emulator. The app will now close for security reasons.',
        [{text: 'OK', onPress: () => BackHandler.exitApp()}],
      );
    } else {
      console.log('Device is secure.');
    }
  };
  useEffect(() => {
    checkDeviceSecurity();
    setupLoginDatabase();

    setupPinDatabase();
    const getpin = async () => {
      const savedUserId = await AsyncStorage.getItem('userid');
      const result = await getAllPinItems();

      const pin = result[0].pin;

      const decreptedmpin = AESExtensions.decryptmpinString(pin);
      // return
      setgetpin(decreptedmpin.replace(/\D/g, ''));
    };
    getpin();
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
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref = useRef();

  const getCellOnLayoutHandler = index => {
    // Example handler for cell layout if needed
    return ({
      nativeEvent: {
        layout: {width},
      },
    }) => {
      // Do something with cell layout if needed
    };
  };
  const handleMPinChange = (text: string, index: number) => {
    const newMPin = [...mpin];
    newMPin[index] = text;
    setMPin(newMPin);
  };

  const handleMPinSubmit = async () => {
    // return
    const contactRegex = /^[0-9+\-]+$/;
    if (!contactRegex.test(value)) {
      Alert.alert(
        'Validation Error',
        `${languagedata.lbl_MPincanonlycontaindigits}`,
        [{text: `${languagedata.lbl_Ok}`}],
      );
      return;
    }
    if (value.length !== 4) {
      Alert.alert('Error', `${languagedata.lbl_Pleaseentera4_digitMPin}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (getpin === value) {
      Alert.alert(
        `${languagedata.lbl_LoginSuccessful}`,
        `${languagedata.lbl_Welcome}`,
        [{text: `${languagedata.lbl_Ok}`}],
      );
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeDrawer'}],
        }),
      );
      // navigation.push('HomeDrawer');
    } else {
      Alert.alert(
        `${languagedata.lbl_InvalidMPin}`,
        `${languagedata.lbl_Pleasetryagain}`,
        [{text: `${languagedata.lbl_Ok}`}],
      );
    }
  };
  const handlechangempinnavigation = async () => {
    if (isConnected === false) {
      Alert.alert('', `${languagedata.lbl_PleasechecktheInternet}`);
      return;
    }
    // await clearLoginTables();
    // await AsyncStorage.setItem('isLogin', "false");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
    // navigation.push('Login')
    // await AsyncStorage.removeItem("userid");
    // await AsyncStorage.setItem('isLogin', 'false');
  };
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text style={styles.headerText}>
            {languagedata.lbl_EnterYourMPin}
          </Text>
          {/* <View style={styles.mpinContainer}>
        {mpin.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.mpinInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleMPinChange(text, index)}
          />
        ))}
      </View> */}
          <CodeField
            ref={ref}
            value={value}
            onChangeText={setValue} // Ensure setValue is properly defined and used here
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={Platform.select({
              android: 'sms-otp',
              default: 'one-time-code',
            })}
            testID="my-code-input"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <TouchableOpacity style={styles.button} onPress={handleMPinSubmit}>
            <Text style={styles.buttonText}>{languagedata.Submit}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlechangempinnavigation}>
            <Text style={{color: '#FF0000', fontSize: 15, marginTop: 10}}>
              {languagedata.lbl_LoginwithUsernameandPassword}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default MPinLoginScreen;
