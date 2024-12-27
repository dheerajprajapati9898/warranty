import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    maincontainer: { margin: 15 },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    container: { height: height - 150 },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 5,
        marginLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'

    },
    modalView: {
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



    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10, // Adjusted marginLeft to move the red dot to the left
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 10, // Added paddingLeft to move text a bit to the right
    },


    popupOKButton: {
        marginHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 10,
        backgroundColor: '#E11E30',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    syncAllButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
