import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  headerText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 5,
  },
  root: { flex: 1 },
  title: { textAlign: 'center', fontSize: 30 },
  cell: {
    color: 'white',
    borderRadius: 10,
    margin: 4,
    width: 60,
    height: 60,
    // borderBottomColor: 'white',
    // lineHeight: 38,
    fontSize: 40,
    borderWidth: 2,
    borderColor: '#FF0000',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#e11e30',
  },
  mpinContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  mpinInput: {
    height: 50,
    width: 50,
    borderColor: '#FF0000',
    borderWidth: 1,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 24,
    color: '#FFF',
    fontFamily: 'Poppins_700Bold',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    marginHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    fontWeight: 'bold',
    marginHorizontal: 40,
  },
});

export default styles;
