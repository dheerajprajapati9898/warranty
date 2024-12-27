import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import styles from './style';
import axios from 'axios';
import {AESExtensions} from '../AESExtensions';
import {
  setupLoginDatabase,
  getAllLoginItems,
  insertLoginItems,
  loginInsertChecked,
} from './../../db/Login/Login';

import {
  setupRegexDatabase,
  getAllRegexItems,
  insertRegexItems,
  clearRegexTable,
} from './../../db/regex/regex';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputIcon from 'react-native-paper/lib/typescript/components/TextInput/Adornment/TextInputIcon';
import RemoteUrls from '../apiUrl';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';
import {fetch as fetchssl} from 'react-native-ssl-pinning';
const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // const { username } = route.params;
  const [otp, setOtp] = useState('');
  // const [newPassword, setNewPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  //   const { phoneNumber } = route.params;
  const [password, setPassword] = useState('');
  const [confirmpassword, setcnfirmPassword] = useState('');
  const [isConnected, setIsConnected] = useState(null);
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
  const mainmethod = async () => {
    setupLoginDatabase();
    fetchlofindata();
    setupRegexDatabase();
    feItems();
    setupMultiLanguageDatabase();
    fetchingthelanguagedata();
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
      mainmethod();
    } else {
      mainmethod();
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
      return () => {
        unsubscribe();
      };
    }, [handleConnectivityChange]),
  );
  const fetchlofindata = async () => {
    try {
      const itemsFromDb = await getAllLoginItems();
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [regex, setregex] = useState();
  const feItems = async () => {
    try {
      const itemsFromDb = await getAllRegexItems();
      setregex(itemsFromDb);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const handleResetPassword = async () => {
    if (isConnected === false) {
      Alert.alert('', `${languagedata.lbl_PleasechecktheInternet}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    const passwordRegexstr = regex[2].KeyValue;
    const passwordRegex = RegExp(passwordRegexstr);
    if (password === '' && confirmpassword === '') {
      Alert.alert('Error', `${languagedata.lbl_enterSomethingError}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (password != confirmpassword) {
      Alert.alert('', `${languagedata.lbl_passwordMismatchError}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (!passwordRegex.test(password)) {
      // Alert.alert(`Validation Error`, 'Password formate is invalid');
      Alert.alert('Validation Error', `${languagedata.revPassword}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (!passwordRegex.test(confirmpassword)) {
      // Alert.alert(`Validation Error`, 'ConfirmPassword formate is invalid');
      Alert.alert(
        'Validation Error',
        `${languagedata.lbl_passwordRequirements}`,
        [{text: `${languagedata.lbl_Ok}`}],
      );
      return;
    }
    // return

    const username = await AsyncStorage.getItem('Username');

    const requestdata = {
      User_Name: username,
      NewPassword: password,
      ConfirmPassword: confirmpassword,
    };
    const encryptedlogindata = AESExtensions.encryptString(requestdata);

    const payload = JSON.stringify({
      requestId: '',
      isEncrypt: '',
      requestData: encryptedlogindata,
      sessionExpiryTime: '',
      userId: '',
    });
    try {
      const heaaders = await GetHeader();
      const response = await fetchssl(RemoteUrls.postChangePasswordUrl, {
        method: 'POST',
        body: payload,
        headers: heaaders,
        pkPinning: true,
        sslPinning: {
          // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
          certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
        },
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
          const responseData = data.responseData; // Do something with the responseData
          const plaintextoflogindata =
            AESExtensions.decryptString(responseData);
          if (plaintextoflogindata.ErrorCode === '200') {
            Alert.alert(
              '',
              `${languagedata.lbl_password_changed_successfully}`,
              [{text: `${languagedata.lbl_Ok}`}],
            );
            setPassword('');
            setcnfirmPassword('');
            navigation.navigate('Login');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } catch (err) {
      if (err.response.status === 406) {
        const status = await GetLoginResponse();
      }
      Alert.alert('Error', err, [{text: `${languagedata.lbl_Ok}`}]);
      console.log(err);
    }
  };

  const [isSecurepassword, setisSecurepassword] = useState(true);
  const [isSecureconfirmpass, setisSecureconfirmpass] = useState(true);
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.input}
              placeholder={`${languagedata.lbl_enternewpassword}`}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={isSecurepassword}
              maxLength={16}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setisSecurepassword(!isSecurepassword)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: 'gray',
                marginBottom: 12,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                backgroundColor: 'white',
                borderColor: 'gray',
                padding: 10,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}>
              <Icon
                name={isSecurepassword ? 'eye-slash' : 'eye'}
                size={24}
                color="gray"
              />
              {/* <Text>ads</Text> */}
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.input}
              placeholder={`${languagedata.lbl_ConfirmnewPassword}`}
              value={confirmpassword}
              onChangeText={setcnfirmPassword}
              secureTextEntry={isSecureconfirmpass}
              maxLength={16}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setisSecureconfirmpass(!isSecureconfirmpass)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: 'gray',
                marginBottom: 12,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                backgroundColor: 'white',
                borderColor: 'gray',
                padding: 10,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}>
              <Icon
                name={isSecureconfirmpass ? 'eye-slash' : 'eye'}
                size={24}
                color="gray"
              />
              {/* <Text>ads</Text> */}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>{languagedata.ResetPassword}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ResetPasswordScreen;
