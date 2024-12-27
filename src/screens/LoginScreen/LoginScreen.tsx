import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Platform,
  PermissionsAndroid,
  Dimensions,
  NativeModules,
  BackHandler,
} from 'react-native';
import styles from './styles';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {RootStackParamList} from '../../utils/types';
import axios from 'axios';
import {
  setupMasterSyncUpdateDatabase,
  getAllMasterSyncUpdateItems,
  insertMasterSyncUpdateItems,
  clearMasterSyncUpdateTable,
  updateMasterSyncUpdateItem,
} from './../../db/MasterSyncUpdate/MasterSyncUpdate';
import {
  setupPhotoCategorylistDatabase,
  getPhotoCategorylistItems,
  insertPhotoCategorylistItems,
  clearPhotoCategorylistTable,
  getPhotoCategorylistbyuseridItems,
} from './../../db/photocategorylist/photocategorylist';
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;
import {
  setupLoginDatabase,
  getAllLoginItems,
  insertLoginItems,
  loginInsertChecked,
} from './../../db/Login/Login';
import NetInfo from '@react-native-community/netinfo';
import {
  setUserName,
  getUserName,
  setUserId,
  getUserId,
  setIsLogin,
} from './../../components/SharedPreference';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AESExtensions} from '../AESExtensions';
import RemoteUrls from '../apiUrl';
import {
  setupRegexDatabase,
  getAllRegexItems,
  insertRegexItems,
  clearRegexTable,
} from './../../db/regex/regex';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Button, Snackbar} from 'react-native-paper';
import GetLocation from 'react-native-get-location';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import {isRooted, isEmulator} from 'react-native-root-protection';
import {fetch as fetchssl} from 'react-native-ssl-pinning';
import GetLoginResponse from '../GetLoginResponse';
import GetHeader from '../getAuthHeader';
// import RNSslPinning from 'react-native-ssl-pinning';
function Login(props): React.JSX.Element {
  const {height} = Dimensions.get('window');
  const {width} = Dimensions.get('window');
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isConnected, setIsConnected] = useState(null);
  const [loginItems, setLoginItems] = useState([]);
  const navigation = useNavigation();
  // const [username, setUsername] = useState('admin')
  // const [password, setPassword] = useState('Pass@1234')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [isrooted, setisrooted] = useState(false);
  const [visible, setVisible] = useState(false);
  const onDismissSnackBar = () => setVisible(false);
  //   const renderlanguage = async () => {
  // const
  //   }
  // const { RootChecker } = NativeModules;
  // const checkIfRooted = () => {
  //   console.log("RootChecker", RootChecker);

  //   RootChecker.isDeviceRooted((isRooted) => {
  //     if (isRooted) {
  //       Alert.alert("Warning", "This device is rooted!");
  //     } else {
  //       Alert.alert("Device Status", "This device is not rooted.");
  //     }
  //   });
  // };
  const methodcall = async () => {
    const root = await AsyncStorage.getItem('rooted');
    if (root === 'true') {
      setisrooted(true);
    } else {
      setisrooted(false);
    }
    // await checkIfRooted()
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   setIsConnected(state.isConnected);
    // });

    // // Initial check when component mounts
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    await setupPhotoCategorylistDatabase();
    await setupMultiLanguageDatabase();
    await fetchingthelanguagedata();
    await setupRegexDatabase();
    await clearRegexTable('regex');
    if (isConnected) {
      setVisible(true);
    }
    // await AsyncStorage.setItem('languagecheck', "false")
    await setupMasterSyncUpdateDatabase();

    await setupLoginDatabase();

    await requestPermission();
    await fetchingtheagencyfeture();

    // await requestLocationPermission()
    feItems();
    const checkignlanguiagevalue = await AsyncStorage.getItem('languagecheck');

    // await fetchingthelanguagedata()

    if (checkignlanguiagevalue === 'false' || checkignlanguiagevalue === null) {
      const response = await fetch(RemoteUrls.postMultiLanguageUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const extractedData = await response.json();
      const helperList = Object.entries(extractedData);
      const languageResponse = helperList[0][1];
      await clearMultiLanguageTable('multilaguage');
      await insertMultiLanguageItems('english.json', languageResponse);
      const dsasdas = await getAllMultiLanguageItems();

      const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
      const hheo = JSON.parse(removedTing);
      setlanguagedata(hheo);
    }
    // await fetchphotochategorylist();
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  };
  const handleConnectivityChange = useCallback(state => {
    if (state.isConnected === true) {
      methodcall();
    }
  }, []);
  const checkDeviceSecurity = async () => {
    const isCompromised = isRooted() || isEmulator();
    if (isCompromised) {
      Alert.alert(
        'Security Alert',
        'Your device appears to be rooted or running on an emulator. The app will now close for security reasons.',
        [{text: 'OK', onPress: () => BackHandler.exitApp()}],
      );
      await AsyncStorage.setItem('rooted', 'true');
    } else {
      console.log('Device is secure.');
    }
  };
  useFocusEffect(
    useCallback(() => {
      // methodcall();

      checkDeviceSecurity();

      NetInfo.fetch().then(state => {
        setIsConnected(state.isConnected);
      });
      const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
      };
    }, [handleConnectivityChange]),
  );
  const [languagedata, setlanguagedata] = useState(null);
  const [login, setlogin] = useState('LOGIN');
  const [usernametxt, setusernametxt] = useState('USERNAME');
  const [passwordtxt, setpasswordtxt] = useState('PASSWORD');
  const [loginwithotp, setloginwithotp] = useState('LOGIN WITH OTP');
  const [languagetxt, setlanguagetxt] = useState('Select language');
  const [helpnsupporttxt, sethelpnsupporttxt] = useState('Help & Support');
  const fetchingthelanguagedata = async () => {
    try {
      const dsasdas = await getAllMultiLanguageItems();
      const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
      const hheo = JSON.parse(removedTing);

      setlanguagedata(hheo);
      setlogin(hheo.Login);
      setusernametxt(hheo.LoginUsername);
      setpasswordtxt(hheo.LoginPassword);
      setloginwithotp(hheo.LoginWithOTP);
      setlanguagetxt(hheo.Selectlanguage);
      sethelpnsupporttxt(hheo.nav_Help_Support);
    } catch (error) {
      console.log(error);
    }
  };
  const mastersyncinsertion = async value => {
    const options = [
      {apiname: value.nav_StateMaster, is_status: false},
      // { apiname: 'City Master', is_status: false },
      // { apiname: 'District Master', is_status: false },
      {apiname: value.nav_PinCodeMaster, is_status: false},
      {apiname: value.nav_VehicleMakeMaster, is_status: false},
      {apiname: value.nav_VehicleModelMaster, is_status: false},
      {apiname: value.lbl_TyreBrandMaster, is_status: false},
      {apiname: value.lbl_ProductNameMaster, is_status: false},
      {apiname: value.lbl_TyreSizeMaster, is_status: false},
      {apiname: value.lbl_OldTyreCompanyMaster, is_status: false},
      {apiname: value.lbl_OldTyreBrandMaster, is_status: false},
      {apiname: value.nav_VehicleTypeMaster, is_status: false},
      {apiname: value.lbl_VehicleVariantMaster, is_status: false},

      // { apiname: 'Photo Category', is_status: false },
    ];
    await clearMasterSyncUpdateTable('mastersync');
    await insertMasterSyncUpdateItems(options);
  };

  const requestPermission = async () => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.CAMERA;
    }

    if (permission) {
      const status = await request(permission);
    }
  };

  const getLocation = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async position => {
        const {latitude, longitude} = position;

        // return reverseGeocode(latitude, longitude);
      })
      .then(address => {
        console.log('Address:');
      })
      .catch(error => {
        console.warn('Error:', error.code, error.message);
      });
  };

  const [regex, setregex] = useState();

  const feItems = async () => {
    try {
      const itemsFromDb = await getAllRegexItems();
      setregex(itemsFromDb);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  var photocategorylist = [];

  const fetchphotochategorylist = async (auth, session) => {
    photocategorylist = [];

    try {
      const response = await fetchssl(RemoteUrls.getphotoCategories_ListUrl, {
        method: 'GET',
        timeoutInterval: 1000,
        pkPinning: true,
        sslPinning: {
          certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
        },
        headers: {
          Authentication: auth,
          SessionID: session,
          Accept: 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          e_platform: 'mobile',
        },
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(async data => {
          const responseData = JSON.parse(data.responseData);
          photocategorylist = responseData;
          await clearPhotoCategorylistTable('photocategorylist');
          await insertPhotoCategorylistItems(photocategorylist);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

      return;
    } catch (error) {
      console.error(
        'Error fetching photo category list:',
        error.response.status,
      );
    }
  };

  const fetchingtheagencyfeture = async () => {
    await clearRegexTable('regex');

    const payload = {
      requestId: '',
      isEncrypt: '',
      requestData: '',
      sessionExpiryTime: '',
      userId: '',
    };
    try {
      const response = await axios.post(
        RemoteUrls.postAgencyFeatureUrl,
        payload,
      );

      const parsevalue = JSON.parse(response.data.responseData);
      if (Array.isArray(parsevalue)) {
        for (let i = 0; i < parsevalue.length; i++) {
          const {
            AgencyId,
            AgencyListId,
            DefaultValue,
            FeatureCode,
            FeatureDesc,
            FeatureID,
            FeatureShortName,
            KeyValue,
          } = parsevalue[i];

          const newItem = {
            AgencyId,
            AgencyListId,
            DefaultValue,
            FeatureCode,
            FeatureDesc,
            FeatureID,
            FeatureShortName,
            KeyValue,
          };

          if (response.status === 200) {
            await insertRegexItems(newItem);
          }
        }
      } else {
        console.error('Error: parsevalue is not an array or is undefined');
      }
    } catch (error) {
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const checkUserMpinExist = async () => {
    try {
      const itemsFromDb = await getAllLoginItems();
      // setModelItems(modelItems);
      if (itemsFromDb.mpin === null) {
        return false;
      } else {
        await AsyncStorage.setItem('isLogin', 'true');

        return true;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return false;
    }
  };
  const [isLogin, setIsLogin] = useState(false);
  const [isPinAvailable, setIsPinAvailable] = useState(false);
  const [plainText, setplainText] = useState('');
  const [encryptedText, setencryptedText] = useState('');

  const handleLogin = async () => {
    // return
    if (isConnected === false) {
      Alert.alert('', 'Please check the internet!');
      return;
    }

    // const dsasdas = await getAllMultiLanguageItems()
    // const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
    // const hheo = JSON.parse(removedTing);
    if (username === '') {
      Alert.alert('Error', `${languagedata.rfvUsername}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    const usernameRegexstr = regex[1].value;
    // const usernameRegexstr = '[a-z]?(.|\-)+(\w+|\b)';
    const usernameRegex = new RegExp(usernameRegexstr);
    // const passwordRegexstr = regex[2].KeyValue
    // const passwordRegex = new RegExp(passwordRegexstr);

    // return

    if (!usernameRegex.test(username)) {
      Alert.alert(
        'Validation Error',
        `${languagedata.lbl_Usernameformateisinvalid}`,
        [{text: `${languagedata.lbl_Ok}`}],
      );
      return;
    }
    if (password === '') {
      Alert.alert('Error', `${languagedata.rfvpassword1}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    const requestdata = {
      Username: username,
      Password: password,
    };
    const encryptedlogindata = AESExtensions.encryptString(requestdata);

    const encryptedlogindataforauthorizatio = AESExtensions.encryptLoginString(
      `${username}:${password}`,
    );

    const encryptedpassword = AESExtensions.encryptString(password);

    // return
    try {
      setModalVisible(true);
      const payload = JSON.stringify({
        requestId: '',
        isEncrypt: '',
        requestData: encryptedlogindata,
        sessionExpiryTime: '',
        userId: '',
      });

      // return
      // const response = await axios.post(
      //   'https://warrantyuat.yokohama-oht.com/TCWebAPI/api/Login/Login',
      //   payload,
      // );
      const response = await fetchssl(RemoteUrls.postloginUrl, {
        method: 'POST',
        body: payload,
        pkPinning: true,
        sslPinning: {
          certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
        },
        headers: {
          Authentication: encryptedlogindataforauthorizatio,
        },
      })
        .then(response => response.json())
        .then(async data => {
          const responseData = data.responseData; // Do something with the responseData

          const plaintextoflogindata =
            AESExtensions.decryptString(responseData);
          if (
            plaintextoflogindata.Msg === 'username or password is not correct'
          ) {
            Alert.alert(
              'Error',
              `${languagedata.lbl_InvalidUsernameorPassword}`,
              [{text: `${languagedata.lbl_Ok}`}],
            );
            return;
          } else if (
            plaintextoflogindata.Msg ===
            'User account is locked. Please reset your password or contact your administrator.'
          ) {
            Alert.alert('Error', plaintextoflogindata.Msg, [
              {text: `${languagedata.lbl_Ok}`},
            ]);
            return;
          }
          await AsyncStorage.setItem('SessionID', '');
          // return
          await AsyncStorage.setItem(
            'Username',
            plaintextoflogindata.Username === null
              ? ''
              : plaintextoflogindata.Username,
          );
          await AsyncStorage.setItem(
            'Authorization',
            encryptedlogindataforauthorizatio,
          );
          await AsyncStorage.setItem(
            'SessionID',
            plaintextoflogindata.SessionID === null
              ? ''
              : plaintextoflogindata.SessionID,
          );

          await AsyncStorage.setItem('Password', encryptedpassword);

          // return

          if (plaintextoflogindata.Msg === 'Logged In') {
            await mastersyncinsertion(languagedata);

            if (plaintextoflogindata.UserID === null) {
              Alert.alert('', `${languagedata.lbl_accountNotExist}`);
              return;
            }
            await fetchphotochategorylist(
              encryptedlogindataforauthorizatio,
              plaintextoflogindata.SessionID,
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

            //85

            const savedUserId = await AsyncStorage.getItem('userid');

            // return

            // navigation.push('HomeDrawer');
            const usermpin_exist = await checkUserMpinExist();

            if (usermpin_exist) {
              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 0,
              //     routes: [{ name: 'MPIN_Login' }],
              //   })
              // );
              if (Platform.OS === 'android') {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'MPIN_Login'}],
                  }),
                );
              } else {
                navigation.push('MPIN_Login');
              }
              // navigation.push('MPIN_Login');
            } else {
              // requestPermission()
              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 0,
              //     routes: [{ name: 'CreateMPIN' }],
              //   })
              // );
              if (Platform.OS === 'android') {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'CreateMPIN'}],
                  }),
                );
              } else {
                navigation.push('CreateMPIN');
              }
              // navigation.push('CreateMPIN');
            }
          } else {
            Alert.alert(
              'Login failed',
              `${languagedata.lbl_InvalidUsernameorPassword}`,
              [{text: `${languagedata.lbl_Ok}`}],
            );
          }
        })
        .catch(async error => {
          console.error('Error fetching data:', error);
        });
      // return
    } catch (error) {
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
      Alert.alert('', 'Something went wrong');
      console.error('Post Data Error:', error);
      throw error; // Throw the error for further handling
    } finally {
      setModalVisible(false);
    }
    // Perform login logic here
    // On success:
    //  navigation.replace('HomeDrawer');
  };
  // if(isLogin){
  //   navigation.replace('HomeDrawer');
  // }

  const [multilaugagaeloading, setmultilaugagaeloading] = useState(false);
  const handleFetchMultipleLanguage = async language => {
    try {
      setmultilaugagaeloading(true);
      if (language === 'english') {
        const response = await fetch(RemoteUrls.postMultiLanguageUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const extractedData = await response.json();
        const helperList = Object.entries(extractedData);
        const languageResponse = helperList[0][1];
        await clearMultiLanguageTable('multilaguage');
        await insertMultiLanguageItems('english.json', languageResponse);
        await AsyncStorage.setItem('languagecheck', 'true');

        const dsasdas = await getAllMultiLanguageItems();
        await fetchingthelanguagedata();
        const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
        const hheo = JSON.parse(removedTing);
        await mastersyncinsertion(hheo);

        return;
      }
      if (language === 'hindi') {
        const response = await fetch(RemoteUrls.postMultiLanguageUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const extractedData = await response.json();
        const helperList = Object.entries(extractedData);
        const languageResponse = helperList[1][1];
        await clearMultiLanguageTable('multilaguage');
        await insertMultiLanguageItems('hindi.json', languageResponse);
        await AsyncStorage.setItem('languagecheck', 'true');

        const dsasdas = await getAllMultiLanguageItems();
        await fetchingthelanguagedata();

        const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
        const hheo = JSON.parse(removedTing);
        await mastersyncinsertion(hheo);

        return;
      }
      // if (language === "marathi") {
      //   const response = await fetch(RemoteUrls.postMultiLanguageUrl, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   });
      //   // Assuming response.data is an object
      //   const extractedData = await response.json();
      //   const helperList = Object.entries(extractedData);
      //   const languageResponse = helperList[2][1];
      //   await clearMultiLanguageTable('multilaguage');
      //   await insertMultiLanguageItems('marathi.json', languageResponse);
      //   await AsyncStorage.setItem('languagecheck', "true")

      //   const dsasdas = await getAllMultiLanguageItems()
      //   await fetchingthelanguagedata()

      //   const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
      //   const hheo = JSON.parse(removedTing);
      //   await mastersyncinsertion(hheo)

      //   return
      // }
      if (language === 'punjabi') {
        const response = await fetch(RemoteUrls.postMultiLanguageUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // Assuming response.data is an object
        const extractedData = await response.json();
        const helperList = Object.entries(extractedData);
        const languageResponse = helperList[3][1];
        await clearMultiLanguageTable('multilaguage');
        await insertMultiLanguageItems('punjabi.json', languageResponse);
        await AsyncStorage.setItem('languagecheck', 'true');

        const dsasdas = await getAllMultiLanguageItems();
        await fetchingthelanguagedata();

        const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
        const hheo = JSON.parse(removedTing);
        await mastersyncinsertion(hheo);

        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error if any
    } finally {
      setmultilaugagaeloading(false);
    }
  };
  const loginWithOtp = async () => {
    navigation.push('LoginWithOTP');
  };

  return (
    <>
      {/* {isConnected ? (*/}
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="black" />
              <Text>Logging..</Text>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={multilaugagaeloading}
          onRequestClose={() => {
            setmultilaugagaeloading(!multilaugagaeloading);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="black" />
              <Text>Please wait.</Text>
            </View>
          </View>
        </Modal>
        {isrooted === true ? (
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignContent: 'center',
              paddingHorizontal: 20,
            }}>
            <Text style={{textAlign: 'center', fontSize: 18}}>
              Your device appears to be rooted or running on an emulator. The
              app will now close for security reasons.
            </Text>
            <View
              style={{
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <TouchableOpacity
                onPress={() => BackHandler.exitApp()}
                style={{
                  backgroundColor: 'black',
                  width: 60,
                  padding: 10,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 18,
                    textAlign: 'center',
                  }}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.inner_container}>
            <Text style={styles.logintext}>{login}</Text>

            <TextInput
              style={styles.input}
              placeholder={`${usernametxt}`}
              cursorColor="white"
              color="white"
              placeholderTextColor="grey"
              autoCorrect={false}
              autoCapitalize="none"
              value={username}
              onChangeText={val => setUsername(val)}
            />
            <TextInput
              style={styles.input}
              placeholder={`${passwordtxt}`}
              cursorColor="white"
              color="white"
              secureTextEntry
              placeholderTextColor="grey"
              autoCorrect={false}
              autoCapitalize="none"
              value={password}
              onChangeText={val => setPassword(val)}
            />

            <Pressable style={styles.loginbutton} onPress={handleLogin}>
              <Text style={styles.loginbuttonText}>{login}</Text>
            </Pressable>

            {/* <Text style={styles.forgot_password_text} onPress={() => props.navigation.navigate("ChangePassword")}>Forgot Password?</Text> */}
            <Text style={styles.MPinLoginText} onPress={loginWithOtp}>
              {loginwithotp}
            </Text>
            <View style={{top: height - 600}}>
              <View style={styles.selectlanguagecontainer}>
                <TouchableOpacity
                  onPress={() => handleFetchMultipleLanguage('english')}>
                  <Text style={{color: 'white'}}>{languagetxt} : </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFetchMultipleLanguage('english')}>
                  <Text style={styles.languageredtext}> English </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFetchMultipleLanguage('hindi')}>
                  <Text style={styles.languageredtext}> हिंदी </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => handleFetchMultipleLanguage('marathi')}>
   <Text style={styles.languageredtext}>
     मराठी </Text>
 </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => handleFetchMultipleLanguage('punjabi')}>
                  <Text style={styles.languageredtext}> ਪੰਜਾਬੀ </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 20}}>
                <Button
                  onPress={() => props.navigation.navigate('HelpAndSupport')}>
                  <Text style={styles.helpandsupporttext}>
                    {helpnsupporttxt}
                  </Text>
                </Button>
              </View>
            </View>
            <View style={styles.checklogoContainer}>
              <Image
                source={require('../../assets/images/logo/tclogo.png')}
                style={{height: 50, width: 100}}
                resizeMode="contain"
              />
              <Text style={styles.powerByText}>
                Powered by <Text style={styles.checktext}>Check</Text>
                <Text style={styles.exploretext}>Explore</Text>{' '}
              </Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

export default Login;
