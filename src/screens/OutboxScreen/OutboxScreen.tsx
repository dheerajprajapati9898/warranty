//ios

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   TextInput,
//   Modal,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   Alert,
//   RefreshControl,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
//   AppState,
//   Linking,
//   Dimensions,
// } from 'react-native';
// import { RadioButton } from 'react-native-paper';
// import { SQLiteDatabase } from 'react-native-sqlite-storage';
// import { setupDatabase } from './../../db/Registration/database'; // Adjust the import path as necessary
// import {
//   getAllItems,
//   updateItem,
//   deleteItem,
//   getItemsById,
//   getAll,
//   updateSyncStatusWR,
// } from './../../db/Registration/sqliteOperations';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { SelectList } from 'react-native-dropdown-select-list';
// import {
//   setupStateDatabase,
//   getAllStateItems,
//   getStateid,
// } from './../../db/Registration/StateDb';
// import {
//   setupPinCodeDatabase,
//   getAllPinCodeItems,
// } from './../../db/Registration/PinCodeDb';
// import {
//   setupTractorMakeDatabase,
//   getAllTractorMakeItems,
//   getVehicleByVehTypeid,
// } from './../../db/Registration/TractorMakeDb';
// import {
//   setupTractorModelDatabase,
//   getAllTractorModelItems,
//   insertTractorModelItems,
//   getVehicleModelByVehTypeid,
// } from './../../db/Registration/TractorModelDb';
// import {
//   setupBrandNasadmeDatabase,
//   getAllBrandNasadmeItems,
//   insertBrandNasadmeItems,
// } from './../../db/Registration/BrandName';
// import {
//   setupProductNameDatabase,
//   getAllProductNameItems,
//   insertProductNameItems,
// } from './../../db/Registration/ProductNameDb';
// import {
//   setupTyreSizeDatabase,
//   getAllTyreSizeItems,
//   insertTyreSizeItems,
// } from './../../db/Registration/TyreSizeDb';
// import {
//   setupOldTyreBrandNameDatabase,
//   getAllOldTyreBrandNameItems,
//   insertOldTyreBrandNameItems,
// } from './../../db/Registration/OldTyreBrandName';
// import {
//   setupOldTyreCompanyDatabase,
//   getAllOldTyreCompanyItems,
//   insertOldTyreCompanyItems,
// } from './../../db/Registration/OldTyreCompany';
// import styles from './styles';
// import {
//   check,
//   request,
//   PERMISSIONS,
//   RESULTS,
//   openSettings,
// } from 'react-native-permissions';
// import axios from 'axios';
// import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
// import { SimultaneousGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition';
// import {
//   setupLoginDatabase,
//   getAllLoginItems,
//   insertLoginItems,
//   loginInsertChecked,
// } from './../../db/Login/Login';
// import {
//   getAllVehicleTypeItems,
//   setupVehicleTypeDatabase,
// } from '../../db/Registration/VehicleTypeDb';
// import {
//   setupVehicleVariantDatabase,
//   getAllVehicleVariantItems,
//   insertVehicleVariantItems,
//   clearVehicleVariantTable,
//   getVariantByMakeID,
// } from './../../db/Registration/VehicleVariant';
// import { longPressHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';
// import DeviceInfo from 'react-native-device-info';
// import UpdateWarrantyRegistration from '../UpdateWarrantyRegistration/UpdateWarrantyRegistration';
// import WarrantyRegistrationForm from '../RegistrationScreen/RegistrationScreen';
// import { AESExtensions } from '../AESExtensions';
// import NetInfo from '@react-native-community/netinfo';
// import {
//   setupMultiLanguageDatabase,
//   getAllMultiLanguageItems,
//   insertMultiLanguageItems,
//   clearMultiLanguageTable,
// } from './../../db/multilanguage/multilanguage';
// import RemoteUrls from '../apiUrl';
// import LeadDetails from '../LeadDetails';
// import { launchCamera } from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
// import RNFS from 'react-native-fs';
// import GetLocation from 'react-native-get-location';
// import {
//   isLocationEnabled,
//   promptForEnableLocationIfNeeded,
// } from 'react-native-android-location-enabler';
// import moment from 'moment';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import {
//   setupPhotoCategorylistDatabase,
//   getPhotoCategorylistItems,
//   insertPhotoCategorylistItems,
//   clearPhotoCategorylistTable,
//   getPhotoCategorylistbyuseridItems,
// } from './../../db/photocategorylist/photocategorylist';
// import { setupreuploadingimagedbDatabase, getAllreuploadingimagedbItems, insertreuploadingimagedbItems, clearreuploadingimagedbTable, getreuploadingimagedbid, deleteItemById } from './../../db/reuploadingimagedb/reuploadingimagedb'
// import { log } from '@react-native-firebase/crashlytics';
// const Outbox = () => {
//   const [isConnected, setIsConnected] = useState(null);
//   const [option, setOption] = useState({});
//   const [deviceName, setDeviceName] = useState('');
//   // <<<<<<< HEAD
//   const [db, setDb] = useState<SQLiteDatabase | null>(null);
//   const [items, setItems] = useState<Item[] | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   // const [selectedItem, setSelectedItem] = useState<Item | null>(null);
//   const [loginItems, setLoginItems] = useState();
//   const scrollViewRef = useRef();
//   const [refreshing, setRefreshing] = useState(false);
//   const [data, setData] = useState([]);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const handleScroll = event => {
//     const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
//     const distanceFromBottom =
//       contentSize.height - layoutMeasurement.height - contentOffset.y;

//     // Adjust this threshold as needed to trigger refresh
//     if (distanceFromBottom < 100 && !isLoadingMore) {
//       setIsLoadingMore(true);
//       // fetchData();
//     }
//   };
//   const onRefresh = () => {
//     setRefreshing(true);
//     // Simulated refreshing action
//     // fetchItems(db)
//     fetchogin();
//     setTimeout(() => {
//       setData([]);
//       // fetchData();
//       setRefreshing(false);
//     }, 1000); // Simulated delay
//   };
//   const [msg, setmsg] = useState('');
//   const [warrantyid, setwarrantyid] = useState([]);
//   const [appState, setAppState] = useState(AppState.currentState);
//   // const handleAppStateChange = async (nextAppState) => {
//   //   if (appState.match(/inactive|background/) && nextAppState === 'active') {
//   //     console.log('App has come to the foreground!');
//   //     const isGranted = await checkLocationPermission();
//   //     if (isGranted === 'granted') {
//   //       getLocation();
//   //     } else {
//   //       Alert.alert('Permission Required', 'Location permission is needed. Please enable it in the settings.');
//   //     }
//   //   }
//   //   setAppState(nextAppState);
//   // };
//   // // Function to check location permission status
//   // const checkLocationPermission = async () => {
//   //   if (Platform.OS === 'android') {
//   //     try {
//   //       const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
//   //       return status ? 'granted' : 'denied';
//   //     } catch (error) {
//   //       console.warn('Permission check error:', error);
//   //       return 'error';
//   //     }
//   //   } else if (Platform.OS === 'ios') {
//   //     try {
//   //       const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
//   //       switch (result) {
//   //         case RESULTS.GRANTED:
//   //           return 'granted';
//   //         case RESULTS.DENIED:
//   //           return 'denied';
//   //         case RESULTS.BLOCKED:
//   //           return 'blocked';
//   //         case RESULTS.UNAVAILABLE:
//   //           return 'unavailable';
//   //         default:
//   //           return 'error';
//   //       }
//   //     } catch (error) {
//   //       console.warn('Permission check error:', error);
//   //       return 'error';
//   //     }
//   //   }
//   // };
//   // const handleAppStateChange = nextAppState => {
//   //   if (nextAppState === 'active' && appState.match(/inactive|background/)) {
//   //     // App has become active, recheck permissions and fetch location
//   //     // registrationOption();
//   //     requestLocationPermission()

//   //   }
//   //   setAppState(nextAppState);
//   // };
//   const [location, setLocation] = useState(null);
//   useFocusEffect(
//     useCallback(() => {
//       setupreuploadingimagedbDatabase()
//       fetchingthefaildimage()
//       if (Platform.OS === 'android') {
//         const enableResult = promptForEnableLocationIfNeeded();
//         console.log('enableResult', enableResult);
//       }

//       const initializeDatabase = async () => {
//         try {
//           const database = await setupDatabase();
//           setDb(database);
//           await fetchItems(database);
//           await fetchogin();
//           await setupLoginDatabase();
//         } catch (error) {
//           console.error('Error initializing database:', error);
//         }
//       };
//       setupPhotoCategorylistDatabase();
//       fetchphotochategorylist();
//       console.log('avbrthgfafdasd', warrantyid.join(', '));

//       initializeDatabase();
//       const value = items?.map(item =>
//         console.log('Adsadasdasd', item.isStatus === 1),
//       );

//       console.log(value);

//       setWarrantyPostObject([]);
//       const fetchDeviceInfo = async () => {
//         try {
//           const name = await DeviceInfo.getDeviceName();
//           setDeviceName(name);
//         } catch (error) {
//           console.error('Error fetching device name:', error);
//         }
//       };
//       setupMultiLanguageDatabase();
//       fetchingthelanguagedata();
//       fetchDeviceInfo();
//       // console.log("loginItems", loginItems);

//       const unsubscribe = NetInfo.addEventListener(state => {
//         console.log('Connection type:', state.type);
//         console.log('Is connected?', state.isConnected);
//         setIsConnected(state.isConnected);
//       });

//       // Initial check when component mounts
//       NetInfo.fetch().then(state => {
//         setIsConnected(state.isConnected);
//       });

//       // const intervalId = setInterval(() => {
//       //   GetLocation.getCurrentPosition({
//       //     enableHighAccuracy: true,
//       //     timeout: 15000,
//       //   })
//       //     .then(location => {
//       //       setLocation(location);
//       //       console.log(location);
//       //     })
//       //     .catch(error => {
//       //       const { code, message } = error;
//       //       console.warn(code, message);
//       //     });
//       // }, 5000); // fetch location every 5 seconds

//       return () => {
//         // clearInterval(intervalId);
//         unsubscribe();
//       };
//     }, [appState]),
//   );
//   const [failedimagedata, setfailedimagedata] = useState([]);

//   const fetchingthefaildimage = async () => {
//     const data = await getreuploadingimagedbid()
//     console.log("geting failed image name", data);

//     setfailedimagedata(data)
//   }
//   const [languagedata, setlanguagedata] = useState(null);
//   const fetchingthelanguagedata = async () => {
//     try {
//       const dsasdas = await getAllMultiLanguageItems();
//       const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
//       const hheo = JSON.parse(removedTing);
//       console.log('last', hheo);

