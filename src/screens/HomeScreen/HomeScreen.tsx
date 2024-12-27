import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Button,
  BackHandler,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import style from './styles';
// import tractor_image from "../../components/images/Tractor_Image";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {setupDatabase} from '../../db/Registration/database';
import {
  Item,
  insertItem,
  getAllItems,
  updateItem,
  deleteItem,
  getAll,
  getTodayWarrantyDashbaordCount,
  getMonthWarrantyDashbaordCount,
  getthewronhome,
} from '../../db/Registration/sqliteOperations';
import {useEffect, useState, useRef, useCallback} from 'react';
import NetInfo from '@react-native-community/netinfo';
import RemoteUrls from '../apiUrl';
import {AESExtensions} from '../AESExtensions';
import {getAllLoginItems, loginInsertChecked} from '../../db/Login/Login';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setupofflinewarrantycountDatabase,
  getAllofflinewarrantycountItems,
  insertofflinewarrantycountItems,
  clearofflinewarrantycountTable,
  updateofflinewarrantycountItems,
} from './../../db/offlinewarrantycount/offlinewarrantycount';
import crashlytics, {log} from '@react-native-firebase/crashlytics';
import {isEmulator, isRooted} from 'react-native-root-protection';
import GetHeader from '../getAuthHeader';
import GetLoginResponse from '../GetLoginResponse';
import {fetch as fetchssl} from 'react-native-ssl-pinning';
const HomeScreen = () => {
  const [isConnected, setIsConnected] = useState(null);
  const navigation = useNavigation();
  const tractor_image = () => require('../../assets/images/tractor_image.webp');
  const iconColor = '#666';
  const iconSize = 40;
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
      // fetchItems()
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    // Simulated refreshing action

    setTimeout(async () => {
      setData([]);

      setRefreshing(false);
    }, 1000);
  };
  // Simulated delay
  const initializeDatabase = async () => {
    const database = await setupDatabase();
    setDb(database);

    await fetchItems(database);
    await offlinewarrantycount(database);

    setItems;
  };
  const mainmethodcall = async () => {
    await onlinemissingimagecount();

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
    await onlinewarrantycount();

    getMissingImageCount();
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  };
  const offlinemethodcall = async () => {
    await setupMultiLanguageDatabase();

    setlanguagedata;

    await initializeDatabase();
    await fetchingthelanguagedata();
    await setupofflinewarrantycountDatabase();
  };
  const offlinewarrantymethodcall = async () => {
    var todaycount = await AsyncStorage.getItem('today_wr_count');
    var monthcount = await AsyncStorage.getItem('month_wr_count');
    var yearcount = await AsyncStorage.getItem('year_wr_count');
    settoday_wr_count(todaycount);
    setmonth_wr_count(monthcount);
    setyear_wr_count(yearcount);
  };
  const handleConnectivityChange = useCallback(async state => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    if (state.isConnected === true) {
      const status = await GetLoginResponse();

      mainmethodcall();
      offlinemethodcall();
      offlinewarrantymethodcall();
    } else {
      offlinemethodcall();
      offlinewarrantymethodcall();
    }
  }, []);
  const checkDeviceSecurity = () => {
    const isCompromised = isRooted() || isEmulator();
    if (isCompromised) {
      Alert.alert(
        'Security Alert',
        'Your device appears to be rooted or running on an emulator. The app will now close for security reasons.',
        [{text: 'OK', onPress: () => BackHandler.exitApp()}],
      );
    } else {
      console.log('Device is secure.');
    }
  };
  useFocusEffect(
    useCallback(() => {
      checkDeviceSecurity();
      const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
      return () => {
        unsubscribe();
      };

      // mainmethodcall();
    }, [handleConnectivityChange]),
  );
  // useEffect(() => {

  // }, [])
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
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [items, setItems] = useState(0);
  const [overallWRCount, setOverallWRCount] = useState(0);
  const [missingimagecount, setmissingimagecount] = useState();
  const [onlineWRCount, setOnlineWRCount] = useState({
    current_day_count: 0,
    current_month_count: 0,
    current_year_count: 0,
  });
  const [missingImage, setMissingImage] = useState({
    WarrantyImageMissingCount: 0,
  });
  const onlinemissingimagecount = async () => {
    const userData = await getAllLoginItems();
    const specificData = {
      Username: userData.Username,
    };

    try {
      const encryptedlogindata = AESExtensions.encryptString(specificData);
      const payload = JSON.stringify({
        requestId: '',
        isEncrypt: '',
        requestData: encryptedlogindata,
        sessionExpiryTime: '',
        userId: '',
      });
      const heaaders = await GetHeader();
      const response = await fetchssl(
        RemoteUrls.postWarrantyImageMissingListUrl,
        {
          method: 'POST',
          body: payload,
          timeoutInterval: 1000,
          // passing the mycert certificate that we
          // generated in the previous steps

          // The certs property is an array of certificates,
          // we are passing mycert as our certificate
          // for ssl pinning
          // 47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
          pkPinning: true,
          sslPinning: {
            // certs: ['sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='],
            certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
          },
          headers: heaaders,
          // headers: heaaders,
        },
      )
        .then(response => response.json())
        .then(async data => {
          const responseData = data.responseData; // Do something with the responseData
          const plaintextoflogindata =
            AESExtensions.decryptString(responseData);

          setmissingimagecount(plaintextoflogindata.length);
        })
        .catch(async error => {
          console.error('Error fetching data:', error);
        });
      return;
    } catch (error) {
      console.error('onlinemissingimagecount', error.response.status);
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  // var todayWRCount = 0
  const [todayWRCount, settodayWRCount] = useState(0);
  const [monthWRCount, setmonthWRCount] = useState(0);
  // var monthWRCount = [];

  const offlinewarrantycount = async (database: SQLiteDatabase) => {
    try {
      // Fetch today's warranty count
      const todayRegistrationCount = await getTodayWarrantyDashbaordCount(
        database,
      );
      settodayWRCount(todayRegistrationCount.length);
      const monthRegistrationCount = await getMonthWarrantyDashbaordCount(
        database,
      );
      setmonthWRCount(monthRegistrationCount.length);
    } catch (error) {
      console.error('Error fetching warranty counts:', error);
    }
  };
  const [datafromtheofflinewrcountdata, setdatadatafromtheofflinewrcount] =
    useState();
  const fetchwrcountfromtheonline = async () => {
    const datafromtheofflinewrcount = await getAllofflinewarrantycountItems();

    setdatadatafromtheofflinewrcount(datafromtheofflinewrcount[0]);
  };
  const [today_wr_count, settoday_wr_count] = useState('');
  const [month_wr_count, setmonth_wr_count] = useState('');
  const [year_wr_count, setyear_wr_count] = useState('');

  const onlinewarrantycount = async () => {
    if (isConnected === false) {
      return;
    }
    const username = await AsyncStorage.getItem('Username');

    const requesdata = {
      User_Name: username,
    };

    const encryptedlogindata = AESExtensions.encryptString(requesdata);

    const payload = JSON.stringify({
      requestId: '',
      isEncrypt: '',
      requestData: encryptedlogindata,
      sessionExpiryTime: '',
      userId: '',
    });
    try {
      const heaaders = await GetHeader();

      const response = await fetchssl(RemoteUrls.getWarrantyCountUrl, {
        method: 'POST',

        body: payload,
        headers: heaaders,
        timeoutInterval: 1000,
        pkPinning: true,
        sslPinning: {
          certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
        },
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(async data => {
          const responseData = data.responseData; // Do something with the responseData
          const plaintextoflogindata =
            AESExtensions.decryptString(responseData);
          setOnlineWRCount(plaintextoflogindata[0]);

          await AsyncStorage.setItem(
            'today_wr_count',
            plaintextoflogindata[0].current_day_count.toString(),
          );

          await AsyncStorage.setItem(
            'month_wr_count',
            plaintextoflogindata[0].current_month_count.toString(),
          );
          await AsyncStorage.setItem(
            'year_wr_count',
            plaintextoflogindata[0].current_year_count.toString(),
          );
        })
        .catch(async error => {
          console.error('Error fetching data:', error);
        });
      return;

      // }
      // if (Ischecktheonlinewcissaved === "true") {
      //   if (isConnected === true) {
      //     await updateofflinewarrantycountItems(plaintextoflogindata[0].current_day_count, plaintextoflogindata[0].current_month_count, plaintextoflogindata[0].current_year_count)
      //   }
      // }
    } catch (error) {
      console.error(' warError fetchingranty count:', error);
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };
  const getMissingImageCount = async () => {
    const payload = JSON.stringify({
      requestId: '',
      isEncrypt: '',
      requestData: '',
      sessionExpiryTime: '',
      userId: '',
    });

    try {
      const heaaders = await GetHeader();

      const response = await fetchssl(
        RemoteUrls.postWarrantyImageMissingListUrl,
        {
          method: 'POST',
          body: payload,
          timeoutInterval: 1000,
          pkPinning: true,
          sslPinning: {
            certs: ['sha256/aIdGrnl0ZUGL3hHt0TgQv0CuikzuWD0gTW7J+FHmNvE='],
          },
        },
      )
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
          const responseData = data.responseData;
          setMissingImage(responseData[0]);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } catch (error) {
      console.error('Error fetching warranty count:', error);
      if (error.response.status === 406) {
        const status = await GetLoginResponse();
      }
    }
  };

  const fetchItems = async (database: SQLiteDatabase) => {
    try {
      const item = await getthewronhome(database);
      if (item === null) {
        setItems(0);
      } else {
        setItems(item);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <ScrollView
          style={style.container}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Adjust scroll event throttle as needed
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <ImageBackground source={tractor_image()} resizeMode="cover">
            <View style={style.tractor_Image_container} />
          </ImageBackground>

          <View style={style.upper_card_container}>
            <Text style={style.warranty_counts_text}>
              {languagedata.lbl_WarrantyCounts}
            </Text>
            <View style={style.cardGroup}>
              <View style={style.text_card}>
                <Text style={style.text}>{languagedata.lbl_Today}</Text>
              </View>

              <View style={style.text_card}>
                <Text style={style.text}>{languagedata.lbl_Monthly}</Text>
              </View>

              <View style={style.text_card}>
                <Text style={style.text}>{languagedata.lbl_Overall}</Text>
              </View>
            </View>

            <View style={style.cardGroup}>
              <View style={style.number_card}>
                <Text style={style.text}>
                  {isConnected === true
                    ? onlineWRCount.current_day_count
                    : todayWRCount + parseInt(today_wr_count)}
                </Text>
              </View>
              <View style={style.number_card}>
                <Text style={style.text}>
                  {isConnected === true
                    ? onlineWRCount.current_month_count
                    : monthWRCount + parseInt(month_wr_count)}
                </Text>
              </View>
              <View style={style.number_card}>
                <Text style={style.text}>
                  {isConnected === true
                    ? onlineWRCount.current_year_count
                    : items.length + parseInt(year_wr_count)}
                </Text>
              </View>
            </View>
          </View>

          <View style={style.lower_card_container}>
            <View style={style.cardGroup}>
              <TouchableOpacity
                style={style.card}
                onPress={() => navigation.navigate('Registration' as never)}>
                <Icon name="wpforms" size={iconSize} color={iconColor} />
                <Text style={style.text}>
                  {languagedata.lblWarrantyRegistration}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.card}
                onPress={() => navigation.navigate('Dashboard' as never)}>
                <Icon name="desktop" size={iconSize} color={iconColor} />
                <Text style={style.text}>{languagedata.Dashboard}</Text>
              </TouchableOpacity>
            </View>

            <View style={style.cardGroup}>
              <TouchableOpacity
                style={style.card}
                onPress={() => {
                  if (isConnected === false) {
                    Alert.alert(
                      '',
                      `${languagedata.lbl_PleasechecktheInternet}`,
                      [{text: `${languagedata.lbl_Ok}`}],
                    );
                    return;
                  }
                  navigation.navigate('AddImageasdasdas' as never);
                }}>
                <Icon name="image" size={iconSize} color={iconColor} />
                <Text style={style.text}>{languagedata.lbl_MissingImages}</Text>
                {isConnected ? (
                  <Text style={{color: 'red'}}>
                    {languagedata.lbl_MissingImageCount} : {missingimagecount}
                  </Text>
                ) : (
                  <Text style={{color: 'red'}}>
                    {languagedata.lbl_MissingImageCount} : 0
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={style.card}
                onPress={() => navigation.navigate('Outbox' as never)}>
                <Icon name="share-square-o" size={iconSize} color={iconColor} />
                <Text style={style.text}>{languagedata.lbl_Draft}</Text>
                <Text style={{color: 'red'}}>
                  {languagedata.lbl_WarrantyCounts} : {items.length}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default HomeScreen;
