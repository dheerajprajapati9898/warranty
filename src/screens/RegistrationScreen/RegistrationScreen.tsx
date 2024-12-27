import React, {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  Modal,
  ActivityIndicator,
  Pressable,
  Linking,
  Platform,
  PermissionsAndroid,
  Dimensions,
  Keyboard,
  TouchableHighlight,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableNativeFeedback,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import DatePicker from 'react-native-date-picker';
import {RadioButton, List, Snackbar} from 'react-native-paper';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/AntDesign';
import {SelectList} from 'react-native-dropdown-select-list';
import {setupDatabase} from '../../db/Registration/database';
import {
  Item,
  insertItem,
  getAllItems,
  updateItem,
  deleteItem,
  updateSyncStatusWR,
} from '../../db/Registration/sqliteOperations';
import NetInfo from '@react-native-community/netinfo';
import {
  setupLoginDatabase,
  getAllLoginItems,
  insertLoginItems,
  loginInsertChecked,
} from './../../db/Login/Login';
import {
  setupSettingDatabase,
  getSettingItems,
  insertSettingItems,
  clearSettingTable,
  updateSettingItems,
  getSettingbyuseridItems,
} from './../../db/setting/settings';
import {launchCamera} from 'react-native-image-picker';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {
  setupStateDatabase,
  getAllStateItems,
} from './../../db/Registration/StateDb';
import {
  setupPinCodeDatabase,
  getAllPinCodeItems,
  getAllPinCodedataItems,
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
  getbrandids,
} from './../../db/Registration/BrandName';
import {
  setupProductNameDatabase,
  getAllProductNameItems,
  insertProductNameItems,
  getProductNameByProductId,
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
import {
  setupVehicleVariantDatabase,
  getAllVehicleVariantItems,
  insertVehicleVariantItems,
  clearVehicleVariantTable,
  getVariantByMakeID,
} from './../../db/Registration/VehicleVariant';
import axios from 'axios';
import {
  getAllVehicleTypeItems,
  setupVehicleTypeDatabase,
} from '../../db/Registration/VehicleTypeDb';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import RemoteUrls from '../apiUrl';
import {
  setupRegexDatabase,
  getAllRegexItems,
  insertRegexItems,
  clearRegexTable,
} from './../../db/regex/regex';
import DeviceInfo from 'react-native-device-info';
import {AESExtensions} from '../AESExtensions';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import {
  setupLeadShowDatabase,
  getAllLeadShowItems,
  insertLeadShowItems,
  clearLeadShowTable,
} from './../../db/leadshow/leadshow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import GetLocation from 'react-native-get-location';
import {jsiConfigureProps} from 'react-native-reanimated/lib/typescript/reanimated2/core';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import moment from 'moment';
import ModalSelector from 'react-native-modal-selector';
import LookupModal from 'react-native-lookup-modal';
import {
  setupPhotoCategorylistDatabase,
  getPhotoCategorylistItems,
  insertPhotoCategorylistItems,
  clearPhotoCategorylistTable,
  getPhotoCategorylistbyuseridItems,
} from './../../db/photocategorylist/photocategorylist';
import {LightSpeedOutLeft} from 'react-native-reanimated';
import crashlytics, {log} from '@react-native-firebase/crashlytics';
import {
  setupreuploadingimagedbDatabase,
  getAllreuploadingimagedbItems,
  insertreuploadingimagedbItems,
  clearreuploadingimagedbTable,
  getreuploadingimagedbid,
  getdatabyerrorcode,
  updatereuploadingimage,
} from './../../db/reuploadingimagedb/reuploadingimagedb';
import {v4 as uuidv4} from 'uuid';
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';
import {fetch as fetchssl} from 'react-native-ssl-pinning';
const WarrantyRegistrationForm = () => {
  const [checksession, setchecksession] = useState(false);

  const [isConnected, setIsConnected] = useState(null);
  const placeholderTextColor: string = '#666';
  const iconColor = '#000';
  const RadioButtonColor: string = '#e11e30';
  const [fromDate, setFromDate] = useState(null);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [onlinedateupload, setonlineuploaddate] = useState('');
  const handleFromDateConfirm = selectedDate => {
    setOpenFromDate(false); // Close From Date picker
    const asdasdas = moment(selectedDate).format('DD/MM/YYYY');
    setFromDate(asdasdas);
    const selectedDates = selectedDate;
    const formattedDate = selectedDates.toISOString().split('T')[0];
    setonlineuploaddate(formattedDate);
    handleOptionalDetailsChange('invoiceDate', formattedDate);
  };
  // Function to handle cancellation of Date pickers
  const handleCancel = () => {
    setOpenFromDate(false); // Close From Date picker
    setOpenToDate(false); // Close To Date picker
  };
  const [modalVisible, setModalVisible] = useState(false);

  const [expanded, setExpanded] = React.useState(true);

  const [isVehicleRegistrationAvailable, setIsVehicleRegistrationAvailable] =
    useState(false);

  const handlePress = () => setExpanded(!expanded);
  const [selectedNumberOfTyre, setSelectedNumberOfTyre] = React.useState('');
  const NumberOfTyredata = [
    {key: 1, value: '1'},
    {key: 2, value: '2'},
  ];
  const [selectedOldTyreSize, setSelectedOldTyreSize] = React.useState('');
  const OldTyreSizedata = [
    {key: 1, value: '1'},
    {key: 2, value: '2'},
  ];
  //database variables
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  // const [items, setItems] = useState<Item[]>([]);
  //----------------------------------------------------------------

  // State variables to manage visibility of input fields -----------------------------------
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showOptionalDetails, setShowOptionlDetails] = useState(false);
  const [showOldTyreDetails, setShowOldTyreDetails] = useState(false);

  // Toggle functions
  const toggleCustomerDetails = () => {
    if (registrationOption === null) {
      Alert.alert('Validation Error', 'Selection is required!');
      return;
    }
    setShowCustomerDetails(prev => !prev);
  };

  const toggleVehicleDetails = () => {
    if (registrationOption === null) {
      Alert.alert('Validation Error', 'Selection is required!');
      return;
    }
    setShowVehicleDetails(prev => !prev);
  };

  const toggleOptionalDetails = () => {
    if (registrationOption === null) {
      Alert.alert('Validation Error', 'Selection is required!');
      return;
    }
    setShowOptionlDetails(prev => !prev);
  };

  const toggleOldTyreDetails = () => {
    if (registrationOption === null) {
      Alert.alert('Validation Error', 'Selection is required!');
      return;
    }
    setShowOldTyreDetails(prev => !prev);
  };

  // ------------------------------------------------------------------------------------------
  const [isDisable, setIsDisable] = useState(false);

  const [registrationOption, setRegistrationOption] = useState('Available');
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked1, setIsChecked1] = useState(true);
  const [registrationDate, setRegistrationDate] = useState(null);
  const [vehicleRegistration, setVehicleRegistration] = useState({
    reg_num: '',
    mobileNumber: '',
    address: '',
    state: '',
    pinCode: '',
  });
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    mobileNumber: '',
    address: '',
    state: '',
    pinCode: '',
  });
  const [vehicleDetails, setVehicleDetails] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    brand: '',
    productName: '',
    tyreSize: '',
    tyreQuantity: '2',
    tyre1SerialNumber1: '',
    tyre1SerialNumber2: '',
    tyre1SerialNumber3: '',
    tyre1Image: null,
    tyre2SerialNumber1: '',
    tyre2SerialNumber2: '',
    tyre2SerialNumber3: '',
    tyre2Image: null,
  });
  const [optionalDetails, setOptionalDetails] = useState({
    invoiceNumber: '',
    invoiceImage: null,
    invoiceDate: '',
    odoMeterReading: '',
    odoMeterImage: null,
  });
  const [oldTyreDetails, setOldTyreDetails] = useState({
    oldTyreCompany: '',
    oldTyreBrand: '',
    oldTyreSize: '',
  });
  const [serial_1, setserial_1] = useState('');
  const [serial_2, setserial_2] = useState('');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [a, seta] = useState('');
  const cameraRef = useRef(null);

  const handleRadioButtonChange = option => {
    try {
      setRegistrationOption(option);
      if (registrationOption === 'Available') {
        setIsVehicleRegistrationAvailable(true); // Set state for available option
      } else {
        setIsVehicleRegistrationAvailable(false); // Set state for other options
      }
      if (option === 'Not Available' || option === 'New Vehicle') {
        setnumberplate(null);
        setVehicleDetails({
          registrationNumber: '',
        });
      }
      if (
        option === 'Not Available' ||
        option === 'New Vehicle' ||
        option === 'Available'
      ) {
        if (
          vehicleDetails.tyreQuantity === 2 ||
          vehicleDetails.tyreQuantity === '2'
        ) {
          handleVehicleDetailsChange('tyreQuantity', 2);
          handleVehicleDetailsChange(
            'tyre1SerialNumber1',
            vehicleDetails.tyre1SerialNumber1,
          );
          handleVehicleDetailsChange(
            'tyre1SerialNumber2',
            vehicleDetails.tyre1SerialNumber2,
          );
          handleVehicleDetailsChange(
            'tyre1SerialNumber3',
            vehicleDetails.tyre1SerialNumber3,
          );
          handleVehicleDetailsChange(
            'tyre2SerialNumber1',
            vehicleDetails.tyre2SerialNumber1,
          );
          handleVehicleDetailsChange(
            'tyre2SerialNumber2',
            vehicleDetails.tyre2SerialNumber2,
          );
          handleVehicleDetailsChange(
            'tyre2SerialNumber3',
            vehicleDetails.tyre2SerialNumber3,
          );
          handleVehicleDetailsChange('tyre1Image', vehicleDetails.tyre1Image);
          handleVehicleDetailsChange('tyre2Image', vehicleDetails.tyre2Image);
        }
        if (
          vehicleDetails.tyreQuantity === '1' ||
          vehicleDetails.tyreQuantity === 1
        ) {
          handleVehicleDetailsChange('tyreQuantity', 1);
          handleVehicleDetailsChange(
            'tyre1SerialNumber1',
            vehicleDetails.tyre1SerialNumber1,
          );
          handleVehicleDetailsChange(
            'tyre1SerialNumber2',
            vehicleDetails.tyre1SerialNumber2,
          );
          handleVehicleDetailsChange(
            'tyre1SerialNumber3',
            vehicleDetails.tyre1SerialNumber3,
          );
          handleVehicleDetailsChange('tyre1Image', vehicleDetails.tyre1Image);
          handleVehicleDetailsChange('tyre2SerialNumber1', '');
          handleVehicleDetailsChange('tyre2SerialNumber2', '');
          handleVehicleDetailsChange('tyre2SerialNumber3', '');
          handleVehicleDetailsChange('tyre2Image', null);
        }
      }
      if (vehicleDetails.make !== '' || vehicleDetails.make !== undefined) {
        handleVehicleDetailsChange('make', vehicleDetails.make);
      }
      if (vehicleDetails.model !== '' || vehicleDetails.model !== undefined) {
        handleVehicleDetailsChange('model', vehicleDetails.model);
      }
      if (vehicleDetails.brand !== '' || vehicleDetails.brand !== undefined) {
        handleVehicleDetailsChange('brand', vehicleDetails.brand);
      }
      if (
        vehicleDetails.productName !== '' ||
        vehicleDetails.productName !== undefined
      ) {
        handleVehicleDetailsChange('productName', vehicleDetails.productName);
      }
      if (
        vehicleDetails.tyreSize !== '' ||
        vehicleDetails.tyreSize !== undefined
      ) {
        handleVehicleDetailsChange('tyreSize', vehicleDetails.tyreSize);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVehicleRegistrationChange = (field, value) => {
    setVehicleDetails(prevState => ({...prevState, [field]: value}));
  };

  const handleCustomerDetailsChange = (field, value) => {
    setCustomerDetails(prevState => ({...prevState, [field]: value}));
  };
  const [ismakeshow, setismakeshow] = useState(false);
  const [ismodelshow, setismodelshow] = useState(false);
  const [isvehiclevariantshow, setisvehiclevariantshow] = useState(false);
  const [isvehiclevariantcheck, setisvehiclevariantcheck] = useState(false);
  const [isvehiclemakedataitem, setisvehiclemakedataitem] = useState([]);
  const [isvehiclemodeldataitem, setisvehiclemodeldataitem] = useState([]);
  const [isvehtype, setisvehtype] = useState(false);
  const fetchveh_make = async veh_type_id => {};
  const getVehicleMakeByVehiceTypeID = async value => {
    const helper = vehicleTypeItems.filter(element => element.value === value);

    setvehicletyedata(helper[0]);
    let helperarray = await getVehicleByVehTypeid(helper[0].key);
    const makedataItems = helperarray.map(item => ({
      key: item.MakeID,
      value: item.MakeName,
    }));

    setisvehiclemakedataitem(makedataItems);
    setMakeNamesItems(makedataItems);

    let helpermodelarray = await getVehicleModelByVehTypeid(helper[0].key);
    const modeldataItems = helpermodelarray.map(item => ({
      key: item.modelID,
      value: item.modelName,
    }));
    setModelItems(modeldataItems);
    setismakeshow(true);
    setismodelshow(true);
  };
  const [isVehicleVariantdataitem, setisVehicleVariantdataitem] = useState([]);
  const getVehicleVariantById = async value => {
    const helper = makeINamestems.filter(element => element.value === value);

    setgetmakeid(helper[0].key);

    setisvehiclevariantshow(true);
  };
  const storeVehicleVariant = async value => {
    const helper = vehicleVariantItems.filter(
      element => element.value === value,
    );

    setstateidvalue(helper[0]);
  };
  const handleVehicleDetailsChange = async (field, value) => {
    setVehicleDetails(prevState => ({...prevState, [field]: value}));
  };

  const handleSelectedNumberOfTyre = selectedValue => {
    handleVehicleDetailsChange('tyreQuantity', selectedValue); // Update tyreQuantity in vehicleDetails
  };

  const handleOptionalDetailsChange = (field, value) => {
    setOptionalDetails(prevState => ({...prevState, [field]: value}));
  };

  const handleOldTyreDetailsChange = (field, value) => {
    setOldTyreDetails(prevState => ({...prevState, [field]: value}));
  };

  const handleCameraOpen = (p0: string) => {
    setIsCameraOpen(true);
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
  };

  const handleCapture = async imageKey => {};

  // const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);
  const [stateItems, setStateItems] = useState();
  const [pincodeItems, setPinCodeItems] = useState();
  const [makeItems, setMakeItems] = useState();
  const [makeINamestems, setMakeNamesItems] = useState();
  const [modelItems, setModelItems] = useState();
  const [brandnameItems, setBrandNameItems] = useState();
  const [productnameItems, setProductNameItems] = useState();
  const [productname, setProductName] = useState();
  const [productids, setProductids] = useState();
  const [tyresizeItems, setTyreSizeItems] = useState();
  const [oldtyrebrandnameItems, setOldTyreBrandNameItems] = useState();
  const [oldtyrecompanyItems, setOldTyreCompanyItems] = useState();
  const [vehicleTypeItems, setVehicleTypeItems] = useState();
  const [vehicleVariantItems, setVehicleVariantItems] = useState();
  const [serialkey, setserialkey] = useState();
  const [stateidvalue, setstateidvalue] = useState();
  const [vehicletyedata, setvehicletyedata] = useState();
  const [styrequantitySelected, setstyrequantitySelectedy] = useState('2');

  // const [selectedItem, setSelectedItem] = useState(null);
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
      fetchStateItems();
    }
  };
  const [numberplate, setnumberplate] = useState(null);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulated refreshing action
    setTimeout(() => {
      setData([]);
      // fetchData();
      fetchStateItems();

      setRefreshing(false);
    }, 1000); // Simulated delay
  };
  const [loadingdata, setloadingdata] = useState(true);

  const [loginItems, setLoginItems] = useState();
  const [deviceName, setDeviceName] = useState('');
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
  const [settingdata, setsettingdata] = useState();
  const [statenameold, setstatenameold] = useState();
  const [areapincode, setareapincode] = useState();
  const [cityvillageid, setcityvillageid] = useState();
  const [cityvillagename, setcityvillagename] = useState();
  const [districtid, setdistrictid] = useState();
  const [districtname, setdistrictname] = useState();
  const [pincodeid, setpincodeid] = useState();
  const formatDateForORM = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchsettingdata = async () => {
    const data = await getSettingbyuseridItems();
    setsettingdata(data[0]);
    setStateObjectofkey(data[0].state_id);
    setstatenameold(data[0].statename);
    setStatedata(data[0].statename);
    setareapincode(data[0].areapincode);
    setpincodevaluedata(data[0].areapincode);
  };

  const methodcall = async () => {
    if (Platform.OS === 'android') {
      const enableResult = await promptForEnableLocationIfNeeded();
    }
    await setupPhotoCategorylistDatabase();
    await fetchphotochategorylist();

    setloadingdata(true);

    await setupMultiLanguageDatabase();
    await fetchingthelanguagedata();

    setloadingdata(false);

    await setupLoginDatabase();
    await setupRegexDatabase();

    const fetchDeviceInfo = async () => {
      try {
        const name = await DeviceInfo.getDeviceName();
        setDeviceName(name);
      } catch (error) {
        console.error('Error fetching device name:', error);
      }
    };

    await fetchDeviceInfo();
    const registrationsate = formatDateForORM(new Date());
    setRegistrationDate(registrationsate);
    await setupStateDatabase();
    await setupreuploadingimagedbDatabase();
    await fetchStateItems();

    await setupPinCodeDatabase();

    await setupTractorMakeDatabase();
    await setupVehicleVariantDatabase();
    // fetchTractorMakeItems();

    await setupTractorModelDatabase();
    // fetchTractorModelItems();

    await setupBrandNasadmeDatabase();
    await fetchBrandNasadmeItems();

    await setupProductNameDatabase();
    await fetchProductNameItems();

    await setupTyreSizeDatabase();

    await setupOldTyreBrandNameDatabase();
    await setupOldTyreCompanyDatabase();

    await fetchOldTyreCompanyItems();
    await setupVehicleTypeDatabase();

    await fetchVehicleTypeItems();
    await setupVehicleVariantDatabase();
    setStateObjectofkey(null);
    await initializeDatabase();
    await feItems();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Initial check when component mounts
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
    await setupSettingDatabase();
    await fetchsettingdata();
    await setupLeadShowDatabase();
    await fetchwarrantyregistration();
    const data = await getSettingbyuseridItems();

    if (data.length != 0) {
      await fetchPinCodeItems(data[0].state_id, data[0].statename);
    }

    return () => {
      unsubscribe();
    };
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
        unsubscribe();
      };
    }, [handleConnectivityChange]),
  );
  const fetchwarrantyregistration = async () => {
    const savedUserId = await AsyncStorage.getItem('userid');
    const warrantyregistrationdata = await getAllLeadShowItems(savedUserId);
  };
  const initializeDatabase = async () => {
    const database = await setupDatabase();
    setDb(database);
    fetchItems(database);
    // setVehicleDetails(prevDetails => ({
    //   ...prevDetails,
    //   tyre1Image: imageUri
    // }));
    await fetchogin();
  };
  const fetchogin = async () => {
    try {
      const fetchedItems = await getAllLoginItems();

      setLoginItems(fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };
  const [regex, setregex] = useState();
  const [regex1, setregex1] = useState();

  const feItems = async () => {
    try {
      const itemsFromDb = await getAllRegexItems();
      const tyresizeItems = itemsFromDb.map(item => ({
        key: item.FeatureID,
        value: item.KeyValue,
      }));
      setregex(tyresizeItems);
      setregex1(itemsFromDb);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const [stateObjectofkey, setStateObjectofkey] = useState();
  const getStateObjectByName = async stateName => {
    const getstateItems = await getAllStateItems();
    const getstate = getstateItems.filter(
      state => state.statename === stateName,
    );

    setStateObjectofkey(getstate[0].stateid);
  };
  const [Stateitemdata, setStateitemdata] = useState([]);

  const fetchStateItems = async () => {
    try {
      const itemsFromDb = await getAllStateItems();
      const formattedItems = itemsFromDb.map(item => ({
        key: item.stateid,
        value: item.statename,
      }));
      if (itemsFromDb.length === 0) {
        navigation.navigate('Masters');
      }
      setStateitemdata(formattedItems);
      setStateItems(formattedItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [pincodelist, setPincodelist] = useState(null);

  const getPincode = async pincodevalue => {
    const getpincodeItems = await getAllPinCodedataItems(pincodevalue);
    const getpincode = getpincodeItems.filter(
      pincode => pincode.areapincode === pincodevalue,
    );
    setPincodelist(getpincode[0]);
  };
  const [ispincodeloading, setispincodeloading] = useState(false);
  const [pincodedata, setpincodedata] = useState([]);
  const fetchPinCodeItems = async (stateid, statename) => {
    const id = stateid.toString();

    try {
      const itemsFromDb = await getAllPinCodeItems(id);
      const pincodeItems = itemsFromDb.map(item => ({
        key: item.pincodeid,
        value: item.areapincode,
      }));
      if (pincodeItems.length === 0) {
        Alert.alert(
          'Error',
          `${languagedata.lbl_syncStateMessage} ${statename} ${languagedata.lbl_states}`,
        );
        return;
      }
      if (pincodeItems.length != 0) {
        setStatedata(statename);
        setStateObjectofkey(stateid);
      }

      setpincodedata(pincodeItems);
      setPinCodeItems(pincodeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [getmakeid, setgetmakeid] = useState(null);
  const getmakeidlist = async makeName => {
    const makeid = makeItems.filter(make => make.value === makeName);
  };
  const fetchTractorMakeItems = async () => {
    try {
      const TractorMake = await getAllTractorMakeItems();

      setMakeItems(TractorMake);
      const makeItems = TractorMake.map(item => ({
        key: item.MakeID,
        value: item.MakeName,
      }));
      setMakeNameItems(makeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const [getmodelid, setgetmodelid] = useState(null);
  const getmodelidlist = async modelName => {
    // const getstateItems = await getAllStateItems()
    const modelid = modelItems.filter(model => model.value === modelName);
    setgetmodelid(modelid[0].key);
  };
  const [BrandNasadmeItemsdata, setBrandNasadmeItemsdata] = useState([]);

  const fetchBrandNasadmeItems = async () => {
    try {
      const itemsFromDb = await getAllBrandNasadmeItems();
      const brandnameItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.brandname,
      }));
      setBrandNasadmeItemsdata(brandnameItems);
      setBrandNameItems(brandnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [istyresizevisible, setistyresizevisible] = useState(false);
  const getProductNameById = async value => {
    const helper = productnameItems.filter(element => element.value === value);

    const helperarray = await getProductNameByProductId(helper[0].key);
    setserialkey(helperarray[0].series);
    // setproductid(helper[0].key)
    setistyresizevisible(true);
    await fetchTyreSizeItems(helper[0].key);
    setProductName(helperarray[0].productName);
    setProductids(helperarray[0].productId);
  };
  const [ProductNameItemsdata, setProductNameItemsdata] = useState([]);

  const fetchProductNameItems = async () => {
    try {
      const itemsFromDb = await getAllProductNameItems();
      const productnameItems = itemsFromDb.map(item => ({
        key: item.productId,
        value: item.productName,
      }));

      setProductNameItemsdata(productnameItems);
      setProductNameItems(productnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [brandidget, setbrandidget] = useState();
  const getbrandlist = async brand => {
    const makeid = await getbrandids(brand);
    setbrandidget(makeid[0].brandid);
  };
  const [TyreSizeItemsdata, setTyreSizeItemsdata] = useState([]);

  const fetchTyreSizeItems = async product => {
    try {
      const itemsFromDb = await getAllTyreSizeItems(product);

      const tyresizeItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.sizeName,
      }));
      setTyreSizeItemsdata(tyresizeItems);
      setTyreSizeItems(tyresizeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [oldtyrebrandnameItemsdata, setoldtyrebrandnameItemsdata] = useState(
    [],
  );
  const [oldtyrebrandnameItemsiddata, setoldtyrebrandnameItemsiddata] =
    useState(null);
  const [oldTyreCompanydataid, setoldTyreCompanydataid] = useState(null);

  const fetchOldTyreBrandNameItems = async value => {
    setoldtyrebrandnameItemsiddata(value);
    try {
      const itemsFromDb = await getAllOldTyreBrandNameItems(value);
      const oldtyrebrandnameItems = itemsFromDb.map(item => ({
        key: item.brandpatternId,
        value: item.brandpattern,
      }));
      setoldtyrebrandnameItemsdata(oldtyrebrandnameItems);

      // setoldTyreCompanydataid(oldtyrebrandnameItems.key)
      setOldTyreBrandNameItems(oldtyrebrandnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [oldtyrecompanynameItemsdata, setoldtyrecompanynameItemsdata] =
    useState([]);
  const fetchOldTyreCompanyItems = async () => {
    try {
      const itemsFromDb = await getAllOldTyreCompanyItems();
      const oldtyrecompanyItems = itemsFromDb.map(item => ({
        key: item.tyre_company_Id,
        value: item.tyre_company_name,
      }));
      setoldtyrecompanynameItemsdata(oldtyrecompanyItems);
      setOldTyreCompanyItems(oldtyrecompanyItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [VehicleTypeItemsdata, setVehicleTypeItemsdata] = useState([]);

  const fetchVehicleTypeItems = async () => {
    try {
      const itemsFromDb = await getAllVehicleTypeItems();
      const VehicleTypeItems = itemsFromDb.map(item => ({
        key: item.Veh_Type_ID,
        value: item.Veh_Type_Name,
      }));
      setVehicleTypeItemsdata(VehicleTypeItems);
      setVehicleTypeItems(VehicleTypeItems);
    } catch (error) {
      console.error('Fetch error:', error);
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
  //display the saved data (offline)
  // if you want to display the data then enable this code {in JSX you find the flatlist also }
  const renderItem = ({item}: {item: Item}) => (
    <View>
      <Text>id: {item.id}</Text>
      <Text>registrationOption: {item.registrationOption}</Text>
      {/* <Text>customerName: {item.CustomerName}</Text>
      <Text>mobileNumber: {item.MobileNo}</Text> */}
      <Text>address: {item.address}</Text>
      <Text>state: {item.state}</Text>
      <Text>pinCode: {item.pinCode}</Text>
      <Text>obileNumber: {item.mobileNumber}</Text>
      <Text>make: {item.make}</Text>
      <Text>model: {item.model}</Text>
      <Text>brand: {item.brand}</Text>
      <Text>productName: {item.productName}</Text>
      <Text>tyreSize: {item.tyreSize}</Text>
      <Text>stateid: {item.state_id}</Text>
      <Text>tyreQuantity: {item.tyreQuantity}</Text>
      {/* <Text>tyre1SerialNumber: {item.tyre1SerialNumber1}</Text>
      <Text>tyre1SerialNumber: {item.tyre1SerialNumber2}</Text>
      <Text>tyre1SerialNumber: {item.tyre1SerialNumber3}</Text> */}
      <Text>tyre1Image: {item.tyre1Image}</Text>
      {/* <Text>tyre2SerialNumber: {item.tyre2SerialNumber1}</Text>
      <Text>tyre2SerialNumber: {item.tyre2SerialNumber2}</Text>
      <Text>tyre2SerialNumber: {item.tyre2SerialNumber3}</Text> */}
      <Text>tyre2Image: {item.tyre2Image}</Text>
      {/* <Text>invoiceNumber: {item.InvoiceNumber}</Text> */}
      <Text>invoiceImage: {item.invoiceImage}</Text>
      {/* <Text>invoiceDate: {item.InvoiceDate}</Text> */}
      <Text>odoMeterReading: {item.odoMeterReading}</Text>
      <Text>odoMeterImage: {item.odoMeterImage}</Text>
      {/* <Text>oldTyreCompany: {item.OldTyreCompanyName}</Text> */}
      {/* <Text>oldTyreBrand: {item.OldTyreBrandName}</Text> */}
      {/* <Text>oldTyreSize: {item.OldTyreSize}</Text> */}
      <Text>termsAccepted: {item.termsAccepted}</Text>
      <Text>date: {item.registrationDate}</Text>
      <Button
        title="Delete"
        onPress={async () => {
          if (!db) {
            return;
          }
          await deleteItem(db, item.id);
          fetchItems(db);
        }}
      />
      {/* <Button
        title="update"
        onPress={async () => {
          if (!db) return;
          await updateItem(db, item.id);
          fetchItems(db);
        }}
      /> */}
    </View>
  );
  //Camera module to open the camera and pick the pitcures
  const [invoiceImageUri, setInvoiceImageUri] = useState(null);
  const [ODOMeterImageUri, setODOMeterImageUri] = useState(null);
  const [tyre1Image, setTyre1Image] = useState(null);
  const [tyre2Image, setTyre2Image] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [imageUploadingDataArray, setImageUploadingDataArray] = useState([]);
  // const compressImageQuality = parseFloat(regex[17]) / 100;
  // const [tyre2Image, setTyre2Image] = useState(null);
  const requestPermission = async () => {
    let permission;

    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.CAMERA;
    }

    if (permission) {
      try {
        // Check current permission status
        const status = await check(permission);

        if (status === 'granted') {
          return 'granted'; // Permission is already granted
        }

        // Request permission
        const newStatus = await request(permission);

        if (newStatus === 'denied' || newStatus === 'blocked') {
          Alert.alert(
            'Permission Required',
            'Camera access is required to use this feature. Please enable it in the settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => openSettings(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
          );
          return 'denied'; // Permission was denied or blocked
        }

        return newStatus; // Return the new status
      } catch (error) {
        console.error('Error requesting permission:', error);
        return 'error'; // Handle error
      }
    }

    return 'error'; // Handle case where permission is not set
  };
  const [imageData, setImageData] = useState([]);
  const imageDataArray = [];
  const numberplateimage = async () => {
    const permissionStatus = await requestPermission();

    if (permissionStatus === 'granted') {
      try {
        // Open the camera and get the image
        const image = await ImagePicker.openCamera({
          // width: 400,
          // height: 400,
          cropping: false,
          mediaType: 'photo',
          saveToPhotos: false,
          compressImageQuality: Platform.OS === 'ios' ? 0.4 : 0.5,
        });

        const imageextension = image.path.split('.').pop().toLowerCase();

        // Define the new file path
        const fileName = `image_${Date.now()}.${imageextension}`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);
        setnumberplate(newPath); // Update the state with the new path

        if (fileExists) {
          const userData = await getAllLoginItems();

          const data = {
            image: `file://${newPath}`,
            mobilenumber: customerDetails.mobileNumber,
            category_id: photocategorylist[0].Photo_Category_ID,
            category_name: photocategorylist[0].Photo_Category_Name,
            agencyid: userData.AgencyId,
            username: loginItems.Username,
          };
          imageDataArray.push(data);
          setImageData(prevData => [...prevData, data]);
        } else {
          console.error('File does not exist after copy operation.');
        }
      } catch (error) {
        console.error('Error during image processing:', error);
        Alert.alert('Error', `${languagedata.lbl_failed_to_process_image}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
      }
    }
  };
  const invoicePickCamera = async () => {
    const permissionStatus = await requestPermission();

    if (permissionStatus === 'granted') {
      try {
        // Open the camera and get the image
        const image = await ImagePicker.openCamera({
          // width: 400,
          // height: 400,
          cropping: false,
          mediaType: 'photo',
          saveToPhotos: false,
          compressImageQuality: Platform.OS === 'ios' ? 0.4 : 0.5,
        });

        const imageextension = image.path.split('.').pop().toLowerCase();

        // Define the new file path
        const fileName = `image_${Date.now()}.${imageextension}`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);

        if (fileExists) {
          setInvoiceImageUri(newPath);
          const userData = await getAllLoginItems();

          const data = {
            image: `file://${newPath}`,
            mobilenumber: customerDetails.mobileNumber,
            category_id: photocategorylist[5].Photo_Category_ID,
            category_name: photocategorylist[5].Photo_Category_Name,
            agencyid: userData.AgencyId,
            username: loginItems.Username,
          };
          imageDataArray.push(data);
          setImageData(prevData => [...prevData, data]);

          setOptionalDetails(prevDetails => ({
            ...prevDetails,
            invoiceImage: newPath,
          })); // Update the state with the new path
        } else {
          console.error('File does not exist after copy operation.');
        }
      } catch (error) {
        console.error('Error during image processing:', error);
        Alert.alert('Error', `${languagedata.lbl_failed_to_process_image}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
      }
    }
  };
  const ODOMeterPickCamera = async () => {
    const permissionStatus = await requestPermission();

    if (permissionStatus === 'granted') {
      try {
        // Open the camera and get the image
        const image = await ImagePicker.openCamera({
          // width: 400,
          // height: 400,
          cropping: false,
          mediaType: 'photo',
          saveToPhotos: false,
          compressImageQuality: Platform.OS === 'ios' ? 0.4 : 0.5,
        });

        const imageextension = image.path.split('.').pop().toLowerCase();

        // Define the new file path
        const fileName = `image_${Date.now()}.${imageextension}`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);

        if (fileExists) {
          setODOMeterImageUri(newPath);
          const userData = await getAllLoginItems();

          const data = {
            image: `file://${newPath}`,
            mobilenumber: customerDetails.mobileNumber,
            category_id: photocategorylist[6].Photo_Category_ID,
            category_name: photocategorylist[6].Photo_Category_Name,
            agencyid: userData.AgencyId,
            username: loginItems.Username,
          };
          imageDataArray.push(data);
          setImageData(prevData => [...prevData, data]);

          setOptionalDetails(prevDetails => ({
            ...prevDetails,
            odoMeterImage: newPath,
          })); // Update the state with the new path
        } else {
          console.error('File does not exist after copy operation.');
        }
      } catch (error) {
        console.error('Error during image processing:', error);
        Alert.alert('Error', `${languagedata.lbl_failed_to_process_image}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
      }
    }
  };
  const tyre1ImagePickCamera = async () => {
    const permissionStatus = await requestPermission();

    if (permissionStatus === 'granted') {
      try {
        // Open the camera and get the image
        const image = await ImagePicker.openCamera({
          // width: 400,
          // height: 400,
          cropping: false,
          mediaType: 'photo',
          saveToPhotos: false,
          compressImageQuality: Platform.OS === 'ios' ? 0.4 : 0.5,
        });

        const imageextension = image.path.split('.').pop().toLowerCase();

        // Define the new file path
        const fileName = `image_${Date.now()}.${imageextension}`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);

        if (fileExists) {
          setTyre1Image(newPath);
          const userData = await getAllLoginItems();

          const data = {
            image: `file://${newPath}`,
            mobilenumber: customerDetails.mobileNumber,
            category_id: photocategorylist[1].Photo_Category_ID,
            category_name: photocategorylist[1].Photo_Category_Name,
            agencyid: userData.AgencyId,
            username: loginItems.Username,
          };
          imageDataArray.push(data);
          setImageData(prevData => [...prevData, data]);

          setVehicleDetails(prevDetails => ({
            ...prevDetails,
            tyre1Image: newPath,
          })); // Update the state with the new path
        } else {
          console.error('File does not exist after copy operation.');
        }
      } catch (error) {
        console.error('Error during image processing:', error);
        Alert.alert('Error', `${languagedata.lbl_failed_to_process_image}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
      }
    }
  };
  const tyre2ImagePickCamera = async () => {
    const permissionStatus = await requestPermission();

    if (permissionStatus === 'granted') {
      try {
        // Open the camera and get the image
        const image = await ImagePicker.openCamera({
          // width: 400,
          // height: 400,
          cropping: false,
          mediaType: 'photo',
          saveToPhotos: false,
          compressImageQuality: Platform.OS === 'ios' ? 0.4 : 0.5,
        });

        const imageextension = image.path.split('.').pop().toLowerCase();

        // Define the new file path
        const fileName = `image_${Date.now()}.${imageextension}`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);
        setTyre2Image(newPath);
        const userData = await getAllLoginItems();

        const data = {
          image: `file://${newPath}`,
          mobilenumber: customerDetails.mobileNumber,
          category_id: photocategorylist[2].Photo_Category_ID,
          category_name: photocategorylist[2].Photo_Category_Name,
          agencyid: userData.AgencyId,
          username: loginItems.Username,
        };
        imageDataArray.push(data);
        setImageData(prevData => [...prevData, data]);

        setVehicleDetails(prevDetails => ({
          ...prevDetails,
          tyre2Image: newPath,
        }));
        if (fileExists) {
          // Update the state with the new path
        } else {
          console.error('File does not exist after copy operation.');
        }
      } catch (error) {
        console.error('Error during image processing:', error);
        Alert.alert('Error', `${languagedata.lbl_failed_to_process_image}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
      }
    }
  };
  const navigation = useNavigation();

  const [submitloading, setsubmitloading] = useState(false);
  const handleSubmit = async () => {
    const filteredInput = customerDetails.address.replace(/(\r\n|\n|\r)/g, ' ');

    try {
      if (!db) {
        return;
      }
      setsubmitloading(true);

      const newItem = {
        registrationOption,
        isChecked,
        registrationDate,
        ...customerDetails,
        ...vehicleDetails,
        ...optionalDetails,
        ...oldTyreDetails,
        termsAccepted,
      };

      if (pincodelist === null) {
        const id = await insertItem(
          db,
          newItem,
          statenameold,
          stateObjectofkey,
          pincodevaluedata,
          settingdata.districtid,
          settingdata.districtname,
          settingdata.cityvillageid,
          settingdata.cityvillagename,
          settingdata.pincodeid,
          getmakeid,
          brandidget,
          productids,
          serialkey,
          vehicletyedata.key,
          vehicletyedata.value,
          stateidvalue.key,
          stateidvalue.value,
          numberplate,
          false,
          oldtyrebrandnameItemsiddata,
          oldTyreCompanydataid,
        );

        setRegistrationOption(null);
        setIsChecked(false);
        setRegistrationDate(null);
        setStatedata(null);
        setTermsAccepted(false);
        setVehicleTypedata(null);
        setVehicleMakedata(null);
        setVehicleVariantdata(null);
        setVehicleModeldata(null);
        setTyreBranddata(null);
        setProductNamedata(null);
        setTyreSizedata(null);
        setoldTyreCompanydata(null);
        setoldTyreBranddata(null);
        handleCustomerDetailsChange('state', ' ');
        setpincodevaluedata(null);
        setnumberplate(null);
        setFromDate(null);
        setCustomerDetails({
          customerName: '',
          mobileNumber: '',
          address: '',
          state: '',
          pinCode: '',
        });
        setVehicleDetails({
          registrationNumber: '',
          make: '',
          model: '',
          brand: '',
          productName: '',
          tyreSize: '',
          tyreQuantity: 2,
          tyre1SerialNumber1: '',
          tyre1SerialNumber2: '',
          tyre1SerialNumber3: '',
          tyre1Image: null,
          tyre2SerialNumber1: '',
          tyre2SerialNumber2: '',
          tyre2SerialNumber3: '',
          tyre2Image: null,
        });
        setOptionalDetails({
          invoiceNumber: '',
          invoiceImage: null,
          invoiceDate: '',
          odoMeterReading: '',
          odoMeterImage: null,
        });
        setOldTyreDetails({
          oldTyreCompany: '',
          oldTyreBrand: '',
          oldTyreSize: '',
        });
        setTermsAccepted(false);
        Alert.alert(
          `${languagedata.lbl_Success}`,
          `${languagedata.lbl_dataSavedwithtempid}: ` + id,
          [
            {
              text: `${languagedata.lbl_Ok}`,
              onPress: () => {
                // Navigate to another screen after pressing OK

                navigation.navigate('HomeDrawer');
              },
            },
          ],
        );
      } else {
        const id = await insertItem(
          db,
          newItem,
          Statedata,
          stateObjectofkey,
          pincodevaluedata,
          pincodelist.districtid,
          pincodelist.districtname,
          pincodelist.cityvillageid,
          pincodelist.cityvillagename,
          pincodelist.pincodeid,
          getmakeid,
          brandidget,
          productids,
          serialkey,
          vehicletyedata.key,
          vehicletyedata.value,
          stateidvalue.key,
          stateidvalue.value,
          numberplate,
          false,
          oldtyrebrandnameItemsiddata,
          oldTyreCompanydataid,
        );
        setRegistrationOption(null);
        setIsChecked(false);
        setRegistrationDate(null);
        setStatedata(null);
        setTermsAccepted(false);
        setVehicleTypedata(null);
        setVehicleMakedata(null);
        setVehicleVariantdata(null);
        setVehicleModeldata(null);
        setTyreBranddata(null);
        setProductNamedata(null);
        setTyreSizedata(null);
        setoldTyreCompanydata(null);
        setoldTyreBranddata(null);
        handleCustomerDetailsChange('state', ' ');
        setpincodevaluedata(null);
        setnumberplate(null);
        setFromDate(null);

        setCustomerDetails({
          customerName: '',
          mobileNumber: '',
          address: '',
          state: '',
          pinCode: '',
        });
        setVehicleDetails({
          registrationNumber: '',
          make: '',
          model: '',
          brand: '',
          productName: '',
          tyreSize: '',
          tyreQuantity: 2,
          tyre1SerialNumber1: '',
          tyre1SerialNumber2: '',
          tyre1SerialNumber3: '',
          tyre1Image: null,
          tyre2SerialNumber1: '',
          tyre2SerialNumber2: '',
          tyre2SerialNumber3: '',
          tyre2Image: null,
        });
        setOptionalDetails({
          invoiceNumber: '',
          invoiceImage: null,
          invoiceDate: '',
          odoMeterReading: '',
          odoMeterImage: null,
        });
        setOldTyreDetails({
          oldTyreCompany: '',
          oldTyreBrand: '',
          oldTyreSize: '',
        });
        setTermsAccepted(false);
        Alert.alert(
          `${languagedata.lbl_Success}`,

          `${languagedata.lbl_dataSavedwithtempid}: ` + id,
          [
            {
              text: `${languagedata.lbl_Ok}`,
              onPress: () => {
                // Navigate to another screen after pressing OK

                navigation.navigate('HomeDrawer');
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setsubmitloading(false);
    }
  };
  const [photocategorylist, setphotocategorylist] = useState(null);

  const fetchphotochategorylist = async () => {
    try {
      const photocategorylistdata = await getPhotoCategorylistItems();
      setphotocategorylist(photocategorylistdata);
    } catch (error) {
      console.error('Error fetching photo category list:', error);
    }
  };

  function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits

    return `${year}-${month}-${day}`;
  }
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const failedimagename = [];
  const [serversubmitloading, setserversubmitloading] = useState(false);
  const [uploadingimagename, setuploadingimagename] = useState('');
  const reuploadingimagefromthelocaldatabase = async (
    warrantyid,
    file,
    contactnumber,
    categoryId,
    imagename,
    latitude,
    longitude,
    agencyId,
    createdby,
  ) => {
    const now = new Date();

    const formattedDate = formatDateToISO(now);

    // const formattedDate = now.format('YYYY-MM-DD HH:mm:ss');

    const timestamp = Date.now();
    const generatedId = `uploadedimageby_${contactnumber}_${timestamp}_${categoryId}`;

    const formData = new FormData();
    const photoname = `${imagename}.${file.split('.').pop()}`;
    const requestData = {
      WarrantyId: warrantyid,
      TempId: generatedId,
      PhotoName: photoname,
      CategoryId: categoryId,
      PhotoURL: `file://${file}`,
      Latitude: latitude,
      Longitude: longitude,
      PhotoCaptureAddress: '',
      PhotoUploadedBySystem: 'Mobile',
      CreatedBy: createdby,
      ModifiedBy: '',
      ModifyDate: '',
      AgencyId: agencyId,
      InspectionDateTime: formattedDate,
      ServiceType: '',
    };
    const imageextension = file.split('.').pop().toLowerCase();
    // if (
    //   imageextension === 'jpg' ||
    //   imageextension === 'jpeg' ||
    //   imageextension === 'png'
    // ) {

    // }
    // else {
    //   Alert.alert('Error', 'Only JPG, JPEG, PNG format expected!');
    //   return;
    // }

    // await delay(2500);
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
      const response = await fetchssl(RemoteUrls.postUploadUrl, {
        // const response = await axios.post(RemoteUrls.postUploadUrl, formData, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          ...heaaders,
        },
      });
      Alert.alert('from db', response.status.toString());
      if (response.status === 200) {
        setuploadingimagename(`uploaded ${imagename}`);
      }
      // await delay(2500);
      // crashlytics().log(`image name: ${imagename}`)
      const formdatasending = {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      };
      const herderdata = JSON.stringify(formdatasending);
      const datarequest = JSON.stringify(requestData);
      const dataformdata = JSON.stringify(formData);

      if (response.status === 403) {
        await insertreuploadingimagedbItems(
          warrantyid,
          file,
          contactnumber,
          categoryId,
          imagename,
          agencyId,
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
      if (response.status === 200) {
        await updatereuploadingimage(warrantyid, 1);
      }
    } catch (logError) {
      if (logError.response.status === 406) {
        setchecksession(true);
        const status = await GetLoginResponse();
      }
      Alert.alert('', logError.message);
      Alert.alert('', `failed image ${imagename}`);
    }
  };
  const gettingthefailedimageerrorcodedata = async (
    warrantyid,
    file,
    contactnumber,
    categoryId,
    imagename,
    latitude,
    longitude,
    agencyId,
    createdby,
  ) => {
    const data = await getdatabyerrorcode('403', warrantyid);
    if (data.length === 0) {
      return;
    } else {
      Alert.alert('', 'executing from local db');
      for (const ele of data) {
        await reuploadingimagefromthelocaldatabase(
          ele.warranty_id,
          ele.file,
          ele.mobilenumber,
          ele.image_category_id,
          ele.image_name,
          ele.Latitude,
          ele.Longitude,
          ele.agency_id,
          ele.created_by,
        );
      }
    }
  };
  // var uploadingimagename = ''
  const uploadimage = async (
    warrantyid,
    file,
    contactnumber,
    categoryId,
    imagename,
    latitude,
    longitude,
    agencyId,
    createdby,
  ) => {
    const fileExists = await RNFS.exists(file);
    if (fileExists === false) {
      Alert.alert('', `file doesnt exist on path - ${file}`);
      return;
    }
    // const now = moment();
    const now = new Date();

    const formattedDate = formatDateToISO(now);

    // const formattedDate = now.format('YYYY-MM-DD HH:mm:ss');

    const timestamp = Date.now();
    const generatedId = `uploadedimageby_${contactnumber}_${timestamp}_${categoryId}`;

    const formData = new FormData();
    const photoname = `${imagename}.${file.split('.').pop()}`;
    const requestData = {
      WarrantyId: warrantyid,
      TempId: generatedId,
      PhotoName: photoname,
      CategoryId: categoryId,
      PhotoURL: `file://${file}`,
      Latitude: latitude,
      Longitude: longitude,
      PhotoCaptureAddress: '',
      PhotoUploadedBySystem: 'Mobile',
      CreatedBy: createdby,
      ModifiedBy: '',
      ModifyDate: '',
      AgencyId: agencyId,
      InspectionDateTime: formattedDate,
      ServiceType: '',
    };
    const imageextension = file.split('.').pop().toLowerCase();
    // if (
    //   imageextension === 'jpg' ||
    //   imageextension === 'jpeg' ||
    //   imageextension === 'png'
    // ) {

    // }
    // else {
    //   Alert.alert('Error', 'Only JPG, JPEG, PNG format expected!');
    //   return;
    // }

    // await delay(2500);
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
      const response = await fetch(RemoteUrls.postUploadUrl, {
        // const response = await axios.post(RemoteUrls.postUploadUrl, formData, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          ...heaaders,
        },
      });
      // Alert.alert("", response.status.toString())
      if (response.status === 200) {
        setuploadingimagename(`uploaded ${imagename}`);
      }
      // await delay(2500);
      // crashlytics().log(`image name: ${imagename}`)
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
          categoryId,
          imagename,
          agencyId,
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
          categoryId,
          imagename,
          agencyId,
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
          categoryId,
          imagename,
          agencyId,
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
          categoryId,
          imagename,
          agencyId,
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
    } catch (logError) {
      if (logError.response.status === 406) {
        setchecksession(true);
        const status = await GetLoginResponse();
      }
      Alert.alert('', logError.message);
      Alert.alert('', `failed image ${imagename}`);
    }
  };

  const returnlocation = async () => {
    if (Platform.OS === 'android') {
      const enableResult = await promptForEnableLocationIfNeeded();
      const position = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      return position;
    } else if (Platform.OS === 'ios') {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      })
        .then(location => {
          console.log(location);
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
          return;
        });
      return;
    }
  };
  const validationmessage = async mode => {
    const contactforserialnumberRegex = /^[0-9+\-]+$/;

    if (registrationOption === null) {
      Alert.alert('Error', `${languagedata.lbl_Selectionisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    const registrationnoregex = new RegExp(regex[0].value);

    if (registrationOption === 'Available') {
      if (vehicleDetails.registrationNumber === '') {
        Alert.alert(
          'Error',
          `${languagedata.lbl_RegistrationNumberBlankValidation}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );

        return;
      }

      if (!registrationnoregex.test(vehicleDetails.registrationNumber)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_RegistrationNumberValidation}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
    }

    if (customerDetails.customerName === '') {
      Alert.alert('Error', `${languagedata.rfvCustomerName}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    const nameRegexstr = regex[6].value; // Regex pattern: alphabets, hyphen, apostrophe, and space
    const nameRegex = new RegExp(nameRegexstr);
    if (!nameRegex.test(customerDetails.customerName)) {
      Alert.alert(
        'Validation Error',
        `${languagedata.lbl_CustomerNameValidation}`,
        [{text: `${languagedata.lbl_Ok}`}],
      );
      return;
    }
    if (customerDetails.mobileNumber === '') {
      Alert.alert('Error', `${languagedata.ReqCusMobileNo}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    // if (vehicleDetails.registrationNumber === '') {
    //   Alert.alert(`Error`, "Enter valid vehicle registration no")
    //   return
    // }
    const contactRegexstr = regex[3].value;

    const contactRegex = new RegExp(contactRegexstr);
    if (!contactRegex.test(customerDetails.mobileNumber)) {
      Alert.alert('Validation Error', `${languagedata.lbl_NumberValidation}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (customerDetails.address === '') {
      Alert.alert('Error', `${languagedata.lbl_Addressisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (statenameold === undefined && Statedata === null) {
      Alert.alert('Error', `${languagedata.lbl_Stateisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (areapincode === undefined && pincodevaluedata === null) {
      Alert.alert('Error', `${languagedata.lbl_PinCodeisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (isvehtype === false) {
      Alert.alert('Error', `${languagedata.lbl_VehicleTypeisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (vehicleDetails.make === '') {
      Alert.alert('Error', `${languagedata.rfvMake}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    if (vehicleDetails.model === '') {
      Alert.alert('Error', `${languagedata.lbl_ModelCannotbeBlank}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (VehicleVariantdata === null) {
      Alert.alert('Error', `${languagedata.lbl_VehicleVariantisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (vehicleDetails.brand === '') {
      Alert.alert('Error', `${languagedata.lbl_TyreBrandisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (vehicleDetails.productName === '') {
      Alert.alert('Error', `${languagedata.lbl_ProductNameisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    if (vehicleDetails.tyreSize === '') {
      Alert.alert('Error', `${languagedata.lbl_TyreSizeisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (vehicleDetails.tyreQuantity === undefined) {
      Alert.alert('Error', `${languagedata.lbl_NumberofTyresisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    // if()
    if (
      vehicleDetails.tyreQuantity === 1 ||
      vehicleDetails.tyreQuantity === '1'
    ) {
      if (
        !contactforserialnumberRegex.test(vehicleDetails.tyre1SerialNumber2)
      ) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre1SerialNumber2.length != 5) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1containatleast5number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre1SerialNumber3 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial1}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (vehicleDetails.tyre1SerialNumber2 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial1}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (
        !contactforserialnumberRegex.test(vehicleDetails.tyre1SerialNumber3)
      ) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre1SerialNumber3.length != 4) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1containatleast4number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (tyre1Image === null) {
        Alert.alert('Error', `${languagedata.lbl_Serial1imageisrequired}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
    }
    if (
      vehicleDetails.tyreQuantity === 2 ||
      vehicleDetails.tyreQuantity === '2'
    ) {
      if (
        !contactforserialnumberRegex.test(vehicleDetails.tyre1SerialNumber2)
      ) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre1SerialNumber2.length != 5) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1containatleast5number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre1SerialNumber3 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial1}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (vehicleDetails.tyre1SerialNumber2 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial1}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (
        !contactforserialnumberRegex.test(vehicleDetails.tyre1SerialNumber3)
      ) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre1SerialNumber3.length != 4) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1containatleast4number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (tyre1Image === null) {
        Alert.alert('Error', `${languagedata.lbl_Serial1imageisrequired}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);

        return;
      }
      if (
        !contactforserialnumberRegex.test(vehicleDetails.tyre2SerialNumber2)
      ) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre2SerialNumber2.length != 5) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2containatleast5number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre2SerialNumber3 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial2}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (vehicleDetails.tyre2SerialNumber2 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial2}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (
        !contactforserialnumberRegex.test(vehicleDetails.tyre2SerialNumber3)
      ) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (vehicleDetails.tyre2SerialNumber3.length != 4) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2containatleast4number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (tyre2Image === null) {
        Alert.alert('Error', `${languagedata.lbl_Serial2imageisrequired}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
    }

    if (optionalDetails.odoMeterReading != '') {
      if (!contactforserialnumberRegex.test(optionalDetails.odoMeterReading)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_ODOMeteronlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
    }

    if (termsAccepted === false) {
      Alert.alert('Error', `${languagedata.ErrorMsgTermsConditions}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    if (mode === 'offline') {
      handleSubmit();
    } else if (mode === 'online') {
      handlemodifyandsubmit();
    } else {
    }
  };
  const [serversubmitloading1, setserversubmitloading1] = useState(false);

  const postRequestDataBody = async (
    userData,
    filteredInput,
    latitude,
    longitude,
  ) => {
    try {
      setserversubmitloading(true);

      // if (latitude === null || longitude === null) {
      //   Alert.alert(`Error`, "Failed to proccess due to location access")
      //   return
      // }

      if (pincodelist === null) {
        var registionselecteddata;
        if (
          registrationOption === 'Not Available' ||
          registrationOption === 'New Vehicle'
        ) {
          registionselecteddata = registrationOption;
          // setnumberplate(null);
        } else {
          registionselecteddata = vehicleDetails.registrationNumber;
        }

        if (
          vehicleDetails.tyre2SerialNumber2 === '' &&
          vehicleDetails.tyre2SerialNumber3 === ''
        ) {
          const requestData = {
            Registration_No: registionselecteddata,
            CustomerName: customerDetails.customerName,
            MobileNo: customerDetails.mobileNumber,
            EmailId: loginItems.EmailId,
            Remark: null,
            Company: 'YOKOHAMA',
            IsDeclaretion: termsAccepted,
            Agency_Id: loginItems.AgencyId,
            InvoiceNo: optionalDetails.invoiceNumber,
            InvoiceDate: onlinedateupload,
            InvoiceAmount: '',
            User_Device_Formation: deviceName,
            CreatedFor: 'self',
            MappingCodeCode: null,
            Address: filteredInput,
            State_Id: stateObjectofkey,
            State_Name: statenameold,
            District_id: settingdata.districtid,
            District_Name: settingdata.districtname,
            City_Id: settingdata.cityvillageid,
            City_Name: settingdata.cityvillagename,
            PinCode_Id: settingdata.pincodeid,
            PinCode_Name: settingdata.areapincode.toString(),
            ODOMeter: optionalDetails.odoMeterReading,
            Type_of_Machine_Id: vehicletyedata.key,
            Type_of_Machine_Name: vehicletyedata.value,
            Make_Id: getmakeid,
            Make_Name: vehicleDetails.make,
            Model_Id: null,
            Model_Name: vehicleDetails.model,
            Variant_Id: stateidvalue.key,
            Variant_Name: stateidvalue.value,
            RegistrationDate: registrationDate,
            ManufacturerDate: null,
            BrandName: vehicleDetails.brand,
            ProductName: vehicleDetails.productName,
            Serial_1:
              serialkey +
              vehicleDetails.tyre1SerialNumber2 +
              vehicleDetails.tyre1SerialNumber3,
            Serial_2: null,
            Serial_Number: null,
            Createdby: loginItems.Username,
            Photo_Temp_Id: null,
            TyreSize: vehicleDetails.tyreSize,
            NoOfTyres: vehicleDetails.tyreQuantity,
            OldTyre_CompanyName: oldTyreDetails.oldTyreCompany,
            OldTyre_BrandName: oldTyreDetails.oldTyreBrand,
            OldTyre_Size: oldTyreDetails.oldTyreSize,
          };

          const encryptedlogindata = AESExtensions.encryptSs(requestData);
          const payload = {
            requestId: '',
            isEncrypt: '',
            requestData: encryptedlogindata,
            sessionExpiryTime: '',
            userId: '',
          };

          try {
            const heaaders = await GetHeader();
            if (heaaders.SessionID === null) {
              const status = await GetLoginResponse();
              await postRequestDataBody(
                userData,
                filteredInput,
                latitude,
                longitude,
              );
            }
            // return
            // setloading(true)
            await fetchssl(RemoteUrls.postWarrantyRegistrationUrl, {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: heaaders,

              pkPinning: true,
              sslPinning: {
                // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
                certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
              },
            })
              .then(response => response.json()) // Parse the response as JSON
              .then(async data => {
                const responseData = data.responseData; // Do something with the responseData
                const plaintextoflogindata =
                  AESExtensions.decryptString(responseData);
                if (
                  plaintextoflogindata.Message ===
                  'Warranty Registered Successfully'
                ) {
                  // setnumberplate;

                  if (registrationOption === 'Available') {
                    if (numberplate != null) {
                      await uploadimage(
                        plaintextoflogindata.WarrantyNumber,
                        numberplate,
                        customerDetails.mobileNumber,
                        photocategorylist[0].Photo_Category_ID,
                        photocategorylist[0].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        loginItems.Username,
                      );
                    }
                  }

                  if (tyre1Image != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      tyre1Image,
                      customerDetails.mobileNumber,
                      photocategorylist[1].Photo_Category_ID,
                      photocategorylist[1].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (
                    vehicleDetails.tyre2SerialNumber2 !== '' &&
                    vehicleDetails.tyre2SerialNumber3 !== ''
                  ) {
                    if (tyre2Image != null) {
                      await uploadimage(
                        plaintextoflogindata.WarrantyNumber,
                        tyre2Image,
                        customerDetails.mobileNumber,
                        photocategorylist[2].Photo_Category_ID,
                        photocategorylist[2].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        loginItems.Username,
                      );
                    }
                  }

                  if (invoiceImageUri != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      invoiceImageUri,
                      customerDetails.mobileNumber,
                      photocategorylist[5].Photo_Category_ID,
                      photocategorylist[5].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (ODOMeterImageUri != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      ODOMeterImageUri,
                      customerDetails.mobileNumber,
                      photocategorylist[6].Photo_Category_ID,
                      photocategorylist[6].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  // setuploadingimagename('')

                  // await gettingthefailedimageerrorcodedata(
                  //   plaintextoflogindata.WarrantyNumber,
                  //   ODOMeterImageUri,
                  //   customerDetails.mobileNumber,
                  //   photocategorylist[6].Photo_Category_ID,
                  //   photocategorylist[6].Photo_Category_Name,
                  //   latitude,
                  //   longitude,
                  //   userData.AgencyId,
                  //   loginItems.Username,
                  // );

                  const payload = {
                    requestId: '',
                    isEncrypt: '',
                    requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserID}\",\"StatusCode\":\"0\"}`,
                    sessionExpiryTime: '',
                    userId: '',
                  };
                  try {
                    const heaaders = await GetHeader();

                    await fetchssl(RemoteUrls.postFinalStatusUpdateUel, {
                      method: 'POST',
                      body: JSON.stringify(payload),
                      headers: heaaders,

                      pkPinning: true,
                      sslPinning: {
                        // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
                        certs: [
                          'sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE=',
                        ],
                      },
                    })
                      .then(response => response.json()) // Parse the response as JSON
                      .then(data => {
                        const responseData = JSON.parse(data.responseData);
                        if (
                          responseData.ErrorCode === '200' ||
                          responseData.ErrorCode === 200
                        ) {
                          setRegistrationOption(null);
                          setIsChecked(false);
                          setRegistrationDate(null);
                          setStatedata(null);
                          setTermsAccepted(false);
                          setVehicleTypedata(null);
                          setVehicleMakedata(null);
                          setVehicleVariantdata(null);
                          setVehicleModeldata(null);
                          setTyreBranddata(null);
                          setProductNamedata(null);
                          setTyreSizedata(null);
                          setoldTyreCompanydata(null);
                          setoldTyreBranddata(null);
                          handleCustomerDetailsChange('state', ' ');
                          setpincodevaluedata(null);
                          setnumberplate(null);
                          setFromDate(null);

                          setCustomerDetails({
                            customerName: '',
                            mobileNumber: '',
                            address: '',
                            state: '',
                            pinCode: '',
                          });
                          setVehicleDetails({
                            registrationNumber: '',
                            make: '',
                            model: '',
                            brand: '',
                            productName: '',
                            tyreSize: '',
                            tyreQuantity: 2,
                            tyre1SerialNumber1: '',
                            tyre1SerialNumber2: '',
                            tyre1SerialNumber3: '',
                            tyre1Image: null,
                            tyre2SerialNumber1: '',
                            tyre2SerialNumber2: '',
                            tyre2SerialNumber3: '',
                            tyre2Image: null,
                          });
                          setOptionalDetails({
                            invoiceNumber: '',
                            invoiceImage: null,
                            invoiceDate: '',
                            odoMeterReading: '',
                            odoMeterImage: null,
                          });
                          setOldTyreDetails({
                            oldTyreCompany: '',
                            oldTyreBrand: '',
                            oldTyreSize: '',
                          });
                          setTermsAccepted(false);
                          Alert.alert(
                            `${languagedata.lbl_Success}`,

                            `${languagedata.lbl_warranty_registration_successful}` +
                              plaintextoflogindata.WarrantyNumber, // Message

                            [
                              {
                                text: `${languagedata.lbl_Ok}`,
                                onPress: () => {
                                  // Navigate to another screen after pressing OK
                                  navigation.navigate('HomeDrawer');
                                },
                              },
                            ], // Optional: make the alert non-cancelable
                          );
                        }
                      })
                      .catch(async error => {
                        console.error('Error fetching data:1', error);
                        const status = await GetLoginResponse();
                        if (status === 200) {
                          await postRequestDataBody(
                            userData,
                            filteredInput,
                            latitude,
                            longitude,
                          );
                        }
                      });
                  } catch (error) {
                    if (error.response.status === 406) {
                      setchecksession(true);
                      const status = await GetLoginResponse();
                      if (status === 200) {
                        await postRequestDataBody(
                          userData,
                          filteredInput,
                          latitude,
                          longitude,
                        );
                      }
                    }
                  }
                } else {
                  console.error('Something went wrong');
                }
              })
              .catch(async error => {
                console.error('Error fetching data:2', error);
                setchecksession(true);
                const status = await GetLoginResponse();
                if (status === 200) {
                  await postRequestDataBody(
                    userData,
                    filteredInput,
                    latitude,
                    longitude,
                  );
                }
              });
          } catch (error) {
            if (error.response.status === 406) {
              setchecksession(true);
              const status = await GetLoginResponse();
              if (status === 200) {
                await postRequestDataBody(
                  userData,
                  filteredInput,
                  latitude,
                  longitude,
                );
              }
            }
          } finally {
            // setloading(false)
            await fetchItems(db);
            await fetchogin();
          }
        } else {
          const requestData = {
            Registration_No: registionselecteddata,
            CustomerName: customerDetails.customerName,
            MobileNo: customerDetails.mobileNumber,
            EmailId: loginItems.EmailId,
            Remark: null,
            Company: 'YOKOHAMA',
            IsDeclaretion: termsAccepted,
            Agency_Id: loginItems.AgencyId,
            InvoiceNo: optionalDetails.invoiceNumber,
            InvoiceDate: onlinedateupload,
            InvoiceAmount: '',
            User_Device_Formation: deviceName,
            CreatedFor: 'self',
            MappingCodeCode: null,
            Address: filteredInput,
            State_Id: stateObjectofkey,
            State_Name: statenameold,
            District_id: settingdata.districtid,
            District_Name: settingdata.districtname,
            City_Id: settingdata.cityvillageid,
            City_Name: settingdata.cityvillagename,
            PinCode_Id: settingdata.pincodeid,
            PinCode_Name: settingdata.areapincode.toString(),
            ODOMeter: optionalDetails.odoMeterReading,
            Type_of_Machine_Id: vehicletyedata.key,
            Type_of_Machine_Name: vehicletyedata.value,
            Make_Id: getmakeid,
            Make_Name: vehicleDetails.make,
            Model_Id: null,
            Model_Name: vehicleDetails.model,
            Variant_Id: stateidvalue.key,
            Variant_Name: stateidvalue.value,
            RegistrationDate: registrationDate,
            ManufacturerDate: null,
            BrandName: vehicleDetails.brand,
            ProductName: vehicleDetails.productName,
            Serial_1:
              serialkey +
              vehicleDetails.tyre1SerialNumber2 +
              vehicleDetails.tyre1SerialNumber3,
            Serial_2:
              serialkey +
              vehicleDetails.tyre2SerialNumber2 +
              vehicleDetails.tyre2SerialNumber3,
            Serial_Number: null,
            Createdby: loginItems.Username,
            Photo_Temp_Id: null,
            TyreSize: vehicleDetails.tyreSize,
            NoOfTyres: vehicleDetails.tyreQuantity,
            OldTyre_CompanyName: oldTyreDetails.oldTyreCompany,
            OldTyre_BrandName: oldTyreDetails.oldTyreBrand,
            OldTyre_Size: oldTyreDetails.oldTyreSize,
          };
          const encryptedlogindata = AESExtensions.encryptSs(requestData);
          const payload = {
            requestId: '',
            isEncrypt: '',
            requestData: encryptedlogindata,
            sessionExpiryTime: '',
            userId: '',
          };

          try {
            // return
            // setloading(true)
            const heaaders = await GetHeader();

            if (heaaders.SessionID === null) {
              const status = await GetLoginResponse();
              await postRequestDataBody(
                userData,
                filteredInput,
                latitude,
                longitude,
              );
            }
            await fetchssl(RemoteUrls.postWarrantyRegistrationUrl, {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: heaaders,

              pkPinning: true,
              sslPinning: {
                // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
                certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
              },
            })
              .then(response => response.json()) // Parse the response as JSON
              .then(async data => {
                const responseData = data.responseData; // Do something with the responseData
                const plaintextoflogindata =
                  AESExtensions.decryptString(responseData);
                if (
                  plaintextoflogindata.Message ===
                  'Warranty Registered Successfully'
                ) {
                  if (registrationOption === 'Available') {
                    if (numberplate != null) {
                      await uploadimage(
                        plaintextoflogindata.WarrantyNumber,
                        numberplate,
                        customerDetails.mobileNumber,
                        photocategorylist[0].Photo_Category_ID,
                        photocategorylist[0].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        loginItems.Username,
                      );
                    }
                  }
                  if (tyre1Image != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      tyre1Image,
                      customerDetails.mobileNumber,
                      photocategorylist[1].Photo_Category_ID,
                      photocategorylist[1].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (tyre2Image != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      tyre2Image,
                      customerDetails.mobileNumber,
                      photocategorylist[2].Photo_Category_ID,
                      photocategorylist[2].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (invoiceImageUri != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      invoiceImageUri,
                      customerDetails.mobileNumber,
                      photocategorylist[5].Photo_Category_ID,
                      photocategorylist[5].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (ODOMeterImageUri != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      ODOMeterImageUri,
                      customerDetails.mobileNumber,
                      photocategorylist[6].Photo_Category_ID,
                      photocategorylist[6].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }

                  const payload = {
                    requestId: '',
                    isEncrypt: '',
                    requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserID}\",\"StatusCode\":\"0\"}`,
                    sessionExpiryTime: '',
                    userId: '',
                  };
                  try {
                    const heaaders = await GetHeader();
                    await fetchssl(RemoteUrls.postFinalStatusUpdateUel, {
                      method: 'POST',
                      body: JSON.stringify(payload),
                      headers: heaaders,

                      pkPinning: true,
                      sslPinning: {
                        // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
                        certs: [
                          'sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE=',
                        ],
                      },
                    })
                      .then(response => response.json()) // Parse the response as JSON
                      .then(async data => {
                        const responseData = JSON.parse(data.responseData);
                        if (
                          responseData.ErrorCode === '200' ||
                          responseData.ErrorCode === 200
                        ) {
                          setRegistrationOption(null);
                          setIsChecked(false);
                          setRegistrationDate(null);
                          setStatedata(null);
                          setTermsAccepted(false);
                          setVehicleTypedata(null);
                          setVehicleMakedata(null);
                          setVehicleVariantdata(null);
                          setVehicleModeldata(null);
                          setTyreBranddata(null);
                          setProductNamedata(null);
                          setTyreSizedata(null);
                          setoldTyreCompanydata(null);
                          setoldTyreBranddata(null);
                          handleCustomerDetailsChange('state', ' ');
                          setpincodevaluedata(null);
                          setnumberplate(null);
                          setFromDate(null);

                          setCustomerDetails({
                            customerName: '',
                            mobileNumber: '',
                            address: '',
                            state: '',
                            pinCode: '',
                          });
                          setVehicleDetails({
                            registrationNumber: '',
                            make: '',
                            model: '',
                            brand: '',
                            productName: '',
                            tyreSize: '',
                            tyreQuantity: 2,
                            tyre1SerialNumber1: '',
                            tyre1SerialNumber2: '',
                            tyre1SerialNumber3: '',
                            tyre1Image: null,
                            tyre2SerialNumber1: '',
                            tyre2SerialNumber2: '',
                            tyre2SerialNumber3: '',
                            tyre2Image: null,
                          });
                          setOptionalDetails({
                            invoiceNumber: '',
                            invoiceImage: null,
                            invoiceDate: '',
                            odoMeterReading: '',
                            odoMeterImage: null,
                          });
                          setOldTyreDetails({
                            oldTyreCompany: '',
                            oldTyreBrand: '',
                            oldTyreSize: '',
                          });
                          setTermsAccepted(false);
                          Alert.alert(
                            `${languagedata.lbl_Success}`,

                            `${languagedata.lbl_warranty_registration_successful}` +
                              plaintextoflogindata.WarrantyNumber, // Message

                            [
                              {
                                text: `${languagedata.lbl_Ok}`,
                                onPress: () => {
                                  // Navigate to another screen after pressing OK
                                  navigation.navigate('HomeDrawer');
                                },
                              },
                            ], // Optional: make the alert non-cancelable
                          );
                        }
                      })
                      .catch(async error => {
                        console.error('Error fetching data:3', error);
                        const status = await GetLoginResponse();
                        if (status === 200) {
                          await postRequestDataBody(
                            userData,
                            filteredInput,
                            latitude,
                            longitude,
                          );
                        }
                      });
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  console.error('Something went wrong');
                }
              })
              .catch(async error => {
                console.error('Error fetching data:4', error);
                const status = await GetLoginResponse();
                if (status === 200) {
                  await postRequestDataBody(
                    userData,
                    filteredInput,
                    latitude,
                    longitude,
                  );
                }
              });
          } catch (error) {
            console.log(error);
          } finally {
            // setloading(false)
            await fetchItems(db);
            await fetchogin();
          }
        }
      }
      // }
      else {
        var registionselecteddata;
        if (
          registrationOption === 'Not Available' ||
          registrationOption === 'New Vehicle'
        ) {
          registionselecteddata = registrationOption;
          // setnumberplate(null);
        } else {
          registionselecteddata = vehicleDetails.registrationNumber;
        }
        if (
          vehicleDetails.tyre2SerialNumber2 === '' &&
          vehicleDetails.tyre2SerialNumber3 === ''
        ) {
          const requestData = {
            Registration_No: registionselecteddata,
            CustomerName: customerDetails.customerName,
            MobileNo: customerDetails.mobileNumber,
            EmailId: loginItems.EmailId,
            Remark: null,
            Company: 'YOKOHAMA',
            IsDeclaretion: termsAccepted,
            Agency_Id: loginItems.AgencyId,
            InvoiceNo: optionalDetails.invoiceNumber,
            InvoiceDate: onlinedateupload,
            InvoiceAmount: '',
            User_Device_Formation: deviceName,
            CreatedFor: 'self',
            MappingCodeCode: null,
            Address: filteredInput,
            State_Id: stateObjectofkey,
            State_Name: Statedata,
            District_id: pincodelist.districtid,
            District_Name: pincodelist.districtname,
            City_Id: pincodelist.cityvillageid,
            City_Name: pincodelist.cityvillagename,
            PinCode_Id: pincodelist.pincodeid,
            PinCode_Name: customerDetails.pinCode.toString(),
            ODOMeter: optionalDetails.odoMeterReading,
            Type_of_Machine_Id: vehicletyedata.key,
            Type_of_Machine_Name: vehicletyedata.value,
            Make_Id: getmakeid,
            Make_Name: vehicleDetails.make,
            Model_Id: null,
            Model_Name: vehicleDetails.model,
            Variant_Id: stateidvalue.key,
            Variant_Name: stateidvalue.value,
            RegistrationDate: registrationDate,
            ManufacturerDate: null,
            BrandName: vehicleDetails.brand,
            ProductName: vehicleDetails.productName,
            Serial_1:
              serialkey +
              vehicleDetails.tyre1SerialNumber2 +
              vehicleDetails.tyre1SerialNumber3,
            Serial_2: null,
            Serial_Number: null,
            Createdby: loginItems.Username,
            Photo_Temp_Id: null,
            TyreSize: vehicleDetails.tyreSize,
            NoOfTyres: vehicleDetails.tyreQuantity,
            OldTyre_CompanyName: oldTyreDetails.oldTyreCompany,
            OldTyre_BrandName: oldTyreDetails.oldTyreBrand,
            OldTyre_Size: oldTyreDetails.oldTyreSize,
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
            if (heaaders.SessionID === null) {
              const status = await GetLoginResponse();
              await postRequestDataBody(
                userData,
                filteredInput,
                latitude,
                longitude,
              );
            }
            await fetchssl(RemoteUrls.postWarrantyRegistrationUrl, {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: heaaders,

              pkPinning: true,
              sslPinning: {
                // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
                certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
              },
            })
              .then(response => response.json()) // Parse the response as JSON
              .then(async data => {
                const responseData = data.responseData; // Do something with the responseData
                const plaintextoflogindata =
                  AESExtensions.decryptString(responseData);
                if (
                  plaintextoflogindata.Message ===
                  'Warranty Registered Successfully'
                ) {
                  if (registrationOption === 'Available') {
                    if (numberplate != null) {
                      await uploadimage(
                        plaintextoflogindata.WarrantyNumber,
                        numberplate,
                        customerDetails.mobileNumber,
                        photocategorylist[0].Photo_Category_ID,
                        photocategorylist[0].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        loginItems.Username,
                      );
                    }
                  }
                  if (tyre1Image != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      tyre1Image,
                      customerDetails.mobileNumber,
                      photocategorylist[1].Photo_Category_ID,
                      photocategorylist[1].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (
                    vehicleDetails.tyre2SerialNumber2 !== '' &&
                    vehicleDetails.tyre2SerialNumber3 !== ''
                  ) {
                    if (tyre2Image != null) {
                      await uploadimage(
                        plaintextoflogindata.WarrantyNumber,
                        tyre2Image,
                        customerDetails.mobileNumber,
                        photocategorylist[2].Photo_Category_ID,
                        photocategorylist[2].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        loginItems.Username,
                      );
                    }
                  }

                  if (invoiceImageUri != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      invoiceImageUri,
                      customerDetails.mobileNumber,
                      photocategorylist[5].Photo_Category_ID,
                      photocategorylist[5].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (ODOMeterImageUri != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      ODOMeterImageUri,
                      customerDetails.mobileNumber,
                      photocategorylist[6].Photo_Category_ID,
                      photocategorylist[6].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }

                  const payload = {
                    requestId: '',
                    isEncrypt: '',
                    requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserID}\",\"StatusCode\":\"0\"}`,
                    sessionExpiryTime: '',
                    userId: '',
                  };

                  try {
                    const heaaders = await GetHeader();
                    await fetchssl(RemoteUrls.postFinalStatusUpdateUel, {
                      method: 'POST',
                      body: JSON.stringify(payload),
                      headers: heaaders,
                      pkPinning: true,
                      sslPinning: {
                        // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
                        certs: [
                          'sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE=',
                        ],
                      },
                    })
                      .then(response => response.json()) // Parse the response as JSON
                      .then(async data => {
                        const responseData = JSON.parse(data.responseData);
                        if (
                          responseData.ErrorCode === '200' ||
                          responseData.ErrorCode === 200
                        ) {
                          setRegistrationOption(null);
                          setIsChecked(false);
                          setRegistrationDate(null);
                          setStatedata(null);
                          setTermsAccepted(false);
                          setVehicleTypedata(null);
                          setVehicleMakedata(null);
                          setVehicleVariantdata(null);
                          setVehicleModeldata(null);
                          setTyreBranddata(null);
                          setProductNamedata(null);
                          setTyreSizedata(null);
                          setoldTyreCompanydata(null);
                          setoldTyreBranddata(null);
                          handleCustomerDetailsChange('state', ' ');
                          setpincodevaluedata(null);
                          setnumberplate(null);
                          setFromDate(null);

                          setCustomerDetails({
                            customerName: '',
                            mobileNumber: '',
                            address: '',
                            state: '',
                            pinCode: '',
                          });
                          setVehicleDetails({
                            registrationNumber: '',
                            make: '',
                            model: '',
                            brand: '',
                            productName: '',
                            tyreSize: '',
                            tyreQuantity: 2,
                            tyre1SerialNumber1: '',
                            tyre1SerialNumber2: '',
                            tyre1SerialNumber3: '',
                            tyre1Image: null,
                            tyre2SerialNumber1: '',
                            tyre2SerialNumber2: '',
                            tyre2SerialNumber3: '',
                            tyre2Image: null,
                          });
                          setOptionalDetails({
                            invoiceNumber: '',
                            invoiceImage: null,
                            invoiceDate: '',
                            odoMeterReading: '',
                            odoMeterImage: null,
                          });
                          setOldTyreDetails({
                            oldTyreCompany: '',
                            oldTyreBrand: '',
                            oldTyreSize: '',
                          });
                          setTermsAccepted(false);
                          Alert.alert(
                            `${languagedata.lbl_Success}`,

                            `${languagedata.lbl_warranty_registration_successful}` +
                              plaintextoflogindata.WarrantyNumber, // Message

                            [
                              {
                                text: `${languagedata.lbl_Ok}`,
                                onPress: () => {
                                  // Navigate to another screen after pressing OK
                                  navigation.navigate('HomeDrawer');
                                },
                              },
                            ], // Optional: make the alert non-cancelable
                          );
                        }
                      })
                      .catch(async error => {
                        console.error('Error fetching data:5', error);
                        const status = await GetLoginResponse();
                        if (status === 200) {
                          await postRequestDataBody(
                            userData,
                            filteredInput,
                            latitude,
                            longitude,
                          );
                        }
                      });
                  } catch (error) {
                    console.log('error', error);
                  }
                } else {
                  console.log('smething went wrong');
                }
              })
              .catch(async error => {
                console.error('Error fetching data:6', error);
                const status = await GetLoginResponse();
                if (status === 200) {
                  await postRequestDataBody(
                    userData,
                    filteredInput,
                    latitude,
                    longitude,
                  );
                }
              });
          } catch (error) {
            if (error.response.status === 406) {
              setchecksession(true);
              const status = await GetLoginResponse();
              if (status === 200) {
                await postRequestDataBody(
                  userData,
                  filteredInput,
                  latitude,
                  longitude,
                );
              }
            }
          } finally {
            // setloading(false)
            await fetchItems(db);
            await fetchogin();
          }
        } else {
          const requestData = {
            Registration_No: registionselecteddata,
            CustomerName: customerDetails.customerName,
            MobileNo: customerDetails.mobileNumber,
            EmailId: loginItems.EmailId,
            Remark: null,
            Company: 'YOKOHAMA',
            IsDeclaretion: termsAccepted,
            Agency_Id: loginItems.AgencyId,
            InvoiceNo: optionalDetails.invoiceNumber,
            InvoiceDate: onlinedateupload,
            InvoiceAmount: '',
            User_Device_Formation: deviceName,
            CreatedFor: 'self',
            MappingCodeCode: null,
            Address: filteredInput,
            State_Id: stateObjectofkey,
            State_Name: Statedata,
            District_id: pincodelist.districtid,
            District_Name: pincodelist.districtname,
            City_Id: pincodelist.cityvillageid,
            City_Name: pincodelist.cityvillagename,
            PinCode_Id: pincodelist.pincodeid,
            PinCode_Name: customerDetails.pinCode.toString(),
            ODOMeter: optionalDetails.odoMeterReading,
            Type_of_Machine_Id: vehicletyedata.key,
            Type_of_Machine_Name: vehicletyedata.value,
            Make_Id: getmakeid,
            Make_Name: vehicleDetails.make,
            Model_Id: null,
            Model_Name: vehicleDetails.model,
            Variant_Id: stateidvalue.key,
            Variant_Name: stateidvalue.value,
            RegistrationDate: registrationDate,
            ManufacturerDate: null,
            BrandName: vehicleDetails.brand,
            ProductName: vehicleDetails.productName,
            Serial_1:
              serialkey +
              vehicleDetails.tyre1SerialNumber2 +
              vehicleDetails.tyre1SerialNumber3,
            Serial_2:
              serialkey +
              vehicleDetails.tyre2SerialNumber2 +
              vehicleDetails.tyre2SerialNumber3,
            Serial_Number: null,
            Createdby: loginItems.Username,
            Photo_Temp_Id: null,
            TyreSize: vehicleDetails.tyreSize,
            NoOfTyres: vehicleDetails.tyreQuantity,
            OldTyre_CompanyName: oldTyreDetails.oldTyreCompany,
            OldTyre_BrandName: oldTyreDetails.oldTyreBrand,
            OldTyre_Size: oldTyreDetails.oldTyreSize,
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
            // return
            // setloading(true)
            const heaaders = await GetHeader();
            if (heaaders.SessionID === null) {
              const status = await GetLoginResponse();
              await postRequestDataBody(
                userData,
                filteredInput,
                latitude,
                longitude,
              );
            }
            await fetchssl(RemoteUrls.postWarrantyRegistrationUrl, {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: heaaders,

              pkPinning: true,
              sslPinning: {
                // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
                certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
              },
            })
              .then(response => response.json()) // Parse the response as JSON
              .then(async data => {
                const responseData = data.responseData; // Do something with the responseData
                const plaintextoflogindata =
                  AESExtensions.decryptString(responseData);
                if (
                  plaintextoflogindata.Message ===
                  'Warranty Registered Successfully'
                ) {
                  if (registrationOption === 'Available') {
                    if (numberplate != null) {
                      await uploadimage(
                        plaintextoflogindata.WarrantyNumber,
                        numberplate,
                        customerDetails.mobileNumber,
                        photocategorylist[0].Photo_Category_ID,
                        photocategorylist[0].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        loginItems.Username,
                      );
                    }
                  }
                  if (tyre1Image != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      tyre1Image,
                      customerDetails.mobileNumber,
                      photocategorylist[1].Photo_Category_ID,
                      photocategorylist[1].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (tyre2Image != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      tyre2Image,
                      customerDetails.mobileNumber,
                      photocategorylist[2].Photo_Category_ID,
                      photocategorylist[2].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (invoiceImageUri != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      invoiceImageUri,
                      customerDetails.mobileNumber,
                      photocategorylist[5].Photo_Category_ID,
                      photocategorylist[5].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  if (ODOMeterImageUri != null) {
                    await uploadimage(
                      plaintextoflogindata.WarrantyNumber,
                      ODOMeterImageUri,
                      customerDetails.mobileNumber,
                      photocategorylist[6].Photo_Category_ID,
                      photocategorylist[6].Photo_Category_Name,
                      latitude,
                      longitude,
                      userData.AgencyId,
                      loginItems.Username,
                    );
                  }
                  // await gettingthefailedimageerrorcodedata(
                  //   plaintextoflogindata.WarrantyNumber,
                  //   ODOMeterImageUri,
                  //   customerDetails.mobileNumber,
                  //   photocategorylist[6].Photo_Category_ID,
                  //   photocategorylist[6].Photo_Category_Name,
                  //   latitude,
                  //   longitude,
                  //   userData.AgencyId,
                  //   loginItems.Username,
                  // );

                  const payload = {
                    requestId: '',
                    isEncrypt: '',
                    requestData: `{\"Warranty_Id\":\"${plaintextoflogindata.WarrantyNumber}\",\"UserId\":\"${loginItems.UserID}\",\"StatusCode\":\"0\"}`,
                    sessionExpiryTime: '',
                    userId: '',
                  };
                  try {
                    const heaaders = await GetHeader();
                    await fetchssl(RemoteUrls.postFinalStatusUpdateUel, {
                      method: 'POST',
                      body: JSON.stringify(payload),
                      headers: heaaders,

                      pkPinning: true,
                      sslPinning: {
                        // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
                        certs: [
                          'sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE=',
                        ],
                      },
                    })
                      .then(response => response.json()) // Parse the response as JSON
                      .then(async data => {
                        const responseData = JSON.parse(data.responseData);
                        if (
                          responseData.ErrorCode === '200' ||
                          responseData.ErrorCode === 200
                        ) {
                          setRegistrationOption(null);
                          setIsChecked(false);
                          setRegistrationDate(null);
                          setStatedata(null);
                          setTermsAccepted(false);
                          setVehicleTypedata(null);
                          setVehicleMakedata(null);
                          setVehicleVariantdata(null);
                          setVehicleModeldata(null);
                          setTyreBranddata(null);
                          setProductNamedata(null);
                          setTyreSizedata(null);
                          setoldTyreCompanydata(null);
                          setoldTyreBranddata(null);
                          handleCustomerDetailsChange('state', ' ');
                          setpincodevaluedata(null);
                          setnumberplate(null);
                          setFromDate(null);

                          setCustomerDetails({
                            customerName: '',
                            mobileNumber: '',
                            address: '',
                            state: '',
                            pinCode: '',
                          });
                          setVehicleDetails({
                            registrationNumber: '',
                            make: '',
                            model: '',
                            brand: '',
                            productName: '',
                            tyreSize: '',
                            tyreQuantity: 2,
                            tyre1SerialNumber1: '',
                            tyre1SerialNumber2: '',
                            tyre1SerialNumber3: '',
                            tyre1Image: null,
                            tyre2SerialNumber1: '',
                            tyre2SerialNumber2: '',
                            tyre2SerialNumber3: '',
                            tyre2Image: null,
                          });
                          setOptionalDetails({
                            invoiceNumber: '',
                            invoiceImage: null,
                            invoiceDate: '',
                            odoMeterReading: '',
                            odoMeterImage: null,
                          });
                          setOldTyreDetails({
                            oldTyreCompany: '',
                            oldTyreBrand: '',
                            oldTyreSize: '',
                          });
                          setTermsAccepted(false);
                          Alert.alert(
                            `${languagedata.lbl_Success}`,

                            `${languagedata.lbl_warranty_registration_successful}` +
                              plaintextoflogindata.WarrantyNumber, // Message

                            [
                              {
                                text: `${languagedata.lbl_Ok}`,
                                onPress: () => {
                                  // Navigate to another screen after pressing OK
                                  navigation.navigate('HomeDrawer');
                                },
                              },
                            ], // Optional: make the alert non-cancelable
                          );
                        }
                      })
                      .catch(async error => {
                        console.error('Error fetching data:7', error);
                        const status = await GetLoginResponse();
                        if (status === 200) {
                          await postRequestDataBody(
                            userData,
                            filteredInput,
                            latitude,
                            longitude,
                          );
                        }
                      });
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  console.log('smething went wrong');
                }
              })
              .catch(async error => {
                console.error('Error fetching data: 8', error);
                if (error.status === 406) {
                  setchecksession(true);
                  const status = await GetLoginResponse();
                  if (status === 200) {
                    await postRequestDataBody(
                      userData,
                      filteredInput,
                      latitude,
                      longitude,
                    );
                  }
                }
              });
          } catch (error) {
            if (error.response.status === 406) {
              setchecksession(true);
              const status = await GetLoginResponse();
            }
          } finally {
            // setloading(false)
            await fetchItems(db);
            await fetchogin();
          }
        }
      }
      // }
      setserversubmitloading(false);
    } catch (error: unknown) {
      setserversubmitloading(false);
      if (error.response.status === 406) {
        setchecksession(true);
        const status = await GetLoginResponse();
      }
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setserversubmitloading(false);
    }
  };
  const handlemodifyandsubmit = async () => {
    if (isConnected === false) {
      Alert.alert('', `${languagedata.lbl_PleasechecktheInternet}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    const filteredInput = customerDetails.address.replace(/(\r\n|\n|\r)/g, ' ');

    const userData = await getAllLoginItems();
    if (Platform.OS === 'android') {
      setserversubmitloading(true);

      const enableResult = await promptForEnableLocationIfNeeded();
      const position = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      const {latitude, longitude} = position;
      await postRequestDataBody(userData, filteredInput, latitude, longitude);
    }
    if (Platform.OS === 'ios') {
      await getLocation(pincodelist, userData);
    }
  };

  const requestLocationPermission = async () => {
    const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE; // or PERMISSIONS.IOS.LOCATION_ALWAYS if needed

    try {
      const result = await check(permission);
      // setPermissionStatus(result);

      if (result === RESULTS.GRANTED) {
        // Alert.alert('Permission Status', 'Location permission is granted');
        await getLocation();
      } else if (result === RESULTS.DENIED) {
        // Optionally request permission if it's denied
        requestLocationPermission();
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert('Permission Status', 'Location permission is blocked');
      }
    } catch (error) {
      console.error('Permission check error:', error);
    }
  };
  const getLocation = async (pincodelist, userData) => {
    const filteredInput = customerDetails.address.replace(/(\r\n|\n|\r)/g, ' ');

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async location => {
        try {
          setserversubmitloading(true);

          const {latitude, longitude} = location;
          await postRequestDataBody(
            userData,
            filteredInput,
            latitude,
            longitude,
          );
        } catch (error: unknown) {
          //   // setserversubmitloading(false)
          if (error instanceof Error) {
            console.error(error.message);
          }
        } finally {
          setserversubmitloading(false);
        }
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };
  const [ispincodemodelopup, setpincodemodelopup] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = pincodedata.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString();

      // Convert searchQuery to string
      let searchString = searchQuery;

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderItem1 = ({item}) => (
    <Pressable
      onPress={() => {
        handleItemSelect(item);
        setSelectedId(item.key);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [pincodevaluedata, setpincodevaluedata] = useState(null);
  const handleItemSelect = item => {
    // setSelectedItem(item); // Store selected item if needed
    setSearchQuery('');
    setpincodemodelopup(false); // Close the modal
    setpincodevaluedata(item.value);
    getPincode(item.value);
    handleCustomerDetailsChange('pinCode', item.value);
  };

  const [isStatemodalPopup, setisStatemodalPopup] = useState(false);
  const [searchStateQuery, setsearchStateQuery] = useState('');

  const filteredStateData = Stateitemdata.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase();

      // Convert searchQuery to string
      let searchString = searchStateQuery.toString().toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
    return false;
  });
  const renderStateItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
        setisStatemodalPopup(false);

        handleStateItemSelect(item);
      }}
      accessible={false}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </TouchableOpacity>
  );

  const [Statedata, setStatedata] = useState(null);
  const [Statedatas, setStatedatas] = useState(null);
  const handleStateItemSelect = async item => {
    Keyboard.dismiss();
    setisStatemodalPopup(false);
    setsearchStateQuery('');
    if (pincodevaluedata != null) {
      setpincodevaluedata(null);
    }
    if (areapincode != undefined) {
      setareapincode(undefined);
    }
    handleCustomerDetailsChange('state', item.value);
    fetchPinCodeItems(item.key, item.value);
  };

  const [isVehicleTypemodalPopup, setisVehicleTypemodalPopup] = useState(false);
  const [selectedvehicletypeId, setSelectedvehicletypeId] = useState();

  const [searchVehicleTypeQuery, setsearchVehicleTypeQuery] = useState('');

  const filteredVehicleTypeData = VehicleTypeItemsdata.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase();

      // Convert searchQuery to string
      let searchString = searchVehicleTypeQuery.toString().toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderVehicleTypeItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleVehicleTypeItemSelect(item);
        setSelectedvehicletypeId(item.key);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleTypedata, setVehicleTypedata] = useState(null);
  const handleVehicleTypeItemSelect = item => {
    setsearchVehicleTypeQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleTypemodalPopup(false); // Close the modal
    setVehicleTypedata(item.value);
    getVehicleMakeByVehiceTypeID(item.value);
    setisvehtype(true);
  };

  const [isVehicleMakemodalPopup, setisVehicleMakemodalPopup] = useState(false);
  const [searchVehicleMakeQuery, setsearchVehicleMakeQuery] = useState('');

  const filteredVehicleMakeData = isvehiclemakedataitem.filter(item => {
    if (item.value != undefined && item.value != null) {
      let itemString = item.value.toLowerCase();
      let searchString = searchVehicleMakeQuery.toLowerCase();
      return itemString.includes(searchString);
    }
  });
  const renderVehicleMakeItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleVehicleMakeItemSelect(item);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleMakedata, setVehicleMakedata] = useState(null);
  const handleVehicleMakeItemSelect = item => {
    setsearchVehicleMakeQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleMakemodalPopup(false); // Close the modal
    setVehicleMakedata(item.value);

    fetchmodel(item.key);
    handleVehicleDetailsChange('make', item.value);
    getVehicleVariantById(item.value);
    getmakeidlist(item.value);

    if (VehicleModeldata != null) {
      setVehicleModeldata(null);
      handleVehicleDetailsChange('model', '');
    }
    if (VehicleVariantdata != null) {
      setVehicleVariantdata(null);
      setstateidvalue(undefined);
    }
  };

  const fetchmodel = async item => {
    let helpermodelarray = await getVehicleModelByVehTypeid(item);
    const modeldataItems = helpermodelarray.map(item => ({
      key: item.modelID,
      value: item.modelName,
    }));

    setisvehiclemodeldataitem(modeldataItems);
  };

  const [isVehicleVariantmodalPopup, setisVehicleVariantmodalPopup] =
    useState(false);
  const [searchVehicleVariantQuery, setsearchVehicleVariantQuery] =
    useState('');

  const filteredVehicleVariantData = isVehicleVariantdataitem.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase();

      // Convert searchQuery to string
      let searchString = searchVehicleVariantQuery.toString().toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderVehicleVariantItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleVehicleVariantItemSelect(item);

        // getPincode(item.value)
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleVariantdata, setVehicleVariantdata] = useState(null);
  const handleVehicleVariantItemSelect = item => {
    setsearchVehicleVariantQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleVariantmodalPopup(false); // Close the modal
    setVehicleVariantdata(item.value);
    storeVehicleVariant(item.value);
    setisvehiclevariantcheck(true);
  };

  const [isVehicleModelmodalPopup, setisVehicleModelmodalPopup] =
    useState(false);
  const [searchVehicleModelQuery, setsearchVehicleModelQuery] = useState('');

  const filteredVehicleModelData = isvehiclemodeldataitem.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase();

      // Convert searchQuery to string
      let searchString = searchVehicleModelQuery.toString().toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderVehicleModelItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleVehicleModelItemSelect(item);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleModeldata, setVehicleModeldata] = useState(null);
  const handleVehicleModelItemSelect = item => {
    setsearchVehicleModelQuery('');
    if (VehicleVariantdata != null) {
      setVehicleVariantdata(null);
      setstateidvalue(undefined);
    }
    fetchdata(item.key);
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleModelmodalPopup(false); // Close the modal
    setVehicleModeldata(item.value);
    handleVehicleDetailsChange('model', item.value);
    getmodelidlist(item.value);
  };

  const fetchdata = async id => {
    const helperarray = await getVariantByMakeID(id);
    const variantdataItems = helperarray.map(item => ({
      key: item.variantid,
      value: item.variantname,
    }));
    setisVehicleVariantdataitem(variantdataItems);
    setVehicleVariantItems(variantdataItems);
  };

  const [isTyreBrandmodalPopup, setisTyreBrandmodalPopup] = useState(false);
  const [searchTyreBrandQuery, setsearchTyreBrandQuery] = useState('');

  const filteredTyreBrandData = BrandNasadmeItemsdata.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase();

      // Convert searchQuery to string
      let searchString = searchTyreBrandQuery.toString().toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderTyreBrandItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleTyreBrandItemSelect(item);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [TyreBranddata, setTyreBranddata] = useState(null);
  const handleTyreBrandItemSelect = item => {
    setsearchTyreBrandQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisTyreBrandmodalPopup(false); // Close the modal
    setTyreBranddata(item.value);
    handleVehicleDetailsChange('brand', item.value);
    getbrandlist(item.value);
  };

  const [isProductNamemodalPopup, setisProductNamemodalPopup] = useState(false);
  const [searchProductNameQuery, setsearchProductNameQuery] = useState('');

  const filteredProductNameData = ProductNameItemsdata.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toLowerCase();

      // Convert searchQuery to string
      let searchString = searchProductNameQuery.toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderProductNameItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleProductNameItemSelect(item);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [ProductNamedata, setProductNamedata] = useState(null);
  const handleProductNameItemSelect = item => {
    setsearchProductNameQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisProductNamemodalPopup(false); // Close the modal
    setProductNamedata(item.value);
    handleVehicleDetailsChange('productName', item.value);
    getProductNameById(item.value);
    if (TyreSizedata != null) {
      setTyreSizedata(null);
      handleVehicleDetailsChange('tyreSize', '');
    }
  };

  const [isTyreSizemodalPopup, setisTyreSizemodalPopup] = useState(false);
  const [searchTyreSizeQuery, setsearchTyreSizeQuery] = useState('');

  const filteredTyreSizeData = TyreSizeItemsdata.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toLowerCase();

      // Convert searchQuery to string
      let searchString = searchTyreSizeQuery.toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderTyreSizeItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleTyreSizeItemSelect(item);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [TyreSizedata, setTyreSizedata] = useState(null);
  const handleTyreSizeItemSelect = item => {
    setsearchTyreSizeQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisTyreSizemodalPopup(false); // Close the modal
    setTyreSizedata(item.value);
    handleVehicleDetailsChange('tyreSize', item.value);
  };

  const [isoldTyreCompanymodalPopup, setisoldTyreCompanymodalPopup] =
    useState(false);
  const [searcholdTyreCompanyQuery, setsearcholdTyreCompanyQuery] =
    useState('');

  const filteredoldTyreCompanyData = oldtyrecompanynameItemsdata.filter(
    item => {
      if (item.value !== undefined && item.value !== null) {
        // Convert item.value to string before checking inclusion
        let itemString = item.value.toLowerCase();

        // Convert searchQuery to string
        let searchString = searcholdTyreCompanyQuery.toLowerCase();

        // Check if itemString includes searchString
        return itemString.includes(searchString);
      }
    },
  );
  const renderoldTyreCompanyItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleoldTyreCompanyItemSelect(item);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [oldTyreCompanydata, setoldTyreCompanydata] = useState(null);
  const handleoldTyreCompanyItemSelect = item => {
    setsearcholdTyreCompanyQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisoldTyreCompanymodalPopup(false); // Close the modal
    setoldTyreCompanydata(item.value);
    setoldTyreCompanydataid(item.key);
    fetchOldTyreBrandNameItems(item.key);

    handleOldTyreDetailsChange('oldTyreCompany', item.value);
    if (oldTyreBranddata != null) {
      setoldTyreBranddata(null);
      handleOldTyreDetailsChange('oldTyreBrand', '');
    }
  };

  const [isoldTyreBrandmodalPopup, setisoldTyreBrandmodalPopup] =
    useState(false);
  const [searcholdTyreBrandQuery, setsearcholdTyreBrandQuery] = useState('');

  const filteredoldTyreBrandData = oldtyrebrandnameItemsdata.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toLowerCase();

      // Convert searchQuery to string
      let searchString = searcholdTyreBrandQuery.toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderoldTyreBrandItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleoldTyreBrandItemSelect(item);
      }}>
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [oldTyreBranddata, setoldTyreBranddata] = useState(null);
  const handleoldTyreBrandItemSelect = item => {
    setsearcholdTyreBrandQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisoldTyreBrandmodalPopup(false); // Close the modal
    setoldTyreBranddata(item.value);
    handleOldTyreDetailsChange('oldTyreBrand', item.value);
  };

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Option 1',
        value: 'option1',
        size: 20,
      },
      {
        id: '2',
        label: 'Option 2',
        value: 'option2',
        size: 20,
      },
    ],
    [],
  );

  const [selectedIdsss, setSelectedIdsss] = useState<string | undefined>();
  const handlePresASsASasAs = value => {
    setSelectedIdsss(value);
    if (value === '1') {
      console.log('value', 'value 1');
    }
    if (value === '2') {
      console.log('value', 'value 2');
    }
  };
  const [selectedValue, setSelectedValue] = useState('option1');
  const {width} = Dimensions.get('window');
  const inputRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = option => {
    setSelectedOption(option);
  };
  const users = [
    {
      id: 1,
      value: 'Brit Renfield',
      tel: '542-866-4301',
      email: 'brenfield0@gmail.com',
      country: 'Russia',
    },
    {
      id: 2,
      name: 'Alfonse Tesche',
      tel: '436-643-1234',
      email: 'atesche1@hotmail.com',
      country: 'Indonesia',
    },
    {
      id: 3,
      name: 'Chandler Follett',
      tel: '682-740-8794',
      email: 'cfollett2@boston.com',
      country: 'Greece',
    },
  ];
  const [user, setUser] = useState();
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.container}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Adjust scroll event throttle as needed
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Modal
            transparent={true}
            visible={submitloading}
            onRequestClose={() => {
              setsubmitloading(!submitloading);
            }}>
            <View style={styles.centeredView1}>
              <View style={styles.modalView1}>
                <ActivityIndicator size="large" color="black" />
                <Text>{languagedata.lbl_Saving_as_a_Draft}.</Text>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={serversubmitloading}
            onRequestClose={() => {
              setserversubmitloading(!serversubmitloading);
            }}>
            <View style={styles.centeredView1}>
              <View style={styles.modalView1}>
                <ActivityIndicator size="large" color="black" />
                {/* <Text>{languagedata.lbl_Uploading_Onlline}. {uploadingimagename}</Text> */}
                <Text>{languagedata.lbl_Uploading_Onlline}.</Text>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={serversubmitloading1}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setserversubmitloading1(!serversubmitloading1);
            }}>
            <View style={styles.centeredView1}>
              <View style={styles.modalView1}>
                <ActivityIndicator size="large" color="black" />
                <Text>Re-Uploading image...</Text>
              </View>
            </View>
          </Modal>
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
          <View style={{alignItems: 'center'}}>
            <Text style={styles.headerText}>
              {languagedata.lblWarrantyRegistration}
            </Text>

            {/* Radio Buttons */}
            <RadioButton.Group
              onValueChange={handleRadioButtonChange}
              value={registrationOption}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16, // Adjust spacing between radio button items
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.radioLabel}>
                  {languagedata.VehicleRegistrationNoavailable}
                </Text>
                <RadioButton.Android
                  value="Available"
                  color={RadioButtonColor}
                  style={styles.radioButton}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16, // Adjust spacing between radio button items
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.radioLabel}>
                  {languagedata.VehicleRegistrationNonotavailable}
                </Text>
                <RadioButton.Android
                  value="Not Available"
                  color={RadioButtonColor}
                  style={styles.radioButton}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16, // Adjust spacing between radio button items
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.radioLabel}>{languagedata.NewVehicle}</Text>
                <RadioButton.Android
                  value="New Vehicle"
                  color={RadioButtonColor}
                  style={styles.radioButton}
                />
              </View>
            </RadioButton.Group>
          </View>

          {/* Vehicle Registration Number */}
          {registrationOption === 'Available' && (
            <View>
              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    {languagedata.RegistrationNo}
                    <Text style={{color: 'red'}}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <TextInput
                    inputMode="text"
                    style={styles.input}
                    placeholder={`${languagedata.RegistrationNo}`}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value =>
                      handleVehicleDetailsChange(
                        'registrationNumber',
                        value.toUpperCase(),
                      )
                    }
                    maxLength={10}
                    value={vehicleDetails.registrationNumber}
                  />
                </View>
              </View>

              {numberplate && (
                <Image
                  source={{
                    uri: `file://${numberplate}`,
                  }}
                  width={width - 40}
                  height={300}
                />
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={numberplateimage}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  {languagedata.lbl_Take_Registration_No_Photo}
                </Text>
                <Icon
                  style={{marginLeft: 10, marginTop: 2}}
                  name="camera"
                  size={20}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Customer Details */}
          <View>
            <TouchableOpacity
              style={styles.sectionHeaderContainer}
              onPress={toggleCustomerDetails}>
              <Text style={styles.sectionHeader}>
                {languagedata.lbl_CustomerDetails}
              </Text>
              <TouchableOpacity style={styles.toggleButton}>
                <Icon
                  style={{marginTop: 12}}
                  onPress={toggleCustomerDetails}
                  name={showCustomerDetails ? 'caret-up' : 'caret-down'}
                  size={25}
                  color={iconColor}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {showCustomerDetails && (
              <>
                <KeyboardAvoidingView
                  style={styles.centeredView12}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                  <View style={styles.outer_view}>
                    <View style={styles.label_view}>
                      <Text style={styles.label_View_text_style}>
                        {languagedata.CustomerName}
                        <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    </View>
                    <View style={styles.text_view}>
                      <TextInput
                        maxLength={50}
                        style={styles.input}
                        placeholder={`${languagedata.CustomerName}`}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleCustomerDetailsChange('customerName', value)
                        }
                        value={customerDetails.customerName}
                      />
                    </View>
                  </View>
                  <View style={styles.outer_view}>
                    <View style={styles.label_view}>
                      <Text style={styles.label_View_text_style}>
                        {languagedata.MobileNo}
                        <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    </View>
                    <View style={styles.text_view}>
                      <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder={`${languagedata.MobileNo}`}
                        maxLength={10}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleCustomerDetailsChange('mobileNumber', value)
                        }
                        value={customerDetails.mobileNumber}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.outer_view}>
                    <View style={styles.label_view}>
                      <Text style={styles.label_View_text_style}>
                        {/* {languagedata.Address} */}
                        {languagedata.lbl_CustomerAddress}
                        <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    </View>
                    <View style={styles.text_view}>
                      <TextInput
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={styles.textarea}
                        placeholder={`${languagedata.lbl_CustomerAddress}`}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleCustomerDetailsChange('address', value)
                        }
                        value={customerDetails.address}
                      />
                    </View>
                  </View>
                </KeyboardAvoidingView>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isStatemodalPopup}
                  onRequestClose={() => {
                    // Keyboard.dismiss()
                    setisStatemodalPopup(false);
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      // Dismiss the keyboard when tapping outside the input
                      Keyboard.dismiss();
                    }}>
                    <KeyboardAvoidingView
                      style={styles.centeredView}
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                      <View style={styles.modalView}>
                        <View style={styles.innermodalview}>
                          <Text style={styles.modalheader}>
                            {languagedata.lbl_Inbox_State}
                          </Text>
                          <Pressable
                            style={{marginBottom: 10}}
                            onPress={() => {
                              Keyboard.dismiss();
                              setisStatemodalPopup(false);
                            }} // Close modal directly
                          >
                            <Icons name="closecircleo" size={20} />
                          </Pressable>
                        </View>
                        <TextInput
                          ref={inputRef}
                          style={{
                            borderWidth: 1,
                            borderRadius: 5,
                            width: '100%',
                            padding: 10,
                          }}
                          placeholder={`${languagedata.lbl_search}`}
                          onChangeText={text => setsearchStateQuery(text)}
                          value={searchStateQuery}
                        />
                        {searchStateQuery === undefined ? (
                          <FlatList
                            keyboardShouldPersistTaps={'always'}
                            style={{marginTop: 10, width: '100%'}}
                            data={Stateitemdata}
                            renderItem={renderStateItem}
                            keyExtractor={item => item.value}
                            extraData={selectedId}
                          />
                        ) : (
                          <FlatList
                            keyboardShouldPersistTaps={'always'}
                            style={{marginTop: 10, width: '100%'}}
                            data={filteredStateData}
                            renderItem={renderStateItem}
                            keyExtractor={item => item.value}
                            extraData={selectedId}
                          />
                        )}
                      </View>
                    </KeyboardAvoidingView>
                  </TouchableWithoutFeedback>
                </Modal>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.lbl_Inbox_State}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {Statedata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisStatemodalPopup(true);
                          }}>
                          {statenameold === undefined ? (
                            <Text> {languagedata.State}</Text>
                          ) : (
                            <Text> {statenameold}</Text>
                          )}
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            Keyboard.dismiss();
                            setisStatemodalPopup(true);
                          }}>
                          <Text>{Statedata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={ispincodemodelopup}
                  onRequestClose={() => {
                    setpincodemodelopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.lbl_PinCode}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setpincodemodelopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        keyboardType="number-pad"
                        maxLength={6}
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text => setSearchQuery(text)}
                        value={searchQuery}
                      />
                      {searchQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={pincodeItems}
                          renderItem={renderItem1}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredData}
                          renderItem={renderItem1}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>

                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.lbl_PinCode}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {pincodevaluedata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setpincodemodelopup(true);
                          }}>
                          {areapincode === undefined ? (
                            <Text> {languagedata.lbl_PinCode}</Text>
                          ) : (
                            <Text>{areapincode}</Text>
                          )}
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setpincodemodelopup(true);
                          }}>
                          <Text>{pincodevaluedata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Vehicle Details */}
          <View>
            <TouchableOpacity
              style={styles.sectionHeaderContainer}
              onPress={toggleVehicleDetails}>
              <Text style={styles.sectionHeader}>
                {languagedata.lbl_VehicleDetails}
              </Text>
              <TouchableOpacity style={styles.toggleButton}>
                <Icon
                  style={{marginTop: 12}}
                  onPress={toggleVehicleDetails}
                  name={showVehicleDetails ? 'caret-up' : 'caret-down'}
                  size={25}
                  color={iconColor}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {showVehicleDetails && (
              <>
                {/* VehicleTypeItemsdata */}
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isVehicleTypemodalPopup}
                  onRequestClose={() => {
                    setisVehicleTypemodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.VehicleType}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisVehicleTypemodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text => setsearchVehicleTypeQuery(text)}
                        value={searchVehicleTypeQuery}
                      />
                      {searchVehicleTypeQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={VehicleTypeItemsdata}
                          renderItem={renderVehicleTypeItem}
                          keyExtractor={item => item.value}
                          extraData={selectedvehicletypeId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredVehicleTypeData}
                          renderItem={renderVehicleTypeItem}
                          keyExtractor={item => item.value}
                          extraData={selectedvehicletypeId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.VehicleType}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {VehicleTypedata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisVehicleTypemodalPopup(true);
                          }}>
                          <Text>{languagedata.VehicleType}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisVehicleTypemodalPopup(true);
                          }}>
                          <Text>{VehicleTypedata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isVehicleMakemodalPopup}
                  onRequestClose={() => {
                    setisVehicleMakemodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.lbl_VehicleMake}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisVehicleMakemodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text => setsearchVehicleMakeQuery(text)}
                        value={searchVehicleMakeQuery}
                      />
                      {searchVehicleMakeQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={isvehiclemakedataitem}
                          renderItem={renderVehicleMakeItem}
                          keyExtractor={item => item.value}
                          extraData={selectedvehicletypeId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredVehicleMakeData}
                          renderItem={renderVehicleMakeItem}
                          keyExtractor={item => item.value}
                          extraData={selectedvehicletypeId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>

                <View>
                  <View style={styles.outer_view}>
                    <View style={styles.label_view}>
                      <Text style={styles.label_View_text_style}>
                        {languagedata.lbl_VehicleMake}
                        <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    </View>
                    <View style={styles.text_view}>
                      <View style={styles.input}>
                        {VehicleMakedata === null ? (
                          <Pressable
                            style={{flex: 1, flexDirection: 'row'}}
                            onPress={() => {
                              setisVehicleMakemodalPopup(true);
                            }}>
                            <Text>{languagedata.lbl_VehicleMake}</Text>
                            <View
                              style={{
                                position: 'absolute',
                                right: '5%',
                                top: '10%',
                              }}>
                              <Icon
                                name="chevron-down"
                                size={12}
                                color={'gray'}
                              />
                            </View>
                          </Pressable>
                        ) : (
                          <Pressable
                            style={{flex: 1, flexDirection: 'row'}}
                            onPress={() => {
                              setisVehicleMakemodalPopup(true);
                            }}>
                            <Text>{VehicleMakedata}</Text>
                            <View
                              style={{
                                position: 'absolute',
                                right: '5%',
                                top: '10%',
                              }}>
                              <Icon
                                name="chevron-down"
                                size={12}
                                color={'gray'}
                              />
                            </View>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isVehicleModelmodalPopup}
                  onRequestClose={() => {
                    setisVehicleModelmodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.lbl_VehicleModel}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisVehicleModelmodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text => setsearchVehicleModelQuery(text)}
                        value={searchVehicleModelQuery}
                      />
                      {searchVehicleModelQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={isvehiclemodeldataitem}
                          renderItem={renderVehicleModelItem}
                          keyExtractor={item => item.value}
                          extraData={selectedvehicletypeId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredVehicleModelData}
                          renderItem={renderVehicleModelItem}
                          keyExtractor={item => item.value}
                          extraData={selectedvehicletypeId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.lbl_VehicleModel}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {VehicleModeldata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisVehicleModelmodalPopup(true);
                          }}>
                          <Text>{languagedata.lbl_VehicleModel}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisVehicleModelmodalPopup(true);
                          }}>
                          <Text>{VehicleModeldata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isVehicleVariantmodalPopup}
                  onRequestClose={() => {
                    setisVehicleVariantmodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.lbl_VehicleVariant}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisVehicleVariantmodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text =>
                          setsearchVehicleVariantQuery(text)
                        }
                        value={searchVehicleVariantQuery}
                      />
                      {searchVehicleVariantQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={isVehicleVariantdataitem}
                          renderItem={renderVehicleVariantItem}
                          keyExtractor={item => item.value}
                          extraData={selectedvehicletypeId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredVehicleVariantData}
                          renderItem={renderVehicleVariantItem}
                          keyExtractor={item => item.value}
                          extraData={selectedvehicletypeId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>

                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.lbl_VehicleVariant}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {VehicleVariantdata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisVehicleVariantmodalPopup(true);
                          }}>
                          <Text>{languagedata.lbl_VehicleVariant}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisVehicleVariantmodalPopup(true);
                          }}>
                          <Text>{VehicleVariantdata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
                {/* BrandNasadmeItemsdata */}
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isTyreBrandmodalPopup}
                  onRequestClose={() => {
                    setisTyreBrandmodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {' '}
                          {languagedata.BrandName}{' '}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisTyreBrandmodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text => setsearchTyreBrandQuery(text)}
                        value={searchTyreBrandQuery}
                      />
                      {searchTyreBrandQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={BrandNasadmeItemsdata}
                          renderItem={renderTyreBrandItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredTyreBrandData}
                          renderItem={renderTyreBrandItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.BrandName}
                      {/* Brand Name */}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {TyreBranddata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisTyreBrandmodalPopup(true);
                          }}>
                          <Text>{languagedata.BrandName}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisTyreBrandmodalPopup(true);
                          }}>
                          <Text>{TyreBranddata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isProductNamemodalPopup}
                  onRequestClose={() => {
                    setisProductNamemodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.lblProductName}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisProductNamemodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text => setsearchProductNameQuery(text)}
                        value={searchProductNameQuery}
                      />
                      {searchProductNameQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={ProductNameItemsdata}
                          renderItem={renderProductNameItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredProductNameData}
                          renderItem={renderProductNameItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.lblProductName}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {ProductNamedata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisProductNamemodalPopup(true);
                          }}>
                          <Text>{languagedata.lblProductName}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisProductNamemodalPopup(true);
                          }}>
                          <Text>{ProductNamedata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isTyreSizemodalPopup}
                  onRequestClose={() => {
                    setisTyreSizemodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.lbl_TyreSize}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisTyreSizemodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text => setsearchTyreSizeQuery(text)}
                        value={searchTyreSizeQuery}
                      />
                      {searchTyreSizeQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={TyreSizeItemsdata}
                          renderItem={renderTyreSizeItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredTyreSizeData}
                          renderItem={renderTyreSizeItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.lbl_TyreSize}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {TyreSizedata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisTyreSizemodalPopup(true);
                          }}>
                          <Text>{languagedata.lbl_TyreSize}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisTyreSizemodalPopup(true);
                          }}>
                          <Text>{TyreSizedata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.lbl_NumberofTyres}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input1}>
                      <SelectList
                        dropdownStyles={styles.dropdownshow}
                        maxHeight={200}
                        data={NumberOfTyredata}
                        setSelected={value => {
                          handleVehicleDetailsChange('tyreQuantity', value);
                          if (value === 1 || value === '1') {
                            handleVehicleDetailsChange(
                              'tyre2SerialNumber1',
                              '',
                            );
                            handleVehicleDetailsChange(
                              'tyre2SerialNumber2',
                              '',
                            );
                            handleVehicleDetailsChange(
                              'tyre2SerialNumber3',
                              '',
                            );
                            handleVehicleDetailsChange('tyre2Image', null);
                            setTyre2Image(null);
                          }
                        }}
                        placeholder={`${styrequantitySelected}`}
                        // inputStyles={{ color: 'red' }}
                        boxStyles={{borderWidth: 0}}
                        arrowicon={
                          <Icon name="chevron-down" size={12} color={'black'} />
                        }
                        save="value"
                      />
                    </View>
                  </View>
                </View>

                {vehicleDetails.tyreQuantity === 1 ||
                vehicleDetails.tyreQuantity === '1' ? (
                  <View>
                    <Text style={{color: 'black'}}>
                      {languagedata.Serial_1}
                    </Text>

                    <View style={styles.Serial_number_input_view}>
                      <TextInput
                        readOnly={true}
                        style={styles.Serial_number_input_small}
                        placeholder=""
                        maxLength={1}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre1SerialNumber1',
                            value,
                          )
                        }
                        value={serialkey}
                      />
                      <TextInput
                        keyboardType="number-pad"
                        maxLength={5}
                        style={styles.Serial_number_input}
                        placeholder=""
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre1SerialNumber2',
                            value,
                          )
                        }
                        value={vehicleDetails.tyre1SerialNumber2}
                      />
                      <TextInput
                        keyboardType="number-pad"
                        maxLength={4}
                        style={styles.Serial_number_input}
                        placeholder=""
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre1SerialNumber3',
                            value,
                          )
                        }
                        value={vehicleDetails.tyre1SerialNumber3}
                      />
                    </View>

                    {vehicleDetails.tyre1Image && (
                      <Image
                        source={{
                          uri: `file://${vehicleDetails.tyre1Image}`,
                        }}
                        width={width - 40}
                        height={300}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={tyre1ImagePickCamera}>
                      <Text style={styles.buttonText}>
                        {languagedata.Val_TakeTyre1PhotowithSerialNumber}
                      </Text>
                      <Icon
                        style={{marginLeft: 10, marginTop: 2}}
                        name="camera"
                        size={20}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={{color: 'black'}}>
                      {languagedata.Serial_1}
                    </Text>

                    <View style={styles.Serial_number_input_view}>
                      <TextInput
                        readOnly={true}
                        style={styles.Serial_number_input_small}
                        placeholder=""
                        maxLength={1}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre1SerialNumber1',
                            value,
                          )
                        }
                        value={serialkey}
                      />
                      <TextInput
                        keyboardType="number-pad"
                        maxLength={5}
                        style={styles.Serial_number_input}
                        placeholder=""
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre1SerialNumber2',
                            value,
                          )
                        }
                        value={vehicleDetails.tyre1SerialNumber2}
                      />
                      <TextInput
                        keyboardType="number-pad"
                        maxLength={4}
                        style={styles.Serial_number_input}
                        placeholder=""
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre1SerialNumber3',
                            value,
                          )
                        }
                        value={vehicleDetails.tyre1SerialNumber3}
                      />
                    </View>

                    {vehicleDetails.tyre1Image && (
                      <Image
                        source={{
                          uri: `file://${vehicleDetails.tyre1Image}`,
                        }}
                        width={width - 40}
                        height={300}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={tyre1ImagePickCamera}>
                      <Text style={styles.buttonText}>
                        {languagedata.Val_TakeTyre1PhotowithSerialNumber}
                      </Text>
                      <Icon
                        style={{marginLeft: 10, marginTop: 2}}
                        name="camera"
                        size={20}
                        color={'white'}
                      />
                    </TouchableOpacity>
                    <Text style={{color: 'black'}}>
                      {languagedata.Serial_2}
                    </Text>

                    <View style={styles.Serial_number_input_view}>
                      <TextInput
                        readOnly={true}
                        style={styles.Serial_number_input_small}
                        placeholder=""
                        maxLength={1}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre2SerialNumber1',
                            value,
                          )
                        }
                        value={serialkey}
                      />
                      <TextInput
                        keyboardType="number-pad"
                        maxLength={5}
                        style={styles.Serial_number_input}
                        placeholder=""
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre2SerialNumber2',
                            value,
                          )
                        }
                        value={vehicleDetails.tyre2SerialNumber2}
                      />
                      <TextInput
                        keyboardType="number-pad"
                        maxLength={4}
                        style={styles.Serial_number_input}
                        placeholder=""
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleVehicleDetailsChange(
                            'tyre2SerialNumber3',
                            value,
                          )
                        }
                        value={vehicleDetails.tyre2SerialNumber3}
                      />
                    </View>

                    {vehicleDetails.tyre2Image && (
                      <Image
                        source={{
                          uri: `file://${vehicleDetails.tyre2Image}`,
                        }}
                        width={width - 40}
                        height={300}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={tyre2ImagePickCamera}>
                      <Text style={styles.buttonText}>
                        {languagedata.Val_TakeTyre2PhotowithSerialNumber}
                      </Text>
                      <Icon
                        style={{marginLeft: 10, marginTop: 2}}
                        name="camera"
                        size={20}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Optional Details */}
          <View>
            <TouchableOpacity
              style={styles.sectionHeaderContainer}
              onPress={toggleOptionalDetails}>
              <Text style={styles.sectionHeader}>
                {languagedata.lbl_OptionalDetails}
              </Text>
              <TouchableOpacity style={styles.toggleButton}>
                <Icon
                  style={{marginTop: 12}}
                  onPress={toggleOptionalDetails}
                  name={showOptionalDetails ? 'caret-up' : 'caret-down'}
                  size={25}
                  color={iconColor}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            {showOptionalDetails && (
              <>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.InvoiceNo}
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <TextInput
                      maxLength={10}
                      style={styles.input}
                      placeholder={`${languagedata.InvoiceNo}`}
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleOptionalDetailsChange('invoiceNumber', value)
                      }
                      value={optionalDetails.invoiceNumber}
                    />
                  </View>
                </View>

                {optionalDetails.invoiceImage && (
                  <Image
                    source={{
                      uri: `file://${optionalDetails.invoiceImage}`,
                    }}
                    width={width - 40}
                    height={300}
                    // style={{ width: 100, height: 100 }}
                  />
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={invoicePickCamera}>
                  <Text style={styles.buttonText}>
                    {languagedata.lbl_TakeInvoicePhoto}
                  </Text>
                  <Icon
                    style={{marginLeft: 10, marginTop: 2}}
                    name="camera"
                    size={20}
                    color={'white'}
                  />
                </TouchableOpacity>

                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.InvoiceDate}
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <TouchableOpacity
                      style={styles.calenderbutton}
                      onPress={() => setOpenFromDate(true)}>
                      <Text style={styles.buttonText}>
                        {fromDate ? fromDate : `${languagedata.lbl_selectDate}`}{' '}
                        <Icon name="calendar" size={20} color="white" />
                      </Text>
                    </TouchableOpacity>
                    {openFromDate && (
                      <DatePicker
                        title={`${languagedata.lbl_SelectDate}`}
                        cancelText={`${languagedata.lbl_Cancel}`}
                        confirmText={`${languagedata.lbl_confirm}`}
                        modal
                        mode="date"
                        open={openFromDate}
                        date={new Date()} // Default to current date if fromDate is null
                        onConfirm={handleFromDateConfirm}
                        onCancel={handleCancel}
                        buttonColor="#e11e30"
                        dividerColor="#e11e30"
                        // maximumDate={new Date()}
                        maximumDate={new Date()}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.lbl_ODOMeter}
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <TextInput
                      maxLength={10}
                      style={styles.input}
                      keyboardType="number-pad"
                      placeholder={`${languagedata.lbl_ODOMeter}`}
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleOptionalDetailsChange('odoMeterReading', value)
                      }
                      value={optionalDetails.odoMeterReading}
                    />
                  </View>
                </View>

                {/* {ODOMeterImageUri && <Image source={{ uri: ODOMeterImageUri }} width={320} height={300} />} */}
                {optionalDetails.odoMeterImage && (
                  <Image
                    source={{
                      uri: `file://${optionalDetails.odoMeterImage}`,
                    }}
                    width={width - 40}
                    height={300}
                    // style={{ width: 100, height: 100 }}
                  />
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={ODOMeterPickCamera}>
                  <Text style={styles.buttonText}>
                    {languagedata.lbl_Take_ODO_Meter_Photo}
                  </Text>
                  <Icon
                    style={{marginLeft: 10, marginTop: 2}}
                    name="camera"
                    size={20}
                    color={'white'}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Old Tyre Details */}
          <View>
            <TouchableOpacity
              style={styles.sectionHeaderContainer}
              onPress={toggleOldTyreDetails}>
              <Text style={styles.sectionHeader}>
                {languagedata.lblOldTyreDetails}
              </Text>
              <View style={styles.toggleButton}>
                <Icon
                  style={{marginTop: 12}}
                  onPress={toggleOldTyreDetails}
                  name={showOldTyreDetails ? 'caret-up' : 'caret-down'}
                  size={25}
                  color={iconColor}
                />
              </View>
            </TouchableOpacity>

            {showOldTyreDetails && (
              <>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isoldTyreCompanymodalPopup}
                  onRequestClose={() => {
                    setisoldTyreCompanymodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.OldTyreCompany}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisoldTyreCompanymodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text =>
                          setsearcholdTyreCompanyQuery(text)
                        }
                        value={searcholdTyreCompanyQuery}
                      />
                      {searcholdTyreCompanyQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={oldtyrecompanynameItemsdata}
                          renderItem={renderoldTyreCompanyItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredoldTyreCompanyData}
                          renderItem={renderoldTyreCompanyItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.OldTyreCompany}
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {oldTyreCompanydata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisoldTyreCompanymodalPopup(true);
                          }}>
                          <Text>{languagedata.OldTyreCompany}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisoldTyreCompanymodalPopup(true);
                          }}>
                          <Text>{oldTyreCompanydata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isoldTyreBrandmodalPopup}
                  onRequestClose={() => {
                    setisoldTyreBrandmodalPopup(false);
                  }}>
                  <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalView}>
                      <View style={styles.innermodalview}>
                        <Text style={styles.modalheader}>
                          {languagedata.OldTyreBrandName}
                        </Text>
                        <Pressable
                          style={{marginBottom: 10}}
                          onPress={() => setisoldTyreBrandmodalPopup(false)} // Close modal directly
                        >
                          <Text style={{textAlign: 'right'}}>
                            <Icons name="closecircleo" size={20} />
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '100%',
                          padding: 10,
                        }}
                        placeholder={`${languagedata.lbl_search}`}
                        onChangeText={text => setsearcholdTyreBrandQuery(text)}
                        value={searcholdTyreBrandQuery}
                      />
                      {searcholdTyreBrandQuery === undefined ? (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={oldtyrebrandnameItemsdata}
                          renderItem={renderoldTyreBrandItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      ) : (
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          style={{marginTop: 10, width: '100%'}}
                          data={filteredoldTyreBrandData}
                          renderItem={renderoldTyreBrandItem}
                          keyExtractor={item => item.value}
                          extraData={selectedId}
                        />
                      )}
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.OldTyreBrandName}
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View style={styles.input}>
                      {oldTyreBranddata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisoldTyreBrandmodalPopup(true);
                          }}>
                          <Text>{languagedata.OldTyreBrandName}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisoldTyreBrandmodalPopup(true);
                          }}>
                          <Text>{oldTyreBranddata}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '5%',
                              top: '10%',
                            }}>
                            <Icon
                              name="chevron-down"
                              size={12}
                              color={'gray'}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.OldTyreSize}
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <View>
                      <TextInput
                        maxLength={10}
                        style={styles.input}
                        placeholder={`${languagedata.OldTyreSize}`}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={value =>
                          handleOldTyreDetailsChange('oldTyreSize', value)
                        }
                        value={oldTyreDetails.oldTyreSize}
                      />
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Terms and Conditions */}
          <View>
            <Text style={styles.sectionHeader}>
              {languagedata.lbl_TermsandConditions}
            </Text>
            <RadioButton.Group
              onValueChange={value => setTermsAccepted(value)}
              value={termsAccepted}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://warrantyuat.yokohama-oht.com/UploadFiles/Terms_Condition/YIN_Lifetime_Protection_Program_2023.pdf',
                    )
                  }>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      paddingTop: 14,
                      marginRight: '20%',
                    }}>
                    {languagedata.Terms_Conditions}
                  </Text>
                </TouchableOpacity>
                <RadioButton.Android
                  // label={languagedata.Terms_Conditions}
                  value={true}
                  color={RadioButtonColor}
                  style={{
                    backgroundColor: '#D3D3D3',
                    justifyContent: 'flex-end',
                    alignContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                  labelStyle={styles.radioLabel}
                />
              </View>
            </RadioButton.Group>
          </View>

          {/* Submit Button */}
          <View style={{flexDirection: 'row', marginRight: 3}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                marginLeft: 4,
                borderRadius: 5,
                width: '50%',
              }}
              onPress={() => {
                validationmessage('offline');
              }}>
              <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>
                {languagedata.lbl_Save_As_a_Draft}
              </Text>
            </TouchableOpacity>
            {/* onPress={handlemodifyandsubmit} */}
            <TouchableOpacity
              onPress={() => {
                validationmessage('online');
              }}
              style={{
                backgroundColor: '#e11e30',
                padding: 10,
                // opacity: 0.5,
                marginVertical: 10,
                marginLeft: 4,
                borderRadius: 5,
                width: '50%',
              }}>
              <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>
                {languagedata.lbl_Submit_Online_Portal}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        // </KeyboardAvoidingView>
      )}
    </>
  );
};
export default WarrantyRegistrationForm;