//       setlanguagedata(hheo);
//       console.log('setting the value');
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const fetchItems = async (database: SQLiteDatabase) => {
//     try {
//       const fetchedItems = await getAllItems(database);
//       setItems(fetchedItems);
//       console.log('fetchedItems', fetchedItems);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const fetchogin = async () => {
//     try {
//       const fetchedItems = await getAllLoginItems();
//       setLoginItems(fetchedItems);
//       // console.log("fetchedItems", fetchedItems);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const navigation = useNavigation();

//   const openModal = selectedItem => {
//     console.log('itemadsasdasdasdas', selectedItem.registrationOption);
//     const params = {
//       id: selectedItem.id,
//       registrationOptions: selectedItem.registrationOption,
//       numberplateimagess: selectedItem.numberplateimage,
//       customerName: selectedItem.customerName,
//       mobileNumber: selectedItem.mobileNumber,
//       address: selectedItem.address,
//       state: selectedItem.state,
//       state_id: selectedItem.state_id,
//       pinCode: selectedItem.pinCode,
//       districtid: selectedItem.districtid,
//       districtname: selectedItem.districtname,
//       cityvillageid: selectedItem.cityvillageid,
//       cityvillagename: selectedItem.cityvillagename,
//       pincodeid: selectedItem.pincodeid,
//       registrationNumber: selectedItem.registrationNumber,
//       registrationDates: selectedItem.registrationDate,
//       make: selectedItem.make,
//       make_id: selectedItem.make_id,
//       model: selectedItem.model,
//       brand: selectedItem.brand,
//       brandid: selectedItem.brandid,
//       productid: selectedItem.productid,
//       series: selectedItem.series,
//       productName: selectedItem.productName,
//       tyreSize: selectedItem.tyreSize,
//       tyreQuantity: selectedItem.tyreQuantity,
//       tyre1SerialNumber2: selectedItem.tyre1SerialNumber2,
//       tyre1SerialNumber3: selectedItem.tyre1SerialNumber3,
//       tyre1Images: selectedItem.tyre1Image,
//       tyre2SerialNumber2: selectedItem.tyre2SerialNumber2,
//       tyre2SerialNumber3: selectedItem.tyre2SerialNumber3,
//       tyre2Images: selectedItem.tyre2Image,
//       invoiceNumber: selectedItem.invoiceNumber,
//       invoiceImage: selectedItem.invoiceImage,
//       invoiceDate: selectedItem.invoiceDate,
//       odoMeterReading: selectedItem.odoMeterReading,
//       odoMeterImage: selectedItem.odoMeterImage,
//       oldTyreCompany: selectedItem.oldTyreCompany,
//       oldtyrebrandid: selectedItem.oldtyrebrandid,
//       oldTyreBrand: selectedItem.oldTyreBrand,
//       oldTyreSize: selectedItem.oldTyreSize,
//       termsAccepteds: selectedItem.termsAccepted,
//       veh_type_id: selectedItem.veh_type_id,
//       veh_type_name: selectedItem.veh_type_name,
//       variantid: selectedItem.variantid,
//       variantname: selectedItem.variantname,
//     };
//     navigation.navigate('UpdateWarrantyRegistration', params);
//     // setSelectedItem(item);
//     // setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     // setSelectedItem(null);
//   };

//   const handleUpdate = async () => {
//     if (!db || !selectedItem) {
//       return;
//     }
//     console.log('state', selectedItem.state, 'stateid', selectedItem.state_id);

//     try {
//       await updateItem(db, selectedItem.id, selectedItem);
//       fetchItems(db);
//       closeModal();
//       Alert.alert('Success', 'Registration Form updated successfully!');
//     } catch (error) {
//       console.error('Error updating item:', error);
//     }
//   };
//   const [registrationOption, setRegistrationOption] = useState(null);
//   const RadioButtonColor: string = '#e11e30';
//   const [selectedOption, setSelectedOption] = useState(false);
//   const [warrantyPostObject, setWarrantyPostObject] = useState([]);

//   const handleRadioButtonChange = value => {
//     console.log(value);

//     setSelectedOption(value);
//   };
//   const [displaywarrantyregistration, setdisplaywarrantyregistration] =
//     useState([]);
//   const [isdisplaywarrantyregistration, setisdisplaywarrantyregistration] =
//     useState(false);
//   // let count = 0;
//   const [itemCounts, setItemCounts] = useState({});

//   // var count = 0;
//   const checkImageExistsAndUpdateCount = async (imagePath, itemId) => {
//     try {
//       if (imagePath) {
//         console.log('Checking image path:', imagePath);

//         const exists = await RNFS.exists(imagePath);
//         if (!exists) {
//           console.log(`Image not found at path: ${imagePath}`);
//           // Return 1 if the image is missing
//           return 1;
//         } else {
//           console.log(`Image found at path: ${imagePath}`);
//           return 0;
//         }
//       } else {
//         console.log('Image path is null or undefined.');
//         return 0;
//       }
//     } catch (error) {
//       console.error('Error checking image existence:', error);
//       return 0;
//     }
//   };

//   // Function to check all images
//   const checkAllImages = async item => {
//     if (item) {
//       try {
//         const imagePaths = [
//           item.tyre1Image,
//           item.tyre2Image,
//           item.odoMeterImage,
//           item.invoiceImage,
//           item.numberplateimage,
//         ];

//         // Accumulate the count of missing images
//         const missingImagesCount = await Promise.all(
//           imagePaths.map(
//             async path => await checkImageExistsAndUpdateCount(path, item.id),
//           ),
//         );

//         // Sum up the missing images
//         const totalMissing = missingImagesCount.reduce(
//           (acc, count) => acc + count,
//           0,
//         );

//         // Update the count for the specific item
//         setItemCounts(prev => ({ ...prev, [item.id]: totalMissing }));
//       } catch (error) {
//         console.error('Error checking all images:', error);
//       }
//     }
//   };

//   const handleCheckboxChange = async (index, item) => {
//     item.isChecked = !item.isChecked;
//     if (item.isChecked) {
//       const warrantyData = await getItemsById(db, item.id);

//       console.log('warrantyDatasdasdasdasa', warrantyData);
//       setWarrantyPostObject([...warrantyPostObject, warrantyData[0]]);
//       console.log('warrantyData', warrantyPostObject);
//       // setItemCounts(0)
//       // await checkAllImages(item)
//     } else {
//       const updatedItems = warrantyPostObject.filter(
//         items => items.id !== item.id,
//       );
//       console.log('updatedItems', updatedItems);

//       setWarrantyPostObject(updatedItems);
//     }
//   };
//   const renderItem1 = ({ item }) => {
//     return (
//       <View style={{ borderWidth: 1, borderRadius: 12, borderColor: 'grey', padding: 10, marginVertical: 7, flex: 1 }}>
//         <View>
//           <Image style={{ borderRadius: 12 }}
//             source={{
//               uri: `file://${item.file}`,
//             }}
//             width={width - 61}
//             height={300}
//           />
//         </View>
//         <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
//           <View>
//             <Text>Warranty ID: {item.warranty_id}</Text>
//             <Text>Failed Image: {item.image_name}</Text>
//             <Text>mobilenumber: {item.mobilenumber}</Text>
//             <Text>categoryId: {item.image_category_id}</Text>
//             <Text>agency_id: {item.agency_id}</Text>
//             <Text>lattitude: {item.Latitude}</Text>
//             <Text>longitude {item.Longitude}</Text>
//             <Text>InspectionDateTime: {item.InspectionDateTime}</Text>
//             <Text>PhotoName: {item.PhotoName}</Text>
//             <Text>errcode: {item.errcode}</Text>
//             {/* <Text>hearder: {item.herder}</Text> */}

//             <Text>header: {item.herder}</Text>

//             <Text>requestdata: {item.payload}</Text>
//             <Text>formdata: {item.formdata}</Text>
//           </View>
//           {/* <View>
//             <TouchableOpacity onPress={() => handleUploadImage(item)}
//               style={{ padding: 10, backgroundColor: '#e11f10', borderRadius: 12 }}><Text style={{ color: 'white' }}>Upload</Text></TouchableOpacity>
//           </View> */}
//         </View>

//       </View>
//     )
//   }
//   const renderItem = ({ item }) => {
//     // const count = itemCounts[item.id] || 0; // Get count for specific item

//     return (
//       <View
//         style={{
//           borderWidth: 1,
//           padding: 10,
//           borderRadius: 5,
//           marginBottom: 10,
//         }}>
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//           }}>
//           <Text>id: {item.id}</Text>
//           {item.isStatus ? (
//             <Text
//               style={{
//                 textAlign: 'center',
//                 backgroundColor: '#a6edb4',
//                 width: 80,
//                 color: 'black',
//                 borderRadius: 15,
//               }}>
//               {languagedata.lbl_Complete}
//             </Text>
//           ) : (
//             <Text
//               style={{
//                 textAlign: 'center',
//                 backgroundColor: '#9ec0f7',
//                 width: 80,
//                 color: 'black',
//                 borderRadius: 15,
//               }}>
//               {languagedata.lbl_Pending}
//             </Text>
//           )}
//         </View>

//         {/* Display item information */}
//         <Text>Registration Number: {item.registrationNumber}</Text>
//         <Text>Registration Option: {item.registrationOption}</Text>
//         <Text>Customer Name: {item.customerName}</Text>
//         <Text>Mobile Number: {item.mobileNumber}</Text>
//         <Text>{item.tyre1Image}</Text>
//         <Text>{item.tyre2Image}</Text>
//         <Text>{item.odoMeterImage}</Text>
//         <Text>{item.invoiceImage}</Text>
//         <Text>{item.numberplateimage}</Text>
//         <Text>{item.tyre1SerialNumber2}</Text>
//         <Text>{item.tyre1SerialNumber3}</Text>
//         <Text>{item.tyre2SerialNumber2}</Text>
//         <Text>{item.tyre2SerialNumber3}</Text>

//         {/* Display count for this specific item */}
//         {/* <Text>Count: {count}</Text>

//         {count === 0 ? (
//           <Text style={{ color: 'white', backgroundColor: '#f58e97', borderLeftWidth: 3, borderLeftColor: 'red', padding: 8, borderRadius: 5 }}>
//             No image available
//           </Text>
//         ) : null} */}

//         <View style={styles.cardGroup1}>
//           <View
//             style={[
//               styles.buttoncard,
//               item.isStatus ? styles.buttonDisabled : styles.buttonEnabled,
//             ]}>
//             <TouchableOpacity
//               disabled={item.isStatus === 1}
//               onPress={async () => {
//                 if (!db) {
//                   return;
//                 }
//                 await deleteItem(db, item.id);
//                 fetchItems(db);
//               }}>
//               <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
//                 {languagedata.lbl_Delete}
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <View
//             style={[
//               styles.buttoncard,
//               item.isStatus ? styles.buttonDisabled : styles.buttonEnabled,
//             ]}>
//             <TouchableOpacity
//               disabled={item.isStatus === 1}
//               onPress={() => openModal(item)}>
//               <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
//                 {languagedata.lbl_Edit}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const [loading, setloading] = useState(false);
//   const Options = [
//     { warrantyNo: '100019', mobileNo: '9865348796' },
//     { warrantyNo: '100153', mobileNo: '9658214736' },
//     { warrantyNo: '101459', mobileNo: '7985635489' },
//     { warrantyNo: '102376', mobileNo: '9745213698' },
//     { warrantyNo: '103258', mobileNo: '9874563210' },
//   ];

//   const navigateTo = (warrantyNo: any) => {
//     Alert.alert(`Edit Warranty No. : ${warrantyNo}`);
//     console.log(`navigating to page of warranty number :  ${warrantyNo}`);
//   };

//   // const [photocategorylist, setphotocategorylist] = useState()

//   const [photocategorylist, setphotocategorylist] = useState(null);

//   const fetchphotochategorylist = async () => {
//     console.log('check once');

//     try {
//       const photocategorylistdata = await getPhotoCategorylistItems();
//       setphotocategorylist(photocategorylistdata);
//       console.log('photocategorylist updated:', photocategorylistdata);
//     } catch (error) {
//       console.error('Error fetching photo category list:', error);
//     }
//   };

//   // const [currentlocationlatitude, setcurrentlocartionlatitude] = useState('')
//   // const [currentlocationlongitude, setcurrentlocartionlongitude] = useState('')
//   var latitudeoflocation = '';
//   var longitudeoflocation = '';
//   var checklocation = 'enabled';
//   const handleCheckPressed = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const enableResult = await promptForEnableLocationIfNeeded();
//         console.log('enableResult', enableResult);
//         checklocation = enableResult;
//         if (enableResult === 'enabled' || enableResult === 'already-enabled') {
//           const position = await GetLocation.getCurrentPosition({
//             enableHighAccuracy: true,
//             timeout: 60000,
//           });

//           const { latitude, longitude } = position;
//           console.log('Latitude:', latitude);
//           console.log('Longitude:', longitude);

//           latitudeoflocation = latitude.toString();
//           longitudeoflocation = longitude.toString();
//         }
//       } catch (error: unknown) {
//         if (error instanceof Error) {
//           console.error(error.message);
//         }
//       }
//     }
//   };
//   // function formatDateToISO(date) {
//   //   const year = date.getFullYear();
//   //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//   //   const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits

//   //   return `${year}-${month}-${day}`;
//   // }
//   const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
//   const failedimagename = [];
//   const [serversubmitloading, setserversubmitloading] = useState(false);
//   const uploadimage = async (
//     warrantyid,
//     file,
//     contactnumber,
//     imagename,
//     catogoruid,
//     latitude,
//     longitude,
//     // logVar,
//     aagencyId,
//     createdby,
//   ) => {
//     // var location = await getLocation();

//     // setcurrentlocartionlatitude
//     // setcurrentlocartionlongitude
//     // const now = new Date();
//     // const formattedDate = formatDateToISO(now);
//     console.log(
//       'asdasdas',
//       warrantyid,
//       file,
//       contactnumber,
//       imagename,
//       catogoruid,
//       latitude,
//       longitude,
//       logVar,
//       aagencyId,
//     );

//     const now = moment();

//     const formattedDate = now.format('YYYY-MM-DD HH:mm:ss');
//     const timestamp = Date.now();
//     const generatedId = `uploadedimageby_${contactnumber}_${timestamp}`;

//     const formData = new FormData();
//     const photoname = `${imagename}.${file.split('.').pop()}`

//     const requestData = {
//       WarrantyId: warrantyid,
//       TempId: generatedId,
//       PhotoName: photoname,
//       CategoryId: catogoruid,
//       PhotoURL: `file://${file}`,
//       Latitude: latitude,
//       Longitude: longitude,
//       PhotoCaptureAddress: '',
//       PhotoUploadedBySystem: 'Mobile',
//       CreatedBy: createdby,
//       ModifiedBy: '',
//       ModifyDate: '',
//       AgencyId: aagencyId,
//       InspectionDateTime: formattedDate,
//       ServiceType: '',
//     };
//     const imageextension = file.split('.').pop().toLowerCase();
//     if (
//       imageextension !== 'jpg' &&
//       imageextension !== 'jpeg' &&
//       imageextension !== 'png'
//     ) {
//       Alert.alert('Error', 'Only JPG, JPEG, PNG format expected!');
//       return;
//     }
//     await delay(2500);
//     try {
//       // setuploadingimagename(`uploading ${imagename}`)

//       formData.append('file', {
//         uri: `file://${file}`,
//         type: 'image/jpeg',
//         name: file.split('/').pop(),
//       });
//       formData.append('RequestId', '');
//       formData.append('IsEncrypt', '');
//       formData.append('RequestData', JSON.stringify(requestData));
//       formData.append('SessionExpiryTime', '');
//       formData.append('UserId', '');
//       // formData.append("RequestData", JSON.stringify(requestData));
//       console.log('formData', formData);
//       // return
//       const response = await axios.post(RemoteUrls.postUploadUrl, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Access-Control-Allow-Origin': '*',
//           Accept: 'application/json',
//           'Cache-Control': 'no-cache',
//         },
//       });
//       console.log('Upload image response', response);
//       if (response.status === 200) {
//         // setuploadingimagename(`uploaded ${imagename}`)

//         console.log('Success', 'Image has been uploaded successfully');
//       }
//       const formdatasending = {
//         'Content-Type': 'multipart/form-data',
//         'Access-Control-Allow-Origin': '*',
//         Accept: 'application/json',
//         'Cache-Control': 'no-cache',
//       }
//       const herderdata = JSON.stringify(formdatasending)
//       const datarequest = JSON.stringify(requestData)
//       const dataformdata = JSON.stringify(formData)
//       if (response.status === 400) {
//         await insertreuploadingimagedbItems(warrantyid,
//           file,
//           contactnumber,
//           catogoruid,
//           imagename,
//           aagencyId,
//           latitude,
//           longitude,
//           formattedDate,
//           photoname,
//           response.status.toString(),
//           datarequest.toString(),
//           dataformdata.toString(),
//           herderdata.toString(),
//           0
//         )
//       }
//       if (response.status === 204) {
//         await insertreuploadingimagedbItems(warrantyid,
//           file,
//           contactnumber,
//           catogoruid,
//           imagename,
//           aagencyId,
//           latitude,
//           longitude,
//           formattedDate,
//           photoname,
//           response.status.toString(),
//           datarequest.toString(),
//           dataformdata.toString(),
//           herderdata.toString(),
//           0
//         )
//       }
//       if (response.status === 404) {
//         await insertreuploadingimagedbItems(warrantyid,
//           file,
//           contactnumber,
//           catogoruid,
//           imagename,
//           aagencyId,
//           latitude,
//           longitude,
//           formattedDate,
//           photoname,
//           response.status.toString(),
//           datarequest.toString(),
//           dataformdata.toString(),
//           herderdata.toString(),
//           0
//         )
//       }
//       if (response.status === 500) {
//         await insertreuploadingimagedbItems(warrantyid,
//           file,
//           contactnumber,
//           catogoruid,
//           imagename,
//           aagencyId,
//           latitude,
//           longitude,
//           formattedDate,
//           photoname,
//           response.status.toString(),
//           datarequest.toString(),
//           dataformdata.toString(),
//           herderdata.toString(),
//           1
//         )
//       }

//     } catch (error) {

//       console.log('imagenameasd', imagename);

//     }
//   };

//   const retryimageuploadinios = async (
//     warrantynumber,
//     agencyid,
//     foundItem,
//     logVar,
//   ) => {
//     GetLocation.getCurrentPosition({
//       enableHighAccuracy: true,
//       timeout: 60000,
//     })
//       .then(async location => {
//         const { latitude, longitude } = location;
//         console.log('Latitude:', latitude);
//         console.log('Longitude:', longitude);
//         failedimagename.map(async failedimage => {
//           if (failedimage === 'RegistrationNo') {
//             let retrycount = 3;
//             let noofattempt = 0;

//             while (noofattempt < retrycount) {
//               try {
//                 if (foundItem.numberplateimage != null) {
//                   await uploadimage(
//                     warrantynumber,
//                     foundItem.numberplateimage,
//                     foundItem.mobileNumber,
//                     photocategorylist[0].Photo_Category_ID,
//                     photocategorylist[0].Photo_Category_Name,
//                     latitude,
//                     longitude,
//                     agencyid,
//                     loginItems.Username,
//                     logVar,
//                   );
//                 }
//               } catch (error) {
//                 noofattempt++;
//                 console.log('error RegistrationNo: ', error);
//               }
//             }
//           }
//           if (failedimage === 'Serial_1') {
//             let retrycount = 3;
//             let noofattempt = 0;
//             while (noofattempt < retrycount) {
//               try {
//                 if (foundItem.tyre1Image != null) {
//                   await uploadimage(
//                     warrantynumber,
//                     foundItem.tyre1Image,
//                     foundItem.mobileNumber,
//                     photocategorylist[1].Photo_Category_ID,
//                     photocategorylist[1].Photo_Category_Name,
//                     latitude,
//                     longitude,
//                     agencyid,
//                     loginItems.Username,
//                     logVar,
//                   );
//                 }
//               } catch (error) {
//                 noofattempt++;
//                 console.log('error RegistrationNo: ', error);
//               }
//             }
//           }
//           if (failedimage === 'Serial_2') {
//             let retrycount = 3;
//             let noofattempt = 0;
//             while (noofattempt < retrycount) {
//               try {
//                 if (foundItem.tyre2Image != null) {
//                   await uploadimage(
//                     warrantynumber,
//                     foundItem.tyre2Image,
//                     foundItem.mobileNumber,
//                     photocategorylist[2].Photo_Category_ID,
//                     photocategorylist[2].Photo_Category_Name,
//                     latitude,
//                     longitude,
//                     agencyid,
//                     loginItems.Username,
//                     logVar,
//                   );
//                 }
//               } catch (error) {
//                 noofattempt++;
//                 console.log('error RegistrationNo: ', error);
//               }
//             }
//           }
//           if (failedimage === 'InvoiceNumber') {
//             let retrycount = 3;
//             let noofattempt = 0;
//             while (noofattempt < retrycount) {
//               try {
//                 if (foundItem.invoiceImage != null) {
//                   await uploadimage(
//                     warrantynumber,
//                     foundItem.invoiceImage,
//                     foundItem.mobileNumber,
//                     photocategorylist[5].Photo_Category_ID,
//                     photocategorylist[5].Photo_Category_Name,
//                     latitude,
//                     longitude,
//                     agencyid,
//                     loginItems.Username,
//                     logVar,
//                   );
//                 }
//               } catch (error) {
//                 noofattempt++;
//                 console.log('error RegistrationNo: ', error);
//               }
//             }
//           }
//           if (failedimage === 'ODOMeter') {
//             let retrycount = 3;
//             let noofattempt = 0;
//             while (noofattempt < retrycount) {
//               try {
//                 if (foundItem.odoMeterImage != null) {
//                   await uploadimage(
//                     warrantynumber,
//                     foundItem.odoMeterImage,
//                     foundItem.mobileNumber,
//                     photocategorylist[6].Photo_Category_ID,
//                     photocategorylist[6].Photo_Category_Name,
//                     latitude,
//                     longitude,
//                     agencyid,
//                     loginItems.Username,
//                     logVar,
//                   );
//                 }
//               } catch (error) {
//                 noofattempt++;
//                 console.log('error RegistrationNo: ', error);
//               }
//             }
//           }
//         });
//       })
//       .catch(error => {
//         const { code, message } = error;
//         console.warn(code, message);
//       });
//   };

//   const retryimageupload = async (
//     warrantynumber,
//     agencyid,
//     foundItem,
//     logVar,
//   ) => {
//     if (Platform.OS === 'ios') {
//       await retryimageuploadinios(warrantynumber, agencyid, foundItem, logVar);
//     }
//   };
//   const warrantyidsasdasd = [];

//   const handleLoop = async () => {
//     if (isConnected === false) {
//       Alert.alert('', 'Please check the internet!');
//       return;
//     }
//     setwarrantyid([]);
//     console.log('check', items);
//     const checkedItems = items.filter(item => item.isChecked);

//     for (var i = 0; i < checkedItems.length; i++) {
//       try {
//         const foundItem = warrantyPostObject.find(
//           warrantyitem => warrantyitem.id === checkedItems[i].id,
//         );

//         // return
//         // await handlemodifyandsubmit(foundItem);

//         const filteredInput = foundItem.address.replace(/(\r\n|\n|\r)/g, ' ');
//         // await fetchphotochategorylist();
//         const userData = await getAllLoginItems();

//         if (Platform.OS === 'android') {
//           try {
//             setloading(true);
//             const enableResult = await promptForEnableLocationIfNeeded();
//             console.log('enableResult', enableResult);
//             // checklocation = enableResult
//             // if (enableResult === 'enabled' || enableResult === 'already-enabled') {
//             const position = await GetLocation.getCurrentPosition({
//               enableHighAccuracy: true,
//               timeout: 60000,
//             });

//             const { latitude, longitude } = position;
//             console.log('Latitude:', latitude);
//             console.log('Longitude:', longitude);
//             if (latitude === null || longitude === null) {
//               Alert.alert('Error', 'Failed to proccess due to location access');
//               return;
//             }
//             var registionselecteddata;
//             if (
//               foundItem.registrationOption === 'Not Available' ||
//               foundItem.registrationOption === 'New Vehicle'
//             ) {
//               registionselecteddata = foundItem.registrationOption;
//             } else {
//               registionselecteddata = foundItem.registrationNumber;
//             }
//             if (
//               foundItem.tyre2SerialNumber2 === '' &&
//               foundItem.tyre2SerialNumber3 === ''
//             ) {
//               const requestData = {
//                 Registration_No: registionselecteddata,
//                 CustomerName: foundItem.customerName,
//                 MobileNo: foundItem.mobileNumber,
//                 EmailId: loginItems.EmailId,
//                 Remark: null,
//                 Company: 'YOKOHAMA',
//                 IsDeclaretion: foundItem.termsAccepted,
//                 Agency_Id: loginItems.AgencyId,
//                 InvoiceNo: foundItem.invoiceNumber,
//                 InvoiceDate: foundItem.invoiceDate,
//                 InvoiceAmount: '',
//                 User_Device_Formation: deviceName,
//                 CreatedFor: 'self',
//                 MappingCodeCode: null,
//                 Address: filteredInput,
//                 State_Id: foundItem.state_id,
//                 State_Name: foundItem.state,
//                 District_id: foundItem.districtid,
//                 District_Name: foundItem.districtname,
//                 City_Id: foundItem.cityvillageid,
//                 City_Name: foundItem.cityvillagename,
//                 PinCode_Id: foundItem.pincodeid,
//                 PinCode_Name: foundItem.pinCode,
//                 ODOMeter: foundItem.odoMeterReading,
//                 Type_of_Machine_Id: foundItem.veh_type_id,
//                 Type_of_Machine_Name: foundItem.veh_type_name,
//                 Make_Id: foundItem.make_id,
//                 Make_Name: foundItem.make,
//                 Model_Id: null,
//                 Model_Name: foundItem.model,
//                 Variant_Id: foundItem.variantid,
//                 Variant_Name: foundItem.variantname,
//                 RegistrationDate: foundItem.registrationDate,
//                 ManufacturerDate: null,
//                 BrandName: foundItem.brand,
//                 ProductName: foundItem.productName,
//                 Serial_1:
//                   foundItem.series +
//                   foundItem.tyre1SerialNumber2 +
//                   foundItem.tyre1SerialNumber3,
//                 Serial_Number: null,
//                 Createdby: loginItems.Username,
//                 Photo_Temp_Id: null,
//                 TyreSize: foundItem.tyreSize,
//                 NoOfTyres: foundItem.tyreQuantity,
//                 OldTyre_CompanyName: foundItem.oldTyreCompany,
//                 OldTyre_BrandName: foundItem.oldTyreBrand,
//                 OldTyre_Size: foundItem.oldTyreSize,
//               };
//               const encryptedlogindata = AESExtensions.encryptSs(
//                 JSON.stringify(requestData),
//               );
//               console.log(
//                 'encdadwefsdfasdfa  if ',
//                 JSON.stringify(JSON.stringify(requestData)),
//               );
//               // return
//               const payload = {
//                 requestId: '',
//                 isEncrypt: '',
//                 requestData: encryptedlogindata,
//                 sessionExpiryTime: '',
//                 userId: '',
//               };
//               // console.log(payload);
//               // return

//               try {
//                 // console.log("Asdasdasdadasdasdas if", photocategorylist[0].Photo_Category_Name, photocategorylist[0].Photo_Category_ID);

//                 const response = await axios.post(
//                   RemoteUrls.postWarrantyRegistrationUrl,
//                   payload,
//                 );
//                 console.log('response', response.data);
//                 // console.log("response", response.data)

//                 // const parsevalue = JSON.parse(response.data.requestData)
//                 const plaintextoflogindata = AESExtensions.decryptString(
//                   response.data.responseData,
//                 );
//                 // return
//                 console.log(
//                   'plaintextoflogindata.WarrantyNumber',
//                   plaintextoflogindata.WarrantyNumber,
//                 );
//                 // warrantyidsasdasd.push(plaintextoflogindata.WarrantyNumber)

//                 // return

//                 if (response.status === 200) {
//                   if (foundItem.numberplateimage != null) {
//                     var logVar = 'siddhant';
//                     console.log(
//                       logVar,
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.numberplateimage,
//                       foundItem.mobileNumber,
//                       photocategorylist[0].Photo_Category_Name,
//                       photocategorylist[0].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                     );

//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.numberplateimage,
//                       foundItem.mobileNumber,
//                       photocategorylist[0].Photo_Category_Name,
//                       photocategorylist[0].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   if (foundItem.odoMeterImage != null) {
//                     var logVar = 'siddhant2';
//                     console.log(
//                       logVar,
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.odoMeterImage,
//                       foundItem.mobileNumber,
//                       photocategorylist[6].Photo_Category_Name,
//                       photocategorylist[6].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                     );
//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.odoMeterImage,
//                       foundItem.mobileNumber,
//                       photocategorylist[6].Photo_Category_Name,
//                       photocategorylist[6].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   if (foundItem.tyre1Image != null) {
//                     var logVar = 'siddhant3';
//                     console.log(
//                       logVar,
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.tyre1Image,
//                       foundItem.mobileNumber,
//                       photocategorylist[1].Photo_Category_Name,
//                       photocategorylist[1].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                     );

//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.tyre1Image,
//                       foundItem.mobileNumber,
//                       photocategorylist[1].Photo_Category_Name,
//                       photocategorylist[1].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   if (foundItem.tyre2Image != null) {
//                     var logVar = 'siddhant4';
//                     console.log(
//                       logVar,
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.tyre2Image,
//                       foundItem.mobileNumber,
//                       photocategorylist[2].Photo_Category_Name,
//                       photocategorylist[2].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                     );

//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.tyre2Image,
//                       foundItem.mobileNumber,
//                       photocategorylist[2].Photo_Category_Name,
//                       photocategorylist[2].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   if (foundItem.invoiceImage != null) {
//                     var logVar = 'siddhant5';
//                     console.log(
//                       logVar,
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.invoiceImage,
//                       foundItem.mobileNumber,
//                       photocategorylist[5].Photo_Category_Name,
//                       photocategorylist[5].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                     );

//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.invoiceImage,
//                       foundItem.mobileNumber,
//                       photocategorylist[5].Photo_Category_Name,
//                       photocategorylist[5].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   const payload = {
//                     requestId: '',
//                     isEncrypt: '',
//                     requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserId}\",\"StatusCode\":\"0\"}`,
//                     sessionExpiryTime: '',
//                     userId: '',
//                   };
//                   try {
//                     const response = await axios.post(
//                       RemoteUrls.postFinalStatusUpdateUel,
//                       payload,
//                     );
//                     console.log('response', response.data);
//                     if (response.status.responseCode === 200) {
//                       warrantyidsasdasd.push(
//                         plaintextoflogindata.WarrantyNumber,
//                       );

//                       await updateSyncStatusWR(db, foundItem.id, true);
//                       fetchItems(db);
//                       setWarrantyPostObject([]);
//                       if (i === checkedItems.length) {
//                         Alert.alert(
//                           'Success',
//                           `Warranty Registered Successfully with id(s): ${warrantyidsasdasd}`,
//                           // 'Warranty Registered Successfully with id(s): 111111',
//                         );
//                         console.log('checking alert in');
//                       }
//                     }
//                   } catch (error) {
//                     console.log('error', error);
//                   }
//                   setloading(false);
//                 } else {
//                   setloading(false);

//                   console.error('Something went wrong');
//                 }
//               } catch (error) {
//                 setloading(false);

//                 console.log(error);
//               }
//               // finally {
//               //   setloading(false)
//               // }
//               return;
//             } else {
//               const requestData = {
//                 Registration_No: registionselecteddata,
//                 CustomerName: foundItem.customerName,
//                 MobileNo: foundItem.mobileNumber,
//                 EmailId: loginItems.EmailId,
//                 Remark: null,
//                 Company: 'YOKOHAMA',
//                 IsDeclaretion: foundItem.termsAccepted,
//                 Agency_Id: loginItems.AgencyId,
//                 InvoiceNo: foundItem.invoiceNumber,
//                 InvoiceDate: foundItem.invoiceDate,
//                 InvoiceAmount: '',
//                 User_Device_Formation: deviceName,
//                 CreatedFor: 'self',
//                 MappingCodeCode: null,
//                 Address: filteredInput,
//                 State_Id: foundItem.state_id,
//                 State_Name: foundItem.state,
//                 District_id: foundItem.districtid,
//                 District_Name: foundItem.districtname,
//                 City_Id: foundItem.cityvillageid,
//                 City_Name: foundItem.cityvillagename,
//                 PinCode_Id: foundItem.pincodeid,
//                 PinCode_Name: foundItem.pinCode,
//                 ODOMeter: foundItem.odoMeterReading,
//                 Type_of_Machine_Id: foundItem.veh_type_id,
//                 Type_of_Machine_Name: foundItem.veh_type_name,
//                 Make_Id: foundItem.make_id,
//                 Make_Name: foundItem.make,
//                 Model_Id: null,
//                 Model_Name: foundItem.model,
//                 Variant_Id: foundItem.variantid,
//                 Variant_Name: foundItem.variantname,
//                 RegistrationDate: foundItem.registrationDate,
//                 ManufacturerDate: null,
//                 BrandName: foundItem.brand,
//                 ProductName: foundItem.productName,
//                 Serial_1:
//                   foundItem.series +
//                   foundItem.tyre1SerialNumber2 +
//                   foundItem.tyre1SerialNumber3,
//                 Serial_2:
//                   foundItem.series +
//                   foundItem.tyre2SerialNumber2 +
//                   foundItem.tyre2SerialNumber3,
//                 Serial_3: null,
//                 Serial_4: null,
//                 Serial_Number: null,
//                 Createdby: loginItems.Username,
//                 Photo_Temp_Id: null,
//                 TyreSize: foundItem.tyreSize,
//                 NoOfTyres: foundItem.tyreQuantity,
//                 OldTyre_CompanyName: foundItem.oldTyreCompany,
//                 OldTyre_BrandName: foundItem.oldTyreBrand,
//                 OldTyre_Size: foundItem.oldTyreSize,
//               };
//               const encryptedlogindata = AESExtensions.encryptSs(
//                 JSON.stringify(requestData),
//               );
//               console.log(
//                 'encdadwefsdfasdfa else',
//                 JSON.stringify(JSON.stringify(requestData)),
//               );
//               // return
//               const payload = {
//                 requestId: '',
//                 isEncrypt: '',
//                 requestData: encryptedlogindata,
//                 sessionExpiryTime: '',
//                 userId: '',
//               };
//               // console.log(payload);
//               // return
//               console.log('warranty nodasdasdasdasd ');
//               try {
//                 // console.log("Asdasdasdadasdasdas", photocategorylist[0].Photo_Category_Name, photocategorylist[0].Photo_Category_ID);
//                 // return
//                 const response = await axios.post(
//                   RemoteUrls.postWarrantyRegistrationUrl,
//                   payload,
//                 );
//                 console.log('response', response.data);
//                 // console.log("response", response.data)

//                 // const parsevalue = JSON.parse(response.data.requestData)
//                 const plaintextoflogindata = AESExtensions.decryptString(
//                   response.data.responseData,
//                 );
//                 console.log('Asdasdasd', plaintextoflogindata);
//                 console.log(
//                   'plaintextoflogindata.WarrantyNumber',
//                   plaintextoflogindata.WarrantyNumber,
//                 );
//                 console.log('nestphotocategorylist', photocategorylist);
//                 console.log('nestlatitude', latitude);
//                 console.log('nestlongitude', longitude);
//                 console.log('nestnumberplateimage', foundItem.numberplateimage);
//                 console.log('nestmobileNumber', foundItem.mobileNumber);
//                 // warrantyidsasdasd.push(plaintextoflogindata.WarrantyNumber)

//                 // return
//                 // return

//                 if (response.status === 200) {
//                   if (foundItem.numberplateimage != null) {
//                     var logVar = 'siddhant1';
//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.numberplateimage,
//                       foundItem.mobileNumber,
//                       photocategorylist[0].Photo_Category_Name,
//                       photocategorylist[0].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   if (foundItem.odoMeterImage != null) {
//                     var logVar = 'siddhant2';
//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.odoMeterImage,
//                       foundItem.mobileNumber,
//                       photocategorylist[6].Photo_Category_Name,
//                       photocategorylist[6].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   if (foundItem.tyre1Image != null) {
//                     var logVar = 'siddhant3';
//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.tyre1Image,
//                       foundItem.mobileNumber,
//                       photocategorylist[1].Photo_Category_Name,
//                       photocategorylist[1].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   if (foundItem.tyre2Image != null) {
//                     var logVar = 'siddhant4';
//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.tyre2Image,
//                       foundItem.mobileNumber,
//                       photocategorylist[2].Photo_Category_Name,
//                       photocategorylist[2].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   if (foundItem.invoiceImage != null) {
//                     var logVar = 'siddhant4';
//                     await uploadimage(
//                       plaintextoflogindata.WarrantyNumber,
//                       foundItem.invoiceImage,
//                       foundItem.mobileNumber,
//                       photocategorylist[5].Photo_Category_Name,
//                       photocategorylist[5].Photo_Category_ID,
//                       latitude,
//                       longitude,
//                       // logVar,
//                       userData.AgencyId,
//                       loginItems.Username,
//                     );
//                   }
//                   const payload = {
//                     requestId: '',
//                     isEncrypt: '',
//                     requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserId}\",\"StatusCode\":\"0\"}`,
//                     sessionExpiryTime: '',
//                     userId: '',
//                   };
//                   try {
//                     const response = await axios.post(
//                       RemoteUrls.postFinalStatusUpdateUel,
//                       payload,
//                     );
//                     console.log('response', response.data);
//                     if (response.status.responseCode === 200) {
//                       warrantyidsasdasd.push(
//                         plaintextoflogindata.WarrantyNumber,
//                       );

//                       await updateSyncStatusWR(db, foundItem.id, true);
//                       fetchItems(db);
//                       setWarrantyPostObject([]);
//                       if (i === checkedItems.length) {
//                         Alert.alert(
//                           'Success',
//                           `Warranty Registered Successfully with id(s): ${warrantyidsasdasd}`,
//                           // 'Warranty Registered Successfully with id(s): 111111',
//                         );
//                         console.log('checking alert in');
//                       }
//                     }
//                   } catch (error) {
//                     console.log('error', error);
//                   }
//                   setloading(false);
//                 } else {
//                   setloading(false);

//                   console.error('Something went wrong');
//                 }
//               } catch (error) {
//                 setloading(false);

//                 console.log(error);
//               }
//               // finally {
//               //   setloading(false)
//               // }

//               console.log('encdadwefsdfasdfa');

//               // return
//             }
//             // }
//             setloading(false);
//           } catch (error: unknown) {
//             setloading(false);
//             if (error instanceof Error) {
//               console.error(error.message);
//             }
//           }
//         }
//         if (Platform.OS === 'ios') {
//           GetLocation.getCurrentPosition({
//             enableHighAccuracy: true,
//             timeout: 60000,
//           })
//             .then(async location => {
//               console.log(location);
//               try {
//                 setloading(true);
//                 // checklocation = enableResult
//                 // if (enableResult === 'enabled' || enableResult === 'already-enabled') {
//                 const position = await GetLocation.getCurrentPosition({
//                   enableHighAccuracy: true,
//                   timeout: 60000,
//                 });

//                 const { latitude, longitude } = location;
//                 console.log('Latitude:', latitude);
//                 console.log('Longitude:', longitude);
//                 if (latitude === null || longitude === null) {
//                   Alert.alert(
//                     'Error',
//                     'Failed to proccess due to location access',
//                   );
//                   return;
//                 }
//                 var registionselecteddata;
//                 if (
//                   foundItem.registrationOption === 'New Vehicle' ||
//                   foundItem.registrationOption === 'Not Available'
//                 ) {
//                   registionselecteddata = registrationOption;
//                 } else {
//                   registionselecteddata = foundItem.registrationNumber;
//                 }
//                 if (
//                   foundItem.tyre2SerialNumber2 === '' ||
//                   foundItem.tyre2SerialNumber3 === '' ||
//                   foundItem.tyre2SerialNumber2 === null ||
//                   foundItem.tyre2SerialNumber3 === null
//                 ) {
//                   const requestData = {
//                     Registration_No: registionselecteddata,
//                     CustomerName: foundItem.customerName,
//                     MobileNo: foundItem.mobileNumber,
//                     EmailId: loginItems.EmailId,
//                     Remark: null,
//                     Company: 'YOKOHAMA',
//                     IsDeclaretion: foundItem.termsAccepted,
//                     Agency_Id: loginItems.AgencyId,
//                     InvoiceNo: foundItem.invoiceNumber,
//                     InvoiceDate: foundItem.invoiceDate,
//                     InvoiceAmount: '',
//                     User_Device_Formation: deviceName,
//                     CreatedFor: 'self',
//                     MappingCodeCode: null,
//                     Address: filteredInput,
//                     State_Id: foundItem.state_id,
//                     State_Name: foundItem.state,
//                     District_id: foundItem.districtid,
//                     District_Name: foundItem.districtname,
//                     City_Id: foundItem.cityvillageid,
//                     City_Name: foundItem.cityvillagename,
//                     PinCode_Id: foundItem.pincodeid,
//                     PinCode_Name: foundItem.pinCode,
//                     ODOMeter: foundItem.odoMeterReading,
//                     Type_of_Machine_Id: foundItem.veh_type_id,
//                     Type_of_Machine_Name: foundItem.veh_type_name,
//                     Make_Id: foundItem.make_id,
//                     Make_Name: foundItem.make,
//                     Model_Id: null,
//                     Model_Name: foundItem.model,
//                     Variant_Id: foundItem.variantid,
//                     Variant_Name: foundItem.variantname,
//                     RegistrationDate: foundItem.registrationDate,
//                     ManufacturerDate: null,
//                     BrandName: foundItem.brand,
//                     ProductName: foundItem.productName,
//                     Serial_1:
//                       foundItem.series +
//                       foundItem.tyre1SerialNumber2 +
//                       foundItem.tyre1SerialNumber3,
//                     Serial_Number: null,
//                     Createdby: loginItems.Username,
//                     Photo_Temp_Id: null,
//                     TyreSize: foundItem.tyreSize,
//                     NoOfTyres: foundItem.tyreQuantity,
//                     OldTyre_CompanyName: foundItem.oldTyreCompany,
//                     OldTyre_BrandName: foundItem.oldTyreBrand,
//                     OldTyre_Size: foundItem.oldTyreSize,
//                   };
//                   const encryptedlogindata = AESExtensions.encryptSs(
//                     JSON.stringify(requestData),
//                   );
//                   console.log(
//                     'encdadwefsdfasdfa  if ',
//                     JSON.stringify(JSON.stringify(requestData)),
//                   );
//                   // return
//                   const payload = {
//                     requestId: '',
//                     isEncrypt: '',
//                     requestData: encryptedlogindata,
//                     sessionExpiryTime: '',
//                     userId: '',
//                   };
//                   // console.log(payload);
//                   // return

//                   try {
//                     // console.log("Asdasdasdadasdasdas if", photocategorylist[0].Photo_Category_Name, photocategorylist[0].Photo_Category_ID);

//                     const response = await axios.post(
//                       RemoteUrls.postWarrantyRegistrationUrl,
//                       payload,
//                     );
//                     console.log('response', response.data);
//                     // console.log("response", response.data)

//                     // const parsevalue = JSON.parse(response.data.requestData)
//                     const plaintextoflogindata = AESExtensions.decryptString(
//                       response.data.responseData,
//                     );
//                     // return
//                     console.log(
//                       'plaintextoflogindata.WarrantyNumber',
//                       plaintextoflogindata.WarrantyNumber,
//                     );
//                     // warrantyidsasdasd.push(plaintextoflogindata.WarrantyNumber)

//                     // return

//                     if (response.status === 200) {
//                       if (foundItem.numberplateimage != null) {
//                         var logVar = 'siddhant';
//                         console.log(
//                           logVar,
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.numberplateimage,
//                           foundItem.mobileNumber,
//                           photocategorylist[0].Photo_Category_Name,
//                           photocategorylist[0].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                         );

//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.numberplateimage,
//                           foundItem.mobileNumber,
//                           photocategorylist[0].Photo_Category_Name,
//                           photocategorylist[0].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       if (foundItem.odoMeterImage != null) {
//                         var logVar = 'siddhant2';
//                         console.log(
//                           logVar,
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.odoMeterImage,
//                           foundItem.mobileNumber,
//                           photocategorylist[6].Photo_Category_Name,
//                           photocategorylist[6].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                         );
//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.odoMeterImage,
//                           foundItem.mobileNumber,
//                           photocategorylist[6].Photo_Category_Name,
//                           photocategorylist[6].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       if (foundItem.tyre1Image != null) {
//                         var logVar = 'siddhant3';
//                         console.log(
//                           logVar,
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.tyre1Image,
//                           foundItem.mobileNumber,
//                           photocategorylist[1].Photo_Category_Name,
//                           photocategorylist[1].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                         );

//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.tyre1Image,
//                           foundItem.mobileNumber,
//                           photocategorylist[1].Photo_Category_Name,
//                           photocategorylist[1].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       if (foundItem.tyre2Image != null) {
//                         var logVar = 'siddhant4';
//                         console.log(
//                           logVar,
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.tyre2Image,
//                           foundItem.mobileNumber,
//                           photocategorylist[2].Photo_Category_Name,
//                           photocategorylist[2].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                         );

//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.tyre2Image,
//                           foundItem.mobileNumber,
//                           photocategorylist[2].Photo_Category_Name,
//                           photocategorylist[2].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       if (foundItem.invoiceImage != null) {
//                         var logVar = 'siddhant5';
//                         console.log(
//                           logVar,
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.invoiceImage,
//                           foundItem.mobileNumber,
//                           photocategorylist[5].Photo_Category_Name,
//                           photocategorylist[5].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                         );

//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.invoiceImage,
//                           foundItem.mobileNumber,
//                           photocategorylist[5].Photo_Category_Name,
//                           photocategorylist[5].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       var logVar = 'siddhant4';

//                       // await retryimageupload(
//                       //   plaintextoflogindata.WarrantyNumber,
//                       //   userData.AgencyId,
//                       //   foundItem,
//                       //   logVar,
//                       // );
//                       const payload = {
//                         requestId: '',
//                         isEncrypt: '',
//                         requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserId}\",\"StatusCode\":\"0\"}`,
//                         sessionExpiryTime: '',
//                         userId: '',
//                       };
//                       try {
//                         const response = await axios.post(
//                           RemoteUrls.postFinalStatusUpdateUel,
//                           payload,
//                         );
//                         console.log('response', response.data);
//                         if (response.status === 200) {
//                           warrantyidsasdasd.push(
//                             plaintextoflogindata.WarrantyNumber,
//                           );

//                           await updateSyncStatusWR(db, foundItem.id, true);
//                           fetchItems(db);
//                           setWarrantyPostObject([]);
//                           if (i === checkedItems.length) {
//                             Alert.alert(
//                               'Success',
//                               `Warranty Registered Successfully with id(s): ${warrantyidsasdasd}`,
//                               // 'Warranty Registered Successfully with id(s): 111111',
//                             );
//                             console.log('checking alert in');
//                           }
//                         }
//                       } catch (error) {
//                         console.log('error', error);
//                       }
//                       setloading(false);
//                     } else {
//                       setloading(false);

//                       console.error('Something went wrong');
//                     }
//                   } catch (error) {
//                     setloading(false);

//                     console.log(error);
//                   }
//                   // finally {
//                   //   setloading(false)
//                   // }
//                   return;
//                 } else {
//                   const requestData = {
//                     Registration_No: registionselecteddata,
//                     CustomerName: foundItem.customerName,
//                     MobileNo: foundItem.mobileNumber,
//                     EmailId: loginItems.EmailId,
//                     Remark: null,
//                     Company: 'YOKOHAMA',
//                     IsDeclaretion: foundItem.termsAccepted,
//                     Agency_Id: loginItems.AgencyId,
//                     InvoiceNo: foundItem.invoiceNumber,
//                     InvoiceDate: foundItem.invoiceDate,
//                     InvoiceAmount: '',
//                     User_Device_Formation: deviceName,
//                     CreatedFor: 'self',
//                     MappingCodeCode: null,
//                     Address: filteredInput,
//                     State_Id: foundItem.state_id,
//                     State_Name: foundItem.state,
//                     District_id: foundItem.districtid,
//                     District_Name: foundItem.districtname,
//                     City_Id: foundItem.cityvillageid,
//                     City_Name: foundItem.cityvillagename,
//                     PinCode_Id: foundItem.pincodeid,
//                     PinCode_Name: foundItem.pinCode,
//                     ODOMeter: foundItem.odoMeterReading,
//                     Type_of_Machine_Id: foundItem.veh_type_id,
//                     Type_of_Machine_Name: foundItem.veh_type_name,
//                     Make_Id: foundItem.make_id,
//                     Make_Name: foundItem.make,
//                     Model_Id: null,
//                     Model_Name: foundItem.model,
//                     Variant_Id: foundItem.variantid,
//                     Variant_Name: foundItem.variantname,
//                     RegistrationDate: foundItem.registrationDate,
//                     ManufacturerDate: null,
//                     BrandName: foundItem.brand,
//                     ProductName: foundItem.productName,
//                     Serial_1:
//                       foundItem.series +
//                       foundItem.tyre1SerialNumber2 +
//                       foundItem.tyre1SerialNumber3,
//                     Serial_2:
//                       foundItem.series +
//                       foundItem.tyre2SerialNumber2 +
//                       foundItem.tyre2SerialNumber3,
//                     Serial_3: null,
//                     Serial_4: null,
//                     Serial_Number: null,
//                     Createdby: loginItems.Username,
//                     Photo_Temp_Id: null,
//                     TyreSize: foundItem.tyreSize,
//                     NoOfTyres: foundItem.tyreQuantity,
//                     OldTyre_CompanyName: foundItem.oldTyreCompany,
//                     OldTyre_BrandName: foundItem.oldTyreBrand,
//                     OldTyre_Size: foundItem.oldTyreSize,
//                   };
//                   const encryptedlogindata = AESExtensions.encryptSs(
//                     JSON.stringify(requestData),
//                   );
//                   console.log(
//                     'encdadwefsdfasdfa else',
//                     JSON.stringify(JSON.stringify(requestData)),
//                   );
//                   // return
//                   const payload = {
//                     requestId: '',
//                     isEncrypt: '',
//                     requestData: encryptedlogindata,
//                     sessionExpiryTime: '',
//                     userId: '',
//                   };
//                   // console.log(payload);
//                   // return
//                   console.log('warranty nodasdasdasdasd ');
//                   try {
//                     // console.log("Asdasdasdadasdasdas", photocategorylist[0].Photo_Category_Name, photocategorylist[0].Photo_Category_ID);
//                     // return
//                     const response = await axios.post(
//                       RemoteUrls.postWarrantyRegistrationUrl,
//                       payload,
//                     );
//                     console.log('response', response.data);
//                     // console.log("response", response.data)

//                     // const parsevalue = JSON.parse(response.data.requestData)
//                     const plaintextoflogindata = AESExtensions.decryptString(
//                       response.data.responseData,
//                     );
//                     console.log('Asdasdasd', plaintextoflogindata);
//                     console.log(
//                       'plaintextoflogindata.WarrantyNumber',
//                       plaintextoflogindata.WarrantyNumber,
//                     );
//                     console.log('nestphotocategorylist', photocategorylist);
//                     console.log('nestlatitude', latitude);
//                     console.log('nestlongitude', longitude);
//                     console.log(
//                       'nestnumberplateimage',
//                       foundItem.numberplateimage,
//                     );
//                     console.log('nestmobileNumber', foundItem.mobileNumber);
//                     // warrantyidsasdasd.push(plaintextoflogindata.WarrantyNumber)

//                     // return
//                     // return

//                     if (response.status === 200) {
//                       if (foundItem.numberplateimage != null) {
//                         var logVar = 'siddhant1';
//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.numberplateimage,
//                           foundItem.mobileNumber,
//                           photocategorylist[0].Photo_Category_Name,
//                           photocategorylist[0].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       if (foundItem.odoMeterImage != null) {
//                         var logVar = 'siddhant2';
//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.odoMeterImage,
//                           foundItem.mobileNumber,
//                           photocategorylist[6].Photo_Category_Name,
//                           photocategorylist[6].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       if (foundItem.tyre1Image != null) {
//                         var logVar = 'siddhant3';
//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.tyre1Image,
//                           foundItem.mobileNumber,
//                           photocategorylist[1].Photo_Category_Name,
//                           photocategorylist[1].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       if (foundItem.tyre2Image != null) {
//                         var logVar = 'siddhant4';
//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.tyre2Image,
//                           foundItem.mobileNumber,
//                           photocategorylist[2].Photo_Category_Name,
//                           photocategorylist[2].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       if (foundItem.invoiceImage != null) {
//                         var logVar = 'siddhant4';
//                         await uploadimage(
//                           plaintextoflogindata.WarrantyNumber,
//                           foundItem.invoiceImage,
//                           foundItem.mobileNumber,
//                           photocategorylist[5].Photo_Category_Name,
//                           photocategorylist[5].Photo_Category_ID,
//                           latitude,
//                           longitude,
//                           // logVar,
//                           userData.AgencyId,
//                           loginItems.Username,
//                         );
//                       }
//                       var logVar = 'siddhant4';

//                       // await retryimageupload(
//                       //   plaintextoflogindata.WarrantyNumber,
//                       //   userData.AgencyId,
//                       //   foundItem,
//                       //   logVar,
//                       // );
//                       const payload = {
//                         requestId: '',
//                         isEncrypt: '',
//                         requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserId}\",\"StatusCode\":\"0\"}`,
//                         sessionExpiryTime: '',
//                         userId: '',
//                       };
//                       try {
//                         const response = await axios.post(
//                           RemoteUrls.postFinalStatusUpdateUel,
//                           payload,
//                         );
//                         console.log('response', response.data);
//                         if (response.status === 200) {
//                           warrantyidsasdasd.push(
//                             plaintextoflogindata.WarrantyNumber,
//                           );

//                           await updateSyncStatusWR(db, foundItem.id, true);
//                           fetchItems(db);
//                           setWarrantyPostObject([]);
//                           if (i === checkedItems.length) {
//                             Alert.alert(
//                               'Success',
//                               `Warranty Registered Successfully with id(s): ${warrantyidsasdasd}`,
//                               // 'Warranty Registered Successfully with id(s): 111111',
//                             );
//                             console.log('checking alert in');
//                           }
//                         }
//                       } catch (error) {
//                         console.log('error', error);
//                       }
//                       setloading(false);
//                     } else {
//                       setloading(false);

//                       console.error('Something went wrong');
//                     }
//                   } catch (error) {
//                     setloading(false);

//                     console.log(error);
//                   }
//                   // finally {
//                   //   setloading(false)
//                   // }

//                   console.log('encdadwefsdfasdfa');

//                   // return
//                 }
//                 // }
//                 setloading(false);
//               } catch (error: unknown) {
//                 setloading(false);
//                 if (error instanceof Error) {
//                   console.error(error.message);
//                 }
//               }
//             })
//             .catch(error => {
//               const { code, message } = error;
//               console.warn(code, message);
//             });
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     // if (warrantyidsasdasd.length != 0) {
//     //   Alert.alert("Success", `Warranty Registered Successfully with id(s): ${warrantyidsasdasd}`);
//     // }
//     // else {
//     //   Alert.alert("Error", `Faild to upload the warranty registration`);
//     // }
//   };
//   // const handlemodifyandsubmit = async (foundItem) => {

//   //   if (isConnected === false) {
//   //     Alert.alert("", "Please check the internet!")
//   //     return
//   //   }

//   // }
//   // const getLocation = async (foundItem, userData) => {
//   //   const filteredInput = foundItem.address.replace(/(\r\n|\n|\r)/g, ' ');

//   // };
//   const [isActive, setIsAvtive] = useState(false)
//   const { width } = Dimensions.get('window');
//   return (
//     <>
//       {languagedata === null ? (
//         <ActivityIndicator size={'small'} color={'black'} />
//       ) : (
//         <ScrollView
//           contentContainerStyle={styles.container}
//           ref={scrollViewRef}
//           onScroll={handleScroll}
//           scrollEventThrottle={16} // Adjust scroll event throttle as needed
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }>
//           {/* <View style={styles.logoContainer}>
//         <Image source={require('../../assets/images/logo/tractor.png')} style={{height:100,width: 100}} resizeMode='contain' />
//     </View> */}
//           {/* <Text>{location}</Text> */}
//           <View style={styles.logoContainer}>
//             <Text style={styles.headerText}>
//               {languagedata.lbl_DraftWarranty}
//             </Text>
//           </View>

