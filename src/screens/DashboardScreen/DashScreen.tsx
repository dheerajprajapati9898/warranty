import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Alert,
  Button,
  Platform,
  RefreshControl,
  Modal,
  ActivityIndicator,
  Linking,
  AppState,
  Dimensions,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setupDatabase} from '../../db/Registration/database';
// Import SQLite operations and database setup functions
import {searchItems, getAllItems} from '../../db/Registration/sqliteOperations';
import styles from './styles'; // Assuming you have a styles file for your component
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import ViewPDF from '../ViewPDF/ViewPDF';
import axios from 'axios';

import NetInfo from '@react-native-community/netinfo';
import {AESExtensions} from '../AESExtensions';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import RemoteUrls from '../apiUrl';
import {getAllRegexItems, setupRegexDatabase} from '../../db/regex/regex';
import {lightGreen100} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';
import {fetch as fetchssl} from 'react-native-ssl-pinning';
import {Snackbar} from 'react-native-paper';
const Dashboard = () => {
  const navigation = useNavigation();
  const [values, setValues] = useState([]); // State for storing search results
  const [ispresentoffline, setispresentoffline] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(''); // State for mobile number input
  const [warrantyId, setwarrantyId] = useState(''); // State for mobile number input
  const [display, setDisplay] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(null);

  // axios.interceptors.request.use(
  //   (config) => {
  //     // This is where we configure the SSL pinning
  //     ReactNativeSSLPinning({
  //       certs: ['server'],  // 'server' is the name of the certificate file (without extension)
  //       allowInvalidCertificates: false,  // Ensures invalid certs are rejected
  //       validateDomainName: true,  // Optional: Validate the domain name
  //     });

  //     return config;  // Make sure to return the config object for further request processing
  //   },
  //   (error) => {
  //     return Promise.reject(error);  // Handle request errors if any
  //   }
  // );
  // Function to handle confirmation of From Date picker
  const [fromDate, setFromDate] = useState(null);
  const [toDate, settoDate] = useState(null);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [onlinedateuploadfrom, setonlineuploadfromdate] = useState('');
  const [onlinedateuploadto, setonlineuploadtodate] = useState('');
  const [allData, setAllData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recordsPerPage] = useState(5);
  const handleFromDateConfirm = selectedDate => {
    setOpenFromDate(false); // Close From Date picker
    setFromDate(selectedDate); // Update From Date state
    const selectedDates = selectedDate;
    const formattedDate = selectedDates.toISOString().split('T')[0];
    setonlineuploadfromdate(formattedDate);
  };
  const handleToDateConfirm = selectedDate => {
    setOpenToDate(false); // Close From Date picker
    settoDate(selectedDate); // Update From Date state
    const selectedDates = selectedDate;
    const formattedDate = selectedDates.toISOString().split('T')[0];
    setonlineuploadtodate(formattedDate);
  };

  // Function to handle cancellation of Date pickers
  const handlefromCancel = () => {
    setOpenFromDate(false); // Close From Date picker
  };
  const handletoCancel = () => {
    setOpenToDate(false); // Close To Date picker
  };
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  const [appState, setAppState] = useState(AppState.currentState);
  const [previousState, setPreviousState] = useState(null);
  const mainmethod = async () => {
    setupMultiLanguageDatabase();
    fetchingthelanguagedata();
    const initializeDatabase = async () => {
      const database = await setupDatabase();
      setDb(database);
    };
    initializeDatabase();
    setupRegexDatabase();
    feItems();
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
  const handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
    }
    setAppState(nextAppState);
  };
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
  const [regex, setregex] = useState();
  const [checksession, setchecksession] = useState(false);
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
  const [warrantySearchData, setWarrantySearchData] = useState();
  const [ispresentoline, setispresentoline] = useState(false);
  const [isresultfound, setisresultfound] = useState(false);
  const [isdiaplay, setisdiaplay] = useState(false);
  const handleSearch = async () => {
    // const subscription = AppState.addEventListener(
    //   'change',
    //   handleAppStateChange,
    // );

    // const contactRegex = /^[0-9+\-]+$/; // Regex pattern: digits, plus sign, and hyphen
    const contactRegexstr = regex[3].value;

    const contactRegex = new RegExp(contactRegexstr);
    const contactforserialnumberRegex = /^[0-9+\-]+$/;

    if (
      warrantyId === '' &&
      mobileNumber === '' &&
      onlinedateuploadfrom === '' &&
      onlinedateuploadto === ''
    ) {
      Alert.alert('', `${languagedata.lbl_fillField}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    if (warrantyId !== '') {
      if (!contactforserialnumberRegex.test(warrantyId)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_warrantyIdContain}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
    }

    if (mobileNumber !== '') {
      if (!contactRegex.test(mobileNumber)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_contactNumberContain}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
    }

    if (fromDate != null) {
      if (toDate === null) {
        Alert.alert('Error', `${languagedata.lbl_From_ToDate_required}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
    }

    if (toDate != null) {
      if (fromDate === null) {
        Alert.alert('Error', `${languagedata.lbl_From_ToDate_required}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      // return;
    }

    // if (mobileNumber === '' || fromDate === null || toDate === null) {
    //   Alert.alert("Error", "Fields are required!")
    //   return
    // }
    if (warrantySearchData === undefined) {
      setispresentoline(true);
    }

    // Function to format date as YYYY-MM-DD

    // Format fromDate and toDate as YYYY-MM-DD for ORM usage
    // if (fromDate !== '' || toDate !== '') {
    //   const formatDateForORM = date => {
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    //     const day = String(date.getDate()).padStart(2, '0');
    //     return `${year}-${month}-${day}`;
    //   };
    //   const fromDateORMFormat = formatDateForORM(fromDate);
    //   const toDateORMFormat = formatDateForORM(toDate);
    // }

    const username = await AsyncStorage.getItem('Username');

    if (isConnected) {
      const requestdata = JSON.stringify({
        warranty_ID: warrantyId,
        reg_no: '',
        fromDate: onlinedateuploadfrom,
        toDate: onlinedateuploadto,
        User_Name: username,
        dealer_Distributor: '',
        custMobileNo: mobileNumber,
        state_Id: '',
      });

      const encryptedlogindata = AESExtensions.encryptS(requestdata);
      // return
      const payload = JSON.stringify({
        requestId: '',
        isEncrypt: '',
        requestData: encryptedlogindata,
        sessionExpiryTime: '',
        userId: '1',
      });

      try {
        setDisplayData([]);
        setAllData([]);
        setisdiaplay(true);
        const heaaders = await GetHeader();

        await fetchssl(
          RemoteUrls.postSearchWarrantyUrl,
          // 'https://google.com',
          {
            method: 'POST',
            body: payload,
            timeoutInterval: 1000,
            pkPinning: true,
            sslPinning: {
              // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
              certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
            },
            headers: heaaders,
            // headers: heaaders,
          },
        )
          .then(response => response.json()) // Parse the response as JSON
          .then(data => {
            const responseData = data.responseData; // Do something with the responseData
            const plaintextoflogindata =
              AESExtensions.decryptString(responseData);

            setAllData(plaintextoflogindata);
            setLoading(false);
            paginateData(1, plaintextoflogindata);
            setWarrantySearchData(plaintextoflogindata);
          })
          .catch(async error => {
            console.error('Error fetching data:', error);
            if (error.status === 406) {
              setchecksession(true);
              const status = await GetLoginResponse();
            }
          });
      } catch (error) {
        console.error('Error fetching warranty data:', error);
        if (error.response.status === 406) {
          setchecksession(true);

          const status = await GetLoginResponse();
        }
      } finally {
        setisdiaplay(false);
      }
    } else {
      const formatDateForORM = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const fromDateORMFormat = formatDateForORM(fromDate);
      const toDateORMFormat = formatDateForORM(toDate);
      searchItems(db, mobileNumber, fromDateORMFormat, toDateORMFormat)
        .then(results => {
          if (results === null) {
            setispresentoffline(true);
          }
          setValues(results); // Update items state with search results
        })
        .catch(error => {
          console.error('Error searching items:', error);
          // Handle error if needed
        });
    }

    // const helper = {
    //   warranty_ID: warrantyId,
    //   fromDate: fromDateORMFormat,
    //   toDate: toDateORMFormat,
    //   custMobileNo: 9814524624,
    // };

    // subscription.remove();
  };

  const paginateData = (pageNum, data) => {
    const start = (pageNum - 1) * recordsPerPage;
    const end = pageNum * recordsPerPage;
    const newData = data.slice(start, end);

    setDisplayData(prevDisplayData => [...prevDisplayData, ...newData]);
    setPage(pageNum);
  };
  const loadMore = () => {
    const nextPage = page + 1;
    paginateData(nextPage, allData);
  };
  const [value, setValue] = useState({
    name: '',
    mobilenumber: '',
  });
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    // Adjust this threshold as needed to trigger refresh
    if (distanceFromBottom < 100 && !isLoadingMore) {
      setIsLoadingMore(true);
      // fetchData();
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    // Simulated refreshing action
    setTimeout(() => {
      setData([]);
      // fetchData();
      setRefreshing(false);
    }, 1000); // Simulated delay
  };
  const createPDF = item => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL(item.PdfFilePath);
      }
      if (Platform.OS === 'android') {
        //  Linking.openURL(item.PdfFilePath);

        const params = {
          url: item.PdfFilePath,
        };
        navigation.navigate('ViewPDF', params);
      }
    } catch (error) {
      console.log(error);
    }
    subscription.remove();
  };
  const handleClearBtn = async () => {
    setMobileNumber(''); // State for mobile number input
    setwarrantyId('');
    setFromDate(null);
    settoDate(null);
    setonlineuploadfromdate('');
    setonlineuploadtodate('');
    setDisplayData([]);
    setPage(0);
    setAllData([]);
  };
  const {width, height} = Dimensions.get('window');
  const opentodatemodal = async () => {
    setOpenToDate(true);
  };

  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Adjust scroll event throttle as needed
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Snackbar
            visible={checksession}
            duration={1500}
            onDismiss={() => setchecksession(false)}
            action={{
              label: `${languagedata.lbl_close}`,
              onPress: () => {
                // Do something
              },
            }}>
            Session expired!
          </Snackbar>
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size="large" color="black" />
              </View>
            </View>
          </Modal>
          {/* <Button title='asdasdasdasdasdsa' onPress={handlePostRequest}/> */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo/tractor.png')}
              style={{height: 100, width: 100}}
              resizeMode="contain"
            />
          </View>

          <View>
            {isConnected ? (
              <TextInput
                style={styles.input}
                placeholder={`${languagedata.lbl_WarrantyNumber}`}
                placeholderTextColor="#000"
                value={warrantyId}
                onChangeText={text => setwarrantyId(text)}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder={`${languagedata.lbl_WarrantyNumber}`}
                placeholderTextColor="#000"
                value={warrantyId}
                onChangeText={text => setwarrantyId(text)}
              />
            )}

            <TextInput
              value={mobileNumber}
              style={styles.input}
              placeholder={`${languagedata.lbl_MobileNumber}`}
              placeholderTextColor="#000"
              maxLength={10}
              onChangeText={text => setMobileNumber(text)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.calenderContainer}>
            <TouchableOpacity
              style={styles.calenderbutton}
              onPress={() => setOpenFromDate(true)}>
              <Text style={styles.buttonText}>
                {fromDate
                  ? fromDate.toLocaleDateString()
                  : `${languagedata.lbl_SelectFromDate}`}{' '}
                <Icon name="calendar" size={15} color="white" />
              </Text>
            </TouchableOpacity>
            <DatePicker
              title={`${languagedata.lbl_SelectDate}`}
              cancelText={`${languagedata.lbl_Cancel}`}
              confirmText={`${languagedata.lbl_confirm}`}
              modal
              mode="date"
              open={openFromDate}
              date={fromDate || new Date()} // Default to current date if fromDate is null
              onConfirm={handleFromDateConfirm}
              onCancel={handlefromCancel}
              buttonColor="#e11e30"
              dividerColor="#e11e30"
              maximumDate={new Date()}
            />
            <TouchableOpacity
              style={styles.calenderbutton}
              onPress={() => setOpenToDate(true)}>
              <Text style={styles.buttonText}>
                {toDate
                  ? toDate.toLocaleDateString()
                  : `${languagedata.lbl_SelecttoDate}`}{' '}
                <Icon name="calendar" size={15} color="white" />
              </Text>
            </TouchableOpacity>
            <DatePicker
              title={`${languagedata.lbl_SelectDate}`}
              cancelText={`${languagedata.lbl_Cancel}`}
              confirmText={`${languagedata.lbl_confirm}`}
              modal
              mode="date"
              open={openToDate}
              date={toDate || new Date()} // Default to current date if fromDate is null
              onConfirm={handleToDateConfirm}
              onCancel={handletoCancel}
              buttonColor="#e11e30"
              dividerColor="#e11e30"
              maximumDate={new Date()}
            />
          </View>

          <View style={styles.clearnsearchbtncontainer}>
            <TouchableOpacity style={styles.button} onPress={handleClearBtn}>
              <Text style={styles.buttonText}>
                {languagedata.lbl_clear}{' '}
                <Icon name="close" size={16} color="white" />
              </Text>
            </TouchableOpacity>
            <Text> </Text>
            {isdiaplay === true ? (
              <TouchableOpacity
                style={styles.disablebutton}
                onPress={handleSearch}
                disabled={true}>
                <Text style={styles.buttonText}>
                  {' '}
                  {languagedata.Search}{' '}
                  <Icon name="search" size={16} color="white" />
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>
                  {' '}
                  {languagedata.Search}{' '}
                  <Icon name="search" size={16} color="white" />
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Display search results */}
          {isConnected ? (
            <View>
              {isdiaplay === true ? (
                // <ActivityIndicator size={'large'} color={'black'} />
                // <View
                //   style={{
                //     height,
                //     width,
                //     backgroundColor: 'white',
                //     justifyContent: 'center',
                //     alignContent: 'center',
                //     flexDirection: 'column',
                //   }}>
                <Modal
                  transparent={true}
                  visible={isdiaplay}
                  onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                    setisdiaplay(!isdiaplay);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View
                        style={{
                          alignSelf: 'center',
                        }}>
                        <LottieView
                          source={require('./../../assets/serching_animation.json')}
                          autoPlay
                          loop
                          style={styles.lottieview}
                        />
                        <Text
                          style={{
                            marginBottom: 10,
                            fontSize: 15,
                            color: 'black',
                            textAlign: 'center',
                          }}>
                          Searching...
                        </Text>
                      </View>
                    </View>
                  </View>
                </Modal>
              ) : (
                // </View>
                <>
                  <FlatList
                    data={displayData}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                      <>
                        <View style={styles.displayMain}>
                          {/* Display fields */}
                          {/* Example display fields, replace with your actual data */}
                          <View style={styles.displayContainer}>
                            <Text style={styles.displayText}>
                              {' '}
                              <Text style={styles.boldText}>
                                {' '}
                                Warranty Id :
                              </Text>
                            </Text>
                            <Text style={styles.displayText}>
                              {' '}
                              {item.WarrantyID}
                            </Text>
                          </View>

                          <View style={styles.displayContainer}>
                            <Text style={styles.displayText}>
                              {' '}
                              <Text style={styles.boldText}> Customer :</Text>
                            </Text>
                            <Text style={styles.displayText}>
                              {' '}
                              {item.CustomerName}
                            </Text>
                          </View>

                          <View style={styles.displayContainer}>
                            <Text style={styles.displayText}>
                              {' '}
                              <Text style={styles.boldText}> Contact :</Text>
                            </Text>
                            <Text style={styles.displayText}>
                              {' '}
                              {item.MobileNo}
                            </Text>
                          </View>

                          <View style={styles.displayContainer}>
                            <Text style={styles.displayText}>
                              {' '}
                              <Text style={styles.boldText}>
                                {' '}
                                Vehicle Number :
                              </Text>
                            </Text>
                            <Text style={styles.displayText}>
                              {' '}
                              {item.RegistrationNo}
                            </Text>
                          </View>

                          <View style={styles.displayContainer}>
                            <Text style={styles.displayText}>
                              {' '}
                              <Text style={styles.boldText}> Tyre Size :</Text>
                            </Text>
                            <Text style={styles.displayText}> {item.Size}</Text>
                          </View>

                          <View style={styles.displayContainer}>
                            <Text style={styles.displayText}>
                              {' '}
                              <Text style={styles.boldText}>
                                Customer State :
                              </Text>
                            </Text>
                            <Text style={styles.displayText}>
                              {' '}
                              {item.CustomerState}
                            </Text>
                          </View>

                          <View style={styles.displayContainer}>
                            <Text style={styles.displayText}>
                              {' '}
                              <Text style={styles.boldText}>
                                Dealer State :
                              </Text>
                            </Text>
                            <Text style={styles.displayText}>
                              {' '}
                              {item.DealerState}
                            </Text>
                          </View>

                          <View style={styles.displayContainer}>
                            <Text style={styles.displayText}>
                              {' '}
                              <Text style={styles.boldText}>
                                Registration Date :
                              </Text>
                            </Text>
                            <Text style={styles.displayText}>
                              {' '}
                              {item.CreatedDate}
                            </Text>
                          </View>
                          <View>
                            {
                              item.PdfFilePath === null ? (
                                <Text
                                  style={{color: 'red', textAlign: 'center'}}>
                                  {languagedata.lbl_pdf_not_generated}
                                </Text>
                              ) : (
                                // <Text>asdasda</Text>

                                <TouchableOpacity
                                  onPress={() => createPDF(item)}>
                                  <Text
                                    style={{
                                      color: 'red',
                                      textAlign: 'center',
                                      padding: 10,
                                      fontSize: 18,
                                      fontWeight: 'bold',
                                    }}>
                                    {' '}
                                    {languagedata.lbl_viewpdf}{' '}
                                  </Text>
                                </TouchableOpacity>
                              )
                              // <></>
                            }
                          </View>
                        </View>
                      </>
                    )}
                  />
                  <View>
                    {allData.length > displayData.length && (
                      <TouchableOpacity
                        style={styles.loadmorebtn}
                        onPress={loadMore}>
                        <Text style={styles.loadmorebtntext}>
                          {languagedata.lbl_load_more}
                        </Text>
                      </TouchableOpacity>
                      // <Button title="Load More" onPress={loadMore} />
                    )}
                  </View>
                </>
              )}
            </View>
          ) : (
            <FlatList
              data={values}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <>
                  <View style={styles.displayMain}>
                    {/* Display fields */}
                    {/* Example display fields, replace with your actual data */}
                    <View style={styles.displayContainer}>
                      <Text style={styles.displayText}>
                        {' '}
                        <Text style={styles.boldText}> Warranty Id :</Text>
                      </Text>
                      <Text style={styles.displayText}> {item.id}</Text>
                    </View>

                    <View style={styles.displayContainer}>
                      <Text style={styles.displayText}>
                        {' '}
                        <Text style={styles.boldText}> Customer :</Text>
                      </Text>
                      <Text style={styles.displayText}>
                        {' '}
                        {item.customerName}
                      </Text>
                    </View>

                    <View style={styles.displayContainer}>
                      <Text style={styles.displayText}>
                        {' '}
                        <Text style={styles.boldText}> Contact :</Text>
                      </Text>
                      <Text style={styles.displayText}>
                        {' '}
                        {item.mobileNumber}
                      </Text>
                    </View>

                    <View style={styles.displayContainer}>
                      <Text style={styles.displayText}>
                        {' '}
                        <Text style={styles.boldText}> Vehicle Number :</Text>
                      </Text>
                      <Text style={styles.displayText}> MH01SJ0809</Text>
                    </View>

                    <View style={styles.displayContainer}>
                      <Text style={styles.displayText}>
                        {' '}
                        <Text style={styles.boldText}> Tyre Size :</Text>
                      </Text>
                      <Text style={styles.displayText}> {item.tyreSize}</Text>
                    </View>

                    <View style={styles.displayContainer}>
                      <Text style={styles.displayText}>
                        {' '}
                        <Text style={styles.boldText}>Customer State :</Text>
                      </Text>
                      <Text style={styles.displayText}> {item.state}</Text>
                    </View>

                    <View style={styles.displayContainer}>
                      <Text style={styles.displayText}>
                        {' '}
                        <Text style={styles.boldText}>Dealer State :</Text>
                      </Text>
                      <Text style={styles.displayText}> {item.state}</Text>
                    </View>

                    <View style={styles.displayContainer}>
                      <Text style={styles.displayText}>
                        {' '}
                        <Text style={styles.boldText}>Registration Date :</Text>
                      </Text>
                      <Text style={styles.displayText}>
                        {' '}
                        {item.registrationDate}
                      </Text>
                    </View>

                    {/* <TouchableOpacity
                          style={styles.displaybutton}
                          onPress={() => createPDF(item)}>
                          <Text style={styles.buttonText}> View PDF </Text>
                        </TouchableOpacity> */}
                  </View>
                </>
              )}
            />
          )}
          {/* {
              isConnected ?
                <>
                  {
                    ispresentoline ?
                      <Text style={{ textAlign: 'center' }}>No online result found</Text> :
                      <></>
                  }</> :
                <>
                  {
                    ispresentoffline ?
                      <Text style={{ textAlign: 'center' }}>No offline result found</Text> :
                      <></>
                  }</>
            } */}

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
        </ScrollView>
      )}
    </>
  );
};

export default Dashboard;
