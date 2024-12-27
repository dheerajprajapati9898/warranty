
import { Dimensions, Text, View } from 'react-native'

const YouAreOffline = () => {
    const { height } = Dimensions.get('window');
    const { width } = Dimensions.get('window');
    return (
        <View style= {{ height, width, backgroundColor: 'white', justifyContent: 'center', alignContent: 'center', flexDirection: 'column' }
}>
    <View style={ { padding: 0, margin: 0, backgroundColor: 'white', alignSelf: 'center' } }>
        <LottieView source={ require('./../../assets/Animation_1724236945180.json') } autoPlay loop style = {{ width: 300, height: 300, justifyContent: 'center', alignContent: 'center', }} />
            </View>
            < Text style = {{
    marginTop: 20,
        fontSize: 23,
            color: '#333',
                textAlign: 'center',
                    fontWeight: 'bold'
}}> You are Offline! < /Text></View > 
  )
}

export default YouAreOffline
