import React, {useState, useRef, useEffect} from 'react';
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
  Platform,
  Linking,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {RadioButton, List} from 'react-native-paper';
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
} from '../../db/Registration/sqliteOperations';
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
} from './../../db/Registration/PinCodeDb';
import {
  setupTractorMakeDatabase,
  getAllTractorMakeItems,
  getVehicleByVehTypeid,
  getmakeids,
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
  gettyresize,
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
  getvehtype,
} from '../../db/Registration/VehicleTypeDb';
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
import RemoteUrls from '../apiUrl';
import RNFS from 'react-native-fs';
import {LightSpeedOutLeft} from 'react-native-reanimated';
import {longPressHandlerName} from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';
import ImagePicker from 'react-native-image-crop-picker';
import moment, {localeData} from 'moment';
import {useRoute} from '@react-navigation/native';

const UpdateWarrantyRegistration = ({}) => {
  const route = useRoute();

  const {
    id,
    registrationOptions,
    numberplateimagess,
    customerName,
    mobileNumber,
    address,
    state,
    state_id,
    pinCode,
    districtid,
    districtname,
    cityvillageid,
    cityvillagename,
    pincodeid,
    registrationNumber,
    registrationDates,
    make,
    make_id,
    model,
    brand,
    brandid,
    productid,
    series,
    productName,
    tyreSize,
    tyreQuantity,
    tyre1SerialNumber2,
    tyre1SerialNumber3,
    tyre1Images,
    tyre2SerialNumber2,
    tyre2SerialNumber3,
    tyre2Images,
    invoiceNumber,
    invoiceImage,
    invoiceDate,
    odoMeterReading,
    odoMeterImage,
    oldTyreCompany,
    oldtyrebrandid,
    oldTyreBrand,
    oldTyreSize,
    termsAccepteds,
    veh_type_id,
    veh_type_name,
    variantid,
    variantname,
  } = route.params;

  const RadioButtonColor: string = '#e11e30';
  const placeholderTextColor: string = '#666';
  const iconColor = '#000';
  const [fromDate, setFromDate] = useState(null);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const handleFromDateConfirm = selectedDate => {
    setOpenFromDate(false); // Close From Date picker
    // setoldregistrationDate(selectedDate)
    const asdaasda = moment(selectedDate).format('DD/MM/YYYY');

    setFromDate(asdaasda);
    const selectedDates = selectedDate;
    const formattedDate = selectedDates.toISOString().split('T')[0];
    setoldinvoiceDate(formattedDate);
  };
  // Function to handle cancellation of Date pickers
  const handleCancel = () => {
    setOpenFromDate(false); // Close From Date picker
    setOpenToDate(false); // Close To Date picker
  };
  const [modalVisible, setModalVisible] = useState(false);
  // Picker

  // Changes for List Accordions --------------------------------------

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

  const [registrationOption, setRegistrationOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
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
    tyreQuantity: '',
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
    setRegistrationOption(option);
    if (option === 'Available') {
      setIsVehicleRegistrationAvailable(true); // Set state for available option
    } else {
      setIsVehicleRegistrationAvailable(false); // Set state for other options
    }
    setoldregistration(option);
    if (option === 'Not Available' || option === 'New Vehicle') {
      setoldnumberplateimage(null);
      setoldregistrationnumber('');
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
  const [isvehiclevariantcheck, setisvehiclevariantcheck] = useState(true);
  const [isvehiclemakedataitem, setisvehiclemakedataitem] = useState([]);
  const [isvehiclemodeldataitem, setisvehiclemodeldataitem] = useState([]);
  const [isvehtype, setisvehtype] = useState(false);
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
    // setoldmake

    // setModelItems(modeldataItems)
    setismakeshow(true);
    setismodelshow(true);
  };
  const [isVehicleVariantdataitem, setisVehicleVariantdataitem] = useState([]);
  const getVehicleVariantById = async value => {
    const helper = makeINamestems.filter(element => element.value === value);

    const helperarray = await getVariantByMakeID(helper[0].key);
    const variantdataItems = helperarray.map(item => ({
      key: item.variantid,
      value: item.variantname,
    }));
    setisVehicleVariantdataitem(variantdataItems);
    setVehicleVariantItems(variantdataItems);
    setisvehiclevariantshow(true);
  };
  const storeVehicleVariant = async value => {
    const helper = vehicleVariantItems.filter(
      element => element.value === value,
    );
    setoldvariantid(helper[0].key);
    setoldvariantname(helper[0].value);
    setstateidvalue(helper[0]);
  };
  const handleVehicleDetailsChange = async (field, value) => {
    setVehicleDetails(prevState => ({...prevState, [field]: value}));
    if (vehicleDetails.tyreQuantity === '1') {
      setoldtyre2Image('');
      setoldtyre2SerialNumber2('');
      setoldtyre2SerialNumber3('');
    }
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

  const [stateItems, setStateItems] = useState();

  const [pincodeItems, setPinCodeItems] = useState();
  const [makeItems, setMakeItems] = useState();
  const [makeINamestems, setMakeNamesItems] = useState();
  const [modelItems, setModelItems] = useState();
  const [brandnameItems, setBrandNameItems] = useState();
  const [productnameItems, setProductNameItems] = useState();
  const [productname, setProductName] = useState();
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
      // fetchPinCodeItems();
      // fetchTractorMakeItems();
      // fetchTractorModelItems();
      // fetchBrandNasadmeItems();
      // fetchProductNameItems();
      // fetchTyreSizeItems();
      // fetchOldTyreBrandNameItems();
      // fetchOldTyreCompanyItems();
    }
  };
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
  const [oldregistration, setoldregistration] = useState(registrationOptions);
  const [oldcustomername, setoldcustomername] = useState(customerName);
  const [oldmobilenumber, setoldmobilenumber] = useState(mobileNumber);
  const [oldaddress, setoldaddress] = useState(address);
  const [oldstatename, setoldstatename] = useState(state);
  const [oldstateid, setoldstateid] = useState(state_id);
  const [oldpincode, setoldpincode] = useState(pinCode);
  const [olddistrictid, setolddistrictid] = useState(districtid);
  const [olddistrictname, setolddistrictname] = useState(districtname);
  const [oldcityvillageid, setoldcityvillageid] = useState(cityvillageid);
  const [oldcityvillagename, setoldcityvillagename] = useState(cityvillagename);
  const [oldpincodeid, setoldpincodeid] = useState(pincodeid);
  const [oldregistrationnumber, setoldregistrationnumber] =
    useState(registrationNumber);
  const [oldregistrationDate, setoldregistrationDate] =
    useState(registrationDates);
  const [oldmake, setoldmake] = useState(make);
  const [oldmake_id, setoldmake_id] = useState(make_id);
  const [oldmodel, setoldmodel] = useState(model);
  const [oldbrand, setoldbrand] = useState(brand);
  const [oldbrandid, setoldbrandid] = useState(brandid);
  const [oldproductid, setoldproductid] = useState(productid);
  const [oldseries, setoldseries] = useState(series);
  const [oldproductName, setoldproductName] = useState(productName);
  const [oldtyreSize, setoldtyreSize] = useState(tyreSize);
  const [oldtyreQuantity, setoldtyreQuantity] = useState(tyreQuantity);
  const [oldtyre1SerialNumber2, setoldtyre1SerialNumber2] =
    useState(tyre1SerialNumber2);
  const [oldtyre1SerialNumber3, setoldtyre1SerialNumber3] =
    useState(tyre1SerialNumber3);
  const [oldtyre1Image, setoldtyre1Image] = useState(tyre1Images);
  const [oldtyre2SerialNumber2, setoldtyre2SerialNumber2] =
    useState(tyre2SerialNumber2);
  const [oldtyre2SerialNumber3, setoldtyre2SerialNumber3] =
    useState(tyre2SerialNumber3);
  const [oldtyre2Image, setoldtyre2Image] = useState(tyre2Images);
  const [oldinvoiceNumber, setoldinvoiceNumber] = useState(invoiceNumber);
  const [oldinvoiceImage, setoldinvoiceImage] = useState(invoiceImage);
  const [oldinvoiceDate, setoldinvoiceDate] = useState(invoiceDate);
  const [oldodoMeterReading, setoldodoMeterReading] = useState(odoMeterReading);
  const [oldodoMeterImage, setoldodoMeterImage] = useState(odoMeterImage);
  const [oldoldTyreCompany, setoldoldTyreCompany] = useState(oldTyreCompany);
  const [oldoldTyreCompanyis, setoldoldTyreCompanyis] =
    useState(oldtyrebrandid);
  const [oldoldTyreBrand, setoldoldTyreBrand] = useState(oldTyreBrand);
  const [oldoldTyreSize, setoldoldTyreSize] = useState(oldTyreSize);
  const [oldtermsAccepted, setoldtermsAccepted] = useState(termsAccepteds);
  // const [oldcreated_by, setoldcreated_by] = useState(created_by)
  const [oldveh_type_id, setoldveh_type_id] = useState(veh_type_id);
  const [oldveh_type_name, setoldveh_type_name] = useState(veh_type_name);
  const [oldvariantid, setoldvariantid] = useState(variantid);
  const [oldvariantname, setoldvariantname] = useState(variantname);
  const [oldnumberplateimage, setoldnumberplateimage] =
    useState(numberplateimagess);
  const [isNumberplateDeleted, setIsNumberplateDeleted] = useState(false);
  const [isInvoiceDeleted, setIsInvoiceDeleted] = useState(false);
  const [isOdometerDeleted, setIsOdometerDeleted] = useState(false);
  const [isTyre1ImageDeleted, setIsTyre1ImageDeleted] = useState(false);
  const [isTyre2ImageDeleted, setIsTyre2ImageDeleted] = useState(false);

  // Image paths (replace these with your actual paths)
  const checkImageExists = async (
    imagePath,
    setDeletionState,
    setImagePath,
  ) => {
    try {
      if (imagePath != null) {
        const exists = await RNFS.exists(imagePath);
        if (exists) {
          setDeletionState(false); // Set to false (not deleted)
          // setImagePath(imagePath)
        } else {
          setDeletionState(true); // Set to true (deleted)
          // setImagePath(null); // Clear the image path
        }
      }
    } catch (error) {
      console.error('Error checking image existence:', error);
    }
  };

  // Function to check all images
  const checkAllImages = async () => {
    await checkImageExists(
      oldnumberplateimage,
      setIsNumberplateDeleted,
      setoldnumberplateimage,
    );
    await checkImageExists(
      oldinvoiceImage,
      setIsInvoiceDeleted,
      setoldinvoiceImage,
    );
    await checkImageExists(
      oldodoMeterImage,
      setIsOdometerDeleted,
      setoldodoMeterImage,
    );
    await checkImageExists(
      oldtyre1Image,
      setIsTyre1ImageDeleted,
      setoldtyre1Image,
    );
    await checkImageExists(
      oldtyre2Image,
      setIsTyre2ImageDeleted,
      setoldtyre2Image,
    );
  };

  const methodcall = async () => {
    await checkAllImages();
    if (isNumberplateDeleted === true) {
      setoldnumberplateimage(null);
    }
    if (isInvoiceDeleted === true) {
      setoldinvoiceImage(null);
    }
    if (isOdometerDeleted === true) {
      setoldodoMeterImage(null);
    }
    if (isTyre1ImageDeleted === true) {
      setoldtyre1Image(null);
    }
    if (isTyre2ImageDeleted === true) {
      setoldtyre2Image(null);
    }

    await setupMultiLanguageDatabase();
    await fetchingthelanguagedata();
    // toggleOldTyreDetails()
    // toggleOptionalDetails()
    // toggleVehicleDetails()
    const formatDateForORM = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    // getStateObjectByName(selectedItem.state)
    // Format fromDate and toDate as YYYY-MM-DD for ORM usage
    const registrationsate = formatDateForORM(new Date());
    setRegistrationDate(registrationsate);
    setoldregistrationDate(registrationsate);
    setRegistrationOption(oldregistration);
    setTermsAccepted(oldtermsAccepted);
    await setupStateDatabase();

    await fetchStateItems();

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
    await fetchOldTyreBrandNameItems(oldoldTyreCompanyis);

    await setupOldTyreCompanyDatabase();

    await fetchOldTyreCompanyItems();
    await setupVehicleTypeDatabase();

    await fetchVehicleTypeItems();
    await setupVehicleVariantDatabase();

    setStateObjectofkey(null);

    const initializeDatabase = async () => {
      const database = await setupDatabase();
      setDb(database);
      fetchItems(database);
    };
    await initializeDatabase();
    await setupRegexDatabase();
    await feItems();
    let helperarray1 = await getVehicleByVehTypeid(oldveh_type_id);
    const makedataItems = helperarray1.map(item => ({
      key: item.MakeID,
      value: item.MakeName,
    }));
    setisvehiclemakedataitem(makedataItems);

    const helperarray2 = await getVariantByMakeID(oldmake_id);
    const variantdataItems = helperarray2.map(item => ({
      key: item.variantid,
      value: item.variantname,
    }));

    setisVehicleVariantdataitem(variantdataItems);

    let helpermodelarray = await getVehicleModelByVehTypeid(oldmake_id);
    const modeldataItems = helpermodelarray.map(item => ({
      key: item.modelID,
      value: item.modelName,
    }));

    setisvehiclemodeldataitem(modeldataItems);

    const itemsFromDb = await getAllTyreSizeItems(oldproductid);
    const tyresizeItems = itemsFromDb.map(item => ({
      key: item.id,
      value: item.sizeName,
    }));
    setTyreSizeItemsdata(tyresizeItems);
    await setupPinCodeDatabase();
    await fetchPinCodeItems(oldstateid, oldstatename);

    const formattedDate = formatDate(oldinvoiceDate);

    setFromDate(formattedDate);
    if (oldtyre2Image !== null) {
      setTyre2Image(oldtyre2Image);
    }
  };

  function formatDate(inputDate) {
    if (inputDate != '') {
      return moment(inputDate).format('DD/MM/YYYY');
    }
  }

  useEffect(() => {
    methodcall();
  }, []);
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
  const [pincodedata, setpincodedata] = useState([]);

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
      setStateitemdata(formattedItems);
      setStateItems(formattedItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [pincodelist, setPincodelist] = useState(null);

  const getPincode = async (pincodevalue, stateid) => {
    const getpincodeItems = await getAllPinCodeItems(stateid);

    const getpincode = getpincodeItems.filter(
      pincode => pincode.areapincode === pincodevalue,
    );
    setPincodelist(getpincode[0]);

    setoldpincode(getpincode[0].areapincode);
    setolddistrictid(getpincode[0].districtid);
    setolddistrictname(getpincode[0].districtname);
    setoldcityvillageid(getpincode[0].cityvillageid);
    setoldcityvillagename(getpincode[0].cityvillagename);
    setoldpincodeid(getpincode[0].pincodeid);
  };
  const fetchPinCodeItems = async (stateid, statename) => {
    const id = stateid.toString();

    try {
      const itemsFromDb = await getAllPinCodeItems(id);
      const pincodeItems = itemsFromDb.map(item => ({
        key: item.pincodeid,
        value: item.areapincode,
      }));
      if (pincodeItems.length === 0) {
        Alert.alert('Error', `Please sync the ${statename} state`);
        return;
      }
      if (pincodedata.length != 0) {
        setoldstatename(statename);
        setoldstateid(stateid);
      }
      setpincodedata(pincodeItems);
      setPinCodeItems(pincodeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [getmakeid, setgetmakeid] = useState(null);
  const getmakeidlist = async makeName => {
    // const getstateItems = await getAllStateItems()
    const makeid = await getmakeids(makeName);
    setgetmakeid(makeid[0]);
    setoldmake(makeid[0].MakeName);

    setoldmake_id(makeid[0].MakeID);
    setoldveh_type_id(makeid[0].Veh_Type_ID);
  };
  const fetchTractorMakeItems = async () => {
    try {
      const TractorMake = await getAllTractorMakeItems();

      setMakeItems(TractorMake);
      const makeItems = TractorMake.map(item => ({
        key: item.MakeID,
        value: item.MakeName,
      }));
      // setMakeNameItems(makeItems)
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const [getmodelid, setgetmodelid] = useState(null);
  const getmodelidlist = async modelName => {
    // const getstateItems = await getAllStateItems()
    const modelid = modelItems.filter(model => model.value === modelName);
    setgetmodelid(modelid[0].key);
    setoldmodel(modelid[0].value);
  };

  const getbrandlist = async brand => {
    const makeid = await getbrandids(brand);
    setoldbrand(makeid[0].brandname);
    setoldbrandid(makeid[0].brandid);
  };
  const [BrandNasadmeItemsdata, setBrandNasadmeItemsdata] = useState([]);
  const fetchBrandNasadmeItems = async () => {
    try {
      const itemsFromDb = await getAllBrandNasadmeItems();
      const brandnameItems = itemsFromDb.map(item => ({
        key: item.brandid,
        value: item.brandname,
      }));
      setBrandNasadmeItemsdata(brandnameItems);
      setBrandNameItems(brandnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const getProductNameById = async value => {
    const helper = productnameItems.filter(element => element.value === value);

    const helperarray = await getProductNameByProductId(helper[0].key);
    setserialkey(helperarray[0].series);
    setProductName(helperarray[0]);
    setoldproductName(helperarray[0].productName);
    setoldproductid(helperarray[0].productId);
    setoldseries(helperarray[0].series);
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
  const [TyreSizeItemsdata, setTyreSizeItemsdata] = useState([]);
  const fetchTyreSizeItems = async product => {
    try {
      const itemsFromDb = await getAllTyreSizeItems(product);
      const tyresizeItems = itemsFromDb.map(item => ({
        key: item.tyreSizeId,
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
  const fetchOldTyreBrandNameItems = async value => {
    try {
      const itemsFromDb = await getAllOldTyreBrandNameItems(value);
      const oldtyrebrandnameItems = itemsFromDb.map(item => ({
        key: item.brandpatternId,
        value: item.brandpattern,
      }));
      setoldtyrebrandnameItemsdata(oldtyrebrandnameItems);
      // setoldoldTyreBrand(oldtyrebrandnameItems[0].value)
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
      // setoldoldTyreCompany(oldtyrecompanyItems[0].value)
      setOldTyreCompanyItems(oldtyrecompanyItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const getvehtyprelist = async vehtype => {
    const vehtypes = await getvehtype(vehtype);
    setoldveh_type_name(vehtypes[0].Veh_Type_Name);
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
  const [invoiceImageUri, setInvoiceImageUri] = useState(null);
  const [ODOMeterImageUri, setODOMeterImageUri] = useState(null);
  const [tyre1Image, setTyre1Image] = useState(null);
  const [tyre2Image, setTyre2Image] = useState(null);
  // const [tyre2Image, setTyre2Image] = useState(null);
  const [numberplate, setnumberplate] = useState(null);
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

        // Define the new file path
        const fileName = `image_${Date.now()}.jpg`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);
        setoldnumberplateimage(newPath);

        if (fileExists) {
          console.log('File successfully copied to:', newPath);
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

        // Define the new file path
        const fileName = `image_${Date.now()}.jpg`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);
        setoldinvoiceImage(newPath);

        setOptionalDetails(prevDetails => ({
          ...prevDetails,
          invoiceImage: newPath,
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

        // Define the new file path
        const fileName = `image_${Date.now()}.jpg`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);
        setVehicleDetails(prevDetails => ({
          ...prevDetails,
          tyre2Image: newPath,
        }));
        if (fileExists) {
          setoldodoMeterImage(newPath);

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

        // Define the new file path
        const fileName = `image_${Date.now()}.jpg`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);
        setoldtyre1Image(newPath);
        setVehicleDetails(prevDetails => ({
          ...prevDetails,
          tyre1Image: newPath,
        }));
        // Verify file creation
        const fileExists = await RNFS.exists(newPath);

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

        // Define the new file path
        const fileName = `image_${Date.now()}.jpg`;
        const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
        const newPath = `${folderPath}/${fileName}`;

        // Copy the image to the public directory
        await RNFS.copyFile(image.path, newPath);

        // Verify file creation
        const fileExists = await RNFS.exists(newPath);
        setoldtyre2Image(newPath);
        setTyre2Image(newPath);
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
  const handleSubmit = async () => {
    const contactforserialnumberRegex = /^[0-9+\-]+$/;

    const registrationnoregex = new RegExp(regex[0].value);

    if (oldregistration === 'Available') {
      if (oldregistrationnumber === '') {
        Alert.alert(
          'Error',
          `${languagedata.lbl_RegistrationNumberBlankValidation}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (!registrationnoregex.test(oldregistrationnumber)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_RegistrationNumberValidation}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
    }
    if (oldcustomername === '') {
      Alert.alert('Error', `${languagedata.rfvCustomerName}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    const nameRegexstr = regex[6].value; // Regex pattern: alphabets, hyphen, apostrophe, and space
    const nameRegex = new RegExp(nameRegexstr);
    if (!nameRegex.test(oldcustomername)) {
      Alert.alert(
        'Validation Error',
        `${languagedata.lbl_CustomerNameValidation}`,
        [{text: `${languagedata.lbl_Ok}`}],
      );
      return;
    }
    if (oldmobilenumber === '') {
      Alert.alert('Error', `${languagedata.ReqCusMobileNo}`);
      return;
    }
    const contactRegexstr = regex[3].value;

    const contactRegex = new RegExp(contactRegexstr);
    if (!contactRegex.test(oldmobilenumber)) {
      Alert.alert('Validation Error', `${languagedata.lbl_NumberValidation}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (oldaddress === '') {
      Alert.alert('Error', `${languagedata.lbl_Addressisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (oldstatename === undefined && Statedata === null) {
      Alert.alert('Error', `${languagedata.lbl_Stateisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (oldpincode === undefined && pincodevaluedata === null) {
      Alert.alert('Error', `${languagedata.lbl_PinCodeisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (oldmodel === '') {
      Alert.alert('Error', `${languagedata.lbl_ModelCannotbeBlank}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (oldvariantname === '') {
      Alert.alert('Error', `${languagedata.lbl_VehicleVariantisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }

    if (oldbrand === '') {
      Alert.alert('Error', `${languagedata.lbl_TyreBrandisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (oldproductName === '') {
      Alert.alert('Error', `${languagedata.lbl_ProductNameisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (oldtyreSize === '') {
      Alert.alert('Error', `${languagedata.rfvTyreSize}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (oldtyreQuantity === '') {
      Alert.alert('Error', `${languagedata.lbl_NumberofTyresisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    // if()
    if (vehicleDetails.tyreQuantity === '2') {
      if (oldtyre2SerialNumber2 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial2}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (!contactforserialnumberRegex.test(oldtyre2SerialNumber2)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }

      if (oldtyre2SerialNumber2.length != 5) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2containatleast5number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }

      if (oldtyre2SerialNumber3 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial2}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (!contactforserialnumberRegex.test(oldtyre2SerialNumber3)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre2SerialNumber3.length != 4) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2containatleast4number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
    }
    if (oldtyreQuantity === 1) {
      if (!contactforserialnumberRegex.test(oldtyre1SerialNumber2)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre1SerialNumber2.length != 5) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1containatleast5number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre1SerialNumber3 === '') {
        Alert.alert('Error', `${languagedata.lbl_Serial1CannotbeBlank}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (oldtyre1SerialNumber2 === '') {
        Alert.alert('Error', `${languagedata.lbl_Serial1CannotbeBlank}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (!contactforserialnumberRegex.test(oldtyre1SerialNumber3)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre1SerialNumber3.length != 4) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1containatleast4number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
    }
    if (oldtyreQuantity === 2 || oldtyreQuantity === '2') {
      if (!contactforserialnumberRegex.test(oldtyre1SerialNumber2)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre1SerialNumber2.length != 5) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1containatleast5number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre1SerialNumber3 === '') {
        Alert.alert('Error', `${languagedata.lbl_Serial1CannotbeBlank}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (oldtyre1SerialNumber2 === '') {
        Alert.alert('Error', `${languagedata.lbl_Serial1CannotbeBlank}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (!contactforserialnumberRegex.test(oldtyre1SerialNumber3)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre1SerialNumber3.length != 4) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial1containatleast4number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (!contactforserialnumberRegex.test(oldtyre2SerialNumber2)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre2SerialNumber2.length != 5) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2containatleast5number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre2SerialNumber3 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial2}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (oldtyre2SerialNumber2 === '') {
        Alert.alert('Error', `${languagedata.rfvSerial2}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
      if (!contactforserialnumberRegex.test(oldtyre2SerialNumber3)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2onlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
      if (oldtyre2SerialNumber3.length != 4) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_Serial2containatleast4number}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }

      if (oldtyre2Image === null || oldtyre2Image === '') {
        Alert.alert('Error', `${languagedata.lbl_Serial2imageisrequired}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
    }
    if (oldodoMeterReading != '') {
      if (!contactforserialnumberRegex.test(oldodoMeterReading)) {
        Alert.alert(
          'Validation Error',
          `${languagedata.lbl_ODOMeteronlycontainnumber}`,
          [{text: `${languagedata.lbl_Ok}`}],
        );
        return;
      }
    }
    if (oldtermsAccepted === false) {
      Alert.alert('Error', `${languagedata.ErrorMsgTermsConditions}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    try {
      if (!db) {
        return;
      }

      if (
        oldregistration === 'Not Available' ||
        oldregistration === 'New Vehicle'
      ) {
        if (oldtyre2SerialNumber2 !== '' && oldtyre2SerialNumber3 !== '') {
          updateItem(
            db,
            id,
            oldregistration,
            oldcustomername,
            oldmobilenumber,
            oldaddress,
            oldstatename,
            oldstateid,
            oldpincode,
            olddistrictid,
            olddistrictname,
            oldcityvillageid,
            oldcityvillagename,
            oldpincodeid,
            null,
            oldregistrationDate,
            oldmake,
            oldmake_id,
            oldmodel,
            oldbrand,
            oldbrandid,
            oldproductid,
            oldseries,
            oldproductName,
            oldtyreSize,
            oldtyreQuantity,
            oldtyre1SerialNumber2,
            oldtyre1SerialNumber3,
            oldtyre1Image,
            oldtyre2SerialNumber2,
            oldtyre2SerialNumber3,
            oldtyre2Image,
            oldinvoiceNumber,
            oldinvoiceImage,
            oldinvoiceDate,
            oldodoMeterReading,
            oldodoMeterImage,
            oldoldTyreCompany,
            oldoldTyreBrand,
            oldoldTyreSize,
            oldtermsAccepted,
            oldveh_type_id,
            oldveh_type_name,
            oldvariantid,
            oldvariantname,
            null,
            oldoldTyreCompanyis,
          );
        } else {
          updateItem(
            db,
            id,
            oldregistration,
            oldcustomername,
            oldmobilenumber,
            oldaddress,
            oldstatename,
            oldstateid,
            oldpincode,
            olddistrictid,
            olddistrictname,
            oldcityvillageid,
            oldcityvillagename,
            oldpincodeid,
            null,
            oldregistrationDate,
            oldmake,
            oldmake_id,
            oldmodel,
            oldbrand,
            oldbrandid,
            oldproductid,
            oldseries,
            oldproductName,
            oldtyreSize,
            oldtyreQuantity,
            oldtyre1SerialNumber2,
            oldtyre1SerialNumber3,
            oldtyre1Image,
            '',
            '',
            oldtyre2Image,
            oldinvoiceNumber,
            oldinvoiceImage,
            oldinvoiceDate,
            oldodoMeterReading,
            oldodoMeterImage,
            oldoldTyreCompany,
            oldoldTyreBrand,
            oldoldTyreSize,
            oldtermsAccepted,
            oldveh_type_id,
            oldveh_type_name,
            oldvariantid,
            oldvariantname,
            null,
            oldoldTyreCompanyis,
          );
        }
      } else {
        if (oldtyre2SerialNumber2 !== '' && oldtyre2SerialNumber3 !== '') {
          updateItem(
            db,
            id,
            oldregistration,
            oldcustomername,
            oldmobilenumber,
            oldaddress,
            oldstatename,
            oldstateid,
            oldpincode,
            olddistrictid,
            olddistrictname,
            oldcityvillageid,
            oldcityvillagename,
            oldpincodeid,
            oldregistrationnumber,
            oldregistrationDate,
            oldmake,
            oldmake_id,
            oldmodel,
            oldbrand,
            oldbrandid,
            oldproductid,
            oldseries,
            oldproductName,
            oldtyreSize,
            oldtyreQuantity,
            oldtyre1SerialNumber2,
            oldtyre1SerialNumber3,
            oldtyre1Image,
            oldtyre2SerialNumber2,
            oldtyre2SerialNumber3,
            oldtyre2Image,
            oldinvoiceNumber,
            oldinvoiceImage,
            oldinvoiceDate,
            oldodoMeterReading,
            oldodoMeterImage,
            oldoldTyreCompany,
            oldoldTyreBrand,
            oldoldTyreSize,
            oldtermsAccepted,
            oldveh_type_id,
            oldveh_type_name,
            oldvariantid,
            oldvariantname,
            oldnumberplateimage,
            oldoldTyreCompanyis,
          );
        } else {
          updateItem(
            db,
            id,
            oldregistration,
            oldcustomername,
            oldmobilenumber,
            oldaddress,
            oldstatename,
            oldstateid,
            oldpincode,
            olddistrictid,
            olddistrictname,
            oldcityvillageid,
            oldcityvillagename,
            oldpincodeid,
            oldregistrationnumber,
            oldregistrationDate,
            oldmake,
            oldmake_id,
            oldmodel,
            oldbrand,
            oldbrandid,
            oldproductid,
            oldseries,
            oldproductName,
            oldtyreSize,
            oldtyreQuantity,
            oldtyre1SerialNumber2,
            oldtyre1SerialNumber3,
            oldtyre1Image,
            '',
            '',
            oldtyre2Image,
            oldinvoiceNumber,
            oldinvoiceImage,
            oldinvoiceDate,
            oldodoMeterReading,
            oldodoMeterImage,
            oldoldTyreCompany,
            oldoldTyreBrand,
            oldoldTyreSize,
            oldtermsAccepted,
            oldveh_type_id,
            oldveh_type_name,
            oldvariantid,
            oldvariantname,
            oldnumberplateimage,
            oldoldTyreCompanyis,
          );
        }
      }
      // updateItem(db, id, oldregistration, oldcustomername, oldmobilenumber, oldaddress, oldstatename, oldstateid, oldpincode, olddistrictid, olddistrictname, oldcityvillageid, oldcityvillagename, oldpincodeid, oldregistrationnumber, oldregistrationDate, oldmake, oldmake_id, oldmodel, oldbrand, oldbrandid, oldproductid, oldseries, oldproductName, oldtyreSize, oldtyreQuantity, oldtyre1SerialNumber2, oldtyre1SerialNumber3, oldtyre1Image, oldtyre2SerialNumber2, oldtyre2SerialNumber3, oldtyre2Image, oldinvoiceNumber, oldinvoiceImage, oldinvoiceDate, oldodoMeterReading, oldodoMeterImage, oldoldTyreCompany, oldoldTyreBrand, oldoldTyreSize, oldtermsAccepted, oldveh_type_id, oldveh_type_name, oldvariantid, oldvariantname, oldnumberplateimage, oldoldTyreCompanyis)
      Alert.alert(
        `${languagedata.lbl_Success}`,
        `${languagedata.lbl_Registrationupdatedsuccessfully}`,
        [
          {
            text: `${languagedata.lbl_Ok}`,
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.error(error);
    }
  };
  const search = async () => {
    const payload = {
      WarrantyID: 'uiuyu',
      MobileNo: null,
      CustomerName: null,
      RegistrationNo: null,
      CreatedDate: 'khkhjh',
      CreatedBy: null,
      BrandName: null,
      ProductName: null,
      Size: null,
      wcUserName: null,
      DealerState: null,
      CustomerState: null,
    };

    try {
      const response = await axios.post(
        RemoteUrls.postSearchWarrantyUrl,
        payload,
      );
    } catch (error) {
      console.log(error);
    }
  };
  const [isPopup, setIsPopup] = useState(false);
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
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [pincodevaluedata, setpincodevaluedata] = useState(null);
  const handleItemSelect = item => {
    setSearchQuery('');
    getPincode(item.value, oldstateid);

    handleCustomerDetailsChange('pinCode', item.value);
    // setSelectedItem(item); // Store selected item if needed
    setIsPopup(false); // Close the modal
    setpincodevaluedata(item.value);
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
  });
  const renderStateItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleStateItemSelect(item);
      }}>
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [Statedata, setStatedata] = useState(null);
  const handleStateItemSelect = item => {
    if (pincodevaluedata != null) {
      setpincodevaluedata(null);
    }
    if (oldpincode != undefined) {
      setoldpincode(undefined);
    }
    setsearchStateQuery('');
    fetchPinCodeItems(item.key, item.value);
    setisStatemodalPopup(false); // Close the modal
    setStatedata(item.value);
    handleCustomerDetailsChange('state', item.value);
    getStateObjectByName(item.value);
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
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleTypedata, setVehicleTypedata] = useState(null);
  const handleVehicleTypeItemSelect = item => {
    setsearchVehicleTypeQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleTypemodalPopup(false); // Close the modal
    setVehicleTypedata(item.value);
    getVehicleMakeByVehiceTypeID(item.value);
  };

  const [VehicleVariantdata, setVehicleVariantdata] = useState(null);

  const [isVehicleMakemodalPopup, setisVehicleMakemodalPopup] = useState(false);
  const [searchVehicleMakeQuery, setsearchVehicleMakeQuery] = useState('');

  const filteredVehicleMakeData = isvehiclemakedataitem.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase();

      // Convert searchQuery to string
      let searchString = searchVehicleMakeQuery.toString().toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderVehicleMakeItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleVehicleMakeItemSelect(item);
      }}>
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleMakedata, setVehicleMakedata] = useState(null);
  const handleVehicleMakeItemSelect = async item => {
    if (VehicleModeldata != null) {
      setVehicleModeldata(null);
    }
    setoldmodel('');
    setoldvariantname('');

    if (VehicleVariantdata != null) {
      setVehicleVariantdata(null);
    }
    setsearchVehicleMakeQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleMakemodalPopup(false); // Close the modal
    setVehicleMakedata(item.value);
    handleVehicleDetailsChange('make', item.value);
    getVehicleVariantById(item.value);
    getmakeidlist(item.value);
    // fetchmodel(item)
    const helperarray = await getVariantByMakeID(item.key);
    const variantdataItems = helperarray.map(item => ({
      key: item.variantid,
      value: item.variantname,
    }));
    setisVehicleVariantdataitem(variantdataItems);
    let helpermodelarray = await getVehicleModelByVehTypeid(item.key);
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
      }}>
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const handleVehicleVariantItemSelect = item => {
    setsearchVehicleVariantQuery('');

    // setSelectedItem(item); // Store selected item if needed
    setisVehicleVariantmodalPopup(false); // Close the modal
    setVehicleVariantdata(item.value);
    storeVehicleVariant(item.value);
    setoldvariantname(item.value);
    setoldvariantid(item.key);
  };

  const [isVehicleModelmodalPopup, setisVehicleModelmodalPopup] =
    useState(false);
  const [searchVehicleModelQuery, setsearchVehicleModelQuery] = useState('');
  const [getmodelids, setgetmodelids] = useState('');
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
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleModeldata, setVehicleModeldata] = useState(null);
  const handleVehicleModelItemSelect = item => {
    setsearchVehicleModelQuery('');
    setoldmodel(item.value);
    setoldvariantname('');

    if (VehicleVariantdata != null) {
      setVehicleVariantdata(null);
    }
    fetchdata(item.key);

    // setSelectedItem(item); // Store selected item if needed
    setisVehicleModelmodalPopup(false); // Close the modal
    setVehicleModeldata(item.value);
    handleVehicleDetailsChange('model', item.value);
    getmodelidlist(item.value);
    setgetmodelids(item.key);
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
        handleVehicleDetailsChange('brand', item.value);
        getbrandlist(item.value);
        // getPincode(item.value)
      }}>
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [TyreBranddata, setTyreBranddata] = useState(null);
  const handleTyreBrandItemSelect = item => {
    setsearchTyreBrandQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setisTyreBrandmodalPopup(false); // Close the modal
    setTyreBranddata(item.value);
  };

  const [TyreSizedata, setTyreSizedata] = useState(null);

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
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [ProductNamedata, setProductNamedata] = useState(null);
  const handleProductNameItemSelect = item => {
    setsearchProductNameQuery('');
    if (TyreSizedata != null) {
      setTyreSizedata(null);
    }
    setoldtyreSize('');
    // setSelectedItem(item); // Store selected item if needed
    setisProductNamemodalPopup(false); // Close the modal
    setProductNamedata(item.value);
    fetchTyreSizeItems(item.key);
    handleVehicleDetailsChange('productName', item.value);
    getProductNameById(item.value);
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
        handleVehicleDetailsChange('tyreSize', item.value);
        // getPincode(item.value)
      }}>
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const handleTyreSizeItemSelect = item => {
    setsearchTyreSizeQuery('');
    setisTyreSizemodalPopup(false); // Close the modal
    setTyreSizedata(item.value);
    setoldtyreSize(item.value);
  };

  const [oldTyreBranddatas, setoldTyreBranddata] = useState(null);

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
        handleOldTyreDetailsChange('oldTyreCompany', item.value);
        // getPincode(item.value)
      }}>
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const [oldTyreCompanydata, setoldTyreCompanydata] = useState(null);
  const handleoldTyreCompanyItemSelect = item => {
    if (oldTyreBranddatas != null) {
      setoldTyreBranddata(null);
    }
    setoldoldTyreBrand('');
    setsearcholdTyreCompanyQuery('');

    setoldoldTyreCompany(item.value);
    // setSelectedItem(item); // Store selected item if needed
    setisoldTyreCompanymodalPopup(false); // Close the modal
    setoldTyreCompanydata(item.value);
    setoldoldTyreCompanyis(item.key);

    fetchOldTyreBrandNameItems(item.key);
  };

  const [isoldTyreBrandmodalPopup, setisoldTyreBrandmodalPopup] =
    useState(false);
  const [searcholdTyreBrandQuery, setsearcholdTyreBrandQuery] = useState('');

  const filteredoldTyreBrandData = oldtyrebrandnameItemsdata.filter(item => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase();

      // Convert searchQuery to string
      let searchString = searcholdTyreBrandQuery.toString().toLowerCase();

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  });
  const renderoldTyreBrandItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleoldTyreBrandItemSelect(item);
      }}>
      <Text style={{paddingTop: 5, paddingBottom: 5}}>{item.value}</Text>
    </Pressable>
  );
  const handleoldTyreBrandItemSelect = item => {
    if (oldTyreBranddatas != null) {
      setoldTyreBranddata(item.value);
    }
    setoldoldTyreBrand(item.value);
    setsearcholdTyreBrandQuery('');
    handleOldTyreDetailsChange('oldTyreBrand', item.value);

    // setSelectedItem(item); // Store selected item if needed
    setisoldTyreBrandmodalPopup(false); // Close the modal
  };
  const {width} = Dimensions.get('window');

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
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <KeyboardAvoidingView
              style={styles.centeredView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.modalView}>
                <ActivityIndicator size="large" color="black" />
              </View>
            </KeyboardAvoidingView>
          </Modal>
          {/*<Text>SQLite Database Example</Text>
     {isDatabaseInitialized && (
      <>
        <View style={styles.pickerContainer}>
          <SelectList
            data={items}
            setSelected={setSelectedItem}
            placeholder="Select an item"
            boxStyles={styles.picker}
          />
        </View>
        <Text>
          Selected Item: {selectedItem ? items.find(item => item.key === selectedItem)?.value : '-'}
        </Text>
        <Button title="Insert Sample Data" onPress={insertSampleData} />
      </>
    )} */}
          <View style={{alignItems: 'center'}}>
            <Text style={styles.headerText}>
              {languagedata.lblWarrantyRegistration}
            </Text>

            {/* Radio Buttons */}
            {/* <RadioButton.Group
                onValueChange={handleRadioButtonChange}
                value={registrationOption}>
                <RadioButton.Item
                  label={`${languagedata.VehicleRegistrationNoavailable}`}
                  value="Available"
                  color={RadioButtonColor}
                  style={styles.radioButton}
                  labelStyle={styles.radioLabel}
                />
                <RadioButton.Item
                  label={`${languagedata.VehicleRegistrationNonotavailable}`}
                  value="Not Available"
                  color={RadioButtonColor}
                  style={styles.radioButton}
                  labelStyle={styles.radioLabel}
                />
                <RadioButton.Item
                  label={`${languagedata.NewVehicle}`}
                  value="New Vehicle"
                  color={RadioButtonColor}
                  style={styles.radioButton}
                  labelStyle={styles.radioLabel}
                />
              </RadioButton.Group> */}
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
                      setoldregistrationnumber(value.toUpperCase())
                    }
                    value={oldregistrationnumber}
                    maxLength={10}
                  />
                </View>
              </View>

              {/* <TouchableOpacity
                style={styles.search_button}
                onPress={search}>
                <Text style={styles.buttonText}>{languagedata.btnSearch} </Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity
          style={styles.search_button}
          onPress={() => handleCameraOpen('tyre1Image')}>
          {/* <Text style={styles.buttonText}>Photo </Text>
          <Icon name="camera" size={15} color={'white'} />
        </TouchableOpacity> */}
              {isNumberplateDeleted === true ? (
                <Text>Numberplate image has been delted.</Text>
              ) : (
                <>
                  {oldnumberplateimage && (
                    <Image
                      source={{
                        uri: `file://${oldnumberplateimage}`,
                      }}
                      width={width - 40}
                      height={300}
                    />
                  )}
                </>
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
                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.CustomerName}
                      <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <TextInput
                      style={styles.input}
                      placeholder={`${languagedata.CustomerName}`}
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={setoldcustomername}
                      value={oldcustomername}
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
                      style={styles.input}
                      placeholder={`${languagedata.MobileNo}`}
                      maxLength={10}
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={setoldmobilenumber}
                      value={oldmobilenumber}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
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
                      onChangeText={setoldaddress}
                      value={oldaddress}
                    />
                  </View>
                </View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isStatemodalPopup}
                  onRequestClose={() => {
                    setisStatemodalPopup(false);
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
                          onPress={() => setisStatemodalPopup(false)} // Close modal directly
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={stateItems}
                  value={oldstatename}
                  placeholder={`${selectedItem.state}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  setSelected={(value) => {
                    handleCustomerDetailsChange('state', value)
                    getStateObjectByName(value)


                  }
                  }
                  save="value"
                /> */}
                      {Statedata === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisStatemodalPopup(true);
                          }}>
                          <Text>{oldstatename}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '1%',
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
                            setisStatemodalPopup(true);
                          }}>
                          <Text>{oldstatename}</Text>
                          <View
                            style={{
                              position: 'absolute',
                              right: '1%',
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
                  visible={isPopup}
                  onRequestClose={() => {
                    setIsPopup(false);
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
                          onPress={() => setIsPopup(false)} // Close modal directly
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
                          onPress={() => {
                            setIsPopup(true);
                          }}>
                          <Text>{oldpincode}</Text>
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
                          onPress={() => {
                            setIsPopup(true);
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
                        keyboardType="number-pad"
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
                          <Text>{oldveh_type_name}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={vehicleTypeItems}
                  setSelected={value => {
                    handleVehicleDetailsChange('make', value)
                    getVehicleMakeByVehiceTypeID(value)
                    getvehtyprelist(value)
                  }



                  }
                  value={oldveh_type_name}
                  placeholder={`${selectedItem.veh_type_name}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
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
                          <Text>{oldmake}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={makeINamestems}
                  setSelected={value => {
                    handleVehicleDetailsChange('make', value)
                    getVehicleVariantById(value)
                    getmakeidlist(value)
                  }

                  }
                  value={oldmake}
                  placeholder={`${selectedItem.make}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
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
                          <Text>{oldmodel}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={modelItems}
                  setSelected={value => {
                    handleVehicleDetailsChange('model', value)
                    getmodelidlist(value)
                  }


                  }
                  value={oldmodel}
                  placeholder={`${selectedItem.model}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
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
                          <Text>{oldvariantname}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={vehicleVariantItems}
                  setSelected={value => {
                    storeVehicleVariant(value)

                  }
                  }
                  value={oldvariantname}
                  placeholder={`${selectedItem.variantname}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
                    </View>
                  </View>
                </View>

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
                          {languagedata.BrandName}
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
                          <Text>{oldbrand}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={brandnameItems}
                  setSelected={value => {
                    handleVehicleDetailsChange('brand', value)
                    getbrandlist(value)

                  }

                  }
                  value={oldbrand}
                  placeholder={`${selectedItem.brand}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
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
                          <Text>{oldproductName}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  value={oldproductName}
                  data={productnameItems}
                  setSelected={value => {
                    handleVehicleDetailsChange('productName', value)
                    getProductNameById(value)
                  }

                  }
                  placeholder={`${selectedItem.productName}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
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
                          <Text>{oldtyreSize}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={tyresizeItems}
                  value={oldtyreSize}
                  setSelected={value => {
                    handleVehicleDetailsChange('tyreSize', value)
                    gettyresizes(value)
                  }
                  }
                  placeholder={`${selectedItem.tyreSize}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
                    </View>
                  </View>
                </View>

                {/* <RadioButton.Group
        onValueChange={(value) => handleVehicleDetailsChange('tyreQuantity', value)}
        value={vehicleDetails.tyreQuantity}
      >
        <RadioButton.Item label="1" value={1} style={styles.radioButton} color={RadioButtonColor} labelStyle={styles.radioLabel} />
        <RadioButton.Item label="2" value={2} style={styles.radioButton} color={RadioButtonColor} labelStyle={styles.radioLabel} />
      </RadioButton.Group> */}

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
                        value={oldtyreQuantity}
                        setSelected={value => {
                          handleVehicleDetailsChange('tyreQuantity', value);
                          setoldtyreQuantity(value);

                          if (value === '1' || value === 1) {
                            setTyre2Image(null);
                            setoldtyre2SerialNumber2(null);
                            setoldtyre2SerialNumber3(null);
                            setoldtyre2Image(null);
                          }
                        }}
                        placeholder={`${oldtyreQuantity}`}
                        // inputStyles={{color:'red'}}
                        boxStyles={{borderWidth: 0}}
                        arrowicon={
                          <Icon name="chevron-down" size={12} color={'black'} />
                        }
                        save="value"
                      />
                    </View>
                  </View>
                </View>

                {(oldtyreQuantity === 1 ||
                  vehicleDetails.tyreQuantity === '1') && (
                  <View>
                    <Text style={{color: 'black'}}>
                      {languagedata.Serial_1}
                    </Text>

                    <View style={styles.Serial_number_input_view}>
                      <TextInput
                        readOnly={true}
                        style={styles.Serial_number_input_small}
                        maxLength={1}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={
                          // handleVehicleDetailsChange('tyre1SerialNumber1', value)
                          setoldseries
                        }
                        value={oldseries}
                      />
                      <TextInput
                        keyboardType="number-pad"
                        style={styles.Serial_number_input}
                        placeholderTextColor={placeholderTextColor}
                        maxLength={5}
                        onChangeText={
                          // handleVehicleDetailsChange('tyre1SerialNumber2', value)
                          setoldtyre1SerialNumber2
                        }
                        value={oldtyre1SerialNumber2}
                      />
                      <TextInput
                        style={styles.Serial_number_input}
                        placeholderTextColor={placeholderTextColor}
                        maxLength={4}
                        keyboardType="number-pad"
                        onChangeText={
                          // handleVehicleDetailsChange('tyre1SerialNumber3', value)
                          setoldtyre1SerialNumber3
                        }
                        value={oldtyre1SerialNumber3}
                      />
                    </View>
                    {/* {tyre1Image && <Image source={{ uri: tyre1Image }} width={320} height={300} />} */}
                    {isTyre1ImageDeleted === true ? (
                      <Text>Tyre 1 image has been delted.</Text>
                    ) : (
                      <>
                        {oldtyre1Image && (
                          <Image
                            source={{
                              uri: `file://${oldtyre1Image}`,
                            }}
                            width={width - 40}
                            height={300}
                          />
                        )}
                      </>
                    )}

                    {/* {oldtyre1Image && (
                        <Image
                          source={{
                            uri:
                              oldtyre1Image,
                          }}
                          width={320}
                          height={300}
                        />
                      )} */}
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

                    {/* {isCameraOpen && (
            <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
              <View style={styles.cameraControls}>
                <Button title="Capture" onPress={() => handleCapture('tyre1Image')} />
                <Button title="Close" onPress={handleCameraClose} />
              </View>
            </Camera>
          )} */}
                    {/* {capturedImages.tyre1Image && (
            <Image source={{ uri: capturedImages.tyre1Image }} style={styles.capturedImage} />
          )} */}
                  </View>
                )}
                {(oldtyreQuantity === 2 ||
                  vehicleDetails.tyreQuantity === '2') && (
                  <View>
                    <Text style={{color: 'black'}}>
                      {languagedata.Serial_1}
                    </Text>

                    <View style={styles.Serial_number_input_view}>
                      <TextInput
                        readOnly={true}
                        style={styles.Serial_number_input_small}
                        maxLength={1}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={
                          // handleVehicleDetailsChange('tyre1SerialNumber1', value)
                          setoldseries
                        }
                        value={oldseries}
                      />
                      <TextInput
                        style={styles.Serial_number_input}
                        placeholderTextColor={placeholderTextColor}
                        maxLength={5}
                        keyboardType="number-pad"
                        onChangeText={
                          // handleVehicleDetailsChange('tyre1SerialNumber2', value)
                          setoldtyre1SerialNumber2
                        }
                        value={oldtyre1SerialNumber2}
                      />
                      <TextInput
                        style={styles.Serial_number_input}
                        maxLength={4}
                        keyboardType="number-pad"
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={
                          // handleVehicleDetailsChange('tyre1SerialNumber3', value)
                          setoldtyre1SerialNumber3
                        }
                        value={oldtyre1SerialNumber3}
                      />
                    </View>
                    {/* {tyre2Image && <Image source={{ uri: tyre2Image }} width={320} height={300} />} */}
                    {isTyre1ImageDeleted === true ? (
                      <Text>Tyre 1 image has been delted.</Text>
                    ) : (
                      <>
                        {oldtyre1Image && (
                          <Image
                            source={{
                              uri: `file://${oldtyre1Image}`,
                            }}
                            width={width - 40}
                            height={300}
                          />
                        )}
                      </>
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
                        maxLength={1}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={
                          // handleVehicleDetailsChange('tyre2SerialNumber1', value)
                          setoldseries
                        }
                        value={oldseries}
                      />
                      <TextInput
                        style={styles.Serial_number_input}
                        maxLength={5}
                        keyboardType="number-pad"
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={
                          // handleVehicleDetailsChange('tyre2SerialNumber2', value)
                          setoldtyre2SerialNumber2
                        }
                        value={oldtyre2SerialNumber2}
                      />
                      <TextInput
                        style={styles.Serial_number_input}
                        keyboardType="number-pad"
                        maxLength={4}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={
                          // handleVehicleDetailsChange('tyre2SerialNumber3', value)
                          setoldtyre2SerialNumber3
                        }
                        value={oldtyre2SerialNumber3}
                      />
                    </View>

                    {oldtyre2Image && (
                      <Image
                        source={{
                          uri: `file://${oldtyre2Image}`,
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

                    {/* {isCameraOpen && (
            <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
              <View style={styles.cameraControls}>
                <Button title="Capture" onPress={() => handleCapture('tyre2Image')} />
                <Button title="Close" onPress={handleCameraClose} />
              </View>
            </Camera>
          )}
          {capturedImages.tyre2Image && (
            <Image source={{ uri: capturedImages.tyre2Image }} style={styles.capturedImage} />
          )} */}
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
                      {languagedata.InvoiceNo}.
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    <TextInput
                      maxLength={10}
                      style={styles.input}
                      placeholder={`${languagedata.InvoiceNo}`}
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={
                        // handleOptionalDetailsChange('invoiceNumber', value)
                        setoldinvoiceNumber
                      }
                      value={oldinvoiceNumber}
                    />
                  </View>
                </View>
                {isInvoiceDeleted === true ? (
                  <Text>Invoice image has been delted.</Text>
                ) : (
                  <>
                    {oldinvoiceImage && (
                      <Image
                        source={{
                          uri: `file://${oldinvoiceImage}`,
                        }}
                        width={width - 40}
                        height={300}
                      />
                    )}
                  </>
                )}
                {/* {oldinvoiceImage && (
                    <Image
                      source={{
                        uri:
                          oldinvoiceImage,
                      }}
                      width={320}
                      height={300}
                    // style={{ width: 100, height: 100 }}
                    />
                  )} */}
                {/* {invoiceImageUri && <Image source={{ uri: invoiceImageUri }} width={320} height={300} />} */}
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
                {/* {isCameraOpen && (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <Button title="Capture" onPress={() => handleCapture('invoiceImage')} />
            <Button title="Close" onPress={handleCameraClose} />
          </View>
        </Camera>
      )}
      {capturedImages.invoiceImage && (
        <Image source={{ uri: capturedImages.invoiceImage }} style={styles.capturedImage} />
      )} */}

                <View style={styles.outer_view}>
                  <View style={styles.label_view}>
                    <Text style={styles.label_View_text_style}>
                      {languagedata.InvoiceDate}
                    </Text>
                  </View>
                  <View style={styles.text_view}>
                    {/* <TextInput
                style={styles.input}
                placeholder="Invoice Date"
                placeholderTextColor={placeholderTextColor}
                onChangeText={value =>
                  handleOptionalDetailsChange('invoiceDate', value)
                }
                value={optionalDetails.invoiceDate}
              /> */}
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
                        maximumDate={new Date()}
                      />
                    )}
                  </View>
                </View>
                {/* <TouchableOpacity
        style={styles.calenderbutton}
        onPress={() => setOpenFromDate(true)}>
        <Text style={styles.buttonText}>
          {fromDate.toLocaleDateString()}{' '}
          <Icon name="calendar" size={20} color="white" />
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openFromDate}
        date={fromDate} // Ensure fromDate is a Date object
        onConfirm={handleFromDateConfirm}
        onCancel={handleCancel}
        buttonColor="#e11e30"
        dividerColor="#e11e30"
      /> */}

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
                      onChangeText={
                        // handleOptionalDetailsChange('odoMeterReading', value)
                        setoldodoMeterReading
                      }
                      value={oldodoMeterReading}
                    />
                  </View>
                </View>

                {/* {ODOMeterImageUri && <Image source={{ uri: ODOMeterImageUri }} width={320} height={300} />} */}
                {isOdometerDeleted === true ? (
                  <Text>ODOMeter image has been delted.</Text>
                ) : (
                  <>
                    {oldodoMeterImage && (
                      <Image
                        source={{
                          uri: `file://${oldodoMeterImage}`,
                        }}
                        width={width - 40}
                        height={300}
                      />
                    )}
                  </>
                )}
                {/* {oldodoMeterImage && (
                    <Image
                      source={{
                        uri:
                          oldodoMeterImage,
                      }}
                      width={320}
                      height={300}
                    // style={{ width: 100, height: 100 }}
                    />
                  )} */}
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
                {/* {isCameraOpen && (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <Button title="Capture" onPress={() => handleCapture('odoMeterImage')} />
            <Button title="Close" onPress={handleCameraClose} />
          </View>
        </Camera>
      )}
      {capturedImages.odoMeterImage && (
        <Image source={{ uri: capturedImages.odoMeterImage }} style={styles.capturedImage} />
      )} */}
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
                          {oldTyreCompany === '' ? (
                            <Text>{languagedata.OldTyreCompany}</Text>
                          ) : (
                            <Text>{oldoldTyreCompany}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={oldtyrecompanyItems}
                  setSelected={value =>
                    handleOldTyreDetailsChange('oldTyreCompany', value)
                  }
                  placeholder={`${selectedItem.oldTyreCompany}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
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
                      {oldTyreBranddatas === null ? (
                        <Pressable
                          style={{flex: 1, flexDirection: 'row'}}
                          onPress={() => {
                            setisoldTyreBrandmodalPopup(true);
                          }}>
                          {oldoldTyreBrand === '' ? (
                            <Text>{languagedata.OldTyreBrandName}</Text>
                          ) : (
                            <Text>{oldoldTyreBrand}</Text>
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
                            setisoldTyreBrandmodalPopup(true);
                          }}>
                          <Text>{oldTyreBranddatas}</Text>
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
                      {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={oldtyrebrandnameItems}
                  setSelected={value =>
                    handleOldTyreDetailsChange('oldTyreBrand', value)
                  }
                  placeholder={`${selectedItem.oldTyreBrand}`}
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
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
                    <View style={styles.input2}>
                      {oldoldTyreSize === '' ? (
                        <TextInput
                          maxLength={10}
                          placeholder={`${languagedata.OldTyreSize}`}
                          placeholderTextColor={placeholderTextColor}
                          onChangeText={
                            // handleOldTyreDetailsChange('oldTyreSize', value)
                            setoldoldTyreSize
                          }
                          value={oldoldTyreSize}
                        />
                      ) : (
                        <TextInput
                          maxLength={10}
                          placeholder={`${oldoldTyreSize}`}
                          placeholderTextColor={placeholderTextColor}
                          onChangeText={
                            // handleOldTyreDetailsChange('oldTyreSize', value)
                            setoldoldTyreSize
                          }
                          value={oldoldTyreSize}
                        />
                      )}
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
            {/* <RadioButton.Group
                onValueChange={value => { setTermsAccepted(value); setoldtermsAccepted(value) }}
                value={termsAccepted}>
                <RadioButton.Android
                  label={`${languagedata.Terms_Conditions}`}
                  value={termsAccepted}
                  color={RadioButtonColor}
                  style={styles.radioButton}
                  labelStyle={styles.radioLabel}
                />
              </RadioButton.Group> */}
            <RadioButton.Group
              onValueChange={value => {
                setTermsAccepted(value);
                setoldtermsAccepted(value);
              }}
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
                    {`${languagedata.Terms_Conditions}`}
                  </Text>
                </TouchableOpacity>
                <RadioButton.Android
                  // label={languagedata.Terms_Conditions}
                  value={termsAccepted}
                  color={RadioButtonColor}
                  style={{
                    backgroundColor: '#D3D3D3',
                    justifyContent: 'flex-end',
                    alignContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                  labelStyle={styles.radioLabel}
                />
                {/* <TouchableOpacity onPress={() => Linking.openURL('https://warrantyuat.yokohama-oht.com/UploadFiles/Terms_Condition/YIN_Lifetime_Protection_Program_2023.pdf')} style={styles.termsButton}>
                  <Text style={styles.termsText}>
                    {languagedata.Terms_Conditions}
                  </Text>
                </TouchableOpacity> */}
                {/* </View> */}
              </View>
            </RadioButton.Group>
          </View>

          {/* Submit Button */}
          <View style={{flexDirection: 'row', marginRight: 3}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                marginLeft: 4,
                borderRadius: 5,
                width: '50%',
              }}>
              <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>
                {languagedata.lbl_Cancel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                marginLeft: 4,
                borderRadius: 5,
                width: '50%',
              }}
              onPress={handleSubmit}>
              <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>
                {languagedata.lbl_Update}
              </Text>
            </TouchableOpacity>
            {/* <Button title="Save (As a Draft)" onPress={handleSubmit} color="#e11e30" />
<Button title="Submit (Online Portal)" onPress={handleSubmit} color="#e11e30" /> */}
          </View>

          {/* <FlatList

    <View style={{flex:0.5, flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
      <TouchableOpacity style={styles.submit_button}>
        <Text style={styles.buttonText}>Save</Text>
        <Text style={styles.buttonText}>( As a Draft )</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submit_button}>
        <Text style={styles.buttonText}>Submit</Text>
        <Text style={styles.buttonText}>( Online Portal )</Text>
      </TouchableOpacity>
      {/* <Button title="Save as Draft" onPress={handleSubmit} color="#e11e30"/>
      <Button title="Submit" onPress={handleSubmit} color="#e11e30" /></View> */}

          {/* <View>
   <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id? ?? ''}

    /> */}
        </ScrollView>
      )}
    </>
  );
};

export default UpdateWarrantyRegistration;
