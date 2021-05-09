import React, { Component } from "react";

import { LoginStyles as styles, LayoutStyles } from "../styelsheets/MainStyle";
import { Keyboard, Text, View, TextInput, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Button, Rating } from 'react-native-elements';
import imageConstantURI from "../constants/imageConst"
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getHeader,showAlert } from "./../components/common/CommonAction"
import HTMLView from 'react-native-htmlview';
import DatePicker from 'react-native-datepicker';
import {asyncPost,BASE_URL} from "./../utils/utils"
import moment from "moment";
const DeviceWidth = Dimensions.get('window').width;
export default class Details extends Component {
    componentName = "Details"
    constructor(props) {
        super(props);

        global.screenName = this.componentName
        global.globalprops = props
        this.state = {
            dataSource: [{ a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2, isSelected: true }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2, isBooked: true }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }],
        }
    }
    validateTime=(time)=>{
const arr = time.split(":")
const narr = arr.map(d=>{return d.length < 2?"0"+d:d})
return narr.join(":")
    }
    slotSelect=(index)=>{
        const doctorData = this.state.doctorData
        var selectedItme=null
        if(doctorData && doctorData.slots && doctorData.slots.slots  && doctorData.slots.slots.length > index){
            for(var i=0; i < doctorData.slots.slots.length;i++){
           const d=  doctorData.slots.slots[i]
           if(d.isAvailable){
            if(i == index){
               d.isSelected = !d.isSelected              
            }else{
                d.isSelected = false 
            }
           
           }
           if(d.isSelected){
            selectedItme = this.validateTime(d.slot)
           }
           doctorData.slots.slots[i]=d;
        }
        console.log("selectedItme",selectedItme)
        this.setState({doctorData,selectedItme})
        }
    }
    timeRenderer = ({ item,index }) => {
        var w = Math.floor((DeviceWidth - 30) / 6) - 4;
        var bgColor = "transparent"
        var txtColor = "#007c91"
        var borderColor = "#007c91"
        if (item.isSelected) {
            bgColor = "#007c91"
            txtColor = "#fff"
        }
        if (!item.isAvailable) {
            bgColor = "#ecf0f6"
            txtColor = "#8f9cb3"
            borderColor = "#ecf0f6"
        }
        return (
            <TouchableOpacity onPress={()=>{this.slotSelect(index)}} style={{ width: w, flexDirection: 'column', borderRadius: 5, alignItems: "center", borderColor: borderColor, borderWidth: 1, margin: 2, backgroundColor: bgColor }}>
                <Text style={{ fontSize: 14, color: txtColor }}>{item.slot}</Text>
            </TouchableOpacity>
        )
    }
    componentDidMount() {
        if (global.hideFoofer) global.hideFoofer();
        this.props.navigation.addListener('willFocus', () => {
            if (global.hideFoofer) global.hideFoofer();
          //
            global.setScreenName(this.componentName)
            this.fetchdetails();
        })
        
    }
    makeDatePicker=(__selectedTime,__minDate,__maxDate,__action)=>{
        const __height = 28
        const _width = 100
    var __placeHolder = "Change Date"
        
    
    var _format = "DD-MM-YYYY"
   
    const contStyle = { flex: 1, borderWidth: 0, marginLeft: 0,}
    if (Platform.OS != "ios") {
        contStyle.height = __height
        contStyle.width = 100
    }

    const customstyles = {
        dateTouchBody:{width: 100,marginLeft: 0, borderWidth: 0,},
        dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0, marginRight: 0, width: 0, height: 0, },
        dateInput: { flex: 1, marginLeft: 0, borderWidth: 0, paddingLeft: Platform.OS === "ios" ? 15 : 0, paddingTop: Platform.OS === "ios" ? 5 : 0, paddingBottom: Platform.OS === "ios" ? 5 : 0, borderBottomWidth: 0, height: Platform.OS === "ios" ? 5 + __height : __height, borderBottomColor: '#ccc', textAlign: 'left', },
        dateText: {
            width: 100,
            fontSize: 12,
            color: '#808080',
            borderBottomWidth: 0.5,
            borderBottomColor: '#ccc',
            paddingLeft: 0,
            paddingBottom: 8,
            borderWidth: 0,
            textAlign: "right",
            /*height: __height,*/
            flex: 1,
        },
        placeholderText: {
            width: _width,
            
            fontSize: 12,
    
            fontSize: 14, 
            color: "#00acc1", 
            textDecorationLine: "underline",
            borderBottomWidth: 0,
            borderBottomColor: '#ccc',
            paddingLeft: 0,
            paddingBottom: 8,
            /*height: __height,*/
            textAlign: "right",
            flex: 1,
        },
    }
    if (Platform.OS == "ios") {
        customstyles.datePicker = {
            alignItems: 'stretch'
        }
    }
    return (<View key={"dp_" } style={[{  }]}>
   
        <DatePicker
            style={contStyle}
            showIcon={false}
            mode="date"
            placeholder={__placeHolder}
            format={_format}
            is24Hour={true}
   

            minDate={__minDate}
            maxDate={__maxDate}

            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={customstyles}
            onDateChange={(time) => { __action(time) }}
        />

    </View>)
    }
    onDateChange=async(time)=>{
        const data = this.state.doctorData
        const d= await asyncPost(BASE_URL+"getavailableslots",{"providerId":data.doctorId,calendarId:data.calendarId,"date":time})
        if(d.status==200){
            data.slots = d.data.slots
            this.setState({doctorData:data,selectedDate:time})
        }
    }
        fetchdetails=async()=>{
            console.log("global.selectedDoctor",global.selectedDoctor)
            if(!global.selectedDoctor) global.selectedDoctor =3;
            console.log("global.selectedDoctor",global.selectedDoctor)
            if(global.selectedDoctor){
                const doctor =  global.selectedDoctor
                //global.selectedDoctor = null;
                const d= await asyncPost(BASE_URL+"getdoctorprofile",{"providerId":doctor})
                console.log("getdoctorprofile",d)
                if(d.status == 200){
                    this.setState({doctorData:d.data,selectedDocid:doctor})
                }
            }
        }
    shouldComponentUpdate(prop) {
        return global.screenName == this.componentName
    }
    listHeader = () => {
        const data = this.state.doctorData
        if(!data){
            return null;
        }
        const toDay =moment().format("DD-MM-YYYY")
        const month = moment().add(30,"days").format("DD-MM-YYYY")
        var picUrl =data.profileImage?data.profileImage:null
        const imageUrl = picUrl && (picUrl.indexOf("https://") > -1 || picUrl.indexOf("http://") > -1)?picUrl:picUrl?BASE_URL+picUrl:null
       
        return (<View >
            <View style={{ flexDirection: "row", }}>
                <Image source={imageUrl?{uri:imageUrl}:imageConstantURI.profileImage.src}
                    style={{ width: 70, height: 70, alignItems: 'center', borderRadius: 35 }} />
                <View style={{ flexDirection: "column", }}>
                    <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Dr. {data.doctorName}</Text>
                        <Text style={{ fontSize: 14, color: "#a6a6a7" }}>{"\n"}{data.specialization.join(", ")}</Text>
                        <Text style={{ fontSize: 14, }}>{"\n"}Experience: {data.experience} Years</Text>
                        <Text style={{ fontSize: 14, }}>{"\n"}Clinic Fees:</Text>
        <Text style={{ fontSize: 14, color: "#00acc1" }}> ${data.fees}</Text>
                        <Text style={{ fontSize: 14, color: "#00acc1" }}>{"\n"}{data.degree.join(", ")}</Text>
                    </Text>

                    <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                        <Rating showRating={false} imageSize={13} type='custom' ratingColor="#ffa872" startingValue={data.rating} readonly={true} />
                        <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}></Text>
        <Text style={{ fontSize: 12, color: "#a6a6a7" }}>{data.rating}</Text>
                        <Text style={{ fontSize: 12, }}> {"("}</Text>
                        <Text style={{ fontSize: 12, color: "#00acc1", textDecorationLine: "underline" }}>{data.numReview} Review</Text>
                        <Text style={{ fontSize: 12, }}> {")"}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: "column", marginTop: 20, marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name={"calendar"} size={14} color="#8f9cb3" />
                    <Text style={{ fontSize: 16, fontWeight: "bold", paddingLeft: 10 }}>Available Time</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, color: "#a6a6a7", paddingLeft: 20, }}>{data.slots.date}</Text>
                    {/*<Text style={{ fontSize: 14, color: "#00acc1", textDecorationLine: "underline" }}>Change Date</Text>*/}
                    {this.makeDatePicker(toDay,toDay,month,this.onDateChange)}
                </View>
            </View>
        </View>)
    }
    goToConsultation = () => {
        global.dispatchNav("Consultation", this.props)
    }
    makeAppo=async()=>{
        const time =this.state.selectedItme
        if(!time){
            alert("Please select a time")
            return
        }
        const docData = this.state.doctorData
        var dt = this.state.selectedDate?this.state.selectedDate:moment().format("DD-MM-YYYY")
        dt = moment(dt,"DD-MM-YYYY").format("YYYY-MM-DD")+" "+time+":00"
        const d=await asyncPost(BASE_URL+"bookappointment",{providerId: this.state.doctorData.doctorId, appointmentDateTime:dt})
        if(d.status == 200){
            alert("Your request has been sent to provider")
        }else{
            alert("Can't make your request")
        }
    }
    bookAppo=async()=>{
        const time =this.state.selectedItme
        if(!time){
            alert("Please select a time")
            return
        }
        const docData = this.state.doctorData
        var dt = this.state.selectedDate?this.state.selectedDate:moment().format("DD-MM-YYYY")
        dt = moment(dt,"DD-MM-YYYY").format("YYYY-MM-DD")+" "+time+":00"
        showAlert("","Are you want to book "+dt+"?",this.makeAppo)

        //+" "+time
       
       
    }
    listFooter = () => {
        return (
            <View >
            <Button
                buttonStyle={[styles.longButton, { marginTop: 20, }]}
                onPress={() => this.bookAppo()}
                title="Book Appointment"
            />
            </View>
        );
        const data = this.state.doctorData

        return (
            <View >
            <Button
                buttonStyle={[styles.longButton, { marginTop: 20, }]}
                onPress={() => this.bookAppo()}
                title="Book Appointment"
            />
        {!(!data || !data.extraInfo || data.extraInfo =="")?<HTMLView
        value={data.extraInfo}
        stylesheet={styles}
      />:null}
      </View>)
        return (<View >
            <Button
                buttonStyle={[styles.longButton, { marginTop: 20, }]}
                onPress={() => this.goToConsultation()}
                title="Book Appointment"
            />
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15, borderBottomColor: "#a6a6a7", borderBottomWidth: 1, }}>

            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 15 }}>
                <Icon name={"plus-square"} size={20} color="#8f9cb3" />
                <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", }}>Carl Jacson Medical Collage</Text>
                    <Text style={{ fontSize: 14, color: "#a6a6a7", }}>{"\n"}1946 Carlo Bridge Apt. 251</Text>
                </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 15 }}>
                <Icon name={"list-alt"} size={20} color="#8f9cb3" />
                <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", }}>Service</Text>
                    <Text style={{ fontSize: 14, color: "#a6a6a7", }}>{"\n"}Speciality Diagnostic{"\n"}Preventive Medicine{"\n"}Cardio Management</Text>
                    <Text style={{ fontSize: 14, color: "#00acc1", textDecorationLine: "underline" }}>{"\n"}See All Service</Text>
                </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 15 }}>
                <Icon name={"address-card-o"} size={20} color="#8f9cb3" />

                <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", }}>About Dr. Mike Corper{"\n"}</Text>
                    <Text style={{ fontSize: 14, color: "#a6a6a7", paddingRight: 10, textAlign: "justify", flex: 1 }}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"}</Text>
                </Text>
            </View>

        </View>)
    }
    render() {
        return (
            <View style={[styles.loginScreenContainer, { flexDirection: "column" }]}>
                {/*<View style={[{ flexDirection: "column", borderBottomColor: "#a6a6a7", borderBottomWidth: 1, }]}>
                    <View style={[{ flexDirection: "row", justifyContent: "space-between", height: 40, marginHorizontal: 15, alignItems: "center" }]}>
                        <TouchableOpacity onPress={() => { }} style={{ flex: 1, flexDirection: "row", alignItems: "center", height: 30, }} >
                            <Icon name={"angle-left"} size={30} color="#00acc1" />
                            <Text style={{ fontSize: 16, color: "#00acc1", paddingLeft: 5, }}>Back</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" }}>Details</Text>
                        <TouchableOpacity onPress={() => { }} style={{ flex: 1, height: 30, alignItems: "flex-end" }} >
                            <Icon name={"heart-o"} size={25} color="#8f9cb3" />
                        </TouchableOpacity>
                    </View>
        </View>*/}
                {getHeader("Details", this.props, "back", true)}

                <View style={{ flex: 1, paddingTop: 10, marginBottom: 20, }}>

                    {this.state.doctorData && this.state.doctorData.slots && this.state.doctorData.slots.slots?<FlatList
                        data={this.state.doctorData.slots.slots}
                        style={{ paddingHorizontal: 15 }}
                        horizontal={false}
                        renderItem={this.timeRenderer}
                        //Setting the number of column
                        numColumns={6}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={this.listHeader()}
                        ListFooterComponent={this.listFooter()}
                        extraData={this.state.doctorData}
                    />:null}

                </View>




            </View>
        )
    }

}