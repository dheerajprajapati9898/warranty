import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/LoginScreen/LoginScreen';
import { LoginOTP } from './src/screens/OtpScreen/OtpScreen';
import styles from './src/assets/theme/Mainstyles';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import WarrantyRegistrationForm from './src/screens/RegistrationScreen/RegistrationScreen';
import MPinLoginScreen from './src/screens/MPinLoginScreen/MPinLoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import Dashboard from './src/screens/DashboardScreen/DashScreen';
import Outbox from './src/screens/OutboxScreen/OutboxScreen';
import AddImage from './src/screens/AddImageScreen/AddImageScreen';
import HelpAndSupport from './src/screens/HelpAndSupportScreen/HelpAndSupportScreen';
import { createDrawerNavigator } from "@react-navigation/drawer";
import MPinCreationScreen from './src/screens/MPinCreationScreen/MPinCreationScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen/ResetPasswordScreen';
import MasterSync from './src/screens/MasterSyncScreen/MasterSyncScreen';
import FeedbackScreen from './src/screens/FeedbackScreen/FeedbackScreen';
import DefaultSettingScreen from './src/screens/DefaultSettingScreen/DefaultSettingScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import ViewPDF from './src/screens/ViewPDF/ViewPDF';
import { setupLoginDatabase, getAllLoginItems, insertLoginItems } from "./src/db/Login/Login"
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import Logout from './src/screens/Logout/Logout';
import UploadMissingImage from './src/screens/UploadMissingImage/UploadMissingImage';
import LoginWithOTP from './src/screens/LoginWihtOTP/LoginWithOTP';
import { setupMultiLanguageDatabase, getAllMultiLanguageItems } from './src/db/multilanguage/multilanguage';
import LeadDetails from './src/screens/LeadDetails';
import ResetPasswordScreenscopy from './src/screens/ResetPasswordScreen/ResetPasswordScreencopy';
import MPinCreationScreencopy from './src/screens/MPinCreationScreen/MPinCreationScreencopy';
import UpdateWarrantyRegistration from './src/screens/UpdateWarrantyRegistration/UpdateWarrantyRegistration';
import PopUp from './src/screens/PopUp/PopUp';
import { Text } from 'react-native-paper';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function LogoTitle() {
  return (
    <Image
      style={styles.yokohamaLogo}
      source={require('./src/assets/images/logo/logo4.png')}
    />
  );
}

