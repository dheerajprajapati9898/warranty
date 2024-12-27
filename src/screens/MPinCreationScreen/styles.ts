import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // maincontainner: {
  //   height: height,
  // },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
  },

  root: { flex: 1 },
  title: { textAlign: 'center', fontSize: 30, marginTop: 10 },
  cell: {
    marginBottom: 10,
    margin: 4,
    width: 60,
    height: 60,

    // lineHeight: 38,
    fontSize: 40,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#e11e30',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#e11e30',
  },
  headerText: {
    color: '#000',
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
  mpinContainer: {
    flexDirection: 'row',
  },
  mpinInput: {
    height: 50,
    width: 50,
    borderColor: '#e11e30',
    borderWidth: 1,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    fontFamily: 'Poppins_700Bold',
  },
  button: {
    // marginTop: 10,
    // width: '70%',
    backgroundColor: '#e11e30',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 80,
  },
  button1: {
    // marginTop: 10,
    // width: '70%',
    backgroundColor: '#e11e30',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
});
export default styles;
