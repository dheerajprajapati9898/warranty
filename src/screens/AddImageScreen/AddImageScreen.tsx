import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import {ActivityIndicator, RadioButton} from 'react-native-paper';
import styles from './styles';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchCamera} from 'react-native-image-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {setupDatabase} from '../../db/Registration/database';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  Item,
  insertItem,
  getAllItems,
  updateItem,
  deleteItem,
  getAll,
  getTodayWarrantyDashbaordCount,
  getMonthWarrantyDashbaordCount,
} from '../../db/Registration/sqliteOperations';
import axios from 'axios';
import UpdateMissingImage from './../UploadMissingImage/UploadMissingImage';
import RemoteUrls from '../apiUrl';
import {AESExtensions} from '../AESExtensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllLoginItems} from '../../db/Login/Login';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import {getAllRegexItems, setupRegexDatabase} from '../../db/regex/regex';
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';
import NetInfo from '@react-native-community/netinfo';
import {fetch as fetchssl} from 'react-native-ssl-pinning';
const AddImage = () => {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);

  // const Options = [
  //   { warrantyNo: '100019', mobileNo: '9865348796' },
  //   { warrantyNo: '100153', mobileNo: '9658214736' },
  //   { warrantyNo: '101459', mobileNo: '7985635489' },
  //   { warrantyNo: '102376', mobileNo: '9745213698' },
  //   { warrantyNo: '103258', mobileNo: '9874563210' },
  // ];

  // const [warrantyNumber, setWarrantyNumber] = useState('101697');
  // const [mobilenumber, setmobilenumber] = useState('9768546821');
  const [warrantyNumber, setWarrantyNumber] = useState('');
  const [mobilenumber, setmobilenumber] = useState('');
  // const handleInputChange = (text) => {
  //   const sanitizedText = text.replace(/[^0-9\b]/g, '');
  //   const limitedText = sanitizedText.slice(0, 6);

  //   // setWarrantyNumber(limitedText);
  // };

  const handleMobileNumberInputChange = num => {
    const sanitizedText = num.replace(/[^0-9\b]/g, '');
    const limitedText = sanitizedText.slice(0, 10);

    setMobileNumber(limitedText);
  };

  const navigateTo = (warrantyNo: any) => {
    Alert.alert(`Edit Warranty No. : ${warrantyNo}`);
  };
  const ODOMeterPickCamera = async () => {
    const permission = await check(PERMISSIONS.ANDROID.CAMERA);

    if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result !== RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      }
    }
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log('Response:', response);
        if (response.assets && response.assets.length > 0) {
          setImages(response.assets[0].uri);
        }
      }
    });
  };
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const mainmethod = async () => {
    setWarrantyNumber('');
    setmobilenumber('');
    setsearchresult([]);
    setupMultiLanguageDatabase();
    fetchingthelanguagedata();
    const initializeDatabase = async () => {
      const database = await setupDatabase();
      setDb(database);
      fetchItems(database);
    };
    initializeDatabase();
    await fetchingTheMissigImage();
    setupRegexDatabase();
    feItems();
  };
  const mainapicallmethod = async () => {
    const status = await GetLoginResponse();
    console.log('login statuse response', status);
  };
  const handleConnectivityChange = useCallback(async state => {
    console.log('state.isConnected', state.isConnected);

    console.log('state', state);

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
  const [items, setItems] = useState(null);
  const fetchItems = async (database: SQLiteDatabase) => {
    try {
      const item = await getAllItems(database);
      setItems(item);
    } catch (error) {
      console.error(error);
    }
  };
  const [missingimage, setmissingimage] = useState([]);
  const [isloading, setisloading] = useState(false);

  const fetchingTheMissigImage = async () => {
    const userData = await getAllLoginItems();
    const specificData = {
      Username: userData.Username,
    };

    try {
      const heaaders = await GetHeader();
      const encryptedlogindata = AESExtensions.encryptString(specificData);

      const payload = JSON.stringify({
        requestId: '',
        isEncrypt: '',
        requestData: encryptedlogindata,
        sessionExpiryTime: '',
        userId: '',
      });
      const postingdata = JSON.stringify(payload);
      // return

      const response = await fetchssl(
        RemoteUrls.postWarrantyImageMissingListUrl,
        {
          method: 'POST',
          body: payload,
          headers: heaaders,
          pkPinning: true,
          sslPinning: {
            certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
          },
        },
      )
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
          const responseData = data.responseData; // Do something with the responseData
          const plaintextoflogindata =
            AESExtensions.decryptStringformissingimage(responseData);

          setmissingimage(plaintextoflogindata);
        })
        .catch(async error => {
          console.error('Error fetching data:', error);
          if (error.status === 406) {
            const status = await GetLoginResponse();
            if (status === 200) {
              await fetchingTheMissigImage();
            }
          }
        });
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
        if (status === 200) {
          await fetchingTheMissigImage();
        }
      }
    }
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
  const [searchresult, setsearchresult] = useState([]);
  const [ispresent, setispresent] = useState(false);

  const handleSearchMissingImage = async () => {
    const contactforserialnumberRegex = /^[0-9+\-]+$/;
    const contactRegexstr = regex[3].value;
    const contactRegex = new RegExp(contactRegexstr);
    if (warrantyNumber === '' && mobilenumber === '') {
      Alert.alert('', `${languagedata.lbl_fillField}`, [
        {
          text: `${languagedata.lbl_Ok}`,
        },
      ]);
      return;
    }
    if (warrantyNumber != '') {
      if (!contactforserialnumberRegex.test(warrantyNumber)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_warrantyIdContain}`,
          [
            {
              text: `${languagedata.lbl_Ok}`,
            },
          ],
        );
        return;
      }
    }
    if (mobilenumber != '') {
      if (!contactRegex.test(mobilenumber)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_contactNumberContain}`,
          [
            {
              text: `${languagedata.lbl_Ok}`,
            },
          ],
        );
        return;
      }
    }

    try {
      setisloading(true);
      const data = JSON.parse(missingimage);

      const filtered = data.filter(
        item =>
          item.WarrantyID.toString().includes(warrantyNumber) &&
          item.MobileNo.includes(mobilenumber),
      );

      setsearchresult(filtered);
      if (searchresult.length === 0) {
        setispresent(true);
      }
      // navigation.navigate
      setisloading(false);
    } catch (err) {
      setisloading(false);

      console.log(err);
    } finally {
      setisloading(false);
    }
  };
  const Item = ({item}) => (
    // <TouchableOpacity
    //   onPress={onPress}
    // >
    <Text>{item.MobileNo}</Text>
    // </TouchableOpacity>
  );
  const renderItem = ({missingimage}) => {
    return (
      <Item
        item={missingimage.MobileNo}
        // onPress={() => setSelectedId(item.id)}
      />
    );
  };
  const handleMissingImageUpload = async item => {
    const length1 = 1;
    const length2 = 5;
    const length3 = 4;
    var registrationnumber;
    if (item.Serial_1 != null && item.Serial_2 != null) {
      if (
        (item.Registration_No != 'Not Available' &&
          item.Registration_No != 'New Vehicle') ||
        (item.Registration_No != 'notAvailable' &&
          item.Registration_No != 'newVehicle')
      ) {
        registrationnumber = 'available';
      }
      if (
        item.Registration_No === 'New Vehicle' ||
        item.Registration_No === 'newVehicle'
      ) {
        registrationnumber = 'newVehicle';
      }
      if (
        item.Registration_No === 'Not Available' ||
        item.Registration_No === 'notAvailable'
      ) {
        registrationnumber = 'notAvailable';
      }
      const inputString_1 = item.Serial_1;
      const inputString_2 = item.Serial_2;
      // Hardcoded lengths for splitting

      // Extract segments based on hardcoded lengths
      const segment1_1 = inputString_1.slice(0, length1);
      const segment2_1 = inputString_1.slice(length1, length1 + length2);
      const segment3_1 = inputString_1.slice(
        length1 + length2,
        length1 + length2 + length3,
      );
      const segment1_2 = inputString_2.slice(0, length1);
      const segment2_2 = inputString_2.slice(length1, length1 + length2);
      const segment3_2 = inputString_2.slice(
        length1 + length2,
        length1 + length2 + length3,
      );

      // var segment1_2 = ''
      // var segment2_2 = ''
      // var segment3_2 = ''
      console.log('chjeck');

      const params = {
        warrantyid: item.WarrantyID,
        mobileNumber: item.MobileNo,
        missing_image: item.MissingPhoto,
        segment1_11: segment1_1,
        segment1_22: segment2_1,
        segment1_33: segment3_1,
        segment2_11: segment1_2,
        segment2_22: segment2_2,
        segment2_33: segment3_2,
        registrationnumber: registrationnumber,
      };
      // return
      navigation.navigate('UploadMissingImage', params);
    } else {
      if (
        (item.Registration_No != 'Not Available' &&
          item.Registration_No != 'New Vehicle') ||
        (item.Registration_No != 'notAvailable' &&
          item.Registration_No != 'newVehicle')
      ) {
        registrationnumber = 'available';
      }
      if (
        item.Registration_No === 'New Vehicle' ||
        item.Registration_No === 'newVehicle'
      ) {
        registrationnumber = 'newVehicle';
      }
      if (
        item.Registration_No === 'Not Available' ||
        item.Registration_No === 'notAvailable'
      ) {
        registrationnumber = 'notAvailable';
      }
      const inputString_1 = item.Serial_1;
      // Extract segments based on hardcoded lengths
      const segment1_1 = inputString_1.slice(0, length1);
      const segment2_1 = inputString_1.slice(length1, length1 + length2);
      const segment3_1 = inputString_1.slice(
        length1 + length2,
        length1 + length2 + length3,
      );
      // const segment1_2 = inputString_2.slice(0, length1);
      // const segment2_2 = inputString_2.slice(length1, length1 + length2);
      // const segment3_2 = inputString_2.slice(length1 + length2, length1 + length2 + length3);

      var segment1_2 = '';
      var segment2_2 = '';
      var segment3_2 = '';
      console.log('chjeck');

      const params = {
        warrantyid: item.WarrantyID,
        mobileNumber: item.MobileNo,
        missing_image: item.MissingPhoto,
        segment1_11: segment1_1,
        segment1_22: segment2_1,
        segment1_33: segment3_1,
        segment2_11: segment1_2,
        segment2_22: segment2_2,
        segment2_33: segment3_2,
        registrationnumber: registrationnumber,
      };
      // return
      navigation.navigate('UploadMissingImage', params);
    }

    // console.log("checking data", item.Serial_2);
  };
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color="black" />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.headerText}>
              {languagedata.lbl_MissingImages}
            </Text>
          </View>

          <View style={{flexDirection: 'row', width: '100%'}}>
            <View style={{width: '50%'}}>
              <TextInput
                style={styles.input}
                inputMode="numeric"
                keyboardType="number-pad"
                maxLength={6}
                placeholder={`${languagedata.lbl_WarrantyNumber}`}
                placeholderTextColor="#888"
                onChangeText={value => setWarrantyNumber(value)}
                value={warrantyNumber}
              />
            </View>

            <View style={{width: '50%'}}>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                maxLength={10}
                placeholder={`${languagedata.lbl_MobileNumber}`}
                placeholderTextColor="#888"
                onChangeText={value => {
                  setmobilenumber(value);
                }}
                value={mobilenumber}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSearchMissingImage}>
            <Text style={styles.buttonText}>
              {' '}
              {languagedata.btnSearch}{' '}
              <Icon name="search" size={20} color="white" />
            </Text>
          </TouchableOpacity>

          {isloading ? (
            <ActivityIndicator size={20} color="black" />
          ) : (
            <>
              <View style={styles.radioButtonLabelContainer}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                  }}>
                  <Text style={styles.radioLabelHeader}>
                    {languagedata.lbl_Inbox_WarrantyNo}
                  </Text>
                </View>

                <View style={{width: '50%'}}>
                  <Text style={styles.radioLabelHeader}>
                    {languagedata.lbl_Inbox_MobileNo}
                  </Text>
                </View>
              </View>

              {/* <View style={{width:'100%'}} >
{searchresult.map((item, index) => (
<View style={{justifyContent:'center', width:'100%'}}>
  <TouchableOpacity style={styles.radioButton} onPress={() => navigateTo(item.warrantyNo)}>
      <View style={{width : '50%'}}>
        <Text style={styles.radioLabel_warranty_num}>{item.warrantyNo}</Text>
      </View>
      <View style={{width : '50%'}}>
        <Text style={styles.radioLabel_mobile_num}>{item.mobileNo}</Text>
      </View>
  </TouchableOpacity>
</View>
))} */}
              <ScrollView>
                <View style={{width: '100%'}}>
                  {/* {isloading ? (
<Text>Loading...</Text>
) : ( */}
                  <View>
                    {searchresult.map((item, index) => (
                      <View style={{justifyContent: 'center', width: '100%'}}>
                        <TouchableOpacity
                          style={styles.radioButton}
                          onPress={() => handleMissingImageUpload(item)}>
                          <View style={{width: '50%'}}>
                            {item.WarrantyID === null ? (
                              <Text style={styles.radioLabel_warranty_num}>
                                --
                              </Text>
                            ) : (
                              <Text style={styles.radioLabel_warranty_num}>
                                {item.WarrantyID}
                              </Text>
                            )}
                          </View>
                          <View style={{width: '50%'}}>
                            <Text style={styles.radioLabel_mobile_num}>
                              {item.MobileNo}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {/* <Text style={styles.text}>Missing Photo: {data.MissingPhoto}</Text>*/}
                  </View>
                  {/* )
} */}
                </View>
              </ScrollView>
            </>
          )}
          {/* {
              ispresent ?
                <Text style={{ textAlign: 'center' }}>No result found</Text> :
                <></>
            } */}

          {/* <UpdateMissingImage /> */}

          {/* {missingimage && missingimage.map(item => (
  <Text>{item.MobileNo}</Text>
))} */}
          {/* {
  isloading ?
    <Text>loading</Text> :
    <FlatList
      data={missingimage}
      renderItem={renderItem}
      scrollEnabled={false}
    // keyExtractor={(item) => item.id}
    />
} */}

          {/* <View style={styles.checklogoContainer}>
  <Image source={require('../../assets/images/logo/tclogo.png')} style={{height:50,width: 100}} resizeMode='contain' />
  <Text style={styles.powerByText}>Powered by <Text style={styles.checktext}>Check</Text><Text style={styles.exploretext}>Explore</Text> </Text>
</View> */}
        </ScrollView>
      )}
    </>
  );
};

export default AddImage;
