import React, { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { setupMultiLanguageDatabase, getAllMultiLanguageItems, insertMultiLanguageItems, clearMultiLanguageTable } from './../db/multilanguage/multilanguage'
import { setupLeadShowDatabase, getAllLeadShowItems, insertLeadShowItems, clearLeadShowTable } from './../db/leadshow/leadshow'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
const LeadDetails = () => {
    useEffect(() => {
        setupMultiLanguageDatabase()
        fetchingthelanguagedata()
        setupLeadShowDatabase()
        fetchwarrantyregistration()

    }, [])
    const [warrantyregistrationdataa, setwarrantyregistrationdataa] = useState([]);

    const fetchwarrantyregistration = async () => {
        const savedUserId = await AsyncStorage.getItem('userid');
        const warrantyregistrationdata = await getAllLeadShowItems(savedUserId)
        console.log("warrantyregistrationdata", warrantyregistrationdata);

        setwarrantyregistrationdataa(warrantyregistrationdata)
    }
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

    const renderItem = ({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>
                Warranty ID: {item.warrantyid}
            </Text>
            <Text>
                Mobile Number: {item.mmobilenumber}
            </Text>
        </View>
    );
    return (
        <>

            {
                languagedata === null ?
                    <ActivityIndicator size={'small'} color={'black'} /> :

                    // <ScrollView>
                    <View style={{ padding: 10, borderRadius: 10 }}>
                        <Text style={{ fontFamily: 20, color: 'black', textAlign: 'center' }}>{languagedata.lblWarrantyRegistration}</Text>
                        {
                            warrantyregistrationdataa.length === 0 ?
                                <ActivityIndicator size={'small'} color={'black'} /> :
                                <FlatList
                                    scrollEnabled={false} // Set to true if you want scrolling enabled
                                    data={warrantyregistrationdataa}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id.toString()}
                                />
                        }

                    </View>
                // </ScrollView>
            }
        </>

    )
}

export default LeadDetails