//           <View style={styles.logoContainer}>
//             <Text style={styles.subheaderText}>
//               {languagedata.lbl_UnsyncWarranty}
//             </Text>
//           </View>

//           {/* <View style={styles.radioButtonLabelContainer}>

//       <View style = {{alignItems:'center', justifyContent:'center', width:'50%'}}>
//         <Text style={styles.radioLabelHeader}>Warranty No.</Text>
//       </View>

//       <View style = {{  width:'50%'}}>
//         <Text style={styles.radioLabelHeader}>Mobile No.</Text>
//       </View>

//     </View> */}

//           {/* <View style={{width:'100%'}} >
//         {Options.map((item, index) => (
//             <View style={{justifyContent:'center', width:'100%'}}>
//                 <TouchableOpacity style={styles.radioButton} onPress={() => navigateTo(item.warrantyNo)}>
//                     <View style={{width : '50%'}}>
//                       <Text style={styles.radioLabel_warranty_num}>{item.warrantyNo}</Text>
//                     </View>
//                     <View style={{width : '50%'}}>
//                       <Text style={styles.radioLabel_mobile_num}>{item.mobileNo}</Text>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//           ))}
//         </View> */}
//           <Modal
//             transparent={true}
//             visible={loading}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//               setloading(!loading);
//             }}>
//             <View style={styles.centeredView}>
//               <View style={styles.modalView}>
//                 <ActivityIndicator size="large" color="black" />
//                 <Text>{languagedata.lbl_uploading}...</Text>
//               </View>
//             </View>
//           </Modal>
//           <Modal
//             transparent={true}
//             visible={serversubmitloading}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//               setserversubmitloading(!serversubmitloading);
//             }}>
//             <View style={styles.centeredView}>
//               <View style={styles.modalView}>
//                 <ActivityIndicator size="large" color="black" />
//                 <Text>Re-Uploading image...</Text>
//               </View>
//             </View>
//           </Modal>
//           {items?.map((item, index) => (
//             <View
//               key={index}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}>
//               {item.isStatus === 0 ? ( // Check if item.Status is not 1
//                 <>
//                   <Text style={{ color: '#000', fontSize: 18, marginLeft: 10 }}>
//                     {languagedata.lbl_Inbox_WarrantyNo}: {item.id}
//                   </Text>
//                   <TouchableOpacity
//                     style={styles.checkboxContainer}
//                     onPress={() => handleCheckboxChange(index, item)}>
//                     <View
//                       style={[
//                         styles.checkbox,
//                         { backgroundColor: item.isChecked ? '#E11E30' : '#fff' },
//                       ]}>
//                       {item.isChecked === true ? (
//                         <Icon name="check" size={15} color="white" />
//                       ) : (
//                         <></>
//                       )}
//                     </View>
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <></>
//               )}
//             </View>
//           ))}

