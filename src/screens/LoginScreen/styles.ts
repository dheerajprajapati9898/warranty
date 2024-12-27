import { Dimensions, StyleSheet } from "react-native";
const { height } = Dimensions.get('window');
const styles = StyleSheet.create({

  container: {
    // flexDirection: 'column',
    flex: 1,
    backgroundColor: '#000',
  },

  checkexplorelogoContainer: {
    // backgroundColor: '#000',
    alignItems: 'center',
  },

  checkexploreLogo: {
    height: 100,
    width: 100,
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
  yokohamalogo: {
    height: 130,
    width: 180,
    // position: 'absolute',
    left: 100,
    paddingBottom: 10,
  },

  checktext: {
    color: '#008080',
  },

  exploretext: {
    color: '#DFFF00',
  },

  placeholdertext: {
    color: 'red',
  },

  contentContainer: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#000',

  },

  logintext: {
    color: '#fff',
    marginVertical: 15,
    fontSize: 18,
    alignItems: 'center',
    fontFamily: 'monospace',
  },

  MPinLoginText: {
    color: '#e11e30',
    // paddingBottom: 30,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Roboto',
    marginVertical: 10,
  },

  forgot_password_text: {
    color: '#e11e30',
    paddingBottom: 30,
    fontSize: 16,
    alignItems: 'center',
    paddingLeft: 40,
    fontFamily: 'Roboto',
    textDecorationLine: 'underline'
  },

  helpandsupporttext: {
    color: '#e11e30',
    // paddingBottom: 10,
    fontSize: 15,
    alignItems: 'center',
    // paddingLeft: 40,
    fontFamily: 'Roboto',
    textDecorationLine: 'underline',
  },

  contacttext: {
    color: 'white',
    // paddingBottom: 10,
    fontSize: 15,
    alignItems: 'center',
    paddingLeft: 40,
    fontFamily: 'Roboto',
  },


  languageredtext: {
    color: 'red',
    fontSize: 15,
    fontFamily: 'Roboto',
  },

  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 7,
    marginVertical: 10
  },

  loginbutton: {
    backgroundColor: "#e11e30",
    // height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginVertical: 10
  },

  loginbuttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  powerByText: {
    color: 'white',
  },
  inner_container: {
    margin: 20,
    marginTop: 55
  },
  selectlanguagecontainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  checklogoContainer: {
    height: height - 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;