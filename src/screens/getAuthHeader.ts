import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to retrieve both authorization and sessionid
const GetAuthHeaders = async () => {
    try {
        // Retrieve the 'Authorization' and 'SessionID' from AsyncStorage
        const authorization = await AsyncStorage.getItem('Authorization');
        const sessionid = await AsyncStorage.getItem('SessionID');
        console.log("new session", sessionid);

        // Return both values as an object
        return { authorization, sessionid };
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
        return null; // Handle the error case as needed
    }
};

// Function to retrieve the headers and format them correctly
const GetHeader = async () => {
    const header = await GetAuthHeaders();
    console.log("header checking", header);

    // Check if headers were successfully retrieved and return them properly formatted
    if (header) {
        return {
            // Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*",
            Authentication: header.authorization, // Authorization header
            SessionID: header.sessionid,           // SessionID header
            // Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
        };
    } else {
        // In case no headers are found, return empty or default headers
        return {
            Authentication: null,
            SessionID: null,
        };
    }
};

export default GetHeader;
