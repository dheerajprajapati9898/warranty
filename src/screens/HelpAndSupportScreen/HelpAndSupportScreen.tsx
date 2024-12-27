import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
// import { ThemedView } from '@/components/ThemedView';
import styles from './style';
import {
  setupMultiLanguageDatabase,
  getAllMultiLanguageItems,
  insertMultiLanguageItems,
  clearMultiLanguageTable,
} from './../../db/multilanguage/multilanguage';
import {useEffect, useState} from 'react';
export default function HelpAndSupport() {
  const handleWhatsAppPress = () => {
    const phoneNumber = '+918591874895';
    const url = 'https://wa.me/${+918591874895}';

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
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
  useEffect(() => {
    setupMultiLanguageDatabase();
    fetchingthelanguagedata();
  }, []);
  return (
    <>
      {languagedata === null ? (
        <ActivityIndicator size={'small'} color={'black'} />
      ) : (
        <View style={styles.container}>
          <View style={styles.contactContainer}>
            <Text style={styles.contactText}>
              {languagedata.lbl_ContactUs}{' '}
            </Text>
          </View>

          <View style={styles.boxContainer}>
            <View style={styles.box}>
              <Text style={styles.label}>{languagedata.lbl_ContactNo}</Text>
              <Text style={[styles.field, styles.redText]}>+91 8591874895</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>{languagedata.lbl_WhatsApp}</Text>
              <TouchableOpacity
                style={styles.whatsappButton}
                onPress={handleWhatsAppPress}>
                <Text style={styles.whatsappText}>
                  {languagedata.lbl_SendWhatsAppMsg}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>{languagedata.lbl_Email}</Text>
              <Text style={[styles.field, styles.redText]}>
                warrantyuat.yokohama-oht.com
              </Text>
            </View>
          </View>

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
        </View>
      )}
    </>
  );
}