//           {/* <View style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//       }}>
//         <Text>id: {item.id}</Text>
//         {
//           item.isStatus ? <Text style={{ textAlign: 'center', backgroundColor: '#a6edb4', width: 80, color: 'black', borderRadius: 15 }}>complete</Text> :
//             <Text style={{ textAlign: 'center', backgroundColor: '#9ec0f7', width: 80, color: 'black', borderRadius: 15 }}>pending</Text>
//         }
//       </View> */}

//           {/* <View style={styles.syncContainer}>
//         <TouchableOpacity style={styles.syncbutton} onPress={handleLoop}>
//           <Text style={styles.buttonText}>Modify & Submit</Text>
//         </TouchableOpacity>
//       </View> */}

//           {items?.length === 0 ? (
//             <Text style={{ textAlign: 'center' }}>
//               {languagedata.lbl_NoWarrantyRegistrationfound}
//             </Text>
//           ) : (
//             <>
//               {
//                 items &&
//                   items.length > 0 &&
//                   items.every(item => item.isStatus === 1) ? (
//                   <></>
//                 ) : (
//                   <>
//                     {warrantyPostObject.length === 0 ? (
//                       <View style={styles.syncContainer}>
//                         <TouchableOpacity
//                           disabled={true}
//                           style={{
//                             backgroundColor: '#e11e30',
//                             padding: 10,
//                             marginVertical: 10,
//                             marginLeft: 4,
//                             borderRadius: 5,
//                             width: '100%',
//                             opacity: 0.5,
//                           }}
//                           onPress={handleLoop}>
//                           <Text style={styles.buttonText}>
//                             {languagedata.Submit}
//                           </Text>
//                         </TouchableOpacity>
//                       </View>
//                     ) : (
//                       <View style={styles.syncContainer}>
//                         <TouchableOpacity
//                           style={styles.syncbutton}
//                           onPress={handleLoop}>
//                           <Text style={styles.buttonText}>
//                             {languagedata.Submit}
//                           </Text>
//                         </TouchableOpacity>
//                       </View>
//                     )}
//                   </>
//                 )

