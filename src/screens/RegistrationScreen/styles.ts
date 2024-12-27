import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
        container: {
                padding: 20,
                backgroundColor: '#D3D3D3',
        },
        calenderbutton: {
                flex: 0.5,
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                marginLeft: 4,
                borderRadius: 5,
        },
        selectText: {
                fontSize: 16,
                color: 'black',
        },
        optionText: {
                fontSize: 16,
                borderRadius: 50,
                borderColor: 'black',
                borderWidth: 1,
                color: 'black',
        },
        sectionText: {
                color: 'black',
        },
        selector: {
                width: '80%',
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 4,
        },
        centeredView1: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 22,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        modalView1: {
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 35,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                        width: 0,
                        height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
        },
        centeredView: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },

        centeredView12: {
                flex: 1,
                // justifyContent: 'center',
                // alignItems: 'center',
                // paddingTop: 22,
                // backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        modalContent: {
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                alignItems: 'center',
                width: '80%',
        },
        modalheader: { fontWeight: 'bold', color: 'black', fontSize: 15 },
        innermodalview: { flexDirection: 'row', justifyContent: 'space-between' },
        modalView: {
                backgroundColor: 'white',
                borderRadius: 5,
                padding: 16,
                margin: 20,
                height: 400,
                width: '80%',
                // alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                        width: 0,
                        height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                // justifyContent: 'center',
                // alignSelf: 'center',
                // flex: 1,
                // justifyContent: 'center',
                // alignContent: 'center'
        },
        headerText: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#e11e30',
                marginBottom: 20,
                justifyContent: 'center',
                textDecorationLine: 'underline',
        },

        sectionHeaderContainer: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#A3A3A3',
                paddingLeft: 10,
                paddingRight: 10,
                marginBottom: 5,
                paddingVertical: 5,
        },

        sectionHeader: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#000',
                // color: '#ff0000',
                marginVertical: 10,
        },

        outer_view: { flex: 0.5, flexDirection: 'row' },

        label_view: { width: '30%', justifyContent: 'center', paddingRight: 10 },
        label_View_text_style: { fontWeight: 'bold' },

        text_view: { width: '70%' },

        input: {
                borderWidth: 1,
                borderColor: 'gray',
                color: '#000',
                padding: 10,
                marginVertical: 5,
                backgroundColor: 'white',
                // textAlign:'center'
                // paddingLeft : 10
        },
        textarea: {
                borderWidth: 1,
                borderColor: 'gray',
                color: '#000',
                padding: 10,
                //     margin: 150,
                marginVertical: 5,
                backgroundColor: 'white',
                // textAlign:'center'
                // paddingLeft : 10
        },
        input1: {
                borderWidth: 1,
                borderColor: 'gray',
                color: '#000',
                // padding: 10,
                marginVertical: 5,
                backgroundColor: 'white',
                // textAlign:'center'
                // paddingLeft : 10
        },

        Serial_number_input_view: {
                flexDirection: 'row',
                flex: 0.5,
                // padding: 10
        },

        Serial_number_input_small: {
                borderWidth: 1,
                borderColor: 'gray',
                color: '#000',
                padding: 10,
                marginVertical: 5,
                backgroundColor: 'white',
                width: '20%',
                textAlign: 'center',
        },

        Serial_number_input: {
                borderWidth: 1,
                borderColor: 'gray',
                color: '#000',
                // padding: 10,
                marginVertical: 5,
                backgroundColor: 'white',
                minWidth: '40%',
                textAlign: 'center',
        },
        cameraButton: {
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                borderRadius: 5,
                flexDirection: 'row',
                flex: 0.5,
                justifyContent: 'space-between',
                alignContent: 'center',
        },
        button: {
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                borderRadius: 5,
                flexDirection: 'row',
                flex: 0.5,
                justifyContent: 'space-between',
                alignContent: 'center',
        },
        search_button: {
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                borderRadius: 5,
                alignItems: 'center',
                // alignContent:'center',
                // justifyContent : 'space-around'
        },

        buttonText: {
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
        },

        camera: {
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: 400,
                backgroundColor: '#000',
        },

        cameraControls: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                padding: 20,
        },

        capturedImage: {
                width: 200,
                height: 200,
                marginVertical: 10,
        },

        radioButton: {
                backgroundColor: '#D3D3D3',
                // backgroundColor: 'black',
        },

        radioLabel: {
                fontSize: 15,
                width: '88%',
                color: 'black',
        },
        toggleButton: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 20,
                paddingLeft: 20,
        },

        dropdownshow: {
                borderRadius: 0,
                borderWidth: 0,
                borderTopWidth: 1,
        },

        submit_button: {
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                borderRadius: 5,
                alignItems: 'center',
                marginHorizontal: 5,
                width: '48%',
                // alignContent:'center',
                // justifyContent : 'space-around'
        },
});

export default styles;