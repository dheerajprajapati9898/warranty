import React, { useState, useRef, useEffect } from 'react';
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
    PermissionsAndroid,
    Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import DatePicker from 'react-native-date-picker';
import { RadioButton, List } from 'react-native-paper';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SelectList } from 'react-native-dropdown-select-list';
import { setupDatabase } from '../../db/Registration/database';
import RNFetchBlob from 'rn-fetch-blob';
import {
    Item,
    insertItem,
    getAllItems,
    updateItem,
    deleteItem,
    updateSyncStatusWR,
} from '../../db/Registration/sqliteOperations';
import { useRoute } from '@react-navigation/native';
import { launchCamera } from 'react-native-image-picker';
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
import { useNavigation } from '@react-navigation/native';
import { getAllLoginItems } from '../../db/Login/Login';
import { AESExtensions } from '../AESExtensions';
import {
    setupMultiLanguageDatabase,
    getAllMultiLanguageItems,
    insertMultiLanguageItems,
    clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import RemoteUrls from '../apiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import GetLocation from 'react-native-get-location';

import NetInfo from '@react-native-community/netinfo';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import moment from 'moment';
const UpdateMissingImage = () => {
    const route = useRoute();
    const {
        warrantyid,
        mobileNumber,
        missing_image,
        segment1_11,
        segment1_22,
        segment1_33,
        segment2_11,
        segment2_22,
        segment2_33,
        registrationnumber,
    } = route.params;
    const { width } = Dimensions.get('window');

    const RadioButtonColor: string = '#e11e30';
    const placeholderTextColor: string = '#666';
    const iconColor = '#000';
    const [fromDate, setFromDate] = useState(new Date());
    const [openFromDate, setOpenFromDate] = useState(false);
    const [openToDate, setOpenToDate] = useState(false);
    const handleFromDateConfirm = selectedDate => {
        setOpenFromDate(false); // Close From Date picker
        setFromDate(selectedDate); // Update From Date state
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
        { key: 1, value: '1' },
        { key: 2, value: '2' },
    ];
    const [selectedOldTyreSize, setSelectedOldTyreSize] = React.useState('');
    const OldTyreSizedata = [
        { key: 1, value: '1' },
        { key: 2, value: '2' },
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
        // if (registrationOption === null) {
        //     Alert.alert("Validation Error", "Selection is required!")
        //     return
        // }
        setShowCustomerDetails(prev => !prev);
    };

    const toggleVehicleDetails = () => {
        // if (registrationOption === null) {
        //     Alert.alert("Validation Error", "Selection is required!")
        //     return
        // }
        setShowVehicleDetails(prev => !prev);
    };

    const toggleOptionalDetails = () => {
        // if (registrationOption === null) {
        //     Alert.alert("Validation Error", "Selection is required!")
        //     return
        // }
        setShowOptionlDetails(prev => !prev);
    };

    const toggleOldTyreDetails = () => {
        // if (registrationOption === null) {
        //     Alert.alert("Validation Error", "Selection is required!")
        //     return
        // }
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
    };

    const handleVehicleRegistrationChange = (field, value) => {
        setVehicleDetails(prevState => ({ ...prevState, [field]: value }));
    };

    const handleCustomerDetailsChange = (field, value) => {
        setCustomerDetails(prevState => ({ ...prevState, [field]: value }));
    };
    const [ismakeshow, setismakeshow] = useState(false);
    const [ismodelshow, setismodelshow] = useState(false);
    const [isvehiclevariantshow, setisvehiclevariantshow] = useState(false);
    const getVehicleMakeByVehiceTypeID = async value => {
        const helper = vehicleTypeItems.filter(element => element.value === value);

        setvehicletyedata(helper[0]);
        let helperarray = await getVehicleByVehTypeid(helper[0].key);
        const makedataItems = helperarray.map(item => ({
            key: item.MakeID,
            value: item.MakeName,
        }));
        console.log('makedataItems', makedataItems);

        setMakeNamesItems(makedataItems);

        let helpermodelarray = await getVehicleModelByVehTypeid(helper[0].key);
        const modeldataItems = helpermodelarray.map(item => ({
            key: item.makeName,
            value: item.modelName,
        }));
        setModelItems(modeldataItems);
        // setismakeshow(true)
        // setismodelshow(true)
    };
    const getVehicleVariantById = async value => {
        const helper = makeINamestems.filter(element => element.value === value);
        const helperarray = await getVariantByMakeID(helper[0].key);
        const variantdataItems = helperarray.map(item => ({
            key: item.variantid,
            value: item.variantname,
        }));
        setVehicleVariantItems(variantdataItems);
        // setisvehiclevariantshow(true)
    };
    const storeVehicleVariant = async value => {
        const helper = vehicleVariantItems.filter(
            element => element.value === value,
        );
        console.log('helper1', helper);

        setstateidvalue(helper[0]);
    };
    const handleVehicleDetailsChange = async (field, value) => {
        setVehicleDetails(prevState => ({ ...prevState, [field]: value }));

        // if(productnameItems[0])
        // console.log("productnameItems", productnameItems);
    };

    const handleSelectedNumberOfTyre = selectedValue => {
        handleVehicleDetailsChange('tyreQuantity', selectedValue); // Update tyreQuantity in vehicleDetails
    };

    const handleOptionalDetailsChange = (field, value) => {
        setOptionalDetails(prevState => ({ ...prevState, [field]: value }));
    };

    const handleOldTyreDetailsChange = (field, value) => {
        setOldTyreDetails(prevState => ({ ...prevState, [field]: value }));
    };

    const handleCameraOpen = (p0: string) => {
        setIsCameraOpen(true);
    };

    const handleCameraClose = () => {
        setIsCameraOpen(false);
    };

    const handleCapture = async imageKey => {
        // if (cameraRef.current) {
        //   const capturedImage = await cameraRef.current.takePictureAsync();
        //   setCapturedImages((prevState) => ({ ...prevState, [imageKey]: capturedImage.uri }));
        //   handleCameraClose();
        // }
    };

    // const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);
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
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
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
            // console.log("state", selectedStates);

            // fetchPinCodeItems();
            // fetchTractorMakeItems();
            // fetchTractorModelItems();
            // fetchBrandNasadmeItems();
            // fetchProductNameItems();
            // fetchTyreSizeItems();
            // fetchOldTyreBrandNameItems();
            // fetchOldTyreCompanyItems();
            setRefreshing(false);
        }, 1000); // Simulated delay
    };
    const [isloading, setisloading] = useState(false);
    const [missingimage, setmissingimage] = useState([]);
    const [singlemissingimage, setsinglemissingimage] = useState([]);
    const [missingphoto, setmissingphoto] = useState();
    const [getdataloadijng, setgetdataloadijng] = useState(false);
    var invoicedatefronmtheapi = '';
    const [presentregistrationnoimage, setpresentregistrationnoimage] = useState(null)
    const [presentserial1noimage, setpresentserial1noimage] = useState(null)
    const [presentserial2noimage, setprserial2ationnoimage] = useState(null)
    const [presentinvoicenoimage, setpresentinvoicenoimage] = useState(null)
    const [presentodometernoimage, setpresentodometernoimage] = useState(null)
    const [presentimagedata, setpresentimagedata] = useState(null)

    const fetchingTheMissigImage = async () => {
        // const savedUserId = await AsyncStorage.getItem('userid');
        const userData = await getAllLoginItems();
        const specificData = {
            Username: userData.Username,
        };
        const jsonString = JSON.stringify(specificData);
        // const dataval = JSON.stringify(jsonString)
        // Output the JSON string
        console.log('jsonString', jsonString); // Output: "{\"Username\":\"dealer\"}"
        // console.log("deghiudsyhrewiu", userData.Username);

        // return
        // setisloading(true);
        try {
            setisloading(true);
            const encryptedlogindata = AESExtensions.encryptString(specificData);
            console.log('encrypted', encryptedlogindata);
            const payload = {
                requestId: '',
                isEncrypt: '',
                requestData: encryptedlogindata,
                sessionExpiryTime: '',
                userId: '',
            };
            const response = await axios.post(
                RemoteUrls.postWarrantyImageMissingListUrl,
                payload,
            );
            // console.log("againparsedata", response.data.responseData);
            const plaintextoflogindata = AESExtensions.decryptString(
                response.data.responseData,
            );
            console.log('Asdasdasddafsdfsdfsdf', plaintextoflogindata);
            // console.log("fdgerdrgerg");
            const dataada = missing_image.split(',');
            console.log('yes', dataada[0]);
            setmissingphoto(dataada);
            dataada.map(ele => {
                if (ele === 'RegistrationNo') {
                    setRegistrationNo('RegistrationNo');
                }
                if (ele === 'RegistrationNo') {
                    setOdometer('ODOMeter');
                }
                if (ele === 'RegistrationNo') {
                    setInvoiceNumber('InvoiceNumber');
                }
                if (ele === 'RegistrationNo') {
                    setSerial1('Serial_1');
                }
                if (ele === 'RegistrationNo') {
                    setSerial2('Serial_2');
                }
            });
            setgetdataloadijng(true);
            plaintextoflogindata.forEach(element => {
                if (element.WarrantyID === warrantyid) {
                    setsinglemissingimage(element);
                    console.log('element', element.presentImageDeatails);
                    setpresentimagedata(element.presentImageDeatails)
                    setpresentimagedata
                    console.log("presentimagedata.ImageType", presentimagedata);
                    if (presentimagedata === null) {
                        return
                    }
                    else {
                        presentimagedata.map(ele => {
                            if (ele.ImageType === 'RegistrationNo') {
                                setpresentregistrationnoimage(ele.ImageURL)
                            }
                            if (ele.ImageType === 'Serial_1') {
                                setpresentserial1noimage(ele.ImageURL)

                            }
                            if (ele.ImageType === 'Serial_2') {
                                setprserial2ationnoimage(ele.ImageURL)

                            }
                            if (ele.ImageType === 'InvoiceNumber') {





                                setpresentinvoicenoimage(ele.ImageURL)

                            }

                            if (ele.ImageType === 'ODOMeter') {
                                setpresentodometernoimage(ele.ImageURL)

                            }
                        })
                    }




                    invoicedatefronmtheapi = moment(element.InvoiceDate).format(
                        'DD/MM/YYYY',
                    );
                    console.log('invoicedatefronmtheapi', invoicedatefronmtheapi);
                }
            });
            setgetdataloadijng(false);

            // return
            // const responseData = response.data.responseData; // Assuming response.data.responseData is an array
            // const pasrsevalue = JSON.parse(responseData)
            // console.log("againparsedata", pasrsevalue.MobileNo);
            // Process responseData here
            // pasrsevalue.forEach(item => {
            //   console.log("Mobile No:", item.MobileNo);
            //   // Perform other operations with item properties as needed
            // });
            setmissingimage(plaintextoflogindata);
            // Ensure response data is an array (or handle accordingly if it's not)
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle fetch error (e.g., show error message)
        } finally {
            setisloading(false);
        }
    };
    // if (isloading) {
    //     <View>
    //         <ActivityIndicator color={'black'} />
    //     </View>
    //     return
    // }
    const [languagedata, setlanguagedata] = useState(null);
    const fetchingthelanguagedata = async () => {
        console.log('setting the value');

        try {
            const dsasdas = await getAllMultiLanguageItems();
            const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
            const hheo = JSON.parse(removedTing);
            console.log('lastasdasdasdasdas', hheo);

            setlanguagedata(hheo);
            console.log('setting the value');
        } catch (error) {
            console.log(error);
        }
    };
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [odometer, setOdometer] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [serial1, setSerial1] = useState('');
    const [serial2, setSerial2] = useState('');
    const [serial4, setSerial4] = useState('');
    const [isConnected, setIsConnected] = useState(null);

    useEffect(() => {
        if (Platform.OS === 'android') {
            const enableResult = promptForEnableLocationIfNeeded();
            console.log('enableResult', enableResult);
        }

        console.log('asddasdewrfgsdvsd', warrantyid);

        setupMultiLanguageDatabase();
        fetchingthelanguagedata();
        fetchingTheMissigImage();
        // console.log("customerDetails.state", missingimage);

        // setShowCustomerDetails(false)
        // setShowOldTyreDetails(false)
        // setShowOptionlDetails(false)
        // setShowVehicleDetails(false)
        // toggleCustomerDetails(
        // vehicleDetails.tyreQuantity = "2"
        // setstyrequantitySelectedy(vehicleDetails.tyreQuantity)
        // toggleOldTyreDetails()
        // toggleOptionalDetails()
        // toggleVehicleDetails()
        const formatDateForORM = date => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Format fromDate and toDate as YYYY-MM-DD for ORM usage
        const registrationsate = formatDateForORM(new Date());
        setRegistrationDate(registrationsate);
        setupStateDatabase();

        fetchStateItems();

        setupPinCodeDatabase();
        fetchPinCodeItems();

        setupTractorMakeDatabase();
        setupVehicleVariantDatabase();
        // fetchTractorMakeItems();

        setupTractorModelDatabase();
        // fetchTractorModelItems();

        setupBrandNasadmeDatabase();
        fetchBrandNasadmeItems();

        setupProductNameDatabase();
        fetchProductNameItems();

        setupTyreSizeDatabase();
        fetchTyreSizeItems();

        setupOldTyreBrandNameDatabase();
        fetchOldTyreBrandNameItems();
        // // })
        // // .catch(error => {
        // //   console.error('Database initialization error:', error);
        // // })

        setupOldTyreCompanyDatabase();

        fetchOldTyreCompanyItems();
        setupVehicleTypeDatabase();

        fetchVehicleTypeItems();
        setupVehicleVariantDatabase();

        // fetchVehicleVariantItems()
        // })
        // .catch(error => {
        //   console.error('Database initialization error:', error);
        // })
        setStateObjectofkey(null);
        // console.log("pincodelist", pincodelist);

        const initializeDatabase = async () => {
            const database = await setupDatabase();
            setDb(database);
            fetchItems(database);
            // setVehicleDetails(prevDetails => ({
            //   ...prevDetails,
            //   tyre1Image: imageUri
            // }));
        };
        initializeDatabase();
        const expectedLabels = {
            invoiceNumber: 'InvoiceNumber',
            odometer: 'ODOMeter',
            registrationNo: 'RegistrationNo',
            serial1: 'Serial_1',
            serial2: 'Serial_2',
            serial4: 'Serial_4',
        };

        // Convert shuffled string to array and trim spaces
        const values = missing_image.split(',').map(item => item.trim());

        // Initialize variables
        let tempInvoiceNumber = '';
        let tempOdometer = '';
        let tempRegistrationNo = '';
        let tempSerial1 = '';
        let tempSerial2 = '';
        let tempSerial4 = '';

        // Assign values based on the expected labels
        values.forEach(value => {
            if (value === expectedLabels.invoiceNumber) {
                tempInvoiceNumber = value;
            } else if (value === expectedLabels.odometer) {
                tempOdometer = value;
            } else if (value === expectedLabels.registrationNo) {
                tempRegistrationNo = value;
            } else if (value === expectedLabels.serial1) {
                tempSerial1 = value;
            } else if (value === expectedLabels.serial2) {
                tempSerial2 = value;
            } else if (value === expectedLabels.serial4) {
                tempSerial4 = value;
            }
        });
        console.log('registrationnumber', registrationnumber);

        // Update state with parsed values
        setInvoiceNumber(tempInvoiceNumber);
        setOdometer(tempOdometer);
        setRegistrationNo(tempRegistrationNo);
        setSerial1(tempSerial1);
        setSerial2(tempSerial2);
        setSerial4(tempSerial4);
        // console.log("invoiceNumber", invoiceNumber);

        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection type:', state.type);
            console.log('Is connected?', state.isConnected);
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
    var photocategorylist = [];

    const fetchphotochategorylist = async () => {
        console.log('check once');
        photocategorylist = [];

        try {
            const response = await axios.get(RemoteUrls.getphotoCategories_ListUrl);
            const data = response.data.responseData;
            const parsevalue = JSON.parse(data);

            photocategorylist = parsevalue;

            console.log('photocategorylist updated:', photocategorylist);
        } catch (error) {
            console.error('Error fetching photo category list:', error);
        }
    };
    const [stateObjectofkey, setStateObjectofkey] = useState();
    const getStateObjectByName = async stateName => {
        const getstateItems = await getAllStateItems();
        const getstate = getstateItems.filter(
            state => state.statename === stateName,
        );

        setStateObjectofkey(getstate[0].stateid);
        // console.log(getstate[0].stateid);
    };
    const fetchStateItems = async () => {
        try {
            // console.log("check")
            const itemsFromDb = await getAllStateItems();
            // console.log("check state", itemsFromDb.length)
            const formattedItems = itemsFromDb.map(item => ({
                key: item.stateid,
                value: item.statename,
            }));
            // console.log("check state", formattedItems)

            setStateItems(formattedItems);

            // console.log("check state", stateItems)
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    const [pincodelist, setPincodelist] = useState(null);

    const getPincode = async pincodevalue => {
        const getpincodeItems = await getAllPinCodeItems();
        const getpincode = getpincodeItems.filter(
            pincode => pincode.areapincode === pincodevalue,
        );
        setPincodelist(getpincode[0]);
        // console.log(getpincode[0]);

        // try {
        //   const itemsFromDb = await getAllPinCodeItems();
        //   const pincodeItems = itemsFromDb.map(item => pincodelist.push(item.areapincode));
        //   setPinCodeItems(pincodelist);

        // } catch (error) {
        //   console.error('Fetch error:', error);
        // }
    };
    const [ispincodeloading, setispincodeloading] = useState(false);
    const [pincodedata, setpincodedata] = useState([]);
    const fetchPinCodeItems = async () => {
        try {
            const itemsFromDb = await getAllPinCodeItems();
            const pincodeItems = itemsFromDb.map(item => ({
                key: item.pincodeid,
                value: item.areapincode,
            }));

            setpincodedata(pincodeItems);
            setPinCodeItems(pincodeItems);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    // const [isPopup, setIsPopup] = useState(false);
    // const [searchQuery, setSearchQuery] = useState("");
    // const filteredData = pincodeItems.filter((item) =>
    //   item.areapincode.includes(searchQuery)
    // );

    // const renderpincodeItem = ({ item }) => (
    //   <Pressable >
    //     <Text>{item.value}</Text>
    //   </Pressable>
    // );

    // const handleItemSelect = (item) => {onPress={() => handleItemSelect(item)}
    //   setSelectedItem(item); // Store selected item if needed
    //   setIsPopup(false); // Close the modal
    //   console.log(item); // Log the selected item
    // };
    const [getmakeid, setgetmakeid] = useState(null);
    const getmakeidlist = async makeName => {
        // const getstateItems = await getAllStateItems()
        const makeid = makeItems.filter(make => make.value === makeName);
        setgetmakeid(makeid[0].key);
        console.log('makeasdasdasd', makeid[0].key);

        // console.log(getstate[0].stateid);
    };
    const fetchTractorMakeItems = async () => {
        try {
            const TractorMake = await getAllTractorMakeItems();
            // console.log("TractorMake", TractorMake);

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
        console.log(modelid[0].key);

        // console.log(getstate[0].stateid);
    };

    // const fetchTractorModelItems = async () => {
    //   try {
    //     const itemsFromDb = await getAllTractorModelItems();
    //     const modelItems = itemsFromDb.map(item => ({
    //       key: item.id,
    //       value: item.modelName
    //     }));
    //     setModelItems(modelItems);
    //   } catch (error) {
    //     console.error('Fetch error:', error);
    //   }
    // };
    const fetchBrandNasadmeItems = async () => {
        try {
            const itemsFromDb = await getAllBrandNasadmeItems();
            const brandnameItems = itemsFromDb.map(item => ({
                key: item.id,
                value: item.brandname,
            }));
            setBrandNameItems(brandnameItems);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    const getProductNameById = async value => {
        const helper = productnameItems.filter(element => element.value === value);

        const helperarray = await getProductNameByProductId(helper[0].key);
        console.log('helperarray:', helperarray);
        setserialkey(helperarray[0].series);
        console.log('helperarrayasdasdasd:', helper);

        setProductName(helperarray[0].productName);
    };
    const fetchProductNameItems = async () => {
        try {
            const itemsFromDb = await getAllProductNameItems();
            const productnameItems = itemsFromDb.map(item => ({
                key: item.id,
                value: item.productName,
            }));
            setProductNameItems(productnameItems);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    const [brandidget, setbrandidget] = useState();
    const getbrandlist = async brand => {
        // const getstateItems = await getAllStateItems()
        const makeid = await getbrandids(brand);
        console.log('makeasdasdasd', makeid[0]);
        // console.log(getstate[0].stateid);
        setbrandidget(makeid[0].brandid);
    };

    const fetchTyreSizeItems = async () => {
        try {
            const itemsFromDb = await getAllTyreSizeItems();
            const tyresizeItems = itemsFromDb.map(item => ({
                key: item.id,
                value: item.sizeName,
            }));
            setTyreSizeItems(tyresizeItems);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const fetchOldTyreBrandNameItems = async () => {
        try {
            const itemsFromDb = await getAllOldTyreBrandNameItems();
            const oldtyrebrandnameItems = itemsFromDb.map(item => ({
                key: item.id,
                value: item.brandpattern,
            }));
            setOldTyreBrandNameItems(oldtyrebrandnameItems);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const fetchOldTyreCompanyItems = async () => {
        try {
            const itemsFromDb = await getAllOldTyreCompanyItems();
            const oldtyrecompanyItems = itemsFromDb.map(item => ({
                key: item.id,
                value: item.tyre_company_name,
            }));
            setOldTyreCompanyItems(oldtyrecompanyItems);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    const fetchVehicleTypeItems = async () => {
        try {
            const itemsFromDb = await getAllVehicleTypeItems();
            const VehicleTypeItems = itemsFromDb.map(item => ({
                key: item.Veh_Type_ID,
                value: item.Veh_Type_Name,
            }));
            setVehicleTypeItems(VehicleTypeItems);
            console.log('itemsFromDb', itemsFromDb);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    // const fetchVehicleVariantItems = async () => {
    //   try {
    //     const itemsFromDb = await getAllVehicleVariantItems();
    //     const VehicleVariantItems = itemsFromDb.map(item => ({
    //       key: item.variantid,
    //       value: item.variantname
    //     }));
    //     setVehicleVariantItems(VehicleVariantItems);
    //     // console.log("itemsFromDb", VehicleVariantItems);

    //   } catch (error) {
    //     console.error('Fetch error:', error);
    //   }
    // };
    const [items, setItems] = useState(null);
    const fetchItems = async (database: SQLiteDatabase) => {
        try {
            const item = await getAllItems(database);
            setItems(item);
            console.log(items);
        } catch (error) {
            console.error(error);
        }
    };
    //display the saved data (offline)
    // if you want to display the data then enable this code {in JSX you find the flatlist also }
    const renderItem = ({ item }: { item: Item }) => (
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
    const [tyre1Images, setTyre1Images] = useState(null);
    const [tyre2Image, setTyre2Image] = useState(null);
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
                    console.log('Permission is already granted');
                    return 'granted'; // Permission is already granted
                }

                // Request permission
                const newStatus = await request(permission);
                console.log('Permission status after request:', newStatus);

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
                return 'Error'; // Handle error
            }
        }

        return 'Error'; // Handle case where permission is not set
    };
    const numberplateimage = async () => {
        // const permission = await check(PERMISSIONS.ANDROID.CAMERA);

        // if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
        //   const result = await request(PERMISSIONS.ANDROID.CAMERA);
        //   if (result !== RESULTS.GRANTED) {
        //     console.log('Camera permission denied');
        //     return;
        //   }
        // }
        // const options = {
        //   mediaType: 'photo',
        //   cameraType: 'back',
        // };
        // launchCamera(options, response => {
        //   if (response.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (response.error) {
        //     console.log('ImagePicker Error: ', response.error);
        //   } else {
        //     console.log('Response:', response);
        //     if (response.assets && response.assets.length > 0) {
        //       console.log('Image URI:', response.assets[0].uri);
        //       // setnumberplate(response.assets[0].uri);
        //       try {
        //         const fileName = `image_${Date.now()}.jpg`;
        //         const folderPath = RNFS.PicturesDirectoryPath;// Public Pictures directory
        //         // const destinationPath = `${RNFS.DocumentDirectoryPath}/numberplate.jpg`;
        //         const newPath = `${folderPath}/${fileName}`;

        //         console.log("Source URI:", imageUri);
        //         console.log("New Path:", newPath);

        //         // Copy the image to the public directory
        //         RNFS.copyFile(response.assets[0].uri, newPath);

        //         // Verify file creation
        //         // setnumberplate(newPath)
        //         // return
        //         setnumberplate(newPath)

        //         const fileExists = RNFS.exists(newPath);
        //         console.log("fileExists", fileExists);

        //         if (fileExists) {
        //           console.log("File successfully copied to:", newPath);
        //         } else {
        //           console.error("File does not exist after copy operation.");
        //         }
        //         // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
        //         // if (vehicleDetails.tyreQuantity === 1) {
        //         // }

        //         //    else if (vehicleDetails.tyreQuantity === 2) {
        //         //      setVehicleDetails((prevDetails) => ({
        //         //        ...prevDetails,
        //         //        tyre2Image: response.assets[0].uri,
        //         //      }));
        //         //    }
        //         // } else {
        //         //   console.log('No image assets found');

        //       } catch (error) {
        //         console.error('File save error:', error);
        //         Alert.alert(`Error`, 'Failed to save image');
        //       }
        //     }
        //   }
        // });
        console.log('Opening camera');
        const permissionStatus = await requestPermission();

        if (permissionStatus === 'granted') {
            try {
                // Open the camera and get the image
                const image = await ImagePicker.openCamera({
                    width: 400,
                    height: 400,
                    cropping: false,
                    mediaType: 'photo',
                    saveToPhotos: false,
                    compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
                });

                console.log('Image details:', image);

                // Define the new file path
                const fileName = `image_${Date.now()}.jpg`;
                const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
                const newPath = `${folderPath}/${fileName}`;

                console.log('New Path:', newPath);

                // Copy the image to the public directory
                await RNFS.copyFile(image.path, newPath);

                // Verify file creation
                const fileExists = await RNFS.exists(newPath);
                console.log('fileExists:', fileExists);

                if (fileExists) {
                    console.log('File successfully copied to:', newPath);
                    setnumberplate(newPath); // Update the state with the new path
                } else {
                    console.error('File does not exist after copy operation.');
                }
            } catch (error) {
                console.error('Error during image processing:', error);
                Alert.alert('Error', 'Failed to process image');
            }
        }
    };
    const invoicePickCamera = async () => {
        // const permission = await check(PERMISSIONS.ANDROID.CAMERA);

        // if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
        //   const result = await request(PERMISSIONS.ANDROID.CAMERA);
        //   if (result !== RESULTS.GRANTED) {
        //     console.log('Camera permission denied');
        //     return;
        //   }
        // }
        // const options = {
        //   mediaType: 'photo',
        //   cameraType: 'back',
        // };
        // launchCamera(options, response => {
        //   if (response.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (response.error) {
        //     console.log('ImagePicker Error: ', response.error);
        //   } else {
        //     console.log('Response:', response);
        //     if (response.assets && response.assets.length > 0) {
        //       console.log('Image URI:', response.assets[0].uri);
        //       // setInvoiceImageUri(response.assets[0].uri);
        //       // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
        //       // if (vehicleDetails.tyreQuantity === 1) {
        //       try {
        //         const fileName = `image_${Date.now()}.jpg`;
        //         const folderPath = RNFS.PicturesDirectoryPath; // Public Pictures directory
        //         const newPath = `${folderPath}/${fileName}`;

        //         console.log("Source URI:", imageUri);
        //         console.log("New Path:", newPath);

        //         // Copy the image to the public directory
        //         RNFS.copyFile(response.assets[0].uri, newPath);

        //         // Verify file creation
        //         setInvoiceImageUri(newPath)
        // setOptionalDetails(prevDetails => ({
        //   ...prevDetails,
        //   invoiceImage: newPath,
        // }));
        //         const fileExists = RNFS.exists(newPath);
        //         if (fileExists) {
        //           console.log("File successfully copied to:", newPath);
        //         } else {
        //           console.error("File does not exist after copy operation.");
        //         }
        //         // Update the state with the permanent file path
        //       } catch (error) {
        //         console.error('File save error:', error);
        //       }

        //       // console.log(invoiceImageUri)
        //       // }
        //       //    else if (vehicleDetails.tyreQuantity === 2) {
        //       //      setVehicleDetails((prevDetails) => ({
        //       //        ...prevDetails,
        //       //        tyre2Image: response.assets[0].uri,
        //       //      }));
        //       //    }
        //       // }
        //       //  else {
        //       // console.log('No image assets found');
        //     }
        //   }
        // });
        console.log('Opening camera');
        const permissionStatus = await requestPermission();

        if (permissionStatus === 'granted') {
            try {
                // Open the camera and get the image
                const image = await ImagePicker.openCamera({
                    width: 400,
                    height: 400,
                    cropping: false,
                    mediaType: 'photo',
                    saveToPhotos: false,
                    compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
                });

                console.log('Image details:', image);

                // Define the new file path
                const fileName = `image_${Date.now()}.jpg`;
                const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
                const newPath = `${folderPath}/${fileName}`;

                console.log('New Path:', newPath);

                // Copy the image to the public directory
                await RNFS.copyFile(image.path, newPath);

                // Verify file creation
                const fileExists = await RNFS.exists(newPath);
                console.log('fileExists:', fileExists);

                if (fileExists) {
                    console.log('File successfully copied to:', newPath);
                    setInvoiceImageUri(newPath);
                    setOptionalDetails(prevDetails => ({
                        ...prevDetails,
                        invoiceImage: newPath,
                    })); // Update the state with the new path
                } else {
                    console.error('File does not exist after copy operation.');
                }
            } catch (error) {
                console.error('Error during image processing:', error);
                Alert.alert('Error', 'Failed to process image');
            }
        }
    };
    const ODOMeterPickCamera = async () => {
        // const permission = await check(PERMISSIONS.ANDROID.CAMERA);

        // if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
        //   const result = await request(PERMISSIONS.ANDROID.CAMERA);
        //   if (result !== RESULTS.GRANTED) {
        //     console.log('Camera permission denied');
        //     return;
        //   }
        // }
        // const options = {
        //   mediaType: 'photo',
        //   cameraType: 'back',
        // };
        // launchCamera(options, response => {
        //   if (response.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (response.error) {
        //     console.log('ImagePicker Error: ', response.error);
        //   } else {
        //     console.log('Response:', response);
        //     if (response.assets && response.assets.length > 0) {
        //       console.log('Image URI:', response.assets[0].uri);
        //       // setODOMeterImageUri(response.assets[0].uri);
        //       // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
        //       // if (vehicleDetails.tyreQuantity === 1) {
        //       try {
        //         const fileName = `image_${Date.now()}.jpg`;
        //         const folderPath = RNFS.PicturesDirectoryPath; // Public Pictures directory
        //         const newPath = `${folderPath}/${fileName}`;

        //         console.log("Source URI:", imageUri);
        //         console.log("New Path:", newPath);

        //         // Copy the image to the public directory
        //         RNFS.copyFile(response.assets[0].uri, newPath);

        //         // Verify file creation
        //         setODOMeterImageUri(newPath)

        //         const fileExists = RNFS.exists(newPath);
        //         setOptionalDetails(prevDetails => ({
        //           ...prevDetails,
        //           odoMeterImage: newPath,
        //         }));
        //         console.log("fileExists", fileExists);

        //         if (fileExists) {
        //           console.log("File successfully copied to:", newPath);
        //         } else {
        //           console.error("File does not exist after copy operation.");
        //         }
        //         // Update the state with the permanent file path
        //       } catch (error) {
        //         console.error('File save error:', error);
        //       }

        //       // }

        //       //    else if (vehicleDetails.tyreQuantity === 2) {
        //       //      setVehicleDetails((prevDetails) => ({
        //       //        ...prevDetails,
        //       //        tyre2Image: response.assets[0].uri,
        //       //      }));
        //       //    }
        //       // } else {
        //       //   console.log('No image assets found');
        //       // }
        //     }
        //   }
        // });
        console.log('Opening camera');
        const permissionStatus = await requestPermission();

        if (permissionStatus === 'granted') {
            try {
                // Open the camera and get the image
                const image = await ImagePicker.openCamera({
                    width: 400,
                    height: 400,
                    cropping: false,
                    mediaType: 'photo',
                    saveToPhotos: false,
                    compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
                });

                console.log('Image details:', image);

                // Define the new file path
                const fileName = `image_${Date.now()}.jpg`;
                const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
                const newPath = `${folderPath}/${fileName}`;

                console.log('New Path:', newPath);

                // Copy the image to the public directory
                await RNFS.copyFile(image.path, newPath);

                // Verify file creation
                const fileExists = await RNFS.exists(newPath);
                console.log('fileExists:', fileExists);

                if (fileExists) {
                    console.log('File successfully copied to:', newPath);
                    setODOMeterImageUri(newPath);

                    setOptionalDetails(prevDetails => ({
                        ...prevDetails,
                        odoMeterImage: newPath,
                    })); // Update the state with the new path
                } else {
                    console.error('File does not exist after copy operation.');
                }
            } catch (error) {
                console.error('Error during image processing:', error);
                Alert.alert('Error', 'Failed to process image');
            }
        }
    };
    const tyre1ImagePickCamera = async () => {
        // const permission = await check(PERMISSIONS.ANDROID.CAMERA);

        // if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
        //   const result = await request(PERMISSIONS.ANDROID.CAMERA);
        //   if (result !== RESULTS.GRANTED) {
        //     console.log('Camera permission denied');
        //     return;
        //   }
        // }
        // const options = {
        //   mediaType: 'photo',
        //   cameraType: 'back',
        // };
        // launchCamera(options, response => {
        //   if (response.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (response.error) {
        //     console.log('ImagePicker Error: ', response.error);
        //   } else {
        //     console.log('Response:', response);
        //     if (response.assets && response.assets.length > 0) {
        //       console.log('Image URI:', response.assets[0].uri);
        //       // setTyre1Image(response.assets[0].uri);
        //       // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
        //       // if (vehicleDetails.tyreQuantity === 1) {
        //       try {
        //         const fileName = `image_${Date.now()}.jpg`;
        //         const folderPath = RNFS.PicturesDirectoryPath; // Public Pictures directory
        //         const newPath = `${folderPath}/${fileName}`;

        //         console.log("Source URI:", imageUri);
        //         console.log("New Path:", newPath);

        //         // Copy the image to the public directory
        //         RNFS.copyFile(response.assets[0].uri, newPath);

        //         // Verify file creation
        //         setTyre1Image(newPath)
        //         setVehicleDetails(prevDetails => ({
        //           ...prevDetails,
        //           tyre1Image: newPath,
        //         }));
        //         const fileExists = RNFS.exists(newPath);
        //         console.log("fileExists", fileExists);

        //         if (fileExists) {
        //           console.log("File successfully copied to:", newPath);
        //         } else {
        //           console.error("File does not exist after copy operation.");
        //         }
        //         // Update the state with the permanent file path
        //       } catch (error) {
        //         console.error('File save error:', error);
        //       }

        //       // }

        //       //    else if (vehicleDetails.tyreQuantity === 2) {
        //       //      setVehicleDetails((prevDetails) => ({
        //       //        ...prevDetails,
        //       //        tyre2Image: response.assets[0].uri,
        //       //      }));
        //       //    }
        //       // } else {
        //       //   console.log('No image assets found');
        //       // }
        //     }
        //   }
        // });
        console.log('Opening camera');
        const permissionStatus = await requestPermission();

        if (permissionStatus === 'granted') {
            try {
                // Open the camera and get the image
                const image = await ImagePicker.openCamera({
                    width: 400,
                    height: 400,
                    cropping: false,
                    mediaType: 'photo',
                    saveToPhotos: false,
                    compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
                });

                console.log('Image details:', image);

                // Define the new file path
                const fileName = `image_${Date.now()}.jpg`;
                const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
                const newPath = `${folderPath}/${fileName}`;

                console.log('New Path:', newPath);

                // Copy the image to the public directory
                await RNFS.copyFile(image.path, newPath);

                // Verify file creation
                const fileExists = await RNFS.exists(newPath);
                console.log('fileExists:', fileExists);

                if (fileExists) {
                    console.log('File successfully copied to:', newPath);
                    setTyre1Images(newPath);
                    setVehicleDetails(prevDetails => ({
                        ...prevDetails,
                        tyre1Image: newPath,
                    })); // Update the state with the new path
                } else {
                    console.error('File does not exist after copy operation.');
                }
            } catch (error) {
                console.error('Error during image processing:', error);
                Alert.alert('Error', 'Failed to process image');
            }
        }
    };
    const tyre2ImagePickCamera = async () => {
        // const permission = await check(PERMISSIONS.ANDROID.CAMERA);

        // if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
        //   const result = await request(PERMISSIONS.ANDROID.CAMERA);
        //   if (result !== RESULTS.GRANTED) {
        //     console.log('Camera permission denied');
        //     return;
        //   }
        // }
        // const options = {
        //   mediaType: 'photo',
        //   cameraType: 'back',
        // };
        // launchCamera(options, response => {
        //   if (response.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (response.error) {
        //     console.log('ImagePicker Error: ', response.error);
        //   } else {
        //     console.log('Response:', response);
        //     if (response.assets && response.assets.length > 0) {
        //       console.log('Image URI:', response.assets[0].uri);
        //       setTyre2Image(response.assets[0].uri);
        //       // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
        //       // if (vehicleDetails.tyreQuantity === 1) {
        //       try {
        //         const fileName = `image_${Date.now()}.jpg`;
        //         const folderPath = RNFS.PicturesDirectoryPath; // Public Pictures directory
        //         const newPath = `${folderPath}/${fileName}`;

        //         console.log("Source URI:", imageUri);
        //         console.log("New Path:", newPath);

        //         // Copy the image to the public directory
        //         RNFS.copyFile(response.assets[0].uri, newPath);

        //         // Verify file creation
        //         setTyre2Image(newPath)
        //         setVehicleDetails(prevDetails => ({
        //           ...prevDetails,
        //           tyre2Image: newPath,
        //         }));
        //         const fileExists = RNFS.exists(newPath);
        //         console.log("fileExists", fileExists);

        //         if (fileExists) {
        //           console.log("File successfully copied to:", newPath);
        //         } else {
        //           console.error("File does not exist after copy operation.");
        //         }
        //         // Update the state with the permanent file path
        //       } catch (error) {
        //         console.error('File save error:', error);
        //       }

        //       // }

        //       //    else if (vehicleDetails.tyreQuantity === 2) {
        //       //      setVehicleDetails((prevDetails) => ({
        //       //        ...prevDetails,
        //       //        tyre2Image: response.assets[0].uri,
        //       //      }));
        //       //    }
        //       // } else {
        //       //   console.log('No image assets found');
        //       // }
        //     }
        //   }
        // });
        console.log('Opening camera');
        const permissionStatus = await requestPermission();

        if (permissionStatus === 'granted') {
            try {
                // Open the camera and get the image
                const image = await ImagePicker.openCamera({
                    width: 400,
                    height: 400,
                    cropping: false,
                    mediaType: 'photo',
                    saveToPhotos: false,
                    compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
                });

                console.log('Image details:', image);

                // Define the new file path
                const fileName = `image_${Date.now()}.jpg`;
                const folderPath = RNFS.DocumentDirectoryPath; // Public Pictures directory
                const newPath = `${folderPath}/${fileName}`;

                console.log('New Path:', newPath);

                // Copy the image to the public directory
                await RNFS.copyFile(image.path, newPath);

                // Verify file creation
                const fileExists = await RNFS.exists(newPath);
                console.log('fileExists:', fileExists);

                if (fileExists) {
                    console.log('File successfully copied to:', newPath);
                    setTyre2Image(newPath);
                    setVehicleDetails(prevDetails => ({
                        ...prevDetails,
                        tyre2Image: newPath,
                    })); // Update the state with the new path
                } else {
                    console.error('File does not exist after copy operation.');
                }
            } catch (error) {
                console.error('Error during image processing:', error);
                Alert.alert('Error', 'Failed to process image');
            }
        }
    };
    const navigation = useNavigation();
    var latitudeoflocation = '';
    var longitudeoflocation = '';
    var checklocation = 'enabled';
    const handleCheckPressed = async () => {
        if (Platform.OS === 'android') {
            try {
                const enableResult = await promptForEnableLocationIfNeeded();
                console.log('enableResult', enableResult);
                checklocation = enableResult;
                if (enableResult === 'enabled' || enableResult === 'already-enabled') {
                    const position = await GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 60000,
                    });

                    const { latitude, longitude } = position;
                    console.log('Latitude:', latitude);
                    console.log('Longitude:', longitude);

                    latitudeoflocation = latitude.toString();
                    longitudeoflocation = longitude.toString();
                }
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error(error.message);
                    // The user has not accepted to enable the location services or something went wrong during the process
                    // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
                    // codes :
                    //  - ERR00 : The user has clicked on Cancel button in the popup
                    //  - ERR01 : If the Settings change are unavailable
                    //  - ERR02 : If the popup has failed to open
                    //  - ERR03 : Internal error
                }
            }
        }
    };
    function formatDateToISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits

        return `${year}-${month}-${day}`;
    }
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const [loading, setloading] = useState(false);
    const multimissingimageupload = async (
        image,
        catogoruid,
        imagename,
        latitude,
        longitude,
        agencyId,
        createdby,
    ) => {
        const userData = await getAllLoginItems();

        const now = new Date();
        const formattedDate = formatDateToISO(now);

        const timestamp = Date.now();
        const generatedId = `uploadedimageby_${mobileNumber}_${timestamp}`;
        const formData = new FormData();
        const requestData = {
            WarrantyId: warrantyid,
            TempId: generatedId,
            PhotoName: `${imagename}.${image.split('.').pop()}`,
            CategoryId: catogoruid,
            PhotoURL: image,
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
        console.log('Image extension:', image.split('.').pop().toLowerCase());
        const imageextension = image.split('.').pop().toLowerCase();
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
            setloading(true);

            console.log('image', `file://${image}`);

            formData.append('file', {
                uri: `file://${image}`,
                type: 'image/jpeg',
                name: image.split('/').pop(),
            });
            formData.append('RequestId', '');
            formData.append('IsEncrypt', '');
            formData.append('RequestData', JSON.stringify(requestData));
            formData.append('SessionExpiryTime', '');
            formData.append('UserId', '');
            // formData.append("RequestData", JSON.stringify(requestData));

            console.log('formData', formData);

            // return
            const response = await axios.post(RemoteUrls.postUploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*',
                    Accept: 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });
            console.log('Upload image response', response);
            if (response.status === 200) {
                console.log('image uploadede success');
                const payload = {
                    requestId: '',
                    isEncrypt: '',
                    requestData: `{\"Warranty_Id\":\"${warrantyid}\",\"UserId\":\"${userData.UserId}\",\"StatusCode\":\"0\"}`,
                    sessionExpiryTime: '',
                    userId: '',
                };
                try {
                    const response = await axios.post(
                        RemoteUrls.postFinalStatusUpdateUel,
                        payload,
                    );
                    console.log('response', response.data);
                } catch (error) {
                    console.log('error', error);
                }
                Alert.alert(
                    'Success',
                    'Image has been uploaded successfully', // Message
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.navigate('Home');
                            },
                        },
                    ],
                );
            }


            console.log('image uploadede success 2');

            setloading(false);
        } catch (error) {
            setloading(false);

            console.error('Upload image error', error.stack);
        }
    };
    const postRequestbodyOfMissingImage = async (
        latitude,
        longitude,
        userData,
    ) => {
        try {
            if (registrationNo === 'RegistrationNo') {
                if (numberplate != null) {
                    multimissingimageupload(
                        numberplate,
                        photocategorylist[0].Photo_Category_ID,
                        photocategorylist[0].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        userData.Username,
                    );
                }
            }

            if (serial1 === 'Serial_1') {
                if (tyre1Images != null) {
                    multimissingimageupload(
                        tyre1Images,
                        photocategorylist[1].Photo_Category_ID,
                        photocategorylist[1].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        userData.Username,
                    );
                }
            }
            if (serial2 === 'Serial_2') {
                if (tyre2Image != null) {
                    multimissingimageupload(
                        tyre2Image,
                        photocategorylist[2].Photo_Category_ID,
                        photocategorylist[2].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        userData.Username,
                    );
                }
            }
            if (invoiceNumber === 'InvoiceNumber') {
                if (invoiceImageUri != null) {
                    multimissingimageupload(
                        invoiceImageUri,
                        photocategorylist[5].Photo_Category_ID,
                        photocategorylist[5].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        userData.Username,
                    );
                }
            }
            if (odometer === 'ODOMeter') {
                if (ODOMeterImageUri != null) {
                    multimissingimageupload(
                        ODOMeterImageUri,
                        photocategorylist[6].Photo_Category_ID,
                        photocategorylist[6].Photo_Category_Name,
                        latitude,
                        longitude,
                        userData.AgencyId,
                        userData.Username,
                    );
                }
            }

            setloading(false);
        } catch (error) {
            setloading(false);

            console.log(error);
        }
        setloading(false);
    };

    const handleMissingimnageupload = async () => {
        if (isConnected === false) {
            Alert.alert('', 'Please check the internet!');
            return;
        }
        await fetchphotochategorylist();
        const userData = await getAllLoginItems();
        console.log('userdate', userData);
        // return
        if (
            invoiceNumber === null &&
            registrationNo === null &&
            tyre1Images === null &&
            tyre2Image === null &&
            tyre2Image === null &&
            ODOMeterImageUri
        ) {
            Alert.alert('Error', 'No image has been captured!');
            return;
        }
        if (Platform.OS === 'android') {
            try {
                setloading(true);
                const enableResult = await promptForEnableLocationIfNeeded();
                console.log('enableResult', enableResult);
                // checklocation = enableResult
                // if (enableResult === 'enabled' || enableResult === 'already-enabled') {
                const position = await GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 60000,
                });

                const { latitude, longitude } = position;
                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);
                await postRequestbodyOfMissingImage(latitude, longitude, userData);
            } catch (error: unknown) {
                setloading(false);

                // setserversubmitloading(false)
                if (error instanceof Error) {
                    console.error(error.message);
                }
            }
        }
        if (Platform.OS === 'ios') {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            }).then(async location => {
                try {
                    setloading(true);

                    const { latitude, longitude } = location;
                    console.log('Latitude:', latitude);
                    console.log('Longitude:', longitude);
                    await postRequestbodyOfMissingImage(latitude, longitude, userData);
                } catch (error: unknown) {
                    setloading(false);

                    // setserversubmitloading(false)
                    if (error instanceof Error) {
                        console.error(error.message);
                    }
                }
            });
        }
    };
    const [warrantyPostObject, setWarrantyPostObject] = useState([]);
    const handleLoop = async () => {
        console.log('check', items);

        items.forEach((item, index) => {
            if (item.isChecked === true) {
                const foundItem = warrantyPostObject.filter(
                    warrantyitem => warrantyitem.id === item.id,
                );

                console.log('foundItem[0]', foundItem[0]);

                handlemodifyandsubmit(foundItem[0]);
            }
        });
        // const filteredItems = items.filter(item => item.isChecked === true);
        // console.log("filteredItems", filteredItems);

        //  warrantyPostObject.filter(warrantyitem => warrantyitem.id === 1)
    };
    const handlemodifyandsubmit = async foundItem => {
        // console.log("foundItem", foundItem);
        // console.log("Registration_No", foundItem.registrationNumber, "CustomerName", foundItem.customerName, "MobileNo", foundItem.mobileNumber, "EmailId", loginItems.EmailId, "Remark", null, "Company", "YOKOHAMA", "IsDeclaretion", foundItem.termsAccepted, "Agency_Id", loginItems.AgencyId, "InvoiceNo", foundItem.invoiceNumber, "InvoiceDate", foundItem.invoiceDate, "InvoiceAmount", "User_Device_Formation", deviceName, "CreatedFor", "self", "MappingCodeCode", null, "Address", foundItem.address, "State_Id", foundItem.state_id, "State_Name", foundItem.state, "District_id", foundItem.districtid, "District_Name", foundItem.districtname, "City_Id", foundItem.cityvillageid, "City_Name", foundItem.cityvillagename, "PinCode_Id", foundItem.pincodeid, "PinCode_Name", foundItem.cityvillagename, "ODOMeter", foundItem.odoMeterReading, "Type_of_Machine_Id", foundItem.veh_type_id, "Type_of_Machine_Name", foundItem.veh_type_name, "Make_Id", foundItem.make_id, "Make_Name", foundItem.make, "Model_Id", null, "Model_Name", foundItem.model, "Variant_Id", foundItem.variantid, "Variant_Name", foundItem.variantname, "RegistrationDate", foundItem.registrationDate, "ManufacturerDate", null, "BrandName", foundItem.brand, "ProductName", foundItem.productName, "Serial_1", foundItem.series + foundItem.tyre1SerialNumber2 + foundItem.tyre1SerialNumber3, "Serial_2", foundItem.series + foundItem.tyre2SerialNumber2 + foundItem.tyre2SerialNumber3, "Serial_3", null, "Serial_4", null, "Serial_Number", null, "Createdby", loginItems.Name, "Photo_Temp_Id", null, "TyreSize", foundItem.tyreSize, "NoOfTyres", foundItem.tyreQuantity, "OldTyre_CompanyName", foundItem.oldTyreCompany, "OldTyre_BrandName", foundItem.oldTyreBrand, "OldTyre_Size", foundItem.oldTyreSize);

        // return
        const payload = {
            requestId: 'string',
            isEncrypt: 'string',
            requestData: JSON.stringify({
                Registration_No: foundItem.registrationNumber,
                CustomerName: foundItem.customerName,
                MobileNo: foundItem.mobileNumber,
                EmailId: loginItems.EmailId,
                Remark: null,
                Company: 'YOKOHAMA',
                IsDeclaretion: foundItem.termsAccepted,
                Agency_Id: loginItems.AgencyId,
                InvoiceNo: foundItem.invoiceNumber,
                InvoiceDate: foundItem.invoiceDate,
                InvoiceAmount: '1000',
                User_Device_Formation: deviceName,
                CreatedFor: 'self',
                MappingCodeCode: null,
                Address: foundItem.address,
                State_Id: foundItem.state_id,
                State_Name: foundItem.state,
                District_id: foundItem.districtid,
                District_Name: foundItem.districtname,
                City_Id: foundItem.cityvillageid,
                City_Name: foundItem.cityvillagename,
                PinCode_Id: foundItem.pincodeid,
                PinCode_Name: foundItem.cityvillagename,
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
                Createdby: loginItems.Name,
                Photo_Temp_Id: null,
                TyreSize: foundItem.tyreSize,
                NoOfTyres: foundItem.tyreQuantity,
                OldTyre_CompanyName: foundItem.oldTyreCompany,
                OldTyre_BrandName: foundItem.oldTyreBrand,
                OldTyre_Size: foundItem.oldTyreSize,
            }),
            sessionExpiryTime: '2024-12-31T23:59:59',
            userId: loginItems.UserId,
        };
        // console.log(payload);
        // return
        // console.log("warranty no ", warrantyPostObject)
        try {
            setloading(true);
            const response = await axios.post(
                RemoteUrls.postWarrantyRegistrationUrl,
                payload,
            );
            // console.log("response", response.data)
            if (response.status === 200) {
                // console.log("success", response.data);
                await updateSyncStatusWR(db, foundItem.id, true);
            } else {
                console.error('Something went wrong');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
            await fetchItems(db);
            await fetchogin();
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
            console.log('response', response);
        } catch (error) {
            console.log(error);
        }
    };
    const [isPopup, setIsPopup] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [searchQuery, setSearchQuery] = useState();
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

    const renderItem1 = ({ item }) => (
        <Pressable
            onPress={() => {
                handleItemSelect(item);
                setSelectedId(item.key);
                console.log('idsadasdasdasda', item);
                getPincode(item.value);
            }}>
            <Text>{item.value}</Text>
        </Pressable>
    );
    const [pincodevaluedata, setpincodevaluedata] = useState(null);
    const handleItemSelect = item => {
        // setSelectedItem(item); // Store selected item if needed
        setIsPopup(false); // Close the modal
        setpincodevaluedata(item.value);
        console.log('some data', item.value); // Log the selected item
    };
    return (
        <>
            {languagedata === null ? (
                <ActivityIndicator size={'small'} color={'black'} />
            ) : (
                <>
                    <Text>Remark: {missing_image}</Text>
                    {getdataloadijng === true ? (
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
                            <Modal
                                transparent={true}
                                visible={loading}
                                onRequestClose={() => {
                                    setloading(!loading);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <ActivityIndicator size="large" color="black" />
                                        <Text>{languagedata.lbl_uploading_image}..</Text>
                                    </View>
                                </View>
                            </Modal>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.headerText}>
                                    {languagedata.lblWarrantyRegistration}
                                </Text>

                                {/* Radio Buttons */}
                                {/* <RadioButton.Group
                                            onValueChange={handleRadioButtonChange}
                                            value={singlemissingimage.Registration_No}>
                                            <RadioButton.Item

                                                label=
                                                {`${languagedata.VehicleRegistrationNoavailable}`}
                                                value="Available"
                                                disabled={true}
                                                color={RadioButtonColor}
                                                style={styles.radioButton}
                                                labelStyle={styles.radioLabel}
                                            />
                                            <RadioButton.Item
                                                label={`${languagedata.VehicleRegistrationNonotavailable}`}
                                                value="Not Available"
                                                disabled={true}

                                                color={RadioButtonColor}
                                                style={styles.radioButton}
                                                labelStyle={styles.radioLabel}
                                            />
                                            <RadioButton.Item
                                                label={`${languagedata.NewVehicle}`}
                                                value="New Vehicle"
                                                disabled={true}

                                                color={RadioButtonColor}
                                                style={styles.radioButton}
                                                labelStyle={styles.radioLabel}
                                            />
                                        </RadioButton.Group> */}
                                <RadioButton.Group
                                    onValueChange={handleRadioButtonChange}
                                    value={registrationnumber}>
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
                                            value="available"
                                            color={RadioButtonColor}
                                            disabled={true}
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
                                            value="notAvailable"
                                            disabled={true}
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
                                            {languagedata.NewVehicle}
                                        </Text>
                                        <RadioButton.Android
                                            value="newVehicle"
                                            disabled={true}
                                            color={RadioButtonColor}
                                            style={styles.radioButton}
                                        />
                                    </View>
                                </RadioButton.Group>
                            </View>
                            {registrationnumber === 'available' ? (
                                <>
                                    <View style={styles.outer_view}>
                                        <View style={styles.label_view}>
                                            <Text style={styles.label_View_text_style}>
                                                {languagedata.RegistrationNo}
                                                <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                        </View>
                                        <TextInput
                                            inputMode="text"
                                            editable={false}
                                            style={styles.input4}
                                            placeholder={`${languagedata.RegistrationNo}`}
                                            placeholderTextColor={placeholderTextColor}
                                            onChangeText={value =>
                                                handleVehicleDetailsChange(
                                                    'registrationNumber',
                                                    value.toUpperCase(),
                                                )
                                            }
                                            value={singlemissingimage.Registration_No}
                                        />
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
                                    {/* <TouchableOpacity
                                                    style={styles.button}
                                                    onPress={numberplateimage}>
                                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Take Registration No. Photo</Text>
                                                    <Icon
                                                        style={{ marginLeft: 10, marginTop: 2 }}
                                                        name="camera"
                                                        size={20}
                                                        color={'white'}
                                                    />
                                                </TouchableOpacity> */}
                                    {registrationNo === 'RegistrationNo' ? (
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={numberplateimage}>
                                            <Text style={styles.buttonText}>
                                                {languagedata.lbl_Take_Registration_No_Photo}
                                            </Text>
                                            <Icon
                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                name="camera"
                                                size={20}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                    ) : (
                                        <>{
                                            presentregistrationnoimage !== null ?
                                                <Image
                                                    source={{
                                                        uri: presentregistrationnoimage,
                                                    }}
                                                    width={width - 40}
                                                    height={300}
                                                /> : <Text>No image found</Text>
                                        }
                                            <TouchableOpacity
                                                disabled={true}
                                                style={styles.button1}
                                                onPress={numberplateimage}>
                                                <Text style={styles.buttonText}>
                                                    {languagedata.lbl_Take_Registration_No_Photo}
                                                </Text>
                                                <Icon
                                                    style={{ marginLeft: 10, marginTop: 2 }}
                                                    name="camera"
                                                    size={20}
                                                    color={'white'}
                                                />
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                            {/* Vehicle Registration Number */}
                            {/* <View>
                                        {registrationnumber === 'available' ? (
                                            <View>
                                                <View style={styles.outer_view}>
                                                    <View style={styles.label_view}>
                                                        <Text style={styles.label_View_text_style}>
                                                            {languagedata.RegistrationNo}
                                                            <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                    </View>
                                                    <View style={styles.text_view}>
                                                        <TextInput
                                                            inputMode='text'
                                                            editable={false}
                                                            style={styles.input}
                                                            placeholder={`${languagedata.RegistrationNo}`}
                                                            placeholderTextColor={placeholderTextColor}
                                                            onChangeText={value =>
                                                                handleVehicleDetailsChange('registrationNumber', value.toUpperCase())
                                                            }
                                                            value={singlemissingimage.Registration_No}
                                                        />
                                                    </View>
                                                </View>



                                    <> {
                                        numberplate && (
                                            <Image
                                                source={{
                                                    uri:
                                                        `file://${numberplate}`,
                                                }}
                                                width={320}
                                                height={300}
                                            />
                                        )
                                    }
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={numberplateimage}>
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Take Registration No. Photo</Text>
                                            <Icon
                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                name="camera"
                                                size={20}
                                                color={'white'}
                                            />
                                        </TouchableOpacity></>

                                </View>
                                        ) : <>{ }</>}
                    </View> */}

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
                                            style={{ marginTop: 12 }}
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
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <TextInput
                                                    maxLength={50}
                                                    editable={false}
                                                    style={styles.input}
                                                    placeholder={`${singlemissingimage.CustomerName}`}
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
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <TextInput
                                                    style={styles.input}
                                                    readOnly={true}
                                                    placeholder={`${singlemissingimage.MobileNo}`}
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
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <TextInput
                                                    multiline
                                                    readOnly={true}
                                                    numberOfLines={4}
                                                    textAlignVertical="top"
                                                    style={styles.input}
                                                    placeholder={`${singlemissingimage.Address}`}
                                                    placeholderTextColor={placeholderTextColor}
                                                    onChangeText={value =>
                                                        handleCustomerDetailsChange('address', value)
                                                    }
                                                    value={customerDetails.address}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.outer_view}>
                                            <View style={styles.label_view}>
                                                <Text style={styles.label_View_text_style}>
                                                    {languagedata.lbl_Inbox_State}
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        disabled={true}
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text> {singlemissingimage.State_Name}</Text>

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
                                                    {/* <SelectList
              dropdownStyles={styles.dropdownshow}
              maxHeight={200}
              data={stateItems}
              placeholder={'--State--'}
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
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.outer_view}>
                                            <View style={styles.label_view}>
                                                <Text style={styles.label_View_text_style}>
                                                    {languagedata.lbl_PinCode}
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        disabled={true}
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text>{singlemissingimage.PinCode_Name}</Text>
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

                                                    {/* <TextInput
              editable={true}
              placeholder="--Pincode--"
              // value={searchQuery}
              onPressIn={() => {
                handleCustomerDetailsChange('pinCode', searchQuery)
                getPincode(searchQuery)
                setIsPopup(true)
              }}
              value={pincodevaluedata}
            /> */}
                                                    {/* <Pressable onPress={() => {
                handleCustomerDetailsChange('pinCode', searchQuery)
                getPincode(searchQuery)
                setIsPopup(true)
              }

              } /> */}
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
                                            style={{ marginTop: 12 }}
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

                                        <View style={styles.outer_view}>
                                            <View style={styles.label_view}>
                                                <Text style={styles.label_View_text_style}>
                                                    {languagedata.VehicleType}
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        disabled={true}
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text>
                                                            {singlemissingimage.Type_of_Machine_Name}
                                                        </Text>
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
                                                    {/* <SelectList
              dropdownStyles={styles.dropdownshow}
              maxHeight={200}
              data={vehicleTypeItems}
              setSelected={value => {
                getVehicleMakeByVehiceTypeID(value)
              }



              }
              placeholder="Vehicle Type"
              boxStyles={{ borderWidth: 0, padding: 0 }}
              arrowicon={
                <Icon name="chevron-down" size={12} color={'black'} />
              }
              save="value"
            /> */}
                                                </View>
                                            </View>
                                        </View>

                                        <View>
                                            <View style={styles.outer_view}>
                                                <View style={styles.label_view}>
                                                    <Text style={styles.label_View_text_style}>
                                                        {languagedata.lbl_VehicleMake}
                                                        <Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                </View>
                                                <View style={styles.text_view}>
                                                    <View style={styles.input}>
                                                        <Pressable
                                                            disabled={true}
                                                            style={{
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                            }}>
                                                            <Text>{singlemissingimage.Make_Name}</Text>
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
                  placeholder="Vehicle Make"
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.outer_view}>
                                            <View style={styles.label_view}>
                                                <Text style={styles.label_View_text_style}>
                                                    {languagedata.lbl_VehicleModel}
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text>{singlemissingimage.Model_Name}</Text>
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
                                                    {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={modelItems}
                  setSelected={value => {
                    handleVehicleDetailsChange('model', value)
                    getmodelidlist(value)
                  }


                  }
                  placeholder="Vehicle Model"
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
                                                    {languagedata.lbl_VehicleVariant}
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        disabled={true}
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text>{singlemissingimage.Variant_Name}</Text>
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
                                                    {/* <SelectList
                  dropdownStyles={styles.dropdownshow}
                  maxHeight={200}
                  data={vehicleVariantItems}
                  setSelected={value => { storeVehicleVariant(value); setisvehiclevariantcheck(false) }
                  }
                  placeholder="Vehicle Variant"
                  boxStyles={{ borderWidth: 0, padding: 0 }}
                  arrowicon={
                    <Icon name="chevron-down" size={12} color={'black'} />
                  }
                  save="value"
                /> */}
                                                </View>
                                            </View>
                                        </View>
                                        {/* BrandNasadmeItemsdata */}

                                        <View style={styles.outer_view}>
                                            <View style={styles.label_view}>
                                                <Text style={styles.label_View_text_style}>
                                                    {languagedata.BrandName}
                                                    {/* Brand Name */}
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text>{singlemissingimage.BrandName}</Text>
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
                                                    {/* <SelectList
              dropdownStyles={styles.dropdownshow}
              maxHeight={200}
              data={brandnameItems}
              setSelected={value => {
                handleVehicleDetailsChange('brand', value)
                getbrandlist(value)
              }

              }
              placeholder="Tyre Brand"
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
                                                    {languagedata.lblProductName}
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text>{singlemissingimage.ProductName}</Text>
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
                                                    {/* <SelectList
              dropdownStyles={styles.dropdownshow}
              maxHeight={200}
              data={productnameItems}
              setSelected={value => {
                handleVehicleDetailsChange('productName', value)
                getProductNameById(value)
              }

              }
              placeholder="Product Name"
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
                                                    {languagedata.lbl_TyreSize}
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text>{singlemissingimage.TyreSize}</Text>
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
                                                    {/* <SelectList
              dropdownStyles={styles.dropdownshow}
              maxHeight={200}
              data={tyresizeItems}
              setSelected={value =>
                handleVehicleDetailsChange('tyreSize', value)
              }
              placeholder="Tyre Size"
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
                                                    <Text style={{ color: 'red' }}>*</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    <Pressable
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Text>{singlemissingimage.NoOfTyres}</Text>
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
                                                </View>
                                            </View>
                                        </View>

                                        {singlemissingimage.NoOfTyres === '1' ? (
                                            <View>
                                                <Text style={{ color: 'black' }}>
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
                                                        value={segment1_11}
                                                    />
                                                    <TextInput
                                                        keyboardType="number-pad"
                                                        maxLength={5}
                                                        readOnly={true}
                                                        style={styles.Serial_number_input}
                                                        placeholder=""
                                                        placeholderTextColor={placeholderTextColor}
                                                        onChangeText={value =>
                                                            handleVehicleDetailsChange(
                                                                'tyre1SerialNumber2',
                                                                value,
                                                            )
                                                        }
                                                        value={segment1_22}
                                                    />
                                                    <TextInput
                                                        keyboardType="number-pad"
                                                        maxLength={4}
                                                        readOnly={true}
                                                        style={styles.Serial_number_input}
                                                        placeholder=""
                                                        placeholderTextColor={placeholderTextColor}
                                                        onChangeText={value =>
                                                            handleVehicleDetailsChange(
                                                                'tyre1SerialNumber3',
                                                                value,
                                                            )
                                                        }
                                                        value={segment1_33}
                                                    />
                                                </View>
                                                {/* {tyre1Image && <Image source={{ uri: tyre1Image }} width={320} height={300} />} */}

                                                <>
                                                    {tyre1Images && (
                                                        <Image
                                                            source={{
                                                                uri: `file://${tyre1Images}`,
                                                            }}
                                                            width={width - 40}
                                                            height={300}
                                                        />
                                                    )}
                                                    {serial1 === 'Serial_1' ? (
                                                        <TouchableOpacity
                                                            style={styles.button}
                                                            onPress={tyre1ImagePickCamera}>
                                                            <Text style={styles.buttonText}>
                                                                {
                                                                    languagedata.Val_TakeTyre1PhotowithSerialNumber
                                                                }
                                                            </Text>
                                                            <Icon
                                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                                name="camera"
                                                                size={20}
                                                                color={'white'}
                                                            />
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <>{
                                                            presentserial1noimage !== null ?
                                                                <Image
                                                                    source={{
                                                                        uri: presentserial1noimage,
                                                                    }}
                                                                    width={width - 40}
                                                                    height={300}
                                                                /> : <Text>No image found</Text>
                                                        }
                                                            <TouchableOpacity
                                                                style={styles.button1}
                                                                disabled={true}
                                                                onPress={tyre1ImagePickCamera}>
                                                                <Text style={styles.buttonText}>
                                                                    {
                                                                        languagedata.Val_TakeTyre1PhotowithSerialNumber
                                                                    }
                                                                </Text>
                                                                <Icon
                                                                    style={{ marginLeft: 10, marginTop: 2 }}
                                                                    name="camera"
                                                                    size={20}
                                                                    color={'white'}
                                                                />
                                                            </TouchableOpacity></>
                                                    )}
                                                </>

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
                                        ) : (
                                            <></>
                                        )}
                                        {singlemissingimage.NoOfTyres === '2' ? (
                                            <View>
                                                <Text style={{ color: 'black' }}>
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
                                                        value={segment1_11}
                                                    />
                                                    <TextInput
                                                        keyboardType="number-pad"
                                                        maxLength={5}
                                                        readOnly={true}
                                                        style={styles.Serial_number_input}
                                                        placeholder=""
                                                        placeholderTextColor={placeholderTextColor}
                                                        onChangeText={value =>
                                                            handleVehicleDetailsChange(
                                                                'tyre1SerialNumber2',
                                                                value,
                                                            )
                                                        }
                                                        value={segment1_22}
                                                    />
                                                    <TextInput
                                                        keyboardType="number-pad"
                                                        maxLength={4}
                                                        readOnly={true}
                                                        style={styles.Serial_number_input}
                                                        placeholder=""
                                                        placeholderTextColor={placeholderTextColor}
                                                        onChangeText={value =>
                                                            handleVehicleDetailsChange(
                                                                'tyre1SerialNumber3',
                                                                value,
                                                            )
                                                        }
                                                        value={segment1_33}
                                                    />
                                                </View>
                                                {/* {tyre2Image && <Image source={{ uri: tyre2Image }} width={320} height={300} />} */}

                                                <>
                                                    {tyre1Images && (
                                                        <Image
                                                            source={{
                                                                uri: `file://${tyre1Images}`,
                                                            }}
                                                            width={width - 40}
                                                            height={300}
                                                        />
                                                    )}
                                                    {serial1 === 'Serial_1' ? (
                                                        <TouchableOpacity
                                                            style={styles.button}
                                                            onPress={tyre1ImagePickCamera}>
                                                            <Text style={styles.buttonText}>
                                                                {
                                                                    languagedata.Val_TakeTyre1PhotowithSerialNumber
                                                                }
                                                            </Text>
                                                            <Icon
                                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                                name="camera"
                                                                size={20}
                                                                color={'white'}
                                                            />
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <>{
                                                            presentserial1noimage !== null ?
                                                                <Image
                                                                    source={{
                                                                        uri: presentserial1noimage,
                                                                    }}
                                                                    width={width - 40}
                                                                    height={300}
                                                                /> : <Text>No image found</Text>
                                                        }
                                                            <TouchableOpacity
                                                                style={styles.button1}
                                                                disabled={true}
                                                                onPress={tyre1ImagePickCamera}>
                                                                <Text style={styles.buttonText}>
                                                                    {
                                                                        languagedata.Val_TakeTyre1PhotowithSerialNumber
                                                                    }
                                                                </Text>
                                                                <Icon
                                                                    style={{ marginLeft: 10, marginTop: 2 }}
                                                                    name="camera"
                                                                    size={20}
                                                                    color={'white'}
                                                                />
                                                            </TouchableOpacity></>
                                                    )}
                                                </>

                                                <Text style={{ color: 'black' }}>
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
                                                        value={segment2_11}
                                                    />
                                                    <TextInput
                                                        keyboardType="number-pad"
                                                        maxLength={5}
                                                        style={styles.Serial_number_input}
                                                        placeholder=""
                                                        readOnly={true}
                                                        placeholderTextColor={placeholderTextColor}
                                                        onChangeText={value =>
                                                            handleVehicleDetailsChange(
                                                                'tyre2SerialNumber2',
                                                                value,
                                                            )
                                                        }
                                                        value={segment2_22}
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
                                                        value={segment2_33}
                                                    />
                                                </View>
                                                <View>
                                                    <>
                                                        {tyre2Image && (
                                                            <Image
                                                                source={{
                                                                    uri: `file://${tyre2Image}`,
                                                                }}
                                                                width={width - 40}
                                                                height={300}
                                                            />
                                                        )}
                                                        {serial2 === 'Serial_2' ? (
                                                            <TouchableOpacity
                                                                style={styles.button}
                                                                onPress={tyre2ImagePickCamera}>
                                                                <Text style={styles.buttonText}>
                                                                    {
                                                                        languagedata.Val_TakeTyre2PhotowithSerialNumber
                                                                    }
                                                                </Text>
                                                                <Icon
                                                                    style={{ marginLeft: 10, marginTop: 2 }}
                                                                    name="camera"
                                                                    size={20}
                                                                    color={'white'}
                                                                />
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <>{
                                                                presentserial2noimage !== null ?
                                                                    <Image
                                                                        source={{
                                                                            uri: presentserial2noimage,
                                                                        }}
                                                                        width={width - 40}
                                                                        height={300}
                                                                    /> : <Text>No image found</Text>
                                                            }
                                                                <TouchableOpacity
                                                                    style={styles.button1}
                                                                    disabled={true}
                                                                    onPress={tyre2ImagePickCamera}>
                                                                    <Text style={styles.buttonText}>
                                                                        {
                                                                            languagedata.Val_TakeTyre2PhotowithSerialNumber
                                                                        }
                                                                    </Text>
                                                                    <Icon
                                                                        style={{ marginLeft: 10, marginTop: 2 }}
                                                                        name="camera"
                                                                        size={20}
                                                                        color={'white'}
                                                                    />
                                                                </TouchableOpacity></>
                                                        )}
                                                    </>
                                                </View>
                                            </View>
                                        ) : (
                                            <></>
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
                                            style={{ marginTop: 12 }}
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
                                                {singlemissingimage.InvoiceNo === '' ? (
                                                    <TextInput
                                                        style={styles.input}
                                                        // placeholder={`${languagedata.InvoiceNo}`}
                                                        placeholder={`${languagedata.InvoiceNo}`}
                                                        placeholderTextColor={placeholderTextColor}
                                                        onChangeText={value =>
                                                            handleOptionalDetailsChange(
                                                                'invoiceNumber',
                                                                value,
                                                            )
                                                        }
                                                    // value={singlemissingimage.InvoiceNo}
                                                    />
                                                ) : (
                                                    <TextInput
                                                        style={styles.input}
                                                        // placeholder={`${languagedata.rfvInvoiceNo}`}
                                                        placeholder={`${singlemissingimage.InvoiceNo}`}
                                                        readOnly={true}
                                                        placeholderTextColor={placeholderTextColor}
                                                        onChangeText={value =>
                                                            handleOptionalDetailsChange(
                                                                'invoiceNumber',
                                                                value,
                                                            )
                                                        }
                                                    // value={singlemissingimage.InvoiceNo}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                        <View>
                                            <>
                                                {invoiceImageUri && (
                                                    <Image
                                                        source={{
                                                            uri: `file://${invoiceImageUri}`,
                                                        }}
                                                        width={width - 40}
                                                        height={300}
                                                    />
                                                )}
                                                {/* {invoiceImageUri && <Image source={{ uri: invoiceImageUri }} width={320} height={300} />} */}
                                                {invoiceNumber === 'InvoiceNumber' ? (
                                                    <TouchableOpacity
                                                        style={styles.button}
                                                        onPress={invoicePickCamera}>
                                                        <Text style={styles.buttonText}>
                                                            {languagedata.lbl_TakeInvoicePhoto}
                                                        </Text>
                                                        <Icon
                                                            style={{ marginLeft: 10, marginTop: 2 }}
                                                            name="camera"
                                                            size={20}
                                                            color={'white'}
                                                        />
                                                    </TouchableOpacity>
                                                ) : (
                                                    <>
                                                        {
                                                            presentinvoicenoimage != null ?
                                                                <Image
                                                                    source={{
                                                                        uri: presentinvoicenoimage,
                                                                    }}
                                                                    width={width - 40}
                                                                    height={300}
                                                                /> : <Text>No image found</Text>
                                                        }
                                                        <TouchableOpacity
                                                            style={styles.button1}
                                                            disabled={true}
                                                            onPress={invoicePickCamera}>
                                                            <Text style={styles.buttonText}>
                                                                {languagedata.lbl_TakeInvoicePhoto}
                                                            </Text>
                                                            <Icon
                                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                                name="camera"
                                                                size={20}
                                                                color={'white'}
                                                            />
                                                        </TouchableOpacity></>
                                                )}
                                                {/* <TouchableOpacity style={styles.button} onPress={invoicePickCamera}>
                                                            <Text style={styles.buttonText}>{languagedata.lbl_TakeInvoicePhoto}</Text>
                                                            <Icon
                                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                                name="camera"
                                                                size={20}
                                                                color={'white'}
                                                            />
                                                        </TouchableOpacity> */}
                                            </>
                                        </View>

                                        <View style={styles.outer_view}>
                                            <View style={styles.label_view}>
                                                <Text style={styles.label_View_text_style}>
                                                    {languagedata.InvoiceDate}
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <TouchableOpacity
                                                    disabled={true}
                                                    style={styles.calenderbutton}>
                                                    {/* <View> */}
                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                        }}>
                                                        {singlemissingimage.InvoiceDate === '' ? (
                                                            <Text>{'--/--/----'} </Text>
                                                        ) : (
                                                            <>
                                                                {moment(singlemissingimage.InvoiceDate).format(
                                                                    'DD/MM/YYYY',
                                                                )}{' '}
                                                            </>
                                                        )}

                                                        <Icon name="calendar" size={20} color="white" />
                                                    </Text>
                                                    {/* </View> */}
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
                                                    maximumDate={new Date()}
                                                />
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
                                                {singlemissingimage.ODOMeter === '' ? (
                                                    <TextInput
                                                        style={styles.input}
                                                        keyboardType="number-pad"
                                                        placeholder={`${languagedata.lbl_ODOMeter}`}
                                                        placeholderTextColor={placeholderTextColor}
                                                        readOnly={true}
                                                        onChangeText={value =>
                                                            handleOptionalDetailsChange(
                                                                'odoMeterReading',
                                                                value,
                                                            )
                                                        }
                                                    // value={singlemissingimage.ODOMeter}
                                                    />
                                                ) : (
                                                    <TextInput
                                                        style={styles.input}
                                                        keyboardType="number-pad"
                                                        placeholder={`${singlemissingimage.ODOMeter}`}
                                                        placeholderTextColor={placeholderTextColor}
                                                        readOnly={true}
                                                        onChangeText={value =>
                                                            handleOptionalDetailsChange(
                                                                'odoMeterReading',
                                                                value,
                                                            )
                                                        }
                                                    // value={singlemissingimage.ODOMeter}
                                                    />
                                                )}
                                            </View>
                                        </View>

                                        {/* {ODOMeterImageUri && <Image source={{ uri: ODOMeterImageUri }} width={320} height={300} />} */}
                                        <View>
                                            <>
                                                {ODOMeterImageUri && (
                                                    <Image
                                                        source={{
                                                            uri: `file://${ODOMeterImageUri}`,
                                                        }}
                                                        width={width - 40}
                                                        height={300}
                                                    />
                                                )}
                                                {odometer === 'ODOMeter' ? (
                                                    <TouchableOpacity
                                                        style={styles.button}
                                                        onPress={ODOMeterPickCamera}>
                                                        <Text style={styles.buttonText}>
                                                            {languagedata.lbl_Take_ODO_Meter_Photo}
                                                        </Text>
                                                        <Icon
                                                            style={{ marginLeft: 10, marginTop: 2 }}
                                                            name="camera"
                                                            size={20}
                                                            color={'white'}
                                                        />
                                                    </TouchableOpacity>
                                                ) : (
                                                    <>{
                                                        presentodometernoimage !== null ?
                                                            <Image
                                                                source={{
                                                                    uri: presentodometernoimage,
                                                                }}
                                                                width={width - 40}
                                                                height={300}
                                                            /> : <Text>No image found</Text>
                                                    }
                                                        <TouchableOpacity
                                                            style={styles.button1}
                                                            disabled={true}
                                                            onPress={ODOMeterPickCamera}>
                                                            <Text style={styles.buttonText}>
                                                                {languagedata.lbl_Take_ODO_Meter_Photo}
                                                            </Text>
                                                            <Icon
                                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                                name="camera"
                                                                size={20}
                                                                color={'white'}
                                                            />
                                                        </TouchableOpacity></>
                                                )}
                                                {/* <TouchableOpacity
                                                            style={styles.button}
                                                            onPress={ODOMeterPickCamera}>
                                                            <Text style={styles.buttonText}>Take ODO Meter Photo</Text>
                                                            <Icon
                                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                                name="camera"
                                                                size={20}
                                                                color={'white'}
                                                            />
                                                        </TouchableOpacity> */}
                                            </>
                                        </View>
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
                                            style={{ marginTop: 12 }}
                                            onPress={toggleOldTyreDetails}
                                            name={showOldTyreDetails ? 'caret-up' : 'caret-down'}
                                            size={25}
                                            color={iconColor}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {showOldTyreDetails && (
                                    <>
                                        <View style={styles.outer_view}>
                                            <View style={styles.label_view}>
                                                <Text style={styles.label_View_text_style}>
                                                    {languagedata.OldTyreCompany}
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    {singlemissingimage.OldTyre_CompanyName === '' ? (
                                                        <Pressable
                                                            style={{
                                                                flex: 1,
                                                                flexDirection: 'row',
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
                                                            style={{
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                            }}>
                                                            <Text>
                                                                {singlemissingimage.OldTyre_CompanyName}
                                                            </Text>
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
              placeholder="Old Tyre Company"
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
                                                    {languagedata.OldTyreBrandName}
                                                </Text>
                                            </View>
                                            <View style={styles.text_view}>
                                                <View style={styles.input}>
                                                    {singlemissingimage.OldTyre_BrandName === '' ? (
                                                        <Pressable
                                                            style={{
                                                                flex: 1,
                                                                flexDirection: 'row',
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
                                                            style={{
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                            }}>
                                                            <Text>
                                                                {singlemissingimage.OldTyre_BrandName}
                                                            </Text>
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
              placeholder="Old Tyre Brand Name"
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
                                                <View>
                                                    {singlemissingimage.OldTyre_Size === '' ? (
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly={true}
                                                            placeholder={`${languagedata.OldTyreSize}`}
                                                            placeholderTextColor={placeholderTextColor}
                                                            onChangeText={value =>
                                                                handleOldTyreDetailsChange('oldTyreSize', value)
                                                            }
                                                            value={oldTyreDetails.oldTyreSize}
                                                        />
                                                    ) : (
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly={true}
                                                            placeholder={`${singlemissingimage.OldTyre_Size}`}
                                                            placeholderTextColor={placeholderTextColor}
                                                            onChangeText={value =>
                                                                handleOldTyreDetailsChange('oldTyreSize', value)
                                                            }
                                                            value={oldTyreDetails.oldTyreSize}
                                                        />
                                                    )}

                                                    {/* <SelectList
              dropdownStyles={styles.dropdownshow}
              maxHeight={200}
              data={OldTyreSizedata}
              setSelected={value =>
                handleOldTyreDetailsChange('oldTyreSize', value)
              }
              placeholder="Old Tyre Size"
              boxStyles={{ borderWidth: 0, padding: 0 }}
              arrowicon={
                <Icon name="chevron-down" size={12} color={'black'} />
              }
              save="value"
            /> */}
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
                                            value={termsAccepted}
                                            disabled={true}
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

                            <View>
                                <TouchableOpacity
                                    style={styles.submit_button}
                                    onPress={handleMissingimnageupload}>
                                    <Text style={styles.buttonText}>
                                        {languagedata.lbl_uploadimage}
                                    </Text>
                                </TouchableOpacity>
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
            )}
        </>
    );
};

export default UpdateMissingImage;