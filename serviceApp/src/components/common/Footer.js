import { View, ScrollView, TouchableOpacity, Button, Text, StyleSheet, Dimensions, Modal, Image } from 'react-native';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = { showFooter: true, activeIcon: "home" }
        global.hideFoofer = this.hideFoofer
        global.showFoofer = this.showFoofer
        global.setActiveIcon = this.setActiveIcon
        //global.dispatchNav=this.dispatchNav
    }
    /*dispatchNav=(route,props)=> {
        //
        const navigateAction = NavigationActions.navigate({
          routeName: route
      });
    // global.screenName = route;
    //global.hideFooterButton()
    props.navigation.dispatch(navigateAction);
}*/
    hideFoofer = () => {
        this.setState({ showFooter: false })
    }
    showFoofer = () => {
        this.setState({ showFooter: true })
    }
    setActiveIcon = (name) => {
        this.setState({ activeIcon: name })
    }
    onDoctorSearch=()=>{
        global.dispatchNav("Doctorsearch",global.props)
    }
    makeFooer = () => {

        return (
            <View Container='Footer' style={{ zIndex: 100 }}>
                {this.state.showFooter ? <View style={{ height: 50, justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row', backgroundColor: "#ecf0f6" }}>
                    <TouchableOpacity onPress={() => { }} style={{ height: 30, justifyContent: 'center', alignItems: 'center', }} >
                        <Icon name={"home"} size={20} color={this.state.activeIcon == "home" ? "#00acc1" : "#8f9cb3"} />
                        <Text style={{ fontSize: 12, color: this.state.activeIcon == "home" ? "#00acc1" : "#8f9cb3" }}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onDoctorSearch()} style={{ height: 30, justifyContent: 'center', alignItems: 'center', }} >
                        <Icon name={"search"} size={20} color={this.state.activeIcon == "search" ? "#00acc1" : "#8f9cb3"} />
                        <Text style={{ fontSize: 12, color: this.state.activeIcon == "search" ? "#00acc1" : "#8f9cb3" }}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} style={{ height: 30, justifyContent: 'center', alignItems: 'center', }} >
                        <Icon name={"heart-o"} size={20} color={this.state.activeIcon == "heart" ? "#00acc1" : "#8f9cb3"} />
                        <Text style={{ fontSize: 12, color: this.state.activeIcon == "heart" ? "#00acc1" : "#8f9cb3" }}>Favorite</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }} style={{ height: 30, justifyContent: 'center', alignItems: 'center', }} >
                        <Icon name={"file-text-o"} size={20} color={this.state.activeIcon == "file-text" ? "#00acc1" : "#8f9cb3"} />
                        <Text style={{ fontSize: 12, color: this.state.activeIcon == "file-text" ? "#00acc1" : "#8f9cb3" }}>History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} style={{ height: 30, justifyContent: 'center', alignItems: 'center', }} >
                        <Icon name={"user-circle-o"} size={20} color={this.state.activeIcon == "user" ? "#00acc1" : "#8f9cb3"} />
                        <Text style={{ fontSize: 12, color: this.state.activeIcon == "user" ? "#00acc1" : "#8f9cb3" }}>Profile</Text>
                    </TouchableOpacity>
                </View> : null}
            </View>
        );
    }
    render() {

        return (this.makeFooer())
    }
}



export default Footer;