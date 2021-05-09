
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';


class CommonActivity extends Component {
    constructor(props) {
        super(props);
        global.screenName = "Login";
        global.dispatchNav=this.dispatchNav
        global.setScreenName = this.setScreenName
        global.usedScreenList=[]
    }

    dispatchNav=(route,props)=> {
        global.screenName = route;
        const navigateAction = NavigationActions.navigate({
          routeName: route
      });
      props.navigation.dispatch(navigateAction);
      }

    
   
    render() {
       
        return null
    }
}



export default CommonActivity;