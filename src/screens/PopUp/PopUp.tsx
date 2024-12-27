import React, {useState, useEffect, useRef} from 'react';
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
  Platform,
  SafeAreaView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import {
  setupPinCodeDatabase,
  insertPinCodeItems,
  getAllPinCodeItems,
  clearPinCodeTable,
} from './../../db/Registration/PinCodeDb';

import {
  setupMasterSyncUpdateDatabase,
  getAllMasterSyncUpdateItems,
  insertMasterSyncUpdateItems,
  clearMasterSyncUpdateTable,
  updateMasterSyncUpdateItem,
} from './../../db/MasterSyncUpdate/MasterSyncUpdate';
import {CommonActions, useNavigation} from '@react-navigation/native';

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
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';

import {fetchssl} from 'react-native-ssl-pinning';

const PopUp = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [checkboxes, setCheckboxes] = useState([]);
  const isAnyCheckboxChecked = checkboxes.some(checkbox => checkbox.checked);
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
  useEffect(() => {
    setupMultiLanguageDatabase();
    fetchingthelanguagedata();

    fetchData();
    fetchItems();
  }, []);
  const fetchItems = async () => {
    try {
      const fetchedItems = await getAllMasterSyncUpdateItems();
    } catch (error) {
      console.error(error);
    }
  };
  const fetchData = async () => {
    try {
      const heaaders = await GetHeader();
      const stateresponse = await axios.get(RemoteUrls.getStateUrl, {
        headers: heaaders,
      });
      const initialState = stateresponse.data.map(state => ({
        id: state.stateid,
        label: state.statename,
        checked: false,
      }));
      setCheckboxes(initialState);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching state data:', error);
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
      setLoading(false);
    }
  };
  const [selectedStateId, serSelectedStateId] = useState([]);
  // const [pincodeItems, setPinCodeItems] = useState();

  //-----calling the post pincode api----
  const getDistrictMasterFromStateID = async selectedIds => {
    // setonOksubmitloading(true)

    const payload = {
      stateID: selectedIds,
    };
    try {
      const heaaders = await GetHeader();
      const pincoderesponse = await axios.post(
        RemoteUrls.postPincodeUrl,
        payload,
        {
          headers: heaaders,
        },
      );

      const data = pincoderesponse.data;
      insertPinCodeItems(data, selectedIds);
      await updateMasterSyncUpdateItem(languagedata.nav_PinCodeMaster, true);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching state data:', error);
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index, checkbox) => {
    serSelectedStateId([]);
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].checked = !newCheckboxes[index].checked;
    setCheckboxes(newCheckboxes);
    const result = newCheckboxes.filter(item => item.checked === true);
    let updatedIds = [...selectedStateId];

    result.forEach(item => {
      if (item.checked === true) {
        // Add ID if it is checked
        if (!updatedIds.includes(item.id)) {
          updatedIds.push(item.id);
        }
      }
    });
    serSelectedStateId(updatedIds);
  };
  const [onOksubmitloading, setonOksubmitloading] = useState(false);
  const handlestateidloop = async () => {
    setonOksubmitloading(true); // Set loading to true

    try {
      // Execute all promises concurrently
      await Promise.all(
        selectedStateId.map(async element => {
          try {
            await onHideModalWithDataHandler(element);
          } catch (error) {
            console.error(
              'Error in onHideModalWithDataHandler for ID',
              element,
              ':',
              error,
            );
            // Handle individual error if necessary
          }
        }),
      ).then(element => {
        navigation.goBack();
        Alert.alert('Success', `${languagedata.lbl_data_added_successfully}`, [
          {
            text: `${languagedata.lbl_Ok}`,
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
        return element;
      });

      // Success alert after all promises have resolved

      // hideModal();
      fetchItems();
    } catch (error) {
      console.error('Error during processing:', error);
      Alert.alert('Error', 'An error occurred while processing the data.');
    } finally {
      setonOksubmitloading(false); // Set loading to false
    }
  };

  const onHideModalWithDataHandler = async selectedStateId => {
    try {
      await getDistrictMasterFromStateID(selectedStateId);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <SafeAreaView>
          <View style={styles.container}>
            {loading ? (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="black" />
                <Text style={{fontSize: 15, margin: 6, fontWeight: 'bold'}}>
                  {languagedata.lbl_loading_state}...
                </Text>
              </View>
            ) : (
              <View style={styles.maincontainer}>
                <Text
                  style={{
                    color: '#E11E30',
                    fontSize: 25,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  {languagedata.lbl_states}
                </Text>
                <Modal
                  transparent={true}
                  visible={onOksubmitloading}
                  onRequestClose={() => {
                    setonOksubmitloading(!onOksubmitloading);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <ActivityIndicator size="large" color="black" />
                      <Text>{languagedata.lbl_fetching_data}...</Text>
                    </View>
                  </View>
                </Modal>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {checkboxes.map((checkbox, index) => (
                    <View style={styles.checkboxContainer} key={index}>
                      <TouchableOpacity
                        onPress={() => handleCheckboxChange(index, checkbox)}>
                        <View
                          style={[
                            styles.checkbox,
                            {
                              backgroundColor: checkbox.checked
                                ? '#E11E30'
                                : '#fff',
                            },
                          ]}>
                          {checkbox.checked && (
                            <Icon name="check" size={15} color="#fff" />
                          )}
                        </View>
                      </TouchableOpacity>
                      <Text
                        style={{color: '#000', fontSize: 15, marginLeft: 10}}>
                        {checkbox.label}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  disabled={!isAnyCheckboxChecked}
                  style={[
                    styles.popupOKButton,
                    {opacity: isAnyCheckboxChecked ? 1 : 0.5},
                  ]}
                  onPress={handlestateidloop}>
                  {onOksubmitloading ? (
                    <ActivityIndicator size={'small'} color={'black'} />
                  ) : (
                    <Text style={styles.syncAllButtonText}>
                      {languagedata.lbl_Ok}
                      {/* Fetch district */}
                    </Text>
                  )}
                </TouchableOpacity>
                {/* <Text>yeasdasdass</Text> */}
              </View>
            )}
          </View>
        </SafeAreaView>
      )}
    </>
  );
};
export default PopUp;
