import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D3D3D3',
  },
  innerContainer: {
    flexDirection: 'column',
  },
  label: {
    // marginTop: 16,
    fontSize: 16,
    color: 'black',
    marginVertical: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    marginBottom: 10,
    // marginTop: 8,
    color: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalheader: { fontWeight: 'bold', color: 'black', fontSize: 15 },
  innermodalview: { flexDirection: 'row', justifyContent: 'space-between' },

  modalView: {
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    margin: 20,
    height: 400,
    width: '80%',
    // alignItems: "center",
    shadowColor: "#000",
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
  statusContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  rememberMeContainer: {
    flex: 0.5,
    flexDirection: 'row',
    // justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 6
  },
  button: {
    // marginVertical: 8,
    backgroundColor: '#e11e30',
    borderRadius: 5,
    marginVertical: 7
  },

  radioButtonContainer: {
    flex: 0.5,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'center',
  },

  redioButtonItemContainer: { width: '35%', flexDirection: 'row', alignItems: 'center' },

  radioButton: {

    backgroundColor: '#D3D3D3',
    // backgroundColor: 'black',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 5,
    padding: 10
  },
  radioLabel: {
    color: '#000',
  },
});

export default styles;