//                 // <View style={styles.syncContainer}>
//                 //   <TouchableOpacity style={styles.syncbutton} onPress={handleLoop}>
//                 //     <Text style={styles.buttonText}>{languagedata.Submit}</Text>
//                 //   </TouchableOpacity>
//                 // </View>
//               }
//             </>
//           )}

//           {/* <LeadDetails /> */}
//           {/* <View style={styles.syncContainer}>
//         <TouchableOpacity disabled={true} style={[styles.syncbutton, { opacity: false ? 1 : 0.5 }]} onPress={handleLoop}>
//           <Text style={styles.buttonText}>Modify & Submit (In the work)</Text>
//         </TouchableOpacity>
//       </View> */}
//           {/* >>>>>>> ac30e9dd1e878af22b51b760fef1e891272dcec9 */}

//           {/* {items?.length === 0 ? (
//             <></>
//           ) : (
//             <>
//               {items && items.every(item => item.isStatus === 1) ? (
//                 <></>
//               ) : (
//                 <FlatList
//                   scrollEnabled={false}
//                   data={warrantyPostObject}
//                   renderItem={renderItem}
//                   keyExtractor={item => item.id}
//                 />
//               )}
//             </>
//           )} */}
//           <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
//             <TouchableOpacity onPress={() => setIsAvtive(false)} style={[{ borderWidth: 1, borderRadius: 5, padding: 10, width: "48%" }, { backgroundColor: isActive === false ? "#E11E30" : 'white', borderColor: isActive === false ? "#E11E30" : 'black' }]}>
//               <Text style={[{ textAlign: 'center' }, { color: isActive === false ? "white" : "#E11E30" }]}>{languagedata.lbl_Draft}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setIsAvtive(true)} style={[{ borderWidth: 1, borderRadius: 5, padding: 10, width: "48%" }, { backgroundColor: isActive === true ? "#E11E30" : 'white', borderColor: isActive === true ? "#E11E30" : 'black' }]}>
//               <Text style={[{ textAlign: 'center' }, { color: isActive === true ? "white" : "#E11E30" }]}>{languagedata.lbl_failed_image}</Text>
//             </TouchableOpacity>
//           </View >

//           {
//             isActive === false ?
//               <>
//                 {items?.length === 0 ? (
//                   <></>
//                 ) : (
//                   <>
//                     {items && items.every(item => item.isStatus === 1) ? (
//                       <></>
//                     ) : (
//                       <FlatList
//                         scrollEnabled={false}
//                         data={warrantyPostObject}
//                         renderItem={renderItem}
//                         keyExtractor={item => item.id}
//                       />
//                     )}
//                   </>
//                 )}</> :
//               <>
//                 <FlatList
//                   scrollEnabled={false}
//                   data={failedimagedata}
//                   renderItem={renderItem1}
//                   keyExtractor={item => item.id}
//                 />
//               </>
//           }

//           {
//             isActive === false ?
//               warrantyPostObject.length === 0 ?
//                 <View style={styles.nodatacontainer}>

//                   <Text style={styles.nodatalbl}>
//                     No warranty registered or selected
//                   </Text>
//                 </View> :
//                 <></> :
//               failedimagedata.length === 0 ?
//                 <View style={styles.nodatacontainer}>
//                   <Text style={styles.nodatalbl}>
//                     {languagedata.lbl_no_image_failed_yet}
//                   </Text>
//                 </View>
//                 :
//                 <></>
//           }
//           {/* <Modal
//           animationType="slide"
//           visible={modalVisible}
//           onRequestClose={closeModal}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <UpdateWarrantyRegistration
//                 languagedata={languagedata}
//                 selectedItem={selectedItem}
//                 setSelectedItem={setSelectedItem}
//                 setmodalvisible={setModalVisible}
//               />

//               {/* <View style={styles.cardGroup}>
//                 <View style={styles.buttoncard}>
//                   <TouchableOpacity onPress={closeModal}>
//                     <Text style={{ color: "white", fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
//                   </TouchableOpacity>

//                 </View>
//                 <View style={styles.buttoncard}>
//                   <TouchableOpacity onPress={handleUpdate} >
//                     <Text style={{ color: "white", fontWeight: 'bold', fontSize: 16 }}>Update</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//       </View>
//           </View >
//         </Modal > */}
//           <View style={styles.checklogoContainer}>
//             <Image
//               source={require('../../assets/images/logo/tclogo.png')}
//               style={{ height: 50, width: 100 }}
//               resizeMode="contain"
//             />
//             <Text style={styles.powerByText}>
//               Powered by <Text style={styles.checktext}>Check</Text>
//               <Text style={styles.exploretext}>Explore</Text>{' '}
//             </Text>
//           </View>
//         </ScrollView>
//       )}
//     </>
//   );
// };

// export default Outbox;

//android
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  AppState,
  Linking,
  Dimensions,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {setupDatabase} from './../../db/Registration/database'; // Adjust the import path as necessary
