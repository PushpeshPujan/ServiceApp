import React, { Component } from "react";

import { LoginStyles as styles, LayoutStyles } from "../styelsheets/MainStyle";
import { Keyboard, Text, View, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Rating } from 'react-native-elements';
import imageConstantURI from "../constants/imageConst"
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import {getHeader} from "./../components/common/CommonAction"
export default class Paymentsuccess extends Component {

    constructor(props) {
        super(props);
        props.componentName = "Paymentsuccess"
    }
    openDrawer = () => {
       // this.props.navigation.openDrawer();
    }
   
    componentDidMount() {
        if(global.hideFoofer)global.hideFoofer();
        this.props.navigation.addListener('willFocus', () => {
            if(global.hideFoofer)global.hideFoofer();
            global.setScreenName(this.props.componentName)
        })
      }
    render() {
        return (
            <View style={[styles.loginScreenContainer, { flexDirection: "column" }]}>
                {/*<TouchableOpacity onPress={() => { this.openDrawer() }} style={{ marginHorizontal: 15, marginTop: 10, height: 30, justifyContent: 'flex-start', alignItems: 'flex-start', }} >
                    <Icon name={"bars"} size={30} color="#00acc1" />
        </TouchableOpacity>*/}
        {getHeader("",this.props)}
                <Text style={{ fontSize: 30, fontWeight: "bold", marginHorizontal: 15, }}>Checkout</Text>
                <View style={{ borderBottomColor: "#a6a6a7", borderBottomWidth: 1, }}>
           
                </View>
              

                    <View style={{ flexDirection: "column", flex:1, alignItems: "center",justifyContent:"center" }}>
                    <Icon name={"thumbs-up"} size={50} color="#58c8d5" />
                    <Text style={{ fontSize: 30, color:"#007c91", marginHorizontal: 15, textAlign:"center" }}>Congratulations</Text>
                    <Text style={{ fontSize: 18, marginHorizontal: 15, textAlign:"center" }}>Your appointment has been submitted!</Text>
                    <Text style={{ fontSize: 18, marginHorizontal: 15, textAlign:"center" }}>Waiting for confirmation from provider</Text>
                    </View>
              
            </View>
        )
    }

}