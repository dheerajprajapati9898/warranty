import AsyncStorage from '@react-native-async-storage/async-storage';
import { AESExtensions } from './AESExtensions';
import axios from 'axios';
import RemoteUrls from './apiUrl';

// Function to retrieve both authorization and sessionid
const GetLoginResponse = async () => {
    try {
        // Retrieve the 'Authorization' and 'SessionID' from AsyncStorage
        const authorization = await AsyncStorage.getItem('Authorization');
        const enpassword = await AsyncStorage.getItem('Password');
        const username = await AsyncStorage.getItem('Username');
        const decreptedpassword = AESExtensions.decryptpasswordString(
            enpassword,
        );
        console.log("password check", authorization);

        console.log("password", decreptedpassword);
        const requestdata = {
            Username: username,
            Password: decreptedpassword,
        };
        const encryptedlogindata = AESExtensions.encryptString(requestdata);
        console.log("encryptedlogindataasdasdadasdasdasdasdasdasd", encryptedlogindata);
        const payload = {
            requestId: "",
            isEncrypt: "",
            requestData: encryptedlogindata,
            sessionExpiryTime: "",
            userId: ""
        };

        console.log("login sucessfull", authorization);


        // return
        // Return both values as an object
        const response = await axios.post(RemoteUrls.postloginUrl, payload, {
            headers: {
                Authentication: authorization
            }
        });


        if (response.status === 200) {
            await AsyncStorage.setItem('SessionID', '')
            const plaintextoflogindata = AESExtensions.decryptString(
                response.data.responseData,
            );


            await AsyncStorage.setItem('SessionID', plaintextoflogindata.SessionID === null ? '' : plaintextoflogindata.SessionID);
            const seeessionid = await AsyncStorage.getItem('SessionID')
            console.log("seeessionid", seeessionid);
        }


        return response.status
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
        return error // Handle the error case as needed
    }
};



export default GetLoginResponse;
