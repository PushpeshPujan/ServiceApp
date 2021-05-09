import React, { Component } from "react";

import { LoginStyles as styles, LayoutStyles } from "../styelsheets/MainStyle";
import { Keyboard, Text, View, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Rating } from 'react-native-elements';
import imageConstantURI from "../constants/imageConst"
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { getHeader } from "./../components/common/CommonAction"
import {asyncPost,BASE_URL} from "./../utils/utils"
export default class Doctorsearch extends Component {
    _menu = null;
    _filterMenu = null;
    componentName = "Doctorsearch"
    constructor(props) {
        super(props);
this.state={result:null}
        global.screenName = this.componentName
    }
    updateFavorite=async(ind)=>{
        const result = this.state.result
        console.log("result.length",result.length)
        if(result && result.length > ind){
            
            const d = await asyncPost(BASE_URL+"addremovefavorite",{"providerId":result[ind].doctorId})
            if(d.status==200){
                result[ind].isFavorite = !result[ind].isFavorite
                this.setState({result})
            }
            //alert("updateFavorite   "+ind)
        }
       
        
       
    }
    getDoctorCard = (data,index) => {
        if(!data){
            return null;
        }
        var picUrl =data.profileImage?data.profileImage:null
        const imageUrl = picUrl && (picUrl.indexOf("https://") > -1 || picUrl.indexOf("http://") > -1)?picUrl:picUrl?BASE_URL+picUrl:null
       
        return (
            <View key={"doccard"+index+"-"+data.doctorId} style={[LayoutStyles.card, { marginBottom: 10,paddingLeft:10, }]}>
                <TouchableOpacity onPress={() => { this.onDoctorSelect(index) }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", paddingBottom: 10 }}>
                    <Image source={imageUrl?{uri:imageUrl}:imageConstantURI.profileImage.src}
                            style={{ width: 60, height: 60, alignItems: 'center', borderRadius: 30 }} />
                        <View style={{ flexDirection: "column", flex: 1, }}>
                            <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "flex-start", justifyContent: "space-between" }}>
                                <Text style={{flex:9, flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Dr. {data.doctorName}</Text>
        <Text style={{  marginRight: 10,fontSize: 14, color: "#a6a6a7" }}>{"\n"}{data.specialization.join(", ")}</Text>
                                </Text>
                                <TouchableOpacity onPress={() => this.updateFavorite(index)}>
                                <Icon name={data.isFavorite ? "heart" : "heart-o"} size={20} color="#e56060" style={{flex:1, marginTop: 5, }} />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "center" }}>
                                <Rating showRating={false} imageSize={13} type='custom' ratingColor="#ffa872" startingValue={data.rating} readonly={true} />
                                <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}></Text>
                                <Text style={{ fontSize: 12, color: "#a6a6a7" }}> {data.rating}</Text>
                            </View>
                            {/*<Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", marginHorizontal: 10 }}>
                                <Text style={{ fontSize: 14, fontWeight: "bold" }}>Next Available:</Text>
                                <Text style={{ fontSize: 14, }}> Mon, June 11</Text>
        </Text>*/}
                            <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "center", marginTop: 10 }}>
        <Text style={{ fontSize: 14, color: "#00acc1" }}>${data.fees}</Text>
                                <TouchableOpacity style={{ marginLeft: 10, padding: 5, borderColor: "#00acc1", borderWidth: 1, borderRadius: 15, paddingHorizontal: 10 }}>
                                    <Text style={{ fontSize: 14, color: "#00acc1" }}>Make Appointment</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }
    openDrawer = () => {
        //this.props.navigation.openDrawer();
    }
    onSort = () => {

    }
    onFilter = () => {

    }

    setMenuRef = ref => {
        this._menu = ref;
    };
    setFilterMenuRef = ref => {
        this._filterMenu = ref;
    };
    hideFilterMenu = () => {
        if (this._filterMenu != null) this._filterMenu.hide();
    };

    showFilterMenu = () => {
        if (this._filterMenu != null) this._filterMenu.show();
    };
    hideMenu = () => {
        if (this._menu != null) this._menu.hide();
    };

    showMenu = () => {
        if (this._menu != null) this._menu.show();
    };
    onDoctorSelect = (ind) => {
        const result = this.state.result
        console.log("result.length",result.length)
        if(result && result.length > ind){
            global.selectedDoctor = result[ind].doctorId
        global.dispatchNav("Details", this.props)
        }
        //alert("onDoctorSelect   "+ind)
    }
    componentDidMount() {
        if (global.hideFoofer) global.showFoofer();
        this.props.navigation.addListener('willFocus', () => {
            if (global.hideFoofer) global.showFoofer();
            if (global.setActiveIcon) global.setActiveIcon("search")
            //global.screenName = this.props.componentName
            global.setScreenName(this.componentName)
        })
    }

    onChangeText=(text)=>{
        this.state['searchString']=text
        if(text.length >2){
           this.searchDoctor(text.toLowerCase()) 
        }
       //this.setState({key:text})
       }
       searchDoctor=async(txt)=>{
        //result
        const d = await asyncPost(BASE_URL+"searchproviders",{"searchString":txt},true,"",false)
        if(d.status==200){
            this.setState({result:d.data})
        }
       }
    shouldComponentUpdate(prop) {
        return global.screenName == this.componentName
    }
    render() {
        return (
            <View style={[styles.loginScreenContainer, { flexDirection: "column" }]}>
                {/*<TouchableOpacity onPress={() => { this.openDrawer() }} style={{ marginHorizontal: 15, marginTop: 10, height: 30, justifyContent: 'flex-start', alignItems: 'flex-start', }} >
                    <Icon name={"bars"} size={30} color="#00acc1" />
        </TouchableOpacity>*/}
                {getHeader("", this.props)}
                <Text style={{ fontSize: 30, fontWeight: "bold", marginHorizontal: 15, }}>Search</Text>
                <View style={{ borderBottomColor: "#a6a6a7", borderBottomWidth: 1, }}>
                    <View style={{ flexDirection: "row", marginHorizontal: 15, marginVertical: 10, justifyContent: 'flex-start', alignItems: "center" }}>
                        <View style={{ flexDirection: "row", paddingLeft: 10, flex: 1, backgroundColor: '#eaeaeb', borderRadius: 10, alignItems: "center", height: 40, }} >
                            <Icon name={"search"} size={20} color="#96969a" />
                            <TextInput style={{ marginRight: 30, fontSize: 16, color: "#8e8e93" }}  onChangeText={text => this.onChangeText(text)} placeholder="Search"></TextInput>
                        </View>
                        <Menu
                            ref={this.setMenuRef}
                            style={{ paddingTop: 10, marginTop: 25, }}
                            button={<Icon name={"sort-amount-desc"} size={20} color="#00acc1" onPress={this.showMenu} style={{ paddingLeft: 10 }} />}
                        >
                            <MenuItem onPress={this.onSort} style={{ maxHeight: 20, marginBottom: 5, }}>Distance</MenuItem>
                            <MenuItem onPress={this.onSort} style={{ maxHeight: 20, }}>Name</MenuItem>
                        </Menu>
                        <Menu
                            ref={this.setFilterMenuRef}
                            style={{ paddingTop: 10, marginTop: 25, }}
                            button={<Icon name={"filter"} size={25} color="#00acc1" onPress={this.showFilterMenu} style={{ paddingLeft: 10, }} />}
                        >
                            <MenuItem onPress={this.onFilter} style={{ maxHeight: 20, marginBottom: 5, }}>Provider</MenuItem>
                            <MenuItem onPress={this.onFilter} style={{ maxHeight: 20, marginBottom: 5, }}>Specialization</MenuItem>
                            <MenuItem onPress={this.onFilter} style={{ maxHeight: 20, }} disabled>Location</MenuItem>
                            <MenuDivider />
                            <MenuItem onPress={this.onFilter} style={{ maxHeight: 20, marginBottom: 5, marginLeft: 10 }}>0-2 km</MenuItem>
                            <MenuItem onPress={this.onFilter} style={{ maxHeight: 20, marginBottom: 5, marginLeft: 10 }}>2-10 km</MenuItem>
                            <MenuItem onPress={this.onFilter} style={{ maxHeight: 20, marginBottom: 5, marginLeft: 10 }}>more than 10 km</MenuItem>
                            <MenuDivider />
                        </Menu>

                    </View>
                </View>
                <ScrollView>

                    <View style={{ flexDirection: "column", paddingTop: 15, alignItems: "center" }}>

                        {this.state.result && this.state.result.length > 0?this.state.result.map((data,index)=>{ return this.getDoctorCard(data,index)}):null}
                       {this.state.result && this.state.result.length ==0? <Text style={{ fontSize: 14, color: "#00acc1" }}>No result found with the search criteria</Text>:null}
                    </View>
                </ScrollView>
            </View>
        )
    }

}