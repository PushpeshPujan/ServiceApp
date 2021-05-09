import { StyleSheet, Dimensions } from 'react-native';


const DeviceWidth = Dimensions.get('window').width;

export const LayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: DeviceWidth,
  },
  squareButtonCard:{
    flexDirection: "column",  minHeight:70, padding:5,  marginBottom:20,marginHorizontal:4,flex:1,backgroundColor:"#ecf0f6" , paddingVertical:5,
  },
  card:{
    paddingVertical:15,
    elevation:3,
borderRadius:8, 
width: DeviceWidth - 30,
backgroundColor: "#fff"
}
});

export const LoginStyles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 20,

    textAlign: 'center',
  },
  loginFormView: {
    flex: 1,
    justifyContent:"center"
  },
  loginFormTextInput: {
    height: 45,
    fontSize: 16,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    
    color:"#00acc1",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,

  
  },

  longButton: {
    backgroundColor: '#00acc1',
    borderRadius: 5,
    height: 45,

    fontSize:16,
  },

  loginButton: {
    backgroundColor: '#00acc1',
    borderRadius: 5,
    height: 45,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    fontSize:16,
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: '#00acc1',
    marginLeft: 15,
    marginRight: 15,
    fontSize:16,
  },
});

