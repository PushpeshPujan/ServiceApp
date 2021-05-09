import React, { Component } from 'react';
import { Alert, BackHandler, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
import {  CheckBox } from 'react-native-elements'
export const DeviceWidth = Dimensions.get('window').width;
export const DeviceHeight = Dimensions.get('window').height;
export function getDevWidth() {
    return DeviceWidth;
}
export function getHeader(title, props, menuType = "menu", showHeart = false) {
    return (
        <View style={[{ flexDirection: "column", borderBottomColor: "#a6a6a7", borderBottomWidth: menuType == "menu" ? 0 : 1, }]}>
            <View style={[{ flexDirection: "row", justifyContent: "space-between", height: 40, marginHorizontal: 15, alignItems: "center" }]}>
                <TouchableOpacity onPress={() => { menuType == "menu" ? props.navigation.openDrawer() : backToPrevScreen(props) }} style={{ flex: 1, flexDirection: "row", alignItems: "center", height: 30, }} >
                    <Icon name={menuType == "menu" ? "bars" : "angle-left"} size={30} color="#00acc1" />
                    <Text style={{ fontSize: 16, color: "#00acc1", paddingLeft: 5, }}>{menuType != "menu" ? "Back" : ""}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center", flexWrap: "nowrap" }}>{title}</Text>
                {showHeart ? <TouchableOpacity onPress={() => { }} style={{ flex: 1, height: 30, alignItems: "flex-end" }} >
                    <Icon name={"heart-o"} size={25} color="#8f9cb3" />
                </TouchableOpacity> : null}
            </View>
        </View>
    )
}
export function makeCheckBoxWithLabel(__label, __action, __key, __isChecked, __labelStyle = {}) {
    console.log(__key, __isChecked)
    return (<TouchableOpacity onPress={() => __action(__key)} key={__key} style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start" }} >
            {makeCheckBox(__action, __key, __isChecked, { padding: 10, paddingTop: 5, paddingRight: 0, })}
            <Text numberOfLines={1} style={[{ fontSize: 12,color: '#808080',paddingTop:4,paddingBottom:4,paddingLeft:0,height: 30,}, { paddingLeft: __isChecked ? 0 : 2, }, __labelStyle]} >
                {__label}
            </Text>
        </View>
    </TouchableOpacity>)
}
export function linkButton(__label, __action, __customTextStule = {}, ...theArgs) {
    return (
        <TouchableOpacity style={[{ paddingLeft:10,paddingRight:10, paddingTop:8,paddingBottom:8,}, __customTextStule]} onPress={() => __action(theArgs)} >
            <Text style={[{color: '#93278f',fontSize: 12,textAlign: 'center',}]}>{__label}</Text>
        </TouchableOpacity>
    )
}
export function makeCheckBox(__action, __id, __checked, __containerStyle = {}, __checkedcolor = "#ad4274") {
    return (<CheckBox key={"chk_" + __id} disabled={__action == null}
        containerStyle={[{ margin: 0, padding: 0, height: 30, }, __containerStyle]}
        uncheckedIcon={<Icon name={"square-o"} size={15} color="#ccc" />}
        checkedIcon={<Icon name={"check-square-o"} size={15} color={__checkedcolor} />}
        checked={__checked}
        onPress={() => __action ? __action(__id) : {}}
    />)
}
export function makeUploadOptionModal(__okAction, __cancelAction, __checkAction, __selected) {
    return (<Modal isVisible={true} coverScreen={false} deviceWidth={DeviceWidth}
        deviceHeight={DeviceHeight} >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
            <View style={{ flexDirection: "column", backgroundColor: "#fff", borderRadius: 20, paddingTop: 20, paddingBottom: 20, paddingHorizontal: 10, height: 200, justifyContent: "center", alignItems: "center", width: DeviceWidth - 50, }}>
                <Text style={[ { color:'#662d91',fontSize: 14, paddingBottom: 10, }]}>{"PLEASE SELECT A OPTION"}</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                    {makeCheckBoxWithLabel("TAKE A SNAPSHOT", __checkAction, "snapshot", (__selected === "snapshot"))}
                    {makeCheckBoxWithLabel("BROWSE FROM DEVICE", __checkAction, "browse", (__selected === "browse"))}

                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    {linkButton("CANCEL", __cancelAction, { paddingRight: 10, paddingTop: 10, }, "cancel")}
                    {linkButton("OK", __okAction, { paddingLeft: 10, paddingTop: 10, }, "ok")}
                </View>
            </View>
        </View>
    </Modal>)
}
export function backToPrevScreen(__props) {

    const vm = getVM()

    console.log("doctorDetails backToPrevScreen ", vm, global.backCount)
    if (global.screenName == vm) {
        if (!global.backCount) {
            global.backCount = 0;
        }
        global.backCount++
        if (global.backCount == 3) {
            showAlert("", "Want to exit the app", (key, lbl) => {
                if (lbl == "YES") {
                    BackHandler.exitApp();
                }
            }, "", "YES", "NO")

        }
        // return false;
    } else {
        global.backCount = 0;
    }
    if (vm != "Login") {
        global.dispatchNav(vm, __props)
        return true
    } else {
        return false;
    }

    //}
}

export function showAlert(__title, __msg, __action, __key, __okBtnLabel = "OK", __cnclBtnLabel = "Cancel") {
    Alert.alert(
        "",
        __msg,
        [
            { text: 'Cancel', onPress: function () { __action(__key, __cnclBtnLabel) }, style: 'cancel' },
            { text: 'OK', onPress: function () { __action(__key, __okBtnLabel) } },
        ],
        { cancelable: false }
    )
}
export function getVM() {
    var vm = ""
    //console.log("doctorDetails backToPrevScreen ", global.usedScreenList)
    if (global.usedScreenList.length > 2) {
        global.usedScreenList.pop()
        vm = global.usedScreenList[global.usedScreenList.length - 1]

    } else if (global.usedScreenList.length == 2) {
        vm = global.usedScreenList[1]
    } else {
        vm = "Login"
    }
    return vm;
}