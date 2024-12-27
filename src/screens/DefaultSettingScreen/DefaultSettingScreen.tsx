import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {List, Checkbox, Button} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';
import styles from './style';
import {RadioButton} from 'react-native-paper';
import Icons from 'react-native-vector-icons/AntDesign';

import {
  setupStateDatabase,
  getAllStateItems,
  clearStateTable,
} from './../../db/Registration/StateDb';
import {
  setupSettingDatabase,
  getSettingItems,
  insertSettingItems,
  clearSettingTable,
  updateSettingItems,
  getSettingbyuseridItems,
} from './../../db/setting/settings';
import RemoteUrls from '../apiUrl';
import {
  clearPinCodeTable,
  getAllPinCodedataItems,
  getAllPinCodeItems,
  insertPinCodeItems,
} from '../../db/Registration/PinCodeDb';
import {updateMasterSyncUpdateItem} from '../../db/MasterSyncUpdate/MasterSyncUpdate';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import {log} from '@react-native-firebase/crashlytics';
const DefaultSettingScreen = () => {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [regNo, setRegNo] = useState('');
  const [insurer, setInsurer] = useState('Oriental Insurance');
  const [photoCompression, setPhotoCompression] = useState();
  const [leadAlert, setLeadAlert] = useState('');
  const [selfInspection, setSelfInspection] = useState('');
  const [status, setStatus] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = React.useState('');
  const Districtdata = [
    {label: 'Mumbai', value: 'Mumbai'},
    {label: 'Ahmedabad', value: 'Ahmedabad'},
  ];
  const navigation = useNavigation();

  const RadioButtonColor = '#e11e30';
  const switchTrackColor = {false: '#767577', true: '#f4f3f4'};
  const switchThumbColor = status ? '#e11e30' : '#f4f3f4';
  const [qualityCompressionOption, setQualityCompressionOption] =
    useState(null);
  const [isSelectedQualityCompression, setIsSelectedQualityCompression] =
    useState(false);

  const handleQualityCompressionChange = option => {
    setQualityCompressionOption(option);
    if (option === 'available') {
      setIsSelectedQualityCompression(true); // Set state for available option
    } else {
      setIsSelectedQualityCompression(false); // Set state for other options
    }
  };
  const clearSettings = async () => {
    setState('');
    setDistrict('');
    setVehicleType('');
    setRegNo('');
    setInsurer('Oriental Insurance');
    setPhotoCompression(60);
    setLeadAlert('');
    setSelfInspection('');
    setStatus(true);
    setRememberMe(false);
    await AsyncStorage.setItem('checksettingsaced', 'false');
  };
  const [stateItems, setStateItems] = useState();
  const [stateItemsa, setStateItemsa] = useState();
  const [piuncodedata, setpiuncodedata] = useState();
  const [piuncodedataloading, setpiuncodedataloading] = useState(false);
  const methodcall = async () => {
    await setupMultiLanguageDatabase();
    await fetchingthelanguagedata();
    await setupStateDatabase();
    await setupSettingDatabase();
    await fetchStateItems();
    await fetchsettingdata();
    await fetchPinCodeItems(settingdata.state_id, settingdata.statename);
    setStatedatavalue(null);
    setPincodelist([]);
    const settingchecksave = await AsyncStorage.getItem('checksettingsaced');
    setchecksettingsaced(settingchecksave);
  };
  useFocusEffect(
    useCallback(() => {
      methodcall();
    }, []),
  );
  const [settingdata, setsettingdata] = useState(null);
  const [areapincode, setareapincode] = useState(null);
  const fetchsettingdata = async () => {
    try {
      const dsasdas = await getSettingbyuseridItems();

      setsettingdata(dsasdas[0]);
      setareapincode(dsasdas[0].areapincode);
    } catch (error) {
      console.log(error);
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
  const [customerDetails, setCustomerDetails] = useState({
    statename: '',
  });
  const handleCustomerDetailsChange = (field, value) => {
    setCustomerDetails(prevState => ({...prevState, [field]: value}));
  };

  const [stateObjectofkey, setStateObjectofkey] = useState('');
  const getStateObjectByName = async stateName => {
    const getstateItems = await getAllStateItems();
    const getstate = getstateItems.filter(
      state => state.statename === stateName,
    );
    setStateObjectofkey(getstate[0].stateid);
  };
  const [statedatatoinsert, setstatedatatoinsert] = useState();
  const [Stateitemdata, setStateitemdata] = useState([]);
  const [Statedatavalue, setStatedatavalue] = useState(null);
  const [Statedataid, setStatedataid] = useState(null);
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
  const [pincodeItems, setPinCodeItems] = useState();
  const [pincodedata, setpincodedata] = useState([]);
  const fetchPinCodeItems = async (stateid, statename) => {
    var id = stateid.toString();

    try {
      const itemsFromDb = await getAllPinCodeItems(id);
      const pincodeItems = itemsFromDb.map(item => ({
        key: item.pincodeid,
        value: item.areapincode,
      }));

      if (pincodeItems.length === 0) {
        Alert.alert(
          'Error',
          `${languagedata.lbl_syncStateMessage} ${statename} ${languagedata.State}`,
        );
        return;
      }
      // if (pincodedata.length > 0) {
      setStatedatavalue(statename);
      setStatedataid(stateid);
      // }
      setpincodedata(pincodeItems);
      setPinCodeItems(pincodeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [pincodelist, setPincodelist] = useState([]);
  const getPincode = async pincodevalue => {
    const getpincodeItems = await getAllPinCodedataItems(pincodevalue);
    setPincodelist(getpincodeItems[0]);
  };
  const [checksettingsaced, setchecksettingsaced] = useState();

  const saveSettings = async () => {
    if (Statedatavalue === null) {
      Alert.alert('Error', `${languagedata.rfvSelectState}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    if (pincodevaluedata === null) {
      Alert.alert('Error', `${languagedata.lbl_PinCodeisrequired}`, [
        {text: `${languagedata.lbl_Ok}`},
      ]);
      return;
    }
    const savedUserId = await AsyncStorage.getItem('userid');
    try {
      await clearSettingTable('setting');
      await insertSettingItems(
        Statedatavalue,
        Statedataid,
        pincodelist.areapincode,
        pincodelist.cityvillageid,
        pincodelist.cityvillagename,
        pincodelist.districtid,
        pincodelist.districtname,
        pincodelist.pincodeid,
        savedUserId,
      );
      // setchecksettingsaced(true)
      await AsyncStorage.setItem('checksettingsaced', 'true');

      const settingchecksave = await AsyncStorage.getItem('checksettingsaced');
      setchecksettingsaced(settingchecksave);
      setQualityCompressionOption(null);
      setCustomerDetails({
        statename: '',
      });
      Alert.alert('Success', `${languagedata.lbl_data_saved}`, [
        {
          text: `${languagedata.lbl_Ok}`,
          onPress: () => {
            // Navigate to another screen after pressing OK
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };
  const updatesetting = async () => {
    if (Statedatavalue === null && pincodevaluedata === null) {
      Alert.alert(
        'Alert',
        'No data has been changed. Do you want to continue?',
        [
          {text: 'Home', onPress: () => navigation.goBack()},
          {
            text: 'Update',
            onPress: () => {},
          },
        ],
      );
      return;
    }
    if (Statedatavalue === null) {
      if (settingdata === null) {
        Alert.alert('Error', `${languagedata.lbl_Stateisrequired}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
    }
    if (Statedatavalue != null) {
      if (pincodevaluedata === null) {
        Alert.alert('Error', `${languagedata.lbl_PinCodeisrequired}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
    }

    if (pincodevaluedata === null) {
      if (settingdata.areapincode === null) {
        Alert.alert('Error', `${languagedata.lbl_PinCodeisrequired}`, [
          {text: `${languagedata.lbl_Ok}`},
        ]);
        return;
      }
    }

    try {
      const savedUserId = await AsyncStorage.getItem('userid');

      if (pincodelist.length !== 0 && Statedatavalue !== null) {
        await updateSettingItems(
          Statedatavalue,
          Statedataid,
          pincodelist.areapincode,
          pincodelist.cityvillageid,
          pincodelist.cityvillagename,
          pincodelist.districtid,
          pincodelist.districtname,
          pincodelist.pincodeid,
          savedUserId,
        );
      } else {
        await updateSettingItems(
          settingdata.statename,
          settingdata.state_id,
          pincodelist.areapincode,
          pincodelist.cityvillageid,
          pincodelist.cityvillagename,
          pincodelist.districtid,
          pincodelist.districtname,
          pincodelist.pincodeid,
          savedUserId,
        );
      }

      Alert.alert('Success', `${languagedata.lbl_data_saved}`, [
        {
          text: `${languagedata.lbl_Ok}`,
          onPress: () => {
            // Navigate to another screen after pressing OK
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error(error);
    }
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
      <Text style={{paddingBottom: 5, paddingTop: 5}}>{item.value}</Text>
    </Pressable>
  );

  const [Statedatas, setStatedatas] = useState(null);
  const handleStateItemSelect = item => {
    if (pincodevaluedata != null) {
      setpincodevaluedata(null);
    }
    setareapincode(null);
    setStatedatas(item.value);
    setsearchStateQuery('');
    setisStatemodalPopup(false); // Close the modal
    handleCustomerDetailsChange('state', item.value);
    getStateObjectByName(item.value);
    setstatedatatoinsert(item);
    fetchPinCodeItems(item.key, item.value);
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
    setSearchQuery('');
    // setSelectedItem(item); // Store selected item if needed
    setpincodemodelopup(false); // Close the modal
    setpincodevaluedata(item.value);
    getPincode(item.value);
    handleCustomerDetailsChange('pinCode', item.value);
  };
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <View style={styles.outerContainer}>
          {/* <View style={styles.innerContainer}> */}
          <Text style={styles.label}>{languagedata.lbl_DefaultState}</Text>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isStatemodalPopup}
            onRequestClose={() => {
              setisStatemodalPopup(false);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.innermodalview}>
                  <Text style={styles.modalheader}>{languagedata.State}</Text>
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
                    paddingHorizontal: 10,
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
                  />
                ) : (
                  <FlatList
                    keyboardShouldPersistTaps={'always'}
                    style={{marginTop: 10, width: '100%'}}
                    data={filteredStateData}
                    renderItem={renderStateItem}
                    keyExtractor={item => item.value}
                  />
                )}
              </View>
            </View>
          </Modal>
          <View>
            <View style={styles.text_view}>
              <View style={styles.input}>
                <TouchableOpacity
                  style={{padding: 10}}
                  onPress={() => setisStatemodalPopup(true)}>
                  {Statedatavalue === null ? (
                    <>
                      {settingdata != null ? (
                        <Text>{settingdata.statename}</Text>
                      ) : (
                        <Text>{languagedata.State}</Text>
                      )}
                    </>
                  ) : (
                    <Text>{Statedatavalue}</Text>
                  )}
                  {/* {
                      settingdata != null ?
                        <Text >
                          {settingdata.statename}
                        </Text> :
                        <Text >
                          {Statedatavalue === null ? <Text>{languagedata.State}</Text> : Statedatavalue}
                        </Text>
                    } */}
                </TouchableOpacity>
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
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.innermodalview}>
                  <Text style={styles.modalheader}>
                    {languagedata.lblPinCode}
                  </Text>

                  <Pressable
                    style={{marginBottom: 10}}
                    onPress={() => setpincodemodelopup(false)} // Close modal directly
                  >
                    <Icons name="closecircleo" size={20} />
                  </Pressable>
                </View>
                <TextInput
                  keyboardType="number-pad"
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    width: '100%',
                    paddingHorizontal: 10,
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
            </View>
          </Modal>

          <Text style={styles.label}>{languagedata.lbl_DefaultPinCode}</Text>
          <View style={styles.input}>
            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => setpincodemodelopup(true)}>
              {pincodevaluedata === null ? (
                <>
                  {settingdata != null ? (
                    <Text>{areapincode}</Text>
                  ) : (
                    <Text>{languagedata.PinCode}</Text>
                  )}
                </>
              ) : (
                <Text>{pincodevaluedata}</Text>
              )}
              {/* {
                  settingdata != null ?
                    <Text >
                      {settingdata.areapincode}
                    </Text> :
                    <Text >
                      {pincodevaluedata === null ? <Text> {languagedata.PinCode} </Text> : pincodevaluedata}
                    </Text>
                } */}
            </TouchableOpacity>
          </View>
          {/* {
        pincodevaluedata === null ?
          <Text>
            adsadasd
          </Text> :
          <Text>{pincodevaluedata}</Text>
      } */}

          {checksettingsaced === 'true' ? (
            <Button
              mode="contained"
              style={styles.button}
              onPress={updatesetting}>
              <Text> {languagedata.lbl_Update}</Text>
            </Button>
          ) : (
            <Button
              mode="contained"
              style={styles.button}
              onPress={saveSettings}>
              <Text>{languagedata.lbl_Save}</Text>
            </Button>
          )}
        </View>
      )}
    </>
  );
};

export default DefaultSettingScreen;
