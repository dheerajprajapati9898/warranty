
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
  },
  headerText: {
    color: '#000',
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    // borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    // borderRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Poppins_400Regular',
    width: '70%',
  },
  button: {
    backgroundColor: '#e11e30',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
})

export default styles;