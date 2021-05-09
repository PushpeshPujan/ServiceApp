import React, { Component } from "react";
import { asyncPost, BASE_URL } from "./../utils/utils"
import { LoginStyles as styles } from "../styelsheets/MainStyle";
import { Keyboard, Text, View, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import imageConstantURI from "../constants/imageConst"
import Config from "react-native-config";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';

const appId = "1047121222092614"

export default class Login extends Component {
  componentName = "Login"
  constructor(props) {

    super(props);
    global.props = this.props
    global.usedScreenList = []
    global.screenName = this.componentName
    this.state = { showError: false }

  }
  onChangeText = (text, key) => {
    this.state[key] = text
    //this.setState({key:text})
  }
  handleKeyDown = (e) => {
    if (e == "next") {
      this.passwordInput.focus()
    } else if (e == "login") {
      this.onLoginPress(null)
    }
  }
  render2() {
    return (
      <View style={{ flex: 1, backgroundColor: "#0f1c22", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#f4f5fb", marginHorizontal: 65, height: 200, borderRadius: 20 }}>
          <View style={{ backgroundColor: "#ffffff", alignItems: "center", flexDirection: "row", justifyContent: "space-evenly", marginHorizontal: 0, height: 100, borderRadius: 20 }}>
            <View style={{ backgroundColor: "#0f1c22", width: 35, height: 35, borderRadius: 10, }}>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Name</Text>
            <View style={{ backgroundColor: "#0f1c22", width: 35, height: 35, borderRadius: 10, }}>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Balance</Text>
          </View>
        </View>
      </View>
    )
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">


        <View style={styles.loginScreenContainer}>

          <View style={styles.loginFormView}>

            <View style={{ paddingBottom: 10, alignItems: 'center', height: 100, marginBottom: 60, }}>
              <Image source={imageConstantURI.brand.src}
                style={{ width: 100, height: 100, alignItems: 'center', borderRadius: 100 / 2 }} />
              <Text style={styles.logoText} >{Config.COMPANY_NAME?Config.COMPANY_NAME:"Company Name"}</Text>
            </View>
            {this.state.showError ? <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "center", marginHorizontal: 15 }}>
              User name or password is incorrect{"\n"}please <Text style={{ fontWeight: 'bold', color: "red", textDecorationLine: "underline" }}>Call support</Text>
            </Text> : null}

            <TextInput placeholder="Username" autoCompleteType={"username"} keyboardType={'visible-password'} autoCorrect={false} autoCapitalize={"none"} placeholderColor="#c4c3cb" style={styles.loginFormTextInput} onChangeText={text => this.onChangeText(text, "username")} returnKeyType={"next"} onSubmitEditing={() => { this.handleKeyDown("next") }} />
            <TextInput placeholder="Password" ref={(ref) => { this.passwordInput = ref }} placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true} onChangeText={text => this.onChangeText(text, "password")} returnKeyType={"done"} onSubmitEditing={() => { this.handleKeyDown("login") }} />
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => this.onLoginPress(null)}
              title="Login"
            />
            <Button
              buttonStyle={styles.fbLoginButton}
              onPress={() => this.onFbLoginPress()}
              title="Login with Google"
              color="#3897f1"
            />

          </View>
          <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "center", marginHorizontal: 15, color: "#00acc1", marginBottom: 20 }}>
            Forgot username or password?
</Text>
        </View>

      </KeyboardAvoidingView>
    );
  }
  shouldComponentUpdate(prop) {
    return global.screenName == this.componentName
  }
  componentDidMount() {
    if (global.hideFoofer) global.hideFoofer();
    this.props.navigation.addListener('willFocus', () => {
      if (global.hideFoofer) global.hideFoofer();
      global.usedScreenList = []
      global.setScreenName(this.componentName)

    })
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId: '740578883684-noph8bpmqblva8jq8fpv934ojctsk2u7.apps.googleusercontent.com',
      androidClientId: '740578883684-9h9bo03mc6flvaclvehpq5l519t5b30b.apps.googleusercontent.com',
      scopes: ['profile', 'email']
    });
  }

  componentWillUnmount() {
  }
  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      //Get the User details as user is already signed in
      this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
      console.log('Please Login');
    }
    this.setState({ gettingLoginStatus: false });
  };

  _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('User Info --> ', userInfo);
      this.setState({ userInfo: userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  _signIn = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      if (userInfo.serverAuthCode && userInfo.serverAuthCode != "") {
        const oo = {}
        oo.userid = userInfo.user.email
        oo.password = userInfo.serverAuthCode
        oo.firstname = userInfo.user.givenName
        oo.lastname = userInfo.user.familyName
        oo.profileimage = userInfo.user.photo
        oo.siciallogin = "yes"
        this.onLoginPress(oo)
      } else {
        alert("Can't access your profile")
      }

    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
      alert("Can't access your profile")
    }
  };

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ userInfo: null }); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  onLoginPress = async (data) => {
    var oo = {}
    const url = BASE_URL + "signin"
    if (!data) {
      const { username, password } = this.state
      oo.username = username
      oo.password = password
      oo.siciallogin = "no"
      console.log("username,password  ", username, password)

    } else {
      oo = data
    }

    const d = await asyncPost(url, oo, true);
    console.log("result  ", d)
    if (d.status == 200) {
      global.userData = d.data;
      global.isUserLoggedin = true
      global.sessiontoken = d.data.sessionToken
      global.baseUrl = BASE_URL
      global.dispatchNav("Dashboard", this.props)
    } else {
      this.setState({ showError: true })
    }

    //
  }

  async onFbLoginPress() {
    this._signIn()
  }
}