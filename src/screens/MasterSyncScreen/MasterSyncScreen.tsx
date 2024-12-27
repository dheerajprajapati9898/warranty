import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  Modal,
} from 'react-native';
import {Snackbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import {
  setupStateDatabase,
  insertStateItems,
  getAllStateItems,
  clearStateTable,
} from './../../db/Registration/StateDb';
import {
  setupPinCodeDatabase,
  insertPinCodeItems,
  getAllPinCodeItems,
  clearPinCodeTable,
} from './../../db/Registration/PinCodeDb';
import {
  setupTractorMakeDatabase,
  insertTractorMakeItems,
  getAllTractorMakeItems,
  clearTractorMakeTable,
} from './../../db/Registration/TractorMakeDb';
import {
  setupTractorModelDatabase,
  getAllTractorModelItems,
  insertTractorModelItems,
  clearTractorModelTable,
} from './../../db/Registration/TractorModelDb';
import {
  setupBrandNasadmeDatabase,
  getAllBrandNasadmeItems,
  insertBrandNasadmeItems,
  clearBrandNasadmeTable,
} from './../../db/Registration/BrandName';
import {
  setupProductNameDatabase,
  getAllProductNameItems,
  insertProductNameItems,
  clearProductNameTable,
} from './../../db/Registration/ProductNameDb';
import {
  setupTyreSizeDatabase,
  getAllTyreSizeItems,
  insertTyreSizeItems,
  clearTyreSizeTable,
} from './../../db/Registration/TyreSizeDb';
import {
  setupOldTyreBrandNameDatabase,
  getAllOldTyreBrandNameItems,
  insertOldTyreBrandNameItems,
  clearOldTyreBrandNameTable,
} from './../../db/Registration/OldTyreBrandName';
import {
  setupOldTyreCompanyDatabase,
  getAllOldTyreCompanyItems,
  insertOldTyreCompanyItems,
  clearOldTyreCompanyTable,
} from './../../db/Registration/OldTyreCompany';
import {
  setupVehicleVariantDatabase,
  getAllVehicleVariantItems,
  insertVehicleVariantItems,
  clearVehicleVariantTable,
} from './../../db/Registration/VehicleVariant';
import {
  setupVehicleTypeDatabase,
  getAllVehicleTypeItems,
  insertVehicleTypeItems,
  clearVehicleTypeTable,
} from './../../db/Registration/VehicleTypeDb';
import {
  setupMasterSyncUpdateDatabase,
  getAllMasterSyncUpdateItems,
  insertMasterSyncUpdateItems,
  clearMasterSyncUpdateTable,
  updateMasterSyncUpdateItem,
} from './../../db/MasterSyncUpdate/MasterSyncUpdate';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import NetInfo from '@react-native-community/netinfo';
import axios, {formToJSON} from 'axios';

import SQLite from 'react-native-sqlite-storage';
import {check} from 'react-native-permissions';
import RemoteUrls from '../apiUrl';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import LottieView from 'lottie-react-native';
import PopUp from '../PopUp/PopUp';
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';
import {fetchssl} from 'react-native-ssl-pinning';
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const MasterSync = () => {
  const {height} = Dimensions.get('window');
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const [visiblesnackbar, setVisibleSnackBar] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnackBar(!visiblesnackbar);
  const onDismissSnackBar = () => setVisibleSnackBar(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [popupVisible, setPopupVisible] = React.useState(false);
  const showModal = () => {
    setPopupVisible(true);
  };
  const handleHideModal = checkboxesData => {
    setPopupVisible(false); // Example: Update stateItems with checkboxesData
  };

  const hideModal = () => {
    setPopupVisible(false);
    fetchItems();
  };
  // const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isConnected, setIsConnected] = useState(null);
  // const [selectedItem, setSelectedItem] = useState(null);
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [items, setItems] = useState([]);
  const options = [
    {apiname: 'State Master', status: false},
    {apiname: 'City Master', status: false},
    {apiname: 'District Master', status: false},
    {apiname: 'Pincode Master', status: false},
    {apiname: 'Vehicle Type Master', status: false},
    {apiname: 'Vehicle Make Master', status: false},
    {apiname: 'Vehicle Modal Master', status: false},
    // { apiname: 'Photo Category', status: false },
  ];

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
    fetchItems();
    setTimeout(() => {
      setData([]);
      // fetchData();
      setRefreshing(false);
    }, 1000); // Simulated delay
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
  const mainmethod = async () => {
    setupMultiLanguageDatabase();
    fetchingthelanguagedata();
    setupStateDatabase();
    setupPinCodeDatabase();
    setupTractorMakeDatabase();
    setupTractorModelDatabase();
    setupBrandNasadmeDatabase();
    setupProductNameDatabase();
    setupTyreSizeDatabase();
    setupOldTyreBrandNameDatabase();
    setupOldTyreCompanyDatabase();
    setupVehicleTypeDatabase();
    setupVehicleVariantDatabase();
    setupMasterSyncUpdateDatabase();
    fetchStateItems();
    fetchPinCodeItems();
    fetchTractorMakeItems();
    fetchTractorModelItems();
    fetchBrandNasadmeItems();
    fetchProductNameItems();
    fetchTyreSizeItems();
    fetchOldTyreBrandNameItems();
    fetchOldTyreCompanyItems();
    fetchItems();
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
  const fetchItems = async () => {
    try {
      const fetchedItems = await getAllMasterSyncUpdateItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };
  const [syncValueCheck, setSyncValueCheck] = useState({
    isState: false,
    isPincode: false,
    isMake: false,
    isModel: false,
    isBrandName: false,
    isProductName: false,
    isTyreSize: false,
    isoldtyrebrandname: false,
    isoldtyrecompanyname: false,
  });
  // const colorchange=[{
  //   syncValueCheck
  // }]

  const [stateItem, setStateItem] = useState();
  const [pincodeItems, setPinCodeItems] = useState();
  const [makeItems, setMakeItems] = useState();
  const [modelItems, setModelItems] = useState();
  const [brandnameItems, setBrandNameItems] = useState();
  const [productnameItems, setProductNameItems] = useState();
  const [tyresizeItems, setTyreSizeItems] = useState();
  const [oldtyrebrandnameItems, setOldTyreBrandNameItems] = useState();
  const [oldtyrecompanyItems, setOldTyreCompanyItems] = useState();
  const fetchStateItems = async () => {
    try {
      const itemsFromDb = await getAllStateItems();
      const formattedItems = itemsFromDb.map(item => ({
        key: item.StateID.toString(),
        value: item.StateName,
      }));
      setStateItem(formattedItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchPinCodeItems = async () => {
    try {
      const itemsFromDb = await getAllPinCodeItems();
      const pincodeItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.AreaName,
      }));
      setPinCodeItems(pincodeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchTractorMakeItems = async () => {
    try {
      const itemsFromDb = await getAllTractorMakeItems();
      const makeItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.MakeName,
      }));
      setMakeItems(makeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchTractorModelItems = async () => {
    try {
      const itemsFromDb = await getAllTractorModelItems();
      const modelItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.ModelName,
      }));
      setModelItems(modelItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchBrandNasadmeItems = async () => {
    try {
      const itemsFromDb = await getAllBrandNasadmeItems();
      const brandnameItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.BrandName,
      }));
      setBrandNameItems(brandnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchProductNameItems = async () => {
    try {
      const itemsFromDb = await getAllProductNameItems();
      const productnameItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.ProductName,
      }));
      setProductNameItems(productnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchTyreSizeItems = async () => {
    try {
      const itemsFromDb = await getAllTyreSizeItems();
      const tyresizeItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.size_name,
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
        key: item.id.toString(),
        value: item.brand_pattern,
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
        key: item.id.toString(),
        value: item.tyre_company_name,
      }));
      setOldTyreCompanyItems(oldtyrecompanyItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [loading, setLoading] = useState(false);

  // const getstatedata = async () => {

  // }
  const handleSyncAllPress = async () => {
    if (isConnected === false) {
      Alert.alert('', 'Please check the internet!');
      return;
    }
    showModal();

    try {
      navigation.navigate('PopUp');

      setLoading(true);
      await getstatedata();

      await getmakedata();

      await getmodeldata();
      await getbrandnamedata();
      await getproductnamedata();
      await gettyresizedata();
      await getoldtyrecomapanydata();
      await getoldtyrebranddata();
      await getvehicletypedata();
      await getvehicletvariantdata();
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong');
      //     // Handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  const getstatedata = async () => {
    try {
      const heaaders = await GetHeader();
      const stateresponse = await axios.get(RemoteUrls.getStateUrl, {
        headers: heaaders,
      });

      if (stateresponse.status === 200) {
        await clearStateTable('states');
        await insertStateItems(stateresponse.data);

        await updateMasterSyncUpdateItem(languagedata.nav_StateMaster, true);
      } else {
        await updateMasterSyncUpdateItem(languagedata.nav_StateMaster, false);

        Alert.alert('Error', 'fetching state data faild');
        await updateMasterSyncUpdateItem('State Master', false);
        setErrorMessage('fetching state data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(languagedata.nav_StateMaster, false);

      Alert.alert('Error', 'fetching state data faild');
      await updateMasterSyncUpdateItem('State Master', false);
      setErrorMessage('fetching state data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getmakedata = async () => {
    try {
      const heaaders = await GetHeader();
      const makeresponse = await axios.get(RemoteUrls.getVehicleMakeUrl, {
        headers: heaaders,
      });
      if (makeresponse.status === 200) {
        await clearTractorMakeTable('tractormake');
        await insertTractorMakeItems(makeresponse.data);
        await updateMasterSyncUpdateItem(
          languagedata.nav_VehicleMakeMaster,
          true,
        );
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.nav_VehicleMakeMaster,
          false,
        );

        Alert.alert('Error', 'fetching tractormake data faild');
        setErrorMessage('fetching tractormake data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(
        languagedata.nav_VehicleMakeMaster,
        false,
      );

      Alert.alert('Error', 'fetching tractormake data faild');
      setErrorMessage('fetching tractormake data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getmodeldata = async () => {
    try {
      const heaaders = await GetHeader();
      const modelresponse = await axios.get(RemoteUrls.getVehicleModelUrl, {
        headers: heaaders,
      });
      if (modelresponse.status === 200) {
        await clearTractorModelTable('tractormodel');
        await insertTractorModelItems(modelresponse.data);
        await updateMasterSyncUpdateItem(
          languagedata.nav_VehicleModelMaster,
          true,
        );
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.nav_VehicleModelMaster,
          false,
        );

        Alert.alert('Error', 'fetching tractormodel data faild');
        setErrorMessage('fetching tractormodel data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(
        languagedata.nav_VehicleModelMaster,
        false,
      );

      Alert.alert('Error', 'fetching tractormodel data faild');
      setErrorMessage('fetching tractormodel data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getbrandnamedata = async () => {
    try {
      const heaaders = await GetHeader();
      const brandnameresponse = await axios.get(RemoteUrls.getTyreBrandUrl, {
        headers: heaaders,
      });
      if (brandnameresponse.status === 200) {
        await clearBrandNasadmeTable('brandname');
        await insertBrandNasadmeItems(brandnameresponse.data);
        await updateMasterSyncUpdateItem(
          languagedata.lbl_TyreBrandMaster,
          true,
        );
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.lbl_TyreBrandMaster,
          false,
        );

        Alert.alert('Error', 'fetching brandname data faild');
        setErrorMessage('fetching brandname data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(languagedata.lbl_TyreBrandMaster, false);

      Alert.alert('Error', 'fetching brandname data faild');
      setErrorMessage('fetching brandname data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getproductnamedata = async () => {
    try {
      const heaaders = await GetHeader();
      const productnameresponse = await axios.get(RemoteUrls.getProductUrl, {
        headers: heaaders,
      });
      if (productnameresponse.status === 200) {
        await clearProductNameTable('productname');
        await insertProductNameItems(productnameresponse.data);
        await updateMasterSyncUpdateItem(
          languagedata.lbl_ProductNameMaster,
          true,
        );
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.lbl_ProductNameMaster,
          false,
        );

        Alert.alert('Error', 'fetching productname data faild');
        setErrorMessage('fetching productname data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(
        languagedata.lbl_ProductNameMaster,
        false,
      );

      Alert.alert('Error', 'fetching productname data faild');
      setErrorMessage('fetching productname data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const gettyresizedata = async () => {
    try {
      const heaaders = await GetHeader();
      const tyresizeresponse = await axios.get(RemoteUrls.getTyreSizeUrl, {
        headers: heaaders,
      });
      if (tyresizeresponse.status === 200) {
        await clearTyreSizeTable('tyresize');
        await insertTyreSizeItems(tyresizeresponse.data);
        await updateMasterSyncUpdateItem(languagedata.lbl_TyreSizeMaster, true);
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.lbl_TyreSizeMaster,
          false,
        );

        Alert.alert('Error', 'fetching tyresize data faild');

        setErrorMessage('fetching tyresize data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(languagedata.lbl_TyreSizeMaster, false);

      Alert.alert('Error', 'fetching tyresize data faild');
      setErrorMessage('fetching tyresize data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getoldtyrecomapanydata = async () => {
    try {
      const heaaders = await GetHeader();
      const oldtyrecompanyresponse = await axios.get(
        RemoteUrls.getOldTyreCompanyUrl,
        {
          headers: heaaders,
        },
      );
      if (oldtyrecompanyresponse.status === 200) {
        await clearOldTyreCompanyTable('oldtyrecompany');
        await insertOldTyreCompanyItems(oldtyrecompanyresponse.data);
        await updateMasterSyncUpdateItem(
          languagedata.lbl_OldTyreCompanyMaster,
          true,
        );
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.lbl_OldTyreCompanyMaster,
          false,
        );

        Alert.alert('Error', 'fetching oldtyrecompany data faild');
        setErrorMessage('fetching oldtyrecompany data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(
        languagedata.lbl_OldTyreCompanyMaster,
        false,
      );

      Alert.alert('Error', 'fetching oldtyrecompany data faild');
      setErrorMessage('fetching oldtyrecompany data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getoldtyrebranddata = async () => {
    try {
      const heaaders = await GetHeader();
      const oldtyrebrandresponse = await axios.get(
        RemoteUrls.getOldTyreBrandUrl,
        {
          headers: heaaders,
        },
      );
      if (oldtyrebrandresponse.status === 200) {
        await clearOldTyreBrandNameTable('oldtyrebrandname');
        await insertOldTyreBrandNameItems(oldtyrebrandresponse.data);
        await updateMasterSyncUpdateItem(
          languagedata.lbl_OldTyreBrandMaster,
          true,
        );
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.lbl_OldTyreBrandMaster,
          false,
        );

        Alert.alert('Error', 'fetching oldtyrebrandname data faild');
        setErrorMessage('fetching oldtyrebrandname data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(
        languagedata.lbl_OldTyreBrandMaster,
        false,
      );

      Alert.alert('Error', 'fetching oldtyrebrandname data faild');
      setErrorMessage('fetching oldtyrebrandname data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getvehicletypedata = async () => {
    try {
      const heaaders = await GetHeader();
      const vehiicleType = await axios.get(RemoteUrls.getVehicleTypeUrl, {
        headers: heaaders,
      });
      if (vehiicleType.status === 200) {
        await clearVehicleTypeTable();

        await insertVehicleTypeItems(vehiicleType.data);
        await updateMasterSyncUpdateItem(
          languagedata.nav_VehicleTypeMaster,
          true,
        );
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.nav_VehicleTypeMaster,
          false,
        );

        Alert.alert('Error', 'fetching vehiicleType data faild');
        setErrorMessage('fetching vehiicleType data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(
        languagedata.nav_VehicleTypeMaster,
        false,
      );

      Alert.alert('Error', 'fetching vehiicleType data faild');
      setErrorMessage('fetching vehiicleType data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getvehicletvariantdata = async () => {
    try {
      const heaaders = await GetHeader();
      const vehicleVariant = await axios.get(RemoteUrls.getVehicleVariantUrl, {
        headers: heaaders,
      });
      if (vehicleVariant.status === 200) {
        await clearVehicleVariantTable();
        await insertVehicleVariantItems(vehicleVariant.data);
        await updateMasterSyncUpdateItem(
          languagedata.lbl_VehicleVariantMaster,
          true,
        );
      } else {
        await updateMasterSyncUpdateItem(
          languagedata.lbl_VehicleVariantMaster,
          false,
        );

        Alert.alert('Error', 'fetching vehicleVariant data faild');
        setErrorMessage('fetching vehicleVariant data faild');
        onToggleSnackBar();
      }
    } catch (error) {
      await updateMasterSyncUpdateItem(
        languagedata.lbl_VehicleVariantMaster,
        false,
      );

      Alert.alert('Error', 'fetching vehicleVariant data faild');
      setErrorMessage('fetching vehicleVariant data faild');
      onToggleSnackBar();
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };

  const [fetchingiindivisualdataloading, setfetchingiindivisualdataloading] =
    useState(false);
  const onDismissloadingSnackBar = () =>
    setfetchingiindivisualdataloading(false);

  const fetchdatabysingle = async apiname => {
    const fetchedItems = await getAllMasterSyncUpdateItems();

    const itemsFromDb = await getAllStateItems();
    if (apiname === fetchedItems[1].apiname) {
      if (itemsFromDb.length !== 0) {
        showModal();
        return;
      }
      if (itemsFromDb.length === 0) {
        Alert.alert('Error', `Please sync the ${apiname} first.`);
        return;
      }
    }
    try {
      setfetchingiindivisualdataloading(true);
      if (apiname === fetchedItems[0].apiname) {
        await getstatedata();
        await fetchItems();
      }

      if (apiname === fetchedItems[2].apiname) {
        await getmakedata();
        await fetchItems();
      }
      if (apiname === fetchedItems[3].apiname) {
        await getmodeldata();
        await fetchItems();
      }
      if (apiname === fetchedItems[4].apiname) {
        await getbrandnamedata();
        await fetchItems();
      }
      if (apiname === fetchedItems[5].apiname) {
        await getproductnamedata();
        await fetchItems();
      }
      if (apiname === fetchedItems[6].apiname) {
        await gettyresizedata();
        await fetchItems();
      }
      if (apiname === fetchedItems[7].apiname) {
        await getoldtyrecomapanydata();
        await fetchItems();
      }
      if (apiname === fetchedItems[8].apiname) {
        await getoldtyrebranddata();
        await fetchItems();
      }
      if (apiname === fetchedItems[9].apiname) {
        await getvehicletypedata();
        await fetchItems();
      }
      if (apiname === fetchedItems[10].apiname) {
        await getvehicletvariantdata();
        await fetchItems();
      }
      setfetchingiindivisualdataloading(false);
    } catch (err) {
      setfetchingiindivisualdataloading(false);

      console.log(err);
    }
  };
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <>
          {isConnected ? (
            <ScrollView contentContainerStyle={styles.container}>
              {/* Conditional rendering based on popup visibility */}
              <View>
                <Snackbar
                  visible={visiblesnackbar}
                  onDismiss={onDismissSnackBar}>
                  {errorMessage}
                </Snackbar>
                {/* {
                      fetchingiindivisualdataloading === true ?
                        <View style={{ position: 'absolute', top: 0, zIndex: 99 }}><Text>test</Text></View>
                        : <></>
                    } */}
                {/* <Snackbar

                      visible={fetchingiindivisualdataloading}
                      onDismiss={onDismissloadingSnackBar}>
                      <View style={{ flexDirection: 'row' }}><Text style={{ color: 'white' }}>Fetching data...</Text><ActivityIndicator size={'small'} color={'white'} /></View>
                    </Snackbar> */}

                <View>
                  {/* <Modal
                    transparent={true}
                    visible={loading}
                    onRequestClose={() => {
                      setLoading(!loading);
                    }}
                  >
                    <View >
                      <View>
                        <ActivityIndicator size="large" color="black" />
                        <Text>Fetching...</Text>
                      </View>
                    </View>
                  </Modal> */}
                  <Text style={styles.heading}>
                    {languagedata.lbl_Master_Sync}
                  </Text>

                  {items.map((item, index) => (
                    <TouchableOpacity
                      // key={index}
                      style={styles.button}
                      onPress={() => fetchdatabysingle(item.apiname)}>
                      {/* <Text style={styles.buttonText}>{item.label}</Text> */}
                      <Text style={styles.buttonText}>{item.apiname}</Text>
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor:
                              item.status === 1 ? '#30c749' : '#c73030',
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                  {/* {loading ? (
                    <TouchableOpacity style={styles.syncAllButton}>
                      <ActivityIndicator size="large" color="black" />
                      <Text> {languagedata.lbl_Pleasewait}...</Text>
                    </TouchableOpacity>
                  ) : ( */}
                  <TouchableOpacity
                    style={styles.syncAllButton}
                    onPress={handleSyncAllPress}>
                    <Text style={styles.syncAllButtonText}>
                      {languagedata.lbl_SYNCALL}
                    </Text>
                  </TouchableOpacity>
                  {/* )} */}
                </View>

                {/* <PopUp
                    visible={popupVisible}
                    hideModal={hideModal}
                    onHideModalWithData={handleSyncSelected}
                  /> */}
              </View>
            </ScrollView>
          ) : (
            // (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            //   <Text style={{
            //     textAlign: 'center', fontSize: 20, color: 'red',
            //     fontWeight: 'bold',
            //   }}>Internet Connection is required!</Text>
            // </View>)
            <View
              style={{
                height,
                width,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
              }}>
              <View
                style={{
                  padding: 0,
                  margin: 0,
                  backgroundColor: 'white',
                  alignSelf: 'center',
                }}>
                <LottieView
                  source={require('./../../assets/Animation_1724236945180.json')}
                  autoPlay
                  loop
                  style={{
                    width: 300,
                    height: 300,
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  fontSize: 23,
                  color: '#333',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {languagedata.lbl_you_offline}
              </Text>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default MasterSync;
