import React, { Component } from "react";

import { LoginStyles as styles, LayoutStyles } from "../styelsheets/MainStyle";
import { Keyboard, Text, View, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Card } from 'react-native-elements';
import imageConstantURI from "../constants/imageConst"
import { ScrollView } from "react-native-gesture-handler";
import {getHeader,DeviceWidth} from "./../components/common/CommonAction"
import Icon from 'react-native-vector-icons/FontAwesome';

import {asyncPost,BASE_URL,onPay} from "./../utils/utils"
import moment from "moment";
import Config from "react-native-config";
export default class Dashboard extends Component {
    componentName = "Dashboard"
    constructor(props) {
        super(props);
    this.state={}
        global.screenName = this.componentName
    }
    getFavoriteBlock = (data) => {
        if(!data){
            return null
        }
        var picUrl =data.profileImage?data.profileImage:null
        const imageUrl = picUrl && (picUrl.indexOf("https://") > -1 || picUrl.indexOf("http://") > -1)?picUrl:picUrl?BASE_URL+picUrl:null
        return (
            <View key={"fav_"+data.doctorId} style={[LayoutStyles.card, { marginBottom: 10, marginRight: 10, paddingHorizontal: 10, width: 160 }]}>
                <TouchableOpacity onPress={() => { this.onDoctorSelect(data.doctorId) }}>
                <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}><Icon name={"heart"} size={20} color="red" /></View>

                <View style={{ flexDirection: "column", alignItems: "center", marginTop: -18, }}>
                <Image source={imageUrl?{uri:imageUrl}:imageConstantURI.profileImage.src}
                        style={{ width: 70, height: 70, alignItems: 'center', borderRadius: 35 }} />
                    <Text style={{ flexDirection: 'row', textAlign: "center", marginHorizontal: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Dr. {data.doctorName}</Text>
                        <Text style={{ fontSize: 14, color: "#a6a6a7" }}>{"\n"}{data.specialization.join(", ")}</Text>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{"\n\n"}{data.numVisit} Visits</Text>
                    </Text>
                </View>
                </TouchableOpacity>
            </View>
        )
    }
    onDoctorSearch=()=>{
        global.dispatchNav("Doctorsearch",this.props)
    }
    onAppointmentSelect= (data) => {
        //console.log("onAppointmentSelect",data)
        global.consultationData = JSON.parse(data)
        global.dispatchNav("Consultation", this.props)
    }
    onDoctorSelect = (docId) => {
        //const result = this.state.result
        console.log("docId",docId)
        if(docId && docId >= 0){
            global.selectedDoctor = docId
        global.dispatchNav("Details", this.props)
        }
        //alert("onDoctorSelect   "+ind)
    }
    onPaymentComplete=()=>{
        this.fetchAppo()
    }
    getDoctorCard = (data) => {
        //console.log("getDoctorCard",data)
        const dt =moment(data.appointmentDate,"YYYY-MM-DDTHH:mm:ss").format('ddd, Do MMM h:mm A')
        var picUrl =data.profileImage?data.profileImage:null
        const imageUrl = picUrl && (picUrl.indexOf("https://") > -1 || picUrl.indexOf("http://") > -1)?picUrl:picUrl?BASE_URL+picUrl:null
        const due = data.fees - data.paidAmount
        console.log("**********imageUrl*********",imageUrl)
        return (
            <View key={"doc_card_"+data.doctorId+data.appointmentDate.split(":").join("_")} style={[LayoutStyles.card, { marginBottom: 10, paddingHorizontal: 10, }]} >
               
                <TouchableOpacity onPress={() => { this.onAppointmentSelect(JSON.stringify(data)) }} style={{ flexDirection: "row", alignItems: "center", borderBottomColor: "#a6a6a7", borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Image source={imageUrl?{uri:imageUrl}:imageConstantURI.profileImage.src}
                        style={{ width: 40, height: 40, alignItems: 'center', borderRadius: 20 }} />
                    <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", marginHorizontal: 10 ,width:DeviceWidth-100}}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{data.namePrifix} {data.doctorName}</Text>
        <Text style={{ fontSize: 14, color: "#a6a6a7" }}>{"\n"}{data.specialization.join(", ")}</Text>
                    </Text>
                </TouchableOpacity>
               
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, color: "#00acc1",paddingTop:5, }}>{dt}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, backgroundColor: "#e6e6e7", borderRadius: 5, paddingHorizontal: 5, paddingVertical: 5 }}>
                        <Icon name={"check-circle-o"} size={15} color="#00acc1" />
                        <Text style={{ fontSize: 14, color: "#00acc1" }}> {data.appointmentStatus}</Text>
                    </View>
                    {global.userData.role!= "doctor" && due > 0?
                         <TouchableOpacity onPress={()=>{onPay(due,data.eventId,this.onPaymentComplete)}} style={{ flexDirection: "row", alignItems: "center", marginTop: 10, backgroundColor: "#00acc1", borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 }}>
                         <Icon name={"inr"} size={25} color="#ffffff" />
                         <Text style={{ fontSize: 14, color: "#ffffff" }}> {"Pay"}</Text>
                     </TouchableOpacity>:null
                    }
                </View>
               
            </View>
        )
    }
    openDrawer=()=>{
       //this.props.navigation.openDrawer();
    }
    

    render() {
        console.log("BuildConfig.PROVIDER_ID",Config.PROVIDER_ID)
        console.log("BuildConfig.PERSONALIZE",Config.PERSONALIZE)
        console.log("BuildConfig.APPLICATION_ID",Config.APPLICATION_ID)
        return (
            <View style={[styles.loginScreenContainer, { flexDirection: "column" }]}>
                {/*<TouchableOpacity onPress={() => { this.openDrawer() }} style={{ marginHorizontal: 15, marginTop: 10, height: 30, justifyContent: 'flex-start', alignItems: 'flex-start', }} >
                    <Icon name={"bars"} size={30} color="#00acc1" />
        </TouchableOpacity>*/}
        {getHeader("",this.props)}
                <Text style={{ fontSize: 30, fontWeight: "bold", marginHorizontal: 15, }}>Dashboard</Text>
                {Config.PERSONALIZE?<Button
                buttonStyle={[styles.longButton, {  marginHorizontal: 15,
                    marginVertical: 10,}]}
                onPress={() => this.onDoctorSelect(parseInt(Config.PROVIDER_ID))}
                title="Book Appointment"
            />:
                <Button
                    buttonStyle={{
                        backgroundColor: '#e6e6e7',
                        borderRadius: 10,
                        marginHorizontal: 15,
                        marginVertical: 10,
                        justifyContent: 'flex-start',
                        height: 45,
                        fontSize: 16,
                    }}
                    onPress={() => this.onDoctorSearch()}
                    titleStyle={{ color: "#a6a6a7" }}
                    icon={<Icon name={"search"} size={20} color="#a6a6a7" />}
                    title=" Search"

                />}
            
                <ScrollView>

                    {this.state.appointments?<View style={{ flexDirection: "row", marginHorizontal: 15, justifyContent: "space-between", borderTopColor: "#a6a6a7", borderTopWidth: 1, paddingTop: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Appointments</Text>
                        <Text style={{ fontSize: 16, color: "#00acc1" }}>{"View All >"}</Text>
                    </View>:null}
                    {this.state.appointments?<Text style={{ fontSize: 14, color: "#a6a6a7", paddingLeft: 15, }}>Book your Appointment today</Text>:null}
                    <View style={{ flexDirection: "column", paddingTop: 15, alignItems: "center" }}>

                        {this.state.appointments?this.state.appointments.map(data=>{return  this.getDoctorCard(data)}):null}
                        {this.state.appointments && this.state.appointments.length ==0?<Text style={{ fontSize: 16, color: "#00acc1" }}>{"You dont have any appointment"}</Text>:null}
                       
                    </View>
                    {global.userData.role!= "doctor" && this.state.favorites?<View style={{ flexDirection: "row", marginHorizontal: 15, justifyContent: "space-between", borderTopColor: "#a6a6a7", borderTopWidth: 1, paddingTop: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Favorites</Text>
                        <Text style={{ fontSize: 16, color: "#00acc1" }}>{"View All >"}</Text>
                    </View>:null}
                    {global.userData.role!= "doctor" && this.state.favorites?<Text style={{ fontSize: 14, color: "#a6a6a7", paddingLeft: 15, }}>Find Doctor, Clinic, Hospital and More</Text>:null}
                    <ScrollView
                        horizontal={true}
                        style={{ marginHorizontal: 15, marginTop: 10, }}
                    >
                        {global.userData.role!= "doctor" && this.state.favorites?this.state.favorites.map(data=>{return  this.getFavoriteBlock(data)}):null}
                        {global.userData.role!= "doctor" && this.state.favorites && this.state.favorites.length ==0?<Text style={{ fontSize: 16, color: "#00acc1" }}>{"You dont have any favorites"}</Text>:null}
          
                        
                    </ScrollView>


                </ScrollView>
            </View>
        )
    }
    
    shouldComponentUpdate(prop){
        return global.screenName == this.componentName
       }
       
       fetchFav=async()=>{
           const url=BASE_URL+"getfavorites"
        const d = await asyncPost(url,{})
        //console.log("getappointments  ",d)
        if(d.status == 200){
            this.setState({favorites:d.data})
        }
       }
       fetchAppo=async()=>{
        const url=Config.PERSONALIZE?BASE_URL+"appointmentsByConsumerProviderID":BASE_URL+"getappointments"
       //const url=BASE_URL+"getappointments"
       // Config.PROVIDER_ID)
        const __d =Config.PERSONALIZE?{ consumerId: global.userData.id,providerId:Config.PROVIDER_ID }:{}
       // console.log("BuildConfig.PERSONALIZE",Config.PERSONALIZE
     const d = await asyncPost(url,__d)
    // const res = await asyncPost(BASE_URL + "appointmentsByConsumerProviderID", )
    console.log("getappointments  url ",url,global.userData.id)
     console.log("getappointments  ",d)
     if(d.status == 200){

         this.setState({appointments:d.data})
     }
    }
      componentDidMount() {
        
        if(global.hideFoofer)global.showFoofer();
        this.props.navigation.addListener('willFocus', () => {
            this.fetchAppo()
            if(!Config.PERSONALIZE){
                this.fetchFav()
            }
        
            if(global.hideFoofer)global.showFoofer();
            if(global.setActiveIcon)global.setActiveIcon("home")
            //global.screenName = this.props.componentName
            global.setScreenName(this.componentName)
        })
      }
}