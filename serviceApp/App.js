
import React, {Component} from 'react';
import { View,BackHandler } from 'react-native';
import {LayoutStyles} from './src/styelsheets/MainStyle';
import Footer from './src/components/common/Footer';
import AppContainer from './src/RouterContainer';
import Loading from "./src/components/common/Loader"
import Commonactivity from "./src/components/common/Commonactivity"
import { NavigationActions } from 'react-navigation';
import {backToPrevScreen} from "./src/components/common/CommonAction"

global.usedScreenList=[]
global.loading = false
global.isUserLoggedin = false
global.goToPrevScreen =function(__prps){
  backToPrevScreen(__prps)
}
global.setScreenName = function(__screenName){
  global.backCount =0;
  console.log("global.setScreenName  ",__screenName)
   global.screenName = __screenName;
   if(global.usedScreenList.length > 0){
     if( global.usedScreenList[global.usedScreenList.length -1] != __screenName){
      global.usedScreenList.push(__screenName)
     }   
   }else{
    global.usedScreenList.push(__screenName)
   }
   
  }
  global.dispatchNav= function(route,props) {
    global.screenName = route;
    const navigateAction = NavigationActions.navigate({
      routeName: route
  });
  props.navigation.dispatch(navigateAction);
  }
export default class App extends Component {    
  constructor(props){
    super(props);

    this.state= {
       
    };
    global.showHideLoading=this.showLoading
  }
  
componentDidMount() {
  this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //this.hideSaveCancelButton(); 
    //this.props.navigation.goBack(null);
    
    return backToPrevScreen(global.props);
});
}

componentWillUnmount() {

}
 showLoading=(__val,__withDelay=false,__defaultTime=10000)=>{
  global.loading = __val
  if(this.timeoutId){
    clearTimeout(this.timeoutId)
  }
  if(__val){
    this.refs.loadingWin.show();    
    clearTimeout( this.timeoutId)  
    this.timeoutId = setTimeout(this.timeoutCall,20000)
    //store.dispatch({type: "LOADING_START"})
  }else{    
    if(__withDelay){
      clearTimeout( this.timeoutId)     
      this.timeoutId = setTimeout(this.timeoutCall,1000)
    }else{
      this.timeoutCall();
    }
    
  }
  
 }
timeoutCall=()=>{
  if(this.refs.loadingWin.state.show){
    this.refs.loadingWin.close()
    global.loading = false
  }
}


  render() {
       return (    
          <View style={LayoutStyles.container}>    
             
            <AppContainer />
      <Footer   />
      <Loading  ref='loadingWin' />
          </View>
          
        );
  }
}

