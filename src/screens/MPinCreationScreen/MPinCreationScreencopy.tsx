import React, {useEffect, useState, useRef, useCallback} from 'react';
import styles from './styles';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setupPinDatabase,
  insertPinItems,
  getAllPinItems,
  updatePinItems,
} from './../../db/pin/pin';
import {setIsLogin} from './../../components/SharedPreference';
import {updateLoginItem, getAllLoginItems} from './../../db/Login/Login';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Button, Snackbar} from 'react-native-paper';
import {
  getAllMultiLanguageItems,
  setupMultiLanguageDatabase,
} from '../../db/multilanguage/multilanguage';
import {AESExtensions} from '../AESExtensions';
const MPinCreationScreen = () => {
  const navigation = useNavigation();
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
  useFocusEffect(
    useCallback(() => {
      setupPinDatabase();
      getthepin();
      setupMultiLanguageDatabase();
      fetchingthelanguagedata();
      setValue('');
      setconfirmpin('');
      setisbuttonchange(false);
    }, []),
  );
  const getthepin = async () => {
    try {
      const itemsFromDb = await getAllPinItems();
      const makeItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.pin,
      }));
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const [confirmpin, setconfirmpin] = useState('');
  const ref = useRef();
  const ref1 = useRef();

  const getCellOnLayoutHandler = index => {
    // Example handler for cell layout if needed
    return ({
      nativeEvent: {
        layout: {width},
      },
    }) => {
      // Do something with cell layout if needed
    };
  };

  const getCellOnLayoutHandler1 = index => {
    // Example handler for cell layout if needed
    return ({
      nativeEvent: {
        layout: {width},
      },
    }) => {
      // Do something with cell layout if needed
    };
  };

  const [visible, setVisible] = useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const [ononfaildvisible, setonfaildVisible] = useState(false);
  const onfaildDismissSnackBar = () => setonfaildVisible(false);
  const [showconfirmmpin, setshowconfirmmpin] = useState(false);
  const [moinvalidation, setmoinvalidation] = useState(false);
  const onregexDismissSnackBar = () => setmoinvalidation(false);

  const [isbuttonchange, setisbuttonchange] = useState(false);
  const contactRegex = /^[0-9+\-]+$/;
  const handleMPinSubmit = async () => {
    const userData = await getAllLoginItems();

    // if (!contactRegex.test(value)) {
    //   Alert.alert('Validation Error', 'MPin can only contain digits.');
    //   return;
    // }
    // if (!contactRegex.test(confirmpin)) {
    //   Alert.alert('Validation Error', 'MPin can only contain digits.');
    //   return;
    // }

    if (value.length !== 4) {
      setVisible(true);
      return;
    }
    if (value) {
      if (!contactRegex.test(value)) {
        setmoinvalidation(true);
        return;
      }
    }

    if (value.length === 4) {
      setisbuttonchange(true);
    }
  };
  const handleMPinconfirmnverifySubmit = async () => {
    const savedUserId = await AsyncStorage.getItem('userid');
    if (confirmpin.length !== 4) {
      setVisible(true);
      return;
    }
    if (confirmpin) {
      if (!contactRegex.test(confirmpin)) {
        setmoinvalidation(true);
        return;
      }
    }
    if (value != confirmpin) {
      setonfaildVisible(true);
      return;
    }
    if (confirmpin.length === 4) {
      await setIsLogin('true');
      const encryptedmpin = AESExtensions.encryptString(confirmpin);
      await updatePinItems(encryptedmpin);
      // return
      await updateLoginItem(savedUserId, encryptedmpin);
      Alert.alert(
        `${languagedata.lbl_MPinSet}`,
        `${languagedata.lbl_YourMPinhasbeensetsuccessfully}`,
        [{text: `${languagedata.lbl_Ok}`}],
      );
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeDrawer'}],
        }),
      );
      // navigation.replace('HomeDrawer');
    }
  };
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Snackbar
            visible={visible}
            duration={1500}
            onDismiss={onDismissSnackBar}
            action={{
              label: `${languagedata.lbl_close}`,
              onPress: () => {
                // Do something
              },
            }}>
            {languagedata.lbl_Pleaseentera4_digitMPin}
          </Snackbar>
          <Snackbar
            visible={moinvalidation}
            duration={1500}
            onDismiss={onregexDismissSnackBar}
            action={{
              label: `${languagedata.lbl_close}`,
              onPress: () => {
                // Do something
              },
            }}>
            {languagedata.lbl_MPincanonlycontaindigits}
          </Snackbar>
          <Snackbar
            visible={ononfaildvisible}
            duration={1500}
            onDismiss={onfaildDismissSnackBar}
            action={{
              label: `${languagedata.lbl_close}`,
              onPress: () => {
                // Do something
              },
            }}>
            {languagedata.lbl_MPindoesntmatch}
          </Snackbar>
          {isbuttonchange ? (
            <>
              <Text style={styles.headerText}>
                {languagedata.lbl_ConfirmYourMPin}
              </Text>

              {/*{/* Second CodeField for confirming PIN */}
              <CodeField
                ref={ref1}
                value={confirmpin}
                onChangeText={setconfirmpin} // Ensure setconfirmpin is properly defined and used here
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete={Platform.select({
                  android: 'sms-otp',
                  default: 'one-time-code',
                })}
                testID="my-code-input-confirm"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler1(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </>
          ) : (
            <>
              <Text style={styles.headerText}>
                {languagedata.lbl_SetYourMPin}
              </Text>

              <CodeField
                ref={ref}
                value={value}
                onChangeText={setValue} // Ensure setValue is properly defined and used here
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete={Platform.select({
                  android: 'sms-otp',
                  default: 'one-time-code',
                })}
                testID="my-code-input"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </>
          )}

          {/* Text for confirming M-Pin */}

          {isbuttonchange ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleMPinconfirmnverifySubmit}>
              <Text style={styles.buttonText}>
                {languagedata.lbl_ConfirmSubmit}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleMPinSubmit}>
              <Text style={styles.buttonText}>{languagedata.Submit}</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default MPinCreationScreen;