const DrawerNavigator = () => {
  const [languagedata, setlanguagedata] = useState(null);
  const [defaultsetting, setdefaultsetting] = useState('Default Setting');
  const [home, sethome] = useState('Home');
  const [Profile, setProfile] = useState('Profile');
  const [Masters, setMasters] = useState('Masters');
  const [HelpAndSupports, setHelpAndSupport] = useState('HelpAndSupport');
  const [ChangePassword, setChangePassword] = useState('ChangePassword');
  const [Logouttst, setLogout] = useState('Logout');
  const [CreateMPINsss, setCreateMPIN] = useState('CreateMPIN');

  const fetchingthelanguagedata = async () => {
    try {
      const dsasdas = await getAllMultiLanguageItems();
      const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
      const hheo = JSON.parse(removedTing);
      console.log("last", hheo);

      setlanguagedata(hheo);
      setdefaultsetting(hheo.lbl_DefaultSetting)
      sethome(hheo.lbl_Home)
      setProfile(hheo.lbl_Profile)
      setMasters(hheo.lbl_Masters)
      setHelpAndSupport(hheo.lbl_HelpAndSupport)
      setChangePassword(hheo.lbl_ChangePassword)
      setLogout(hheo.button_Logout)
      setCreateMPIN(hheo.lbl_CreateMPIN)
      console.log("setting the value");
    } catch (error) {
      console.log(error);
    }
  };

  const methodcall = async () => {
    await setupMultiLanguageDatabase();
    await fetchingthelanguagedata();
  };

  useEffect(() => {
    methodcall();
  }, []);


  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: 'black', width: 200 },
        drawerLabelStyle: { color: 'white' },
        drawerActiveTintColor: 'red',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ // Use dynamic title
          drawerLabel: `${home}`,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ // Use dynamic title
          drawerLabel: `${Profile}`,

          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />

      <Drawer.Screen
        name="Masters"
        component={MasterSync}
        options={{ // Use dynamic title
          drawerLabel: `${Masters}`,

          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />

      <Drawer.Screen
        name="Default Setting"
        component={DefaultSettingScreen}
        options={{ // Use dynamic title
          drawerLabel: `${defaultsetting}`,

          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />
      <Drawer.Screen name='Change Password' component={ResetPasswordScreenscopy}
        options={{
          drawerLabel: `${ChangePassword}`,

          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: 'black',
          }
        }}
      />
      <Stack.Screen name='CreateMPINs' component={MPinCreationScreencopy}
        options={{
          drawerLabel: `${CreateMPINsss}`,

          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: 'black',
          }
        }}
      />

      <Drawer.Screen
        name="HelpAndSupport"
        component={HelpAndSupport}
        options={{ // Use dynamic title
          drawerLabel: `${HelpAndSupports}`,

          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />
      <Drawer.Screen
        name="Logout" component={Logout}
        options={{ // Use dynamic title
          drawerLabel: `${Logouttst}`,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [languagedata, setlanguagedata] = useState(null);
  const fetchingthelanguagedata = async () => {
    try {
      const dsasdas = await getAllMultiLanguageItems()
      const removedTing = dsasdas.value.slice(1, dsasdas.value.length - 1);
      const hheo = JSON.parse(removedTing);
      console.log("last", hheo);

      setlanguagedata(hheo)
      console.log("setting the value");

    } catch (error) {
      console.log(error);

    }

  }
  const methodcall = async () => {
    await setupMultiLanguageDatabase()
    await fetchingthelanguagedata()
  }
  useEffect(() => {
    methodcall()
  }, [])
  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName='SplashScreen'>

        <Stack.Screen name='SplashScreen' component={SplashScreen}
          options={{
            // headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }} />
        <Stack.Screen name='ChangePassword' component={ResetPasswordScreen}
          options={{
            title: 'Change Password',
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />

        <Stack.Screen name='HelpAndSupport' component={HelpAndSupport}
          options={{
            title: 'Change Password',
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='UpdateWarrantyRegistration' component={UpdateWarrantyRegistration}
          options={{
            // drawerLabel: `${CreateMPINsss}`,

            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='Login' component={Login}
          options={{
            headerTitle: () => <LogoTitle />,
            headerTitleAlign: 'center',
            headerStyle: {

              backgroundColor: 'black',
            }
          }} />
        <Stack.Screen name='MPIN_Login' component={MPinLoginScreen}
          options={{
            headerTitleAlign: 'center',

            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='MPinCreationScreencopy' component={MPinCreationScreencopy}
          options={{
            headerTitleAlign: 'center',

            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        {/* <Stack.Screen name='LoginOTP' component={LoginOTP}
          options={{
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        /> */}


        {/* <Stack.Screen name='Forgot_password' component={ForgotPasswordScreen}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        /> */}
        <Stack.Screen name='CreateMPIN' component={MPinCreationScreen}
          options={{
            title: 'Create MPIN',
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='ViewPDF' component={ViewPDF}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='Home' component={HomeScreen}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />

        <Stack.Screen name='Registration' component={WarrantyRegistrationForm}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />

        <Stack.Screen name='AddImageasdasdas' component={AddImage}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='Outbox' component={Outbox}
          options={{
            title: 'Draft',
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='Lead' component={LeadDetails}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />

        <Stack.Screen name='Dashboard' component={Dashboard}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='LoginWithOTP' component={LoginWithOTP}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='UploadMissingImage' component={UploadMissingImage}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name="PopUp" component={PopUp}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name="HomeDrawer" component={DrawerNavigator}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerShown: false,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>

  );
}



export default App;
