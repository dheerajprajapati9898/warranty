import React, {useEffect, useState, useRef, useCallback} from 'react';
import styles from './styles';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setupPinDatabase,
  insertPinItems,
  getAllPinItems,
} from './../../db/pin/pin';
import {setIsLogin, setUserId} from './../../components/SharedPreference';
import {
  updateLoginItem,
  getAllLoginItems,
  insertLoginItems,
  loginInsertChecked,
} from './../../db/Login/Login';
import NetInfo from '@react-native-community/netinfo';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import axios from 'axios';
import RemoteUrls from '../apiUrl';
import {AESExtensions} from '../AESExtensions';
import {ActivityIndicator} from 'react-native-paper';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import {
  setupRegexDatabase,
  getAllRegexItems,
  insertRegexItems,
  clearRegexTable,
} from './../../db/regex/regex';
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';
import {fetch as fetchssl} from 'react-native-ssl-pinning';
const LoginWithOTP = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(null);
  const [timer, setTimer] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);
  const intervalRef = useRef(null);
  const methodcall = async () => {
    await setupRegexDatabase();
    await feItems();
    await setupMultiLanguageDatabase();
    await fetchingthelanguagedata();
    await setupPinDatabase();
  };
  const mainapicallmethod = async () => {
    const status = await GetLoginResponse();
  };
  const handleConnectivityChange = useCallback(async state => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    if (state.isConnected === true) {
      mainapicallmethod();
      methodcall();
    } else {
      methodcall();
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
      return () => {
        clearInterval(intervalRef.current);
        unsubscribe();
      };
    }, [handleConnectivityChange]),
  );
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
  const CELL_COUNT = 6;
  // const [contactnumber, setcontactnumber] = useState('8786456568');
  const [contactnumber, setcontactnumber] = useState('');
  const [confirmotp, setconfirmotp] = useState('');
  const ref = useRef();
  const ref1 = useRef();

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

  const getCellOnLayoutHandler1 = index => {
    // Example handler for cell layout if needed
    return ({
      nativeEvent: {
        layout: {width},
      },
    }) => {
      // Do something with cell layout if needed
    };
  };
  const [regex, setregex] = useState();

  const feItems = async () => {
    try {
      const itemsFromDb = await getAllRegexItems();
      const tyresizeItems = itemsFromDb.map(item => ({
        key: item.FeatureID,
        value: item.KeyValue,
      }));
      setregex(tyresizeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [loading, setloading] = useState(false);
  const [resendloading, setresendloading] = useState(false);
  const [isotpsent, setisotpsent] = useState(false);
  const [isbuttonchange, setisbuttonchange] = useState(false);
  const handleotploginSubmit = async () => {
    if (isConnected === false) {
      Alert.alert('', 'Please check the internet!');
      return;
    }
    if (contactnumber === '') {
      Alert.alert('Error', `${languagedata.ReqCusMobileNo}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    const contactRegexstr = regex[3].value;

    const contactRegex = new RegExp(contactRegexstr);
    if (!contactRegex.test(contactnumber)) {
      Alert.alert('Validation Error', `${languagedata.ReqCusMobileNo}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    try {
      setloading(true);
      const requestdata = {
        Username_MobileNo: contactnumber,
      };
      const encryptedlogindata = AESExtensions.encryptS(requestdata);
      const formData = new FormData();

      // Add other fields to FormData
      formData.append('UserId', '');
      formData.append('IsEncrypt', '');
      formData.append('SessionExpiryTime', '');
      formData.append('RequestId', '');
      formData.append('RequestData', encryptedlogindata);
      const heaaders = await GetHeader();
      const reaponse = await fetchssl(RemoteUrls.postLoginWithOTPUrl, {
        method: 'POST',
        body: formData,

        headers: heaaders,
        pkPinning: true,
        sslPinning: {
          // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
          certs: ['sha256/GPzrYygcenXUG7uBRkAzUQ3GsIfA0Oxv4jod3tLng2E='],
        },
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
          const responseData = data.responseData;
          // Do something with the responseData
          const plaintextoflogindata =
            AESExtensions.decryptString(responseData);
          if (plaintextoflogindata.ErrorCode === '200') {
            setisotpsent(true);
            setisbuttonchange(true);
            intervalRef.current = setInterval(() => {
              setTimer(prevTimer => {
                if (prevTimer <= 0) {
                  clearInterval(intervalRef.current); // Stop the timer if it reaches 0
                  setIsDisabled(false); // Re-enable functionality if needed
                  return 0; // Ensure timer doesn't go below 0
                }
                if (prevTimer === 0) {
                  clearInterval(intervalRef.current); // Stop the timer at 9 seconds
                  setIsDisabled(true); // Disable something
                }
                return prevTimer - 1;
              });
            }, 1000);
          } else if (plaintextoflogindata.ErrorCode === '400') {
            Alert.alert('Error', plaintextoflogindata.ErrorDesc);
          } else {
            Alert.alert('', 'Something went wrong!');
          }
        })
        .catch(error => {
          console.error('Error fetching data: inside hmm', error);
        });
    } catch (error) {
      Alert.alert('error', error);
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    } finally {
      setloading(false);
    }
  };
  const handleResendotp = async () => {
    if (isConnected === false) {
      Alert.alert('', 'Please check the internet!');
      return;
    }

    try {
      setresendloading(true);
      const requestdata = {
        Username_MobileNo: contactnumber,
      };

      const encryptedlogindata = AESExtensions.encryptS(requestdata);

      const formData = new FormData();

      // Add other fields to FormData
      formData.append('UserId', '');
      formData.append('IsEncrypt', '');
      formData.append('SessionExpiryTime', '');
      formData.append('RequestId', '');
      formData.append('RequestData', encryptedlogindata);
      const heaaders = await GetHeader();
      const reaponses = await fetchssl(RemoteUrls.postLoginWithOTPUrl, {
        method: 'POST',
        body: formData,
        headers: heaaders,
        // passing the mycert certificate that we
        // generated in the previous steps

        // The certs property is an array of certificates,
        // we are passing mycert as our certificate
        // for ssl pinning
        // 47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
        pkPinning: true,
        sslPinning: {
          // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
          certs: ['sha256/GPzrYygcenXUG7uBRkAzUQ3GsIfA0Oxv4jod3tLng2E='],
        },
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
          const responseData = data.responseData; // Do something with the responseData
          const plaintextoflogindata =
            AESExtensions.decryptString(responseData);
          if (plaintextoflogindata.ErrorCode === '200') {
            setTimer(30); // Reset the timer
            setIsDisabled(true);
            intervalRef.current = setInterval(() => {
              setTimer(prevTimer => {
                if (prevTimer <= 0) {
                  clearInterval(intervalRef.current); // Stop the timer if it reaches 0
                  setIsDisabled(false); // Re-enable functionality if needed
                  return 0; // Ensure timer doesn't go below 0
                }
                if (prevTimer === 0) {
                  clearInterval(intervalRef.current); // Stop the timer at 9 seconds
                  setIsDisabled(true); // Disable something
                }
                return prevTimer - 1;
              });
            }, 1000);
          } else if (plaintextoflogindata.ErrorCode === '400') {
            Alert.alert('Error', plaintextoflogindata.ErrorDesc);
          } else {
            Alert.alert('', 'Something went wrong!');
          }
        })
        .catch(async error => {
          console.error('Error fetching data: inside', error);
          if (error.status === 406) {
            const status = await GetLoginResponse();
          }
        });
    } catch (error) {
      Alert.alert('error', error);
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    } finally {
      setresendloading(false);
    }
  };
  const handleotpverificationSubmit = async () => {
    if (isConnected === false) {
      Alert.alert('', `${languagedata.lbl_PleasechecktheInternet}`);
      return;
    }
    if (confirmotp === '') {
      Alert.alert('Error', 'OTP can not be empty.');
      return;
    }
    if (confirmotp.length !== 6) {
      Alert.alert('Error', 'Incomplete OTP..');
      return;
    }
    const requestdata = {
      Username_MobileNo: contactnumber,
      OTP: confirmotp,
    };

    try {
      const encryptedlogindata = AESExtensions.encryptS(requestdata);

      const payload = {
        RequestId: '',
        IsEncrypt: '',
        RequestData: encryptedlogindata,
        SessionExpiryTime: '',
        UserId: '',
      };
      const formData = new FormData();

      // Add other fields to FormData
      formData.append('UserId', '');
      formData.append('IsEncrypt', '');
      formData.append('SessionExpiryTime', '');
      formData.append('RequestId', '');
      formData.append('RequestData', encryptedlogindata);
      const heaaders = await GetHeader();
      const reaponse = await fetchssl(RemoteUrls.postLoginOTPVerificationUrl, {
        method: 'POST',
        body: formData,
        headers: heaaders,
        timeoutInterval: 1000,
        // passing the mycert certificate that we
        // generated in the previous steps

        // The certs property is an array of certificates,
        // we are passing mycert as our certificate
        // for ssl pinning
        // 47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
        pkPinning: true,
        sslPinning: {
          // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
          certs: ['sha256/GPzrYygcenXUG7uBRkAzUQ3GsIfA0Oxv4jod3tLng2E='],
        },
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(async data => {
          const responseData = data.responseData; // Do something with the responseData
          const plaintextoflogindata =
            AESExtensions.decryptString(responseData);
          if (
            plaintextoflogindata.ErrorCode === '200' ||
            plaintextoflogindata.ErrorCode === 200
          ) {
            await AsyncStorage.setItem(
              'Username',
              plaintextoflogindata.Username,
            );
            await insertLoginItems(
              plaintextoflogindata,
              plaintextoflogindata.UserID,
            );
            await setUserId(plaintextoflogindata.UserID);
            await loginInsertChecked(
              plaintextoflogindata,
              plaintextoflogindata.UserID,
            );
            setconfirmotp('');
            navigation.navigate('ChangePassword');
            // Alert.alert("Success", plaintextoflogindata.ErrorDesc)
          } else if (plaintextoflogindata.ErrorCode === '400') {
            Alert.alert('Error', plaintextoflogindata.ErrorDesc);
          } else {
            Alert.alert('', 'Something went wrong!');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } catch (error) {
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} />
      ) : (
        <>
          <View style={styles.container}>
            <Text style={styles.headerText}>{languagedata.LoginWithOTP}</Text>

            <TextInput
              readOnly={isotpsent}
              style={styles.input}
              maxLength={10}
              keyboardType="number-pad"
              placeholder={`${languagedata.lbl_MobileNumber}`}
              value={contactnumber}
              onChangeText={value => {
                setcontactnumber(value);
              }}
            />
            {isotpsent === true ? (
              <CodeField
                ref={ref1}
                value={confirmotp}
                onChangeText={setconfirmotp} // Ensure setconfirmpin is properly defined and used here
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete={Platform.select({
                  android: 'sms-otp',
                  default: 'one-time-code',
                })}
                testID="my-code-input-confirm"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler1(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            ) : (
              <></>
            )}
            {isbuttonchange ? (
              <>
                {resendloading ? (
                  <ActivityIndicator size={'small'} color="black" />
                ) : (
                  <>
                    <View style={{flexDirection: 'row', paddingVertical: 5}}>
                      <Text>
                        {isDisabled
                          ? `${languagedata.lbl_ResendOTPin} ${timer}s`
                          : `${languagedata.lbl_YoucanresendtheOTPnow}`}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.button1,
                          isDisabled && styles.buttonDisabled,
                        ]}
                        onPress={handleResendotp}
                        disabled={isDisabled}>
                        {isDisabled ? (
                          <></>
                        ) : (
                          <Text>{languagedata.lbl_ResendOTP}</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleotpverificationSubmit}>
                  {loading ? (
                    <ActivityIndicator size={'small'} color="black" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {languagedata.lbl_VerifyOTP}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleotploginSubmit}>
                {loading ? (
                  <ActivityIndicator size={'small'} color="black" />
                ) : (
                  <Text style={styles.buttonText}>{languagedata.SendOTP}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </>
  );
};

export default LoginWithOTP;