import {
  getAllItems,
  updateItem,
  deleteItem,
  getItemsById,
  getAll,
  updateSyncStatusWR,
} from './../../db/Registration/sqliteOperations';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SelectList} from 'react-native-dropdown-select-list';
import {
  setupStateDatabase,
  getAllStateItems,
  getStateid,
} from './../../db/Registration/StateDb';
import {
  setupPinCodeDatabase,
  getAllPinCodeItems,
} from './../../db/Registration/PinCodeDb';
import {
  setupTractorMakeDatabase,
  getAllTractorMakeItems,
  getVehicleByVehTypeid,
} from './../../db/Registration/TractorMakeDb';
import {
  setupTractorModelDatabase,
  getAllTractorModelItems,
  insertTractorModelItems,
  getVehicleModelByVehTypeid,
} from './../../db/Registration/TractorModelDb';
import {
  setupBrandNasadmeDatabase,
  getAllBrandNasadmeItems,
  insertBrandNasadmeItems,
} from './../../db/Registration/BrandName';
import {
  setupProductNameDatabase,
  getAllProductNameItems,
  insertProductNameItems,
} from './../../db/Registration/ProductNameDb';
import {
  setupTyreSizeDatabase,
  getAllTyreSizeItems,
  insertTyreSizeItems,
} from './../../db/Registration/TyreSizeDb';
import {
  setupOldTyreBrandNameDatabase,
  getAllOldTyreBrandNameItems,
  insertOldTyreBrandNameItems,
} from './../../db/Registration/OldTyreBrandName';
import {
  setupOldTyreCompanyDatabase,
  getAllOldTyreCompanyItems,
  insertOldTyreCompanyItems,
} from './../../db/Registration/OldTyreCompany';
import styles from './styles';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import axios from 'axios';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import {SimultaneousGesture} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition';
import {
  setupLoginDatabase,
  getAllLoginItems,
  insertLoginItems,
  loginInsertChecked,
} from './../../db/Login/Login';
import {
  getAllVehicleTypeItems,
  setupVehicleTypeDatabase,
} from '../../db/Registration/VehicleTypeDb';
import {
  setupVehicleVariantDatabase,
  getAllVehicleVariantItems,
  insertVehicleVariantItems,
  clearVehicleVariantTable,
  getVariantByMakeID,
} from './../../db/Registration/VehicleVariant';
import {longPressHandlerName} from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';
import DeviceInfo from 'react-native-device-info';
import UpdateWarrantyRegistration from '../UpdateWarrantyRegistration/UpdateWarrantyRegistration';
import WarrantyRegistrationForm from '../RegistrationScreen/RegistrationScreen';
import {AESExtensions} from '../AESExtensions';
import NetInfo from '@react-native-community/netinfo';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import RemoteUrls from '../apiUrl';
import LeadDetails from '../LeadDetails';
import {launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {opacity} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import RNFS from 'react-native-fs';
import GetLocation from 'react-native-get-location';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  setupPhotoCategorylistDatabase,
  getPhotoCategorylistItems,
  insertPhotoCategorylistItems,
  clearPhotoCategorylistTable,
  getPhotoCategorylistbyuseridItems,
} from './../../db/photocategorylist/photocategorylist';
import {
  setupreuploadingimagedbDatabase,
  getAllreuploadingimagedbItems,
  insertreuploadingimagedbItems,
  clearreuploadingimagedbTable,
  getreuploadingimagedbid,
  deleteItemById,
} from './../../db/reuploadingimagedb/reuploadingimagedb';
import {log} from '@react-native-firebase/crashlytics';
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';
import {fetch as fetchssl} from 'react-native-ssl-pinning';
const Outbox = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [option, setOption] = useState({});
  const [deviceName, setDeviceName] = useState('');
  // <<<<<<< HEAD
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  // const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loginItems, setLoginItems] = useState();
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
    // fetchItems(db)
    fetchogin();
    setTimeout(() => {
      setData([]);
      // fetchData();
      setRefreshing(false);
    }, 1000); // Simulated delay
  };
  const [msg, setmsg] = useState('');
  const [warrantyid, setwarrantyid] = useState([]);
  const [appState, setAppState] = useState(AppState.currentState);
  // const handleAppStateChange = async (nextAppState) => {
  //   if (appState.match(/inactive|background/) && nextAppState === 'active') {
  //     console.log('App has come to the foreground!');
  //     const isGranted = await checkLocationPermission();
  //     if (isGranted === 'granted') {
  //       getLocation();
  //     } else {
  //       Alert.alert('Permission Required', 'Location permission is needed. Please enable it in the settings.');
  //     }
  //   }
  //   setAppState(nextAppState);
  // };
  // // Function to check location permission status
  // const checkLocationPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  //       return status ? 'granted' : 'denied';
  //     } catch (error) {
  //       console.warn('Permission check error:', error);
  //       return 'error';
  //     }
  //   } else if (Platform.OS === 'ios') {
  //     try {
  //       const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  //       switch (result) {
  //         case RESULTS.GRANTED:
  //           return 'granted';
  //         case RESULTS.DENIED:
  //           return 'denied';
  //         case RESULTS.BLOCKED:
  //           return 'blocked';
  //         case RESULTS.UNAVAILABLE:
  //           return 'unavailable';
  //         default:
  //           return 'error';
  //       }
  //     } catch (error) {
  //       console.warn('Permission check error:', error);
  //       return 'error';
  //     }
  //   }
  // };
  // const handleAppStateChange = nextAppState => {
  //   if (nextAppState === 'active' && appState.match(/inactive|background/)) {
  //     // App has become active, recheck permissions and fetch location
  //     // registrationOption();
  //     requestLocationPermission()

  //   }
  //   setAppState(nextAppState);
  // };
  const [location, setLocation] = useState(null);
  const mainmethodcall = async () => {
    await setupreuploadingimagedbDatabase();
    await fetchingthefaildimage();
  };
  const mainmethod = async () => {
    if (Platform.OS === 'android') {
      const enableResult = promptForEnableLocationIfNeeded();
    }
    mainmethodcall();
    const initializeDatabase = async () => {
      try {
        const database = await setupDatabase();
        setDb(database);
        await fetchItems(database);
        await fetchogin();
        await setupLoginDatabase();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    setupPhotoCategorylistDatabase();
    fetchphotochategorylist();
    console.log('avbrthgfafdasd', warrantyid.join(', '));

    initializeDatabase();

    setWarrantyPostObject([]);
    const fetchDeviceInfo = async () => {
      try {
        const name = await DeviceInfo.getDeviceName();
        setDeviceName(name);
      } catch (error) {
        console.error('Error fetching device name:', error);
      }
    };
    setupMultiLanguageDatabase();
    fetchingthelanguagedata();
    fetchDeviceInfo();
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
  const [failedimagedata, setfailedimagedata] = useState([]);

  const fetchingthefaildimage = async () => {
    const data = await getreuploadingimagedbid();

    setfailedimagedata(data);
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
  const fetchItems = async (database: SQLiteDatabase) => {
    try {
      const fetchedItems = await getAllItems(database);
      setItems(fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchogin = async () => {
    try {
      const fetchedItems = await getAllLoginItems();
      setLoginItems(fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };
  const navigation = useNavigation();

  const openModal = selectedItem => {
    const params = {
      id: selectedItem.id,
      registrationOptions: selectedItem.registrationOption,
      numberplateimagess: selectedItem.numberplateimage,
      customerName: selectedItem.customerName,
      mobileNumber: selectedItem.mobileNumber,
      address: selectedItem.address,
      state: selectedItem.state,
      state_id: selectedItem.state_id,
      pinCode: selectedItem.pinCode,
      districtid: selectedItem.districtid,
      districtname: selectedItem.districtname,
      cityvillageid: selectedItem.cityvillageid,
      cityvillagename: selectedItem.cityvillagename,
      pincodeid: selectedItem.pincodeid,
      registrationNumber: selectedItem.registrationNumber,
      registrationDates: selectedItem.registrationDate,
      make: selectedItem.make,
      make_id: selectedItem.make_id,
      model: selectedItem.model,
      brand: selectedItem.brand,
      brandid: selectedItem.brandid,
      productid: selectedItem.productid,
      series: selectedItem.series,
      productName: selectedItem.productName,
      tyreSize: selectedItem.tyreSize,
      tyreQuantity: selectedItem.tyreQuantity,
      tyre1SerialNumber2: selectedItem.tyre1SerialNumber2,
      tyre1SerialNumber3: selectedItem.tyre1SerialNumber3,
      tyre1Images: selectedItem.tyre1Image,
      tyre2SerialNumber2: selectedItem.tyre2SerialNumber2,
      tyre2SerialNumber3: selectedItem.tyre2SerialNumber3,
      tyre2Images: selectedItem.tyre2Image,
      invoiceNumber: selectedItem.invoiceNumber,
      invoiceImage: selectedItem.invoiceImage,
      invoiceDate: selectedItem.invoiceDate,
      odoMeterReading: selectedItem.odoMeterReading,
      odoMeterImage: selectedItem.odoMeterImage,
      oldTyreCompany: selectedItem.oldTyreCompany,
      oldtyrebrandid: selectedItem.oldtyrebrandid,
      oldTyreBrand: selectedItem.oldTyreBrand,
      oldTyreSize: selectedItem.oldTyreSize,
      termsAccepteds: selectedItem.termsAccepted,
      veh_type_id: selectedItem.veh_type_id,
      veh_type_name: selectedItem.veh_type_name,
      variantid: selectedItem.variantid,
      variantname: selectedItem.variantname,
    };
    navigation.navigate('UpdateWarrantyRegistration', params);
    // setSelectedItem(item);
    // setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    // setSelectedItem(null);
  };

  const handleUpdate = async () => {
    if (!db || !selectedItem) {
      return;
    }

    try {
      await updateItem(db, selectedItem.id, selectedItem);
      fetchItems(db);
      closeModal();
      Alert.alert('Success', 'Registration Form updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  const [registrationOption, setRegistrationOption] = useState(null);
  const RadioButtonColor: string = '#e11e30';
  const [selectedOption, setSelectedOption] = useState(false);
  const [warrantyPostObject, setWarrantyPostObject] = useState([]);

  const handleRadioButtonChange = value => {
    setSelectedOption(value);
  };
  const [displaywarrantyregistration, setdisplaywarrantyregistration] =
    useState([]);
  const [isdisplaywarrantyregistration, setisdisplaywarrantyregistration] =
    useState(false);
  // let count = 0;
  const [itemCounts, setItemCounts] = useState({});

  // var count = 0;
  const checkImageExistsAndUpdateCount = async (imagePath, itemId) => {
    try {
      if (imagePath) {
        const exists = await RNFS.exists(imagePath);
        if (!exists) {
          // Return 1 if the image is missing
          return 1;
        } else {
          return 0;
        }
      } else {
        console.log('Image path is null or undefined.');
        return 0;
      }
    } catch (error) {
      console.error('Error checking image existence:', error);
      return 0;
    }
  };

  // Function to check all images
  const checkAllImages = async item => {
    if (item) {
      try {
        const imagePaths = [
          item.tyre1Image,
          item.tyre2Image,
          item.odoMeterImage,
          item.invoiceImage,
          item.numberplateimage,
        ];

        // Accumulate the count of missing images
        const missingImagesCount = await Promise.all(
          imagePaths.map(
            async path => await checkImageExistsAndUpdateCount(path, item.id),
          ),
        );

        // Sum up the missing images
        const totalMissing = missingImagesCount.reduce(
          (acc, count) => acc + count,
          0,
        );

        // Update the count for the specific item
        setItemCounts(prev => ({...prev, [item.id]: totalMissing}));
      } catch (error) {
        console.error('Error checking all images:', error);
      }
    }
  };

  const handleCheckboxChange = async (index, item) => {
    item.isChecked = !item.isChecked;
    if (item.isChecked) {
      const warrantyData = await getItemsById(db, item.id);
      setWarrantyPostObject([...warrantyPostObject, warrantyData[0]]);
      // setItemCounts(0)
      // await checkAllImages(item)
    } else {
      const updatedItems = warrantyPostObject.filter(
        items => items.id !== item.id,
      );

      setWarrantyPostObject(updatedItems);
    }
  };
  const {width} = Dimensions.get('window');
  function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits

    return `${year}-${month}-${day}`;
  }
  const uploadImage = async (item, latitude, longitude) => {
    setloading(true);

    // const now = moment();
    const now = new Date();

    // const formattedDate = now.format('YYYY-MM-DD HH:mm:ss');
    const formattedDate = formatDateToISO(now);

    const timestamp = Date.now();
    const generatedId = `uploadedimageby_${item.mobilenumber}_${timestamp}`;

    const formData = new FormData();
    const requestData = {
      WarrantyId: item.warranty_id,
      TempId: generatedId,
      PhotoName: `${item.image_name}.${item.file.split('.').pop()}`,
      CategoryId: item.image_category_id,
      PhotoURL: `file://${item.file}`,
      Latitude: latitude,
      Longitude: longitude,
      PhotoCaptureAddress: '',
      PhotoUploadedBySystem: 'Mobile',
      CreatedBy: item.created_by,
      ModifiedBy: '',
      ModifyDate: '',
      AgencyId: item.agency_id,
      InspectionDateTime: formattedDate,
      ServiceType: '',
    };
    const imageextension = item.file.split('.').pop().toLowerCase();
    if (
      imageextension !== 'jpg' &&
      imageextension !== 'jpeg' &&
      imageextension !== 'png'
    ) {
      Alert.alert('Error', 'Only JPG, JPEG, PNG format expected!');
      return;
    }
    // await delay(2500);
    try {
      formData.append('file', {
        uri: `file://${item.file}`,

        type: 'image/jpeg',
        name: item.file.split('/').pop(),
      });
      formData.append('RequestId', '');
      formData.append('IsEncrypt', '');
      formData.append('RequestData', JSON.stringify(requestData));
      formData.append('SessionExpiryTime', '');
      formData.append('UserId', '');
      const heaaders = await GetHeader();
      const response = await fetchssl(RemoteUrls.postUploadUrl, {
        method: 'POST',
        body: formData,
        // const response = await axios.post(RemoteUrls.postUploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          ...heaaders,
        },
        pkPinning: true,
        sslPinning: {
          // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
          certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
        },
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(async data => {
          const responseData = data.responseData; // Do something with the responseData

          await deleteItemById(item.id);
          await fetchingthefaildimage();
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      const payload = {
        requestId: '',
        isEncrypt: '',
        requestData: `{\"Warranty_Id\":\"${item.warranty_id}\",\"UserId\":\"${item.created_by}\",\"StatusCode\":\"0\"}`,
        sessionExpiryTime: '',
        userId: '',
      };
      try {
        const heaaders = await GetHeader();
        const response = await fetchssl(RemoteUrls.postFinalStatusUpdateUel, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: heaaders,
          timeoutInterval: 1000,
          pkPinning: true,
          sslPinning: {
            // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
            certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
          },
        });
      } catch (error) {
        if (error.response.status === 406) {
          const status = await GetLoginResponse();
          if (status === 200) {
            await uploadImage(item, latitude, longitude);
          }
        }
      }
      setloading(false);
    } catch (logError) {
      setloading(false);
      if (logError.response.status === 406) {
        const status = await GetLoginResponse();

        if (status === 200) {
          await uploadImage(item, latitude, longitude);
        }
      }
    }
  };
  const handleUploadImage = async item => {
    setloading(true);

    if (Platform.OS === 'android') {
      const enableResult = await promptForEnableLocationIfNeeded();
      // checklocation = enableResult
      // if (enableResult === 'enabled' || enableResult === 'already-enabled') {
      const position = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      const {latitude, longitude} = position;
      await uploadImage(item, latitude, longitude);
    }
    if (Platform.OS === 'ios') {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      }).then(async location => {
        if (failedimagename.length === 0) {
          return;
        }
        const {latitude, longitude} = location;
        await uploadImage(item, latitude, longitude);
      });
    }
    setloading(false);
  };
  const renderItem1 = ({item}) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: 12,
          borderColor: 'grey',
          padding: 10,
          marginVertical: 7,
          flex: 1,
        }}>
        <View>
          <Image
            style={{borderRadius: 12}}
            source={{
              uri: `file://${item.file}`,
            }}
            width={width - 61}
            height={300}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text>Warranty ID: {item.warranty_id}</Text>
            <Text>Failed Image: {item.image_name}</Text>
            <Text>mobilenumber: {item.mobilenumber}</Text>
            <Text>categoryId: {item.image_category_id}</Text>
            <Text>agency_id: {item.agency_id}</Text>
            <Text>lattitude: {item.Latitude}</Text>
            <Text>longitude {item.Longitude}</Text>
            <Text>InspectionDateTime: {item.InspectionDateTime}</Text>
            <Text>PhotoName: {item.PhotoName}</Text>
            <Text>errcode: {item.errcode}</Text>
            {/* <Text>hearder: {item.herder}</Text> */}

            <Text>header: {item.herder}</Text>

            <Text>requestdata: {item.payload}</Text>
            <Text>formdata: {item.formdata}</Text>
          </View>
          {/* <View>
            <TouchableOpacity onPress={() => handleUploadImage(item)}
              style={{ padding: 10, backgroundColor: '#e11f10', borderRadius: 12 }}><Text style={{ color: 'white' }}>Upload</Text></TouchableOpacity>
          </View> */}
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => {
    // const count = itemCounts[item.id] || 0; // Get count for specific item

    return (
      <View
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text>id: {item.id}</Text>
          {item.isStatus ? (
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: '#a6edb4',
                width: 80,
                color: 'black',
                borderRadius: 15,
              }}>
              {languagedata.lbl_Complete}
            </Text>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: '#9ec0f7',
                width: 80,
                color: 'black',
                borderRadius: 15,
              }}>
              {languagedata.lbl_Pending}
            </Text>
          )}
        </View>

        {/* Display item information */}
        <Text>Registration Number: {item.registrationNumber}</Text>
        <Text>Registration Option: {item.registrationOption}</Text>
        <Text>Customer Name: {item.customerName}</Text>
        <Text>Mobile Number: {item.mobileNumber}</Text>
        <Text>{item.tyre1Image}</Text>
        <Text>{item.tyre2Image}</Text>
        <Text>{item.odoMeterImage}</Text>
        <Text>{item.invoiceImage}</Text>
        <Text>{item.numberplateimage}</Text>
        <Text>{item.tyre1SerialNumber2}</Text>
        <Text>{item.tyre1SerialNumber3}</Text>
        <Text>{item.tyre2SerialNumber2}</Text>
        <Text>{item.tyre2SerialNumber3}</Text>

        {/* Display count for this specific item */}
        {/* <Text>Count: {count}</Text>

        {count === 0 ? (
          <Text style={{ color: 'white', backgroundColor: '#f58e97', borderLeftWidth: 3, borderLeftColor: 'red', padding: 8, borderRadius: 5 }}>
            No image available
          </Text>
        ) : null} */}

        <View style={styles.cardGroup1}>
          <View
            style={[
              styles.buttoncard,
              item.isStatus ? styles.buttonDisabled : styles.buttonEnabled,
            ]}>
            <TouchableOpacity
              disabled={item.isStatus === 1}
              onPress={async () => {
                if (!db) {
                  return;
                }
                await deleteItem(db, item.id);
                fetchItems(db);
              }}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
                {languagedata.lbl_Delete}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.buttoncard,
              item.isStatus ? styles.buttonDisabled : styles.buttonEnabled,
            ]}>
            <TouchableOpacity
              disabled={item.isStatus === 1}
              onPress={() => openModal(item)}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
                {languagedata.lbl_Edit}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const [loading, setloading] = useState(false);
  const Options = [
    {warrantyNo: '100019', mobileNo: '9865348796'},
    {warrantyNo: '100153', mobileNo: '9658214736'},
    {warrantyNo: '101459', mobileNo: '7985635489'},
    {warrantyNo: '102376', mobileNo: '9745213698'},
    {warrantyNo: '103258', mobileNo: '9874563210'},
  ];

  const navigateTo = (warrantyNo: any) => {
    Alert.alert(`Edit Warranty No. : ${warrantyNo}`);
  };

  // const [photocategorylist, setphotocategorylist] = useState()

  // var photocategorylist = [];
  const [photocategorylist, setphotocategorylist] = useState(null);

  const fetchphotochategorylist = async () => {
    try {
      const photocategorylistdata = await getPhotoCategorylistItems();
      setphotocategorylist(photocategorylistdata);
    } catch (error) {
      console.error('Error fetching photo category list:', error);
    }
  };
  // const [currentlocationlatitude, setcurrentlocartionlatitude] = useState('')
  // const [currentlocationlongitude, setcurrentlocartionlongitude] = useState('')
  var latitudeoflocation = '';
  var longitudeoflocation = '';
  var checklocation = 'enabled';
  const handleCheckPressed = async () => {
    if (Platform.OS === 'android') {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
        checklocation = enableResult;
        if (enableResult === 'enabled' || enableResult === 'already-enabled') {
          const position = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
          });

          const {latitude, longitude} = position;

          latitudeoflocation = latitude.toString();
          longitudeoflocation = longitude.toString();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  };
  // function formatDateToISO(date) {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  //   const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits

  //   return `${year}-${month}-${day}`;
  // }
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const failedimagename = [];
  const [serversubmitloading, setserversubmitloading] = useState(false);
  const [uploadingimagename, setuploadingimagename] = useState('');

  const uploadimage = async (
    warrantyid,
    file,
    contactnumber,
    imagename,
    catogoruid,
    latitude,
    longitude,
    logVar,
    aagencyId,
    createdby,
  ) => {
    const now = moment();

    const formattedDate = now.format('YYYY-MM-DD HH:mm:ss');
    const timestamp = Date.now();
    const generatedId = `uploadedimageby_${contactnumber}_${timestamp}`;

    const formData = new FormData();
    const photoname = `${imagename}.${file.split('.').pop()}`;

    const requestData = {
      WarrantyId: warrantyid,
      TempId: generatedId,
      PhotoName: photoname,
      CategoryId: catogoruid,
      PhotoURL: `file://${file}`,
      Latitude: latitude,
      Longitude: longitude,
      PhotoCaptureAddress: '',
      PhotoUploadedBySystem: 'Mobile',
      CreatedBy: createdby,
      ModifiedBy: '',
      ModifyDate: '',
      AgencyId: aagencyId,
      InspectionDateTime: formattedDate,
      ServiceType: '',
    };
    const imageextension = file.split('.').pop().toLowerCase();
    if (
      imageextension !== 'jpg' &&
      imageextension !== 'jpeg' &&
      imageextension !== 'png'
    ) {
      Alert.alert('Error', 'Only JPG, JPEG, PNG format expected!');
      return;
    }
    await delay(2500);
    try {
      setuploadingimagename(`uploading ${imagename}`);

      formData.append('file', {
        uri: `file://${file}`,
        type: 'image/jpeg',
        name: file.split('/').pop(),
      });
      formData.append('RequestId', '');
      formData.append('IsEncrypt', '');
      formData.append('RequestData', JSON.stringify(requestData));
      formData.append('SessionExpiryTime', '');
      formData.append('UserId', '');
      const heaaders = await GetHeader();
      const response = await axios.post(RemoteUrls.postUploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          ...heaaders,
        },
      });
      console.log('Upload image response', response);
      if (response.status === 200) {
        setuploadingimagename(`uploaded ${imagename}`);
      }
      const formdatasending = {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      };
      const herderdata = JSON.stringify(formdatasending);
      const datarequest = JSON.stringify(requestData);
      const dataformdata = JSON.stringify(formData);
      if (response.status === 400) {
        await insertreuploadingimagedbItems(
          warrantyid,
          file,
          contactnumber,
          catogoruid,
          imagename,
          aagencyId,
          latitude,
          longitude,
          formattedDate,
          photoname,
          response.status.toString(),
          datarequest.toString(),
          dataformdata.toString(),
          herderdata.toString(),
          0,
        );
      }
      if (response.status === 204) {
        await insertreuploadingimagedbItems(
          warrantyid,
          file,
          contactnumber,
          catogoruid,
          imagename,
          aagencyId,
          latitude,
          longitude,
          formattedDate,
          photoname,
          response.status.toString(),
          datarequest.toString(),
          dataformdata.toString(),
          herderdata.toString(),
          0,
        );
      }
      if (response.status === 404) {
        await insertreuploadingimagedbItems(
          warrantyid,
          file,
          contactnumber,
          catogoruid,
          imagename,
          aagencyId,
          latitude,
          longitude,
          formattedDate,
          photoname,
          response.status.toString(),
          datarequest.toString(),
          dataformdata.toString(),
          herderdata.toString(),
          0,
        );
      }
      if (response.status === 500) {
        await insertreuploadingimagedbItems(
          warrantyid,
          file,
          contactnumber,
          catogoruid,
          imagename,
          aagencyId,
          latitude,
          longitude,
          formattedDate,
          photoname,
          response.status.toString(),
          datarequest.toString(),
          dataformdata.toString(),
          herderdata.toString(),
          1,
        );
      }
    } catch (error) {
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const warrantyidsasdasd = [];

  const handleLoop = async () => {
    if (isConnected === false) {
      Alert.alert('', 'Please check the internet!');
      return;
    }
    setwarrantyid([]);
    const checkedItems = items.filter(item => item.isChecked);

    for (const item of checkedItems) {
      const foundItem = warrantyPostObject.find(
        warrantyitem => warrantyitem.id === item.id,
      );

      // return
      await handlemodifyandsubmit(foundItem);
    }
    if (warrantyidsasdasd.length != 0) {
      Alert.alert(
        'Success',
        `${languagedata.lbl_dataSavedwithtempid}: ${warrantyidsasdasd}`,
        [
          {
            text: `${languagedata.lbl_Ok}`,
          },
        ],
      );
    } else {
      Alert.alert('Error', 'Faild to upload the warranty registration');
    }
  };

  const handlemodifyandsubmit = async foundItem => {
    if (isConnected === false) {
      Alert.alert('', 'Please check the internet!');
      return;
    }
    const filteredInput = foundItem.address.replace(/(\r\n|\n|\r)/g, ' ');
    // await fetchphotochategorylist();
    const userData = await getAllLoginItems();

    if (Platform.OS === 'android') {
      try {
        setloading(true);
        const enableResult = await promptForEnableLocationIfNeeded();
        const position = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
        });

        const {latitude, longitude} = position;
        if (latitude === null || longitude === null) {
          Alert.alert('Error', 'Failed to proccess due to location access');
          return;
        }
        var registionselecteddata;
        if (
          foundItem.registrationOption === 'Not Available' ||
          foundItem.registrationOption === 'New Vehicle'
        ) {
          registionselecteddata = foundItem.registrationOption;
        } else {
          registionselecteddata = foundItem.registrationNumber;
        }
        if (
          foundItem.tyre2SerialNumber2 === null ||
          foundItem.tyre2SerialNumber3 === null ||
          foundItem.tyre2SerialNumber2 === '' ||
          foundItem.tyre2SerialNumber3 === ''
        ) {
          const requestData = {
            Registration_No: registionselecteddata,
            CustomerName: foundItem.customerName,
            MobileNo: foundItem.mobileNumber,
            EmailId: loginItems.EmailId,
            Remark: null,
            Company: 'YOKOHAMA',
            IsDeclaretion: foundItem.termsAccepted,
            Agency_Id: loginItems.AgencyId,
            InvoiceNo: foundItem.invoiceNumber,
            InvoiceDate: foundItem.invoiceDate,
            InvoiceAmount: '',
            User_Device_Formation: deviceName,
            CreatedFor: 'self',
            MappingCodeCode: null,
            Address: filteredInput,
            State_Id: foundItem.state_id,
            State_Name: foundItem.state,
            District_id: foundItem.districtid,
            District_Name: foundItem.districtname,
            City_Id: foundItem.cityvillageid,
            City_Name: foundItem.cityvillagename,
            PinCode_Id: foundItem.pincodeid,
            PinCode_Name: foundItem.pinCode,
            ODOMeter: foundItem.odoMeterReading,
            Type_of_Machine_Id: foundItem.veh_type_id,
            Type_of_Machine_Name: foundItem.veh_type_name,
            Make_Id: foundItem.make_id,
            Make_Name: foundItem.make,
            Model_Id: null,
            Model_Name: foundItem.model,
            Variant_Id: foundItem.variantid,
            Variant_Name: foundItem.variantname,
            RegistrationDate: foundItem.registrationDate,
            ManufacturerDate: null,
            BrandName: foundItem.brand,
            ProductName: foundItem.productName,
            Serial_1:
              foundItem.series +
              foundItem.tyre1SerialNumber2 +
              foundItem.tyre1SerialNumber3,
            Serial_2: null,
            Serial_Number: null,
            Createdby: loginItems.Username,
            Photo_Temp_Id: null,
            TyreSize: foundItem.tyreSize,
            NoOfTyres: foundItem.tyreQuantity,
            OldTyre_CompanyName: foundItem.oldTyreCompany,
            OldTyre_BrandName: foundItem.oldTyreBrand,
            OldTyre_Size: foundItem.oldTyreSize,
          };
          const encryptedlogindata = AESExtensions.encryptSs(
            JSON.stringify(requestData),
          );
          const payload = {
            requestId: '',
            isEncrypt: '',
            requestData: encryptedlogindata,
            sessionExpiryTime: '',
            userId: '',
          };
          try {
            const heaaders = await GetHeader();
            const response = await axios.post(
              RemoteUrls.postWarrantyRegistrationUrl,
              payload,
              {
                headers: heaaders,
              },
            );
            const plaintextoflogindata = AESExtensions.decryptString(
              response.data.responseData,
            );

            if (response.status === 200) {
              if (foundItem.numberplateimage != null) {
                var logVar = 'siddhant';

                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.numberplateimage,
                  foundItem.mobileNumber,
                  photocategorylist[0].Photo_Category_Name,
                  photocategorylist[0].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              if (foundItem.tyre1Image != null) {
                var logVar = 'siddhant3';

                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.tyre1Image,
                  foundItem.mobileNumber,
                  photocategorylist[1].Photo_Category_Name,
                  photocategorylist[1].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              if (
                foundItem.tyre2SerialNumber2 !== null ||
                foundItem.tyre2SerialNumber3 !== null ||
                foundItem.tyre2SerialNumber2 !== '' ||
                foundItem.tyre2SerialNumber3 !== ''
              ) {
                if (foundItem.tyre2Image != null) {
                  var logVar = 'siddhant4';

                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.tyre2Image,
                    foundItem.mobileNumber,
                    photocategorylist[2].Photo_Category_Name,
                    photocategorylist[2].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
              }

              if (foundItem.invoiceImage != null) {
                var logVar = 'siddhant5';

                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.invoiceImage,
                  foundItem.mobileNumber,
                  photocategorylist[5].Photo_Category_Name,
                  photocategorylist[5].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              if (foundItem.odoMeterImage != null) {
                var logVar = 'siddhant2';
                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.odoMeterImage,
                  foundItem.mobileNumber,
                  photocategorylist[6].Photo_Category_Name,
                  photocategorylist[6].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              const payload = {
                requestId: '',
                isEncrypt: '',
                requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserId}\",\"StatusCode\":\"0\"}`,
                sessionExpiryTime: '',
                userId: '',
              };
              try {
                const response = await axios.post(
                  RemoteUrls.postFinalStatusUpdateUel,
                  payload,
                  {
                    headers: heaaders,
                  },
                );
                if (response.status === 200) {
                  warrantyidsasdasd.push(plaintextoflogindata.WarrantyNumber);

                  await updateSyncStatusWR(db, foundItem.id, true);
                  fetchItems(db);
                  setWarrantyPostObject([]);
                }
              } catch (error) {
                if (error.response.status === 406) {
                  const status = await GetLoginResponse();
                  if (status === 200) {
                    await handlemodifyandsubmit(foundItem);
                  }
                }
              }
              setloading(false);
            } else {
              setloading(false);

              console.error('Something went wrong');
            }
          } catch (error) {
            setloading(false);
            if (error.response.status === 406) {
              const status = await GetLoginResponse();
              if (status === 200) {
                await handlemodifyandsubmit(foundItem);
              }
            }
            console.log(error);
          }
          return;
        } else {
          const requestData = {
            Registration_No: registionselecteddata,
            CustomerName: foundItem.customerName,
            MobileNo: foundItem.mobileNumber,
            EmailId: loginItems.EmailId,
            Remark: null,
            Company: 'YOKOHAMA',
            IsDeclaretion: foundItem.termsAccepted,
            Agency_Id: loginItems.AgencyId,
            InvoiceNo: foundItem.invoiceNumber,
            InvoiceDate: foundItem.invoiceDate,
            InvoiceAmount: '',
            User_Device_Formation: deviceName,
            CreatedFor: 'self',
            MappingCodeCode: null,
            Address: filteredInput,
            State_Id: foundItem.state_id,
            State_Name: foundItem.state,
            District_id: foundItem.districtid,
            District_Name: foundItem.districtname,
            City_Id: foundItem.cityvillageid,
            City_Name: foundItem.cityvillagename,
            PinCode_Id: foundItem.pincodeid,
            PinCode_Name: foundItem.pinCode,
            ODOMeter: foundItem.odoMeterReading,
            Type_of_Machine_Id: foundItem.veh_type_id,
            Type_of_Machine_Name: foundItem.veh_type_name,
            Make_Id: foundItem.make_id,
            Make_Name: foundItem.make,
            Model_Id: null,
            Model_Name: foundItem.model,
            Variant_Id: foundItem.variantid,
            Variant_Name: foundItem.variantname,
            RegistrationDate: foundItem.registrationDate,
            ManufacturerDate: null,
            BrandName: foundItem.brand,
            ProductName: foundItem.productName,
            Serial_1:
              foundItem.series +
              foundItem.tyre1SerialNumber2 +
              foundItem.tyre1SerialNumber3,
            Serial_2:
              foundItem.series +
              foundItem.tyre2SerialNumber2 +
              foundItem.tyre2SerialNumber3,
            Serial_Number: null,
            Createdby: loginItems.Username,
            Photo_Temp_Id: null,
            TyreSize: foundItem.tyreSize,
            NoOfTyres: foundItem.tyreQuantity,
            OldTyre_CompanyName: foundItem.oldTyreCompany,
            OldTyre_BrandName: foundItem.oldTyreBrand,
            OldTyre_Size: foundItem.oldTyreSize,
          };
          const encryptedlogindata = AESExtensions.encryptSs(
            JSON.stringify(requestData),
          );
          const payload = {
            requestId: '',
            isEncrypt: '',
            requestData: encryptedlogindata,
            sessionExpiryTime: '',
            userId: '',
          };
          try {
            const heaaders = await GetHeader();
            const response = await axios.post(
              RemoteUrls.postWarrantyRegistrationUrl,
              payload,
              {
                headers: heaaders,
              },
            );
            const plaintextoflogindata = AESExtensions.decryptString(
              response.data.responseData,
            );
            if (response.status === 200) {
              if (foundItem.numberplateimage != null) {
                var logVar = 'siddhant1';
                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.numberplateimage,
                  foundItem.mobileNumber,
                  photocategorylist[0].Photo_Category_Name,
                  photocategorylist[0].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              if (foundItem.tyre1Image != null) {
                var logVar = 'siddhant3';
                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.tyre1Image,
                  foundItem.mobileNumber,
                  photocategorylist[1].Photo_Category_Name,
                  photocategorylist[1].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              if (foundItem.tyre2Image != null) {
                var logVar = 'siddhant4';
                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.tyre2Image,
                  foundItem.mobileNumber,
                  photocategorylist[2].Photo_Category_Name,
                  photocategorylist[2].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              if (foundItem.invoiceImage != null) {
                var logVar = 'siddhant4';
                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.invoiceImage,
                  foundItem.mobileNumber,
                  photocategorylist[5].Photo_Category_Name,
                  photocategorylist[5].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              if (foundItem.odoMeterImage != null) {
                var logVar = 'siddhant2';
                await uploadimage(
                  plaintextoflogindata.WarrantyNumber,
                  foundItem.odoMeterImage,
                  foundItem.mobileNumber,
                  photocategorylist[6].Photo_Category_Name,
                  photocategorylist[6].Photo_Category_ID,
                  latitude,
                  longitude,
                  logVar,
                  userData.AgencyId,
                  loginItems.Username,
                );
              }
              // await retryimageupload(
              //   plaintextoflogindata.WarrantyNumber,
              //   userData.AgencyId,
              //   foundItem,
              //   logVar,
              // );
              const payload = {
                requestId: '',
                isEncrypt: '',
                requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserId}\",\"StatusCode\":\"0\"}`,
                sessionExpiryTime: '',
                userId: '',
              };
              try {
                const response = await axios.post(
                  RemoteUrls.postFinalStatusUpdateUel,
                  payload,
                  {
                    headers: heaaders,
                  },
                );
                if (response.status === 200) {
                  warrantyidsasdasd.push(plaintextoflogindata.WarrantyNumber);

                  await updateSyncStatusWR(db, foundItem.id, true);
                  fetchItems(db);
                  setWarrantyPostObject([]);
                }
              } catch (error) {
                if (error.response.status === 406) {
                  const status = await GetLoginResponse();
                  if (status === 200) {
                    await handlemodifyandsubmit(foundItem);
                  }
                }
              }
              setloading(false);
            } else {
              setloading(false);

              console.error('Something went wrong');
            }
          } catch (error) {
            setloading(false);
            if (error.response.status === 406) {
              const status = await GetLoginResponse();
              if (status === 200) {
                await handlemodifyandsubmit(foundItem);
              }
            }
            console.log(error);
          }
        }
        setloading(false);
      } catch (error: unknown) {
        setloading(false);
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
    if (Platform.OS === 'ios') {
      await getLocation(foundItem, userData);
    }
  };
  const getLocation = async (foundItem, userData) => {
    const filteredInput = foundItem.address.replace(/(\r\n|\n|\r)/g, ' ');

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async location => {
        try {
          setloading(true);
          const position = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
          });

          const {latitude, longitude} = location;
          if (latitude === null || longitude === null) {
            Alert.alert('Error', 'Failed to proccess due to location access');
            return;
          }
          var registionselecteddata;
          if (
            registrationOption === 'Not Available' ||
            registrationOption === 'New Vehicle'
          ) {
            registionselecteddata = registrationOption;
          } else {
            registionselecteddata = foundItem.registrationNumber;
          }
          if (
            foundItem.tyre2SerialNumber2 === null &&
            foundItem.tyre2SerialNumber3 === null
          ) {
            const requestData = {
              Registration_No: registionselecteddata,
              CustomerName: foundItem.customerName,
              MobileNo: foundItem.mobileNumber,
              EmailId: loginItems.EmailId,
              Remark: null,
              Company: 'YOKOHAMA',
              IsDeclaretion: foundItem.termsAccepted,
              Agency_Id: loginItems.AgencyId,
              InvoiceNo: foundItem.invoiceNumber,
              InvoiceDate: foundItem.invoiceDate,
              InvoiceAmount: '',
              User_Device_Formation: deviceName,
              CreatedFor: 'self',
              MappingCodeCode: null,
              Address: filteredInput,
              State_Id: foundItem.state_id,
              State_Name: foundItem.state,
              District_id: foundItem.districtid,
              District_Name: foundItem.districtname,
              City_Id: foundItem.cityvillageid,
              City_Name: foundItem.cityvillagename,
              PinCode_Id: foundItem.pincodeid,
              PinCode_Name: foundItem.pinCode,
              ODOMeter: foundItem.odoMeterReading,
              Type_of_Machine_Id: foundItem.veh_type_id,
              Type_of_Machine_Name: foundItem.veh_type_name,
              Make_Id: foundItem.make_id,
              Make_Name: foundItem.make,
              Model_Id: null,
              Model_Name: foundItem.model,
              Variant_Id: foundItem.variantid,
              Variant_Name: foundItem.variantname,
              RegistrationDate: foundItem.registrationDate,
              ManufacturerDate: null,
              BrandName: foundItem.brand,
              ProductName: foundItem.productName,
              Serial_1:
                foundItem.series +
                foundItem.tyre1SerialNumber2 +
                foundItem.tyre1SerialNumber3,
              Serial_2: null,
              Serial_Number: null,
              Createdby: loginItems.Username,
              Photo_Temp_Id: null,
              TyreSize: foundItem.tyreSize,
              NoOfTyres: foundItem.tyreQuantity,
              OldTyre_CompanyName: foundItem.oldTyreCompany,
              OldTyre_BrandName: foundItem.oldTyreBrand,
              OldTyre_Size: foundItem.oldTyreSize,
            };
            const encryptedlogindata = AESExtensions.encryptSs(
              JSON.stringify(requestData),
            );
            const payload = {
              requestId: '',
              isEncrypt: '',
              requestData: encryptedlogindata,
              sessionExpiryTime: '',
              userId: '',
            };

            try {
              const response = await axios.post(
                RemoteUrls.postWarrantyRegistrationUrl,
                payload,
              );
              const plaintextoflogindata = AESExtensions.decryptString(
                response.data.responseData,
              );

              if (response.status === 200) {
                if (foundItem.numberplateimage != null) {
                  var logVar = 'siddhant';

                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.numberplateimage,
                    foundItem.mobileNumber,
                    photocategorylist[0].Photo_Category_Name,
                    photocategorylist[0].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                if (foundItem.tyre1Image != null) {
                  var logVar = 'siddhant3';

                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.tyre1Image,
                    foundItem.mobileNumber,
                    photocategorylist[1].Photo_Category_Name,
                    photocategorylist[1].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                if (
                  foundItem.tyre2SerialNumber2 !== null &&
                  foundItem.tyre2SerialNumber3 !== null
                ) {
                  if (foundItem.tyre2Image != null) {
                    var logVar = 'siddhant4';

                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      foundItem.tyre2Image,
                      foundItem.mobileNumber,
                      photocategorylist[2].Photo_Category_Name,
                      photocategorylist[2].Photo_Category_ID,
                      latitude,
                      longitude,
                      logVar,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                }

                var logVar = 'siddhant5';

                if (foundItem.invoiceImage != null) {
                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.invoiceImage,
                    foundItem.mobileNumber,
                    photocategorylist[5].Photo_Category_Name,
                    photocategorylist[5].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                if (foundItem.odoMeterImage != null) {
                  var logVar = 'siddhant2';
                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.odoMeterImage,
                    foundItem.mobileNumber,
                    photocategorylist[6].Photo_Category_Name,
                    photocategorylist[6].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                var logVar = 'siddhant4';

                // await retryimageupload(
                //   plaintextoflogindata.WarrantyNumber,
                //   userData.AgencyId,
                //   foundItem,
                //   logVar,
                // );
                const payload = {
                  requestId: '',
                  isEncrypt: '',
                  requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserId}\",\"StatusCode\":\"0\"}`,
                  sessionExpiryTime: '',
                  userId: '',
                };
                try {
                  const response = await axios.post(
                    RemoteUrls.postFinalStatusUpdateUel,
                    payload,
                  );
                  if (response.status === 200) {
                    warrantyidsasdasd.push(plaintextoflogindata.WarrantyNumber);

                    await updateSyncStatusWR(db, foundItem.id, true);
                    fetchItems(db);
                    setWarrantyPostObject([]);
                  }
                } catch (error) {
                  console.log('error', error);
                }
                setloading(false);
              } else {
                setloading(false);

                console.error('Something went wrong');
              }
            } catch (error) {
              setloading(false);

              console.log(error);
            }
            // finally {
            //   setloading(false)
            // }
            return;
          } else {
            const requestData = {
              Registration_No: registionselecteddata,
              CustomerName: foundItem.customerName,
              MobileNo: foundItem.mobileNumber,
              EmailId: loginItems.EmailId,
              Remark: null,
              Company: 'YOKOHAMA',
              IsDeclaretion: foundItem.termsAccepted,
              Agency_Id: loginItems.AgencyId,
              InvoiceNo: foundItem.invoiceNumber,
              InvoiceDate: foundItem.invoiceDate,
              InvoiceAmount: '',
              User_Device_Formation: deviceName,
              CreatedFor: 'self',
              MappingCodeCode: null,
              Address: filteredInput,
              State_Id: foundItem.state_id,
              State_Name: foundItem.state,
              District_id: foundItem.districtid,
              District_Name: foundItem.districtname,
              City_Id: foundItem.cityvillageid,
              City_Name: foundItem.cityvillagename,
              PinCode_Id: foundItem.pincodeid,
              PinCode_Name: foundItem.pinCode,
              ODOMeter: foundItem.odoMeterReading,
              Type_of_Machine_Id: foundItem.veh_type_id,
              Type_of_Machine_Name: foundItem.veh_type_name,
              Make_Id: foundItem.make_id,
              Make_Name: foundItem.make,
              Model_Id: null,
              Model_Name: foundItem.model,
              Variant_Id: foundItem.variantid,
              Variant_Name: foundItem.variantname,
              RegistrationDate: foundItem.registrationDate,
              ManufacturerDate: null,
              BrandName: foundItem.brand,
              ProductName: foundItem.productName,
              Serial_1:
                foundItem.series +
                foundItem.tyre1SerialNumber2 +
                foundItem.tyre1SerialNumber3,
              Serial_2:
                foundItem.series +
                foundItem.tyre2SerialNumber2 +
                foundItem.tyre2SerialNumber3,
              Serial_3: null,
              Serial_4: null,
              Serial_Number: null,
              Createdby: loginItems.Username,
              Photo_Temp_Id: null,
              TyreSize: foundItem.tyreSize,
              NoOfTyres: foundItem.tyreQuantity,
              OldTyre_CompanyName: foundItem.oldTyreCompany,
              OldTyre_BrandName: foundItem.oldTyreBrand,
              OldTyre_Size: foundItem.oldTyreSize,
            };
            const encryptedlogindata = AESExtensions.encryptSs(
              JSON.stringify(requestData),
            );
            const payload = {
              requestId: '',
              isEncrypt: '',
              requestData: encryptedlogindata,
              sessionExpiryTime: '',
              userId: '',
            };
            try {
              const response = await axios.post(
                RemoteUrls.postWarrantyRegistrationUrl,
                payload,
              );
              const plaintextoflogindata = AESExtensions.decryptString(
                response.data.responseData,
              );

              if (response.status === 200) {
                if (foundItem.numberplateimage != null) {
                  var logVar = 'siddhant1';
                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.numberplateimage,
                    foundItem.mobileNumber,
                    photocategorylist[0].Photo_Category_Name,
                    photocategorylist[0].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                if (foundItem.tyre1Image != null) {
                  var logVar = 'siddhant3';
                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.tyre1Image,
                    foundItem.mobileNumber,
                    photocategorylist[1].Photo_Category_Name,
                    photocategorylist[1].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                if (foundItem.tyre2Image != null) {
                  var logVar = 'siddhant4';
                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.tyre2Image,
                    foundItem.mobileNumber,
                    photocategorylist[2].Photo_Category_Name,
                    photocategorylist[2].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                if (foundItem.invoiceImage != null) {
                  var logVar = 'siddhant4';
                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.invoiceImage,
                    foundItem.mobileNumber,
                    photocategorylist[5].Photo_Category_Name,
                    photocategorylist[5].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                if (foundItem.odoMeterImage != null) {
                  var logVar = 'siddhant2';
                  await uploadimage(
                    plaintextoflogindata.WarrantyNumber,
                    foundItem.odoMeterImage,
                    foundItem.mobileNumber,
                    photocategorylist[6].Photo_Category_Name,
                    photocategorylist[6].Photo_Category_ID,
                    latitude,
                    longitude,
                    logVar,
                    userData.AgencyId,
                    loginItems.Username,
                  );
                }
                // await retryimageupload(
                //   plaintextoflogindata.WarrantyNumber,
                //   userData.AgencyId,
                //   foundItem,
                //   logVar,
                // );
                const payload = {
                  requestId: '',
                  isEncrypt: '',
                  requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserId}\",\"StatusCode\":\"0\"}`,
                  sessionExpiryTime: '',
                  userId: '',
                };
                try {
                  const response = await axios.post(
                    RemoteUrls.postFinalStatusUpdateUel,
                    payload,
                  );
                  if (response.status === 200) {
                    warrantyidsasdasd.push(plaintextoflogindata.WarrantyNumber);

                    await updateSyncStatusWR(db, foundItem.id, true);
                    fetchItems(db);
                    setWarrantyPostObject([]);
                  }
                } catch (error) {
                  console.log('error', error);
                }
                setloading(false);
              } else {
                setloading(false);

                console.error('Something went wrong');
              }
            } catch (error) {
              setloading(false);
            }
          }
          setloading(false);
        } catch (error: unknown) {
          setloading(false);
          if (error instanceof Error) {
            console.error(error.message);
          }
        }
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };
  const [isActive, setIsAvtive] = useState(false);
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
          {/* <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logo/tractor.png')} style={{height:100,width: 100}} resizeMode='contain' />
    </View> */}
          {/* <Text>{location}</Text> */}
          <View style={styles.logoContainer}>
            <Text style={styles.headerText}>
              {languagedata.lbl_DraftWarranty}
            </Text>
          </View>

          <View style={styles.logoContainer}>
            <Text style={styles.subheaderText}>
              {languagedata.lbl_UnsyncWarranty}
            </Text>
          </View>

          {/* <View style={styles.radioButtonLabelContainer}>

      <View style = {{alignItems:'center', justifyContent:'center', width:'50%'}}>
        <Text style={styles.radioLabelHeader}>Warranty No.</Text>
      </View>

      <View style = {{  width:'50%'}}>
        <Text style={styles.radioLabelHeader}>Mobile No.</Text>
      </View>

    </View> */}

          {/* <View style={{width:'100%'}} >
        {Options.map((item, index) => (
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
          ))}
        </View> */}
          <Modal
            transparent={true}
            visible={loading}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setloading(!loading);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size="large" color="black" />
                {/* <Text>Uploading... {uploadingimagename}</Text> */}
                <Text>{languagedata.lbl_uploading}...</Text>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={serversubmitloading}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setserversubmitloading(!serversubmitloading);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size="large" color="black" />
                <Text>Re-Uploading...</Text>
              </View>
            </View>
          </Modal>
          {items?.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {item.isStatus === 0 ? ( // Check if item.Status is not 1
                <>
                  <Text style={{color: '#000', fontSize: 18, marginLeft: 10}}>
                    {languagedata.lbl_Inbox_WarrantyNo}: {item.id}
                  </Text>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleCheckboxChange(index, item)}>
                    <View
                      style={[
                        styles.checkbox,
                        {backgroundColor: item.isChecked ? '#E11E30' : '#fff'},
                      ]}>
                      {item.isChecked === true ? (
                        <Icon name="check" size={15} color="white" />
                      ) : (
                        <></>
                      )}
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
            </View>
          ))}

          {/* <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text>id: {item.id}</Text>
        {
          item.isStatus ? <Text style={{ textAlign: 'center', backgroundColor: '#a6edb4', width: 80, color: 'black', borderRadius: 15 }}>complete</Text> :
            <Text style={{ textAlign: 'center', backgroundColor: '#9ec0f7', width: 80, color: 'black', borderRadius: 15 }}>pending</Text>
        }
      </View> */}

          {/* <View style={styles.syncContainer}>
        <TouchableOpacity style={styles.syncbutton} onPress={handleLoop}>
          <Text style={styles.buttonText}>Modify & Submit</Text>
        </TouchableOpacity>
      </View> */}

          {items?.length === 0 ? (
            <Text style={{textAlign: 'center'}}>
              {languagedata.lbl_NoWarrantyRegistrationfound}
            </Text>
          ) : (
            <>
              {
                items &&
                items.length > 0 &&
                items.every(item => item.isStatus === 1) ? (
                  <></>
                ) : (
                  <>
                    {warrantyPostObject.length === 0 ? (
                      <View style={styles.syncContainer}>
                        <TouchableOpacity
                          disabled={true}
                          style={{
                            backgroundColor: '#e11e30',
                            padding: 10,
                            marginVertical: 10,
                            marginLeft: 4,
                            borderRadius: 5,
                            width: '100%',
                            opacity: 0.5,
                          }}
                          onPress={handleLoop}>
                          <Text style={styles.buttonText}>
                            {languagedata.Submit}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.syncContainer}>
                        <TouchableOpacity
                          style={styles.syncbutton}
                          onPress={handleLoop}>
                          <Text style={styles.buttonText}>
                            {languagedata.Submit}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )

                // <View style={styles.syncContainer}>
                //   <TouchableOpacity style={styles.syncbutton} onPress={handleLoop}>
                //     <Text style={styles.buttonText}>{languagedata.Submit}</Text>
                //   </TouchableOpacity>
                // </View>
              }
            </>
          )}

          {/* <LeadDetails /> */}
          {/* <View style={styles.syncContainer}>
        <TouchableOpacity disabled={true} style={[styles.syncbutton, { opacity: false ? 1 : 0.5 }]} onPress={handleLoop}>
          <Text style={styles.buttonText}>Modify & Submit (In the work)</Text>
        </TouchableOpacity>
      </View> */}
          {/* >>>>>>> ac30e9dd1e878af22b51b760fef1e891272dcec9 */}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              onPress={() => setIsAvtive(false)}
              style={[
                {borderWidth: 1, borderRadius: 5, padding: 10, width: '48%'},
                {
                  backgroundColor: isActive === false ? '#E11E30' : 'white',
                  borderColor: isActive === false ? '#E11E30' : 'black',
                },
              ]}>
              <Text
                style={[
                  {textAlign: 'center'},
                  {color: isActive === false ? 'white' : '#E11E30'},
                ]}>
                {languagedata.lbl_Draft}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsAvtive(true)}
              style={[
                {borderWidth: 1, borderRadius: 5, padding: 10, width: '48%'},
                {
                  backgroundColor: isActive === true ? '#E11E30' : 'white',
                  borderColor: isActive === true ? '#E11E30' : 'black',
                },
              ]}>
              <Text
                style={[
                  {textAlign: 'center'},
                  {color: isActive === true ? 'white' : '#E11E30'},
                ]}>
                {languagedata.lbl_failed_image}
              </Text>
            </TouchableOpacity>
          </View>

          {isActive === false ? (
            <>
              {items?.length === 0 ? (
                <></>
              ) : (
                <>
                  {items && items.every(item => item.isStatus === 1) ? (
                    <></>
                  ) : (
                    <FlatList
                      scrollEnabled={false}
                      data={warrantyPostObject}
                      renderItem={renderItem}
                      keyExtractor={item => item.id}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <FlatList
                scrollEnabled={false}
                data={failedimagedata}
                renderItem={renderItem1}
                keyExtractor={item => item.id}
              />
            </>
          )}

          {isActive === false ? (
            warrantyPostObject.length === 0 ? (
              <View style={styles.nodatacontainer}>
                <Text style={styles.nodatalbl}>
                  {languagedata.lbl_no_warranty_registerd_selected}
                </Text>
              </View>
            ) : (
              <></>
            )
          ) : failedimagedata.length === 0 ? (
            <View style={styles.nodatacontainer}>
              <Text style={styles.nodatalbl}>
                {languagedata.lbl_no_image_failed_yet}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {/* {
            failedimagedata.map(ele => {
              <Text>{ele.agency_id}</Text>
            })
          } */}
          {/* <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <UpdateWarrantyRegistration
                languagedata={languagedata}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                setmodalvisible={setModalVisible}
              />

              {/* <View style={styles.cardGroup}>
                <View style={styles.buttoncard}>
                  <TouchableOpacity onPress={closeModal}>
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                  </TouchableOpacity>

                </View>
                <View style={styles.buttoncard}>
                  <TouchableOpacity onPress={handleUpdate} >
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 16 }}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
      </View>
          </View >
        </Modal > */}

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

export default Outbox;
