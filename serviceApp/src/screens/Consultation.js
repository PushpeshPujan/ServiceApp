import React, { Component } from "react";

import { LoginStyles as styles, LayoutStyles } from "../styelsheets/MainStyle";
import { Keyboard, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking, FlatList } from 'react-native';
import { Button, Rating } from 'react-native-elements';
import imageConstantURI from "../constants/imageConst"
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getHeader, makeCheckBoxWithLabel } from "./../components/common/CommonAction"
import { asyncPost, BASE_URL, uploadFile,onPay } from "../utils/utils"
import { mimeToIcon, sampleQuestionAir } from "../constants/dataConstant"
import Docpicker from "./../components/common/Docpicker"
import moment from "moment";
const DeviceWidth = Dimensions.get('window').width;
export default class Consultation extends Component {
    componentName = "Consultation"
    constructor(props) {
        super(props);
        global.screenName = this.componentName
        global.globalprops = props
        this.state = {
            showOptionModal: false,
            dataSource: [{ a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2, isSelected: true }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2, isBooked: true }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }],
        }
    }
    onCncl = () => {
        this.setState({ showOptionModal: false })
        //setTimeout(()=>this.updateFooterBtn(),1000)

    }
    onFileChoose = (image, raw) => {
        const consultationData = this.state.consultationData
        uploadFile(image, { eventId: consultationData.eventId }).then(res => {
            //console.log("uploadFile   ", res)
            if (res.status == 200) {
                this.setState({ attachments: res.data })
                alert(res.msg)
            }
        }
        )
        this.setState({ showOptionModal: false })
        //alert("Document selected for uploaded")
    }
    fetchConsumerAppo=async(consumerid,eventId)=>{
        const res = await asyncPost(BASE_URL + "appointmentsByConsumerProviderID", { consumerId: consumerid })
        if (res.status == 200) {
            //var currentApo = null
           //console.log("-----  allAppo",res.data)
            this.setState({ allAppo: res.data })
        }
    }
    fetchAttchments = async (eventid) => {
        const res = await asyncPost(BASE_URL + "getattachment", { eventId: eventid })
        if (res.status == 200) {
            this.setState({ attachments: res.data })
        }
        //console.log("fetchAttchments", res)

    }
    componentDidMount() {
        //console.log("sampleQuestionAir",JSON.stringify(sampleQuestionAir))
        if (global.hideFoofer) global.hideFoofer();
        this.props.navigation.addListener('willFocus', () => {
            if (global.hideFoofer) global.hideFoofer();
            //global.screenName = this.props.componentName
            
            if (global.consultationData) {
               
                const cdata =JSON.parse(JSON.stringify(global.consultationData))
                this.setState({ consultationData: cdata })
                this.fetchAttchments(cdata.eventId)
                if(global.userData.role== "doctor"){
                    //console.log(" global.consultationData.consumerId",cdata.consumerId)
                    this.fetchConsumerAppo(cdata.consumerId,cdata.eventId)
                }
                global.consultationData = null
            
                if(cdata.answerData && cdata.answerData !=""){
                    this.setQdata(JSON.parse(cdata.answerData))
                }else if(cdata.extraInfo && cdata.extraInfo !=""){
                    this.setQdata(JSON.parse(cdata.extraInfo))
                }
                
               
            }else{
                console.log("no consultationData")
            }
        
            global.setScreenName(this.componentName)
           
        })
    }
    
    setQdata=(qus)=>{
        //const qus = sampleQuestionAir.questionAir;
        const oo = {}
        const elements = []
        if(!qus){
            return null
        }
        qus.questionAir.map(d => {
            const iid = 'id_' + d.id
            oo[iid] = d
        })
        //console.log(oo)
        this.setState({ qdata: oo })
        return oo
    }
    shouldComponentUpdate(prop) {
        return global.screenName == this.componentName
    }
    nextPrevAppo=(action)=>{
        const allAppo =this.state.allAppo
        var __n =  action ==0?this.currentApoIndex -1:action ==1?this.currentApoIndex +1:-1
        if( __n >=0 && __n < allAppo.length){
            const cdata =allAppo[__n]
            this.setState({ consultationData: cdata })
            this.fetchAttchments(cdata.eventId)
            if(cdata.answerData && cdata.answerData !=""){
                this.setQdata(JSON.parse(cdata.answerData))
            }else if(cdata.extraInfo && cdata.extraInfo !=""){
                this.setQdata(JSON.parse(cdata.extraInfo))
            }
        }
        
    
    
    }
    getDoctorCard = (data) => {
        const allAppo =this.state.allAppo
        this.currentApoIndex = -1
        var showRight = false
        var showLeft = false
        if(allAppo && allAppo.length > 0){
           
            for (var i=0; i < allAppo.length; i++){
                if(allAppo[i].eventId == data.eventId){
                    //currentApo = res.data[i]
                    this.currentApoIndex = i;
                    if(allAppo.length > this.currentApoIndex+1){
                        showRight = true
                    }
                    if(this.currentApoIndex > 0){
                        showLeft = true
                    }
                    break;
                }
            }
        }
        if (!data) return null
        var picUrl =data.profileImage?data.profileImage:null
        const imageUrl = picUrl && (picUrl.indexOf("https://") > -1 || picUrl.indexOf("http://") > -1)?picUrl:picUrl?BASE_URL+picUrl:null
        
        return (
            <View style={[LayoutStyles.card, { marginBottom: 10, }]}>

                <View style={{ flexDirection: "row", alignItems: "center", }}>
                { ( global.userData.role== "doctor" && showLeft)?<TouchableOpacity onPress={()=>this.nextPrevAppo(0)} style={{width:30,height:30}}><Icon name={"angle-left"} size={30} color="#8f9cb3" style={{ marginLeft: 10, }}  /></TouchableOpacity>:null}
                    <Image source={imageUrl?{uri:imageUrl}:imageConstantURI.profileImage.src}
                        style={{ width: 70, height: 70, alignItems: 'center', borderRadius: 35,paddingLeft:10 }} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "flex-start", justifyContent: "space-between" }}>
                            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}>
                            {global.userData.role!= "doctor"?null:<Text style={{ fontSize: 18, fontWeight: "bold" }}>{"Patient Name :\n"}</Text>}
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{data.namePrifix} {data.doctorName}</Text>
                                <Text style={{ fontSize: 14, color: "#a6a6a7" }}>{"\n"}{data.specialization.join(", ")}</Text>
                            </Text>

                        </View>
                        {global.userData.role!= "doctor"?<View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "center" }}>
                            <Rating showRating={false} imageSize={13} type='custom' ratingColor="#ffa872" startingValue={data.rating} readonly={true} />
                            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}></Text>
                            <Text style={{ fontSize: 12, color: "#a6a6a7" }}> {data.rating}</Text>
                        </View>:null}

                    </View>
                    {global.userData.role!= "doctor" || ( global.userData.role== "doctor" && showRight)?<TouchableOpacity onPress={()=>( global.userData.role== "doctor" && showRight)?this.nextPrevAppo(1):console.log("")} style={{width:30,height:30}}><Icon name={"angle-right"} size={30} color="#8f9cb3" style={{ marginRight: 10, }} /></TouchableOpacity>:null}
                </View>
                
            </View>
        )
    }
    openDoc = () => {
        const consultationData = this.state.consultationData
        if (consultationData.appointmentStatus == "confirm") {
            this.setState({ showOptionModal: true })
        } else {
            alert("Appointment not conformed")

        }

    }
    showDocPick = () => {
        return (<Docpicker onFinished={this.onFileChoose} cancelAction={this.onCncl} ></Docpicker>)
    }
    goToConference = (url) => {
        if (!url || url == "") {
            alert("Appointment not confirmed")
        } else {
            Linking.openURL(url)
        }
    }
    goToPaymentSuccess = () => {
        global.dispatchNav("Paymentsuccess", this.props)
    }
    openDriveFile = (id) => {
        const url = `https://drive.google.com/file/d/${id}/view?usp=sharing`
        Linking.openURL(url)
    }
    timeRenderer = (item, index) => {
        var mimetype = item.mimetype.toLocaleLowerCase()

        var iconName = null
        if (mimetype.indexOf("image") > -1 || mimetype.indexOf("audio") > -1 || mimetype.indexOf("video") > -1) {
            mimetype = mimetype.split("/")[0]
            iconName = mimeToIcon[mimetype]
        } else {
            if (mimeToIcon[mimetype]) {
                iconName = mimeToIcon[mimetype]
            } else {
                iconName = "file"
            }
        }

        return (
            <TouchableOpacity key={"attch_"+index} onPress={() => { this.openDriveFile(item.attachmentid) }} style={{ flexDirection: 'row', alignItems: "center", borderColor: "#ccc", borderWidth: 1, margin: 2, padding: 3, backgroundColor: "#fff" }}>
                <Icon name={iconName} size={20} color="#007c91" />
                <Text style={{ fontSize: 14, color: "#000", paddingLeft: 8, }} numberOfLines={1} ellipsizeMode='tail' >{item.title}</Text>
            </TouchableOpacity>
        )
    }
    onQusAction = (id, value) => {

        //console.log("onQusAction",id, value)

        const qdata = this.state.qdata
        if(!qdata){
            return null
        }
        if (qdata) {
            const i = id.split("-")[0]
           var d = qdata[i]
            var ans = value
            if (d.tag == "input" || d.tag == "textarea") {
                d.value = value
            }
            if (d.tag == "checkbox" || d.tag == "radio") {
                const j = parseInt(id.split("-")[1])

                const ndd = d.data.map((dd, index) => {

                    if (index == j) {
                        if (d.tag == "checkbox") {
                            dd.checked = !dd.checked
                        } else {
                            dd.checked = true
                        }

                    } else {
                        if (d.tag != "checkbox") {
                            dd.checked = false
                        }
                    }
                    if(dd.checked){
                        d.value=dd.value;
                    }
                    return dd
                })
                d.data = ndd


            }
            qdata[i] = d
            //data.extraInfo =qdata
            this.setState({ qdata: qdata })
            //console.log(qdata[i])
        }
    }
    onQusSave=async()=>{
        const qdata = this.state.qdata
        if(!qdata){
            alert("No data to save")
            return 
        }
        const oo={}
        oo.questionAir=[]
        for (var prop in qdata) {
            oo.questionAir.push(qdata[prop])
        }
        const o2={}
        o2.eventId=this.state.consultationData.eventId
        o2.answerData =oo
        const res=await asyncPost(BASE_URL+"saveanswer",o2)
        if(res.status==200){
            alert("Data has been saved")
        }else{
            alert(res.msg)
        }
    }
    renderQuestionAir = () => {
        var elements = []

        const qdata = this.state.qdata
        //
        if(!qdata){
            return null;
        }
        const deleteIdx=[]
        var d=null;
        for (var prop in qdata) {
            d = qdata[prop]
            if (d.skip) {
                d.skip.map(skp => {
                    if (skp.val == d.value) {
                        if (skp.questions && skp.questions.length > 0) {
                            skp.questions.map(v => { deleteIdx.push("id_" + v) })
                        }
                    }

                })
            }
            if (d.add) {
                d.add.map(add => {
                    if (add.val == d.value) {
                        if (add.newQuestions && add.newQuestions.length > 0) {
                            add.newQuestions.map(v => { qdata["id_n_" + v.id] = v })
                        }
                    }
                })
            }
            //deleteIdx.map(v=>{delete qdata[v]})
        }
        //console.log("oo2",qdata)
        var cnt =1;
        const keys = Object.keys(qdata)
        //elements = new Array(keys.length+1)
        const qd={}
        elements.push(<Text key={"qus_ttl" } style={{ flexDirection: 'row',  textAlign: "center", marginHorizontal: 10,color:"#00acc1",fontSize:20,fontWeight:"bold" }}>{global.userData.role!= "doctor"?"Fill the questionnaire":"submitted Answer"}</Text>)
        for (var prop in qdata) {
            if(deleteIdx.indexOf(prop) > -1){
                continue
            }
            d = qdata[prop]
            const key =prop
            if (d.label && d.label != "") {
                qd["qd_"+d.id] = (<Text key={"qus_" + d.id} style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", marginHorizontal: 10 }}>{cnt}{". "}{d.label}</Text>)
            elements.push(<Text key={"qus_" + d.id} style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", marginHorizontal: 10 }}>{cnt}{". "}{d.label}</Text>)
            }
            if (d.tag == "input" || d.tag == "textarea") {
                //console.log("----------prop ---",d.tag,key)
                qd["ad_"+d.id] =(<TextInput key={"ans_" + d.id} editable={global.userData.role!= "doctor"} onChangeText={(text) => { global.userData.role!= "doctor"?this.onQusAction(""+key, text):console.log }} multiline={d.tag == "textarea"} style={{ borderColor: "#000", height: d.tag == "textarea" ? 70 : 35, borderWidth: 1, marginHorizontal: 10,padding:0,paddingHorizontal:10,marginBottom:10, }}>{d.value ? d.value : ""}</TextInput>)
                elements.push(<TextInput key={"ans_" + d.id} editable={global.userData.role!= "doctor"} onChangeText={(text) => { global.userData.role!= "doctor"?this.onQusAction(""+key, text):console.log }} multiline={d.tag == "textarea"} style={{ borderColor: "#000", height: d.tag == "textarea" ? 70 : 35, borderWidth: 1, marginHorizontal: 10,padding:0,paddingHorizontal:10,marginBottom:10, }}>{d.value ? d.value : ""}</TextInput>)
            }
            if (d.tag == "checkbox" || d.tag == "radio") {
                d.data.map((dd, index) => {
                    qd["od_"+d.id] =(makeCheckBoxWithLabel(dd.label, global.userData.role!= "doctor"?this.onQusAction:console.log, prop + "-" + index, dd.checked))
                    elements.push(makeCheckBoxWithLabel(dd.label, global.userData.role!= "doctor"?this.onQusAction:console.log, prop + "-" + index, dd.checked))
                })

            }
            cnt++;
        }
        if(global.userData.role!= "doctor"){
        elements.push( <Button key={"submit_btn"}
    buttonStyle={styles.loginButton}
    onPress={() => this.onQusSave()}
    title="Save"
  />)
        }
  var nkeys = Object.keys(qd)
  nkeys.sort(function(a, b){
      var aa = a.split("_")
      var bb = b.split("_")
      var an = parseInt(aa[aa.length-1])
      var bn = parseInt(bb[bb.length-1])
      return an-bn});
  //console.log("qd keys  ",Object.keys(qd),qd["qd_0"],nkeys)
  elements.push(<View key={"pad"} style={{marginBottom:20}}></View>)
        return elements
    }
    makePay=async(data,eventId)=>{
         onPay(data,eventId).then(d=>{
            //console.log("--------------ssssssssss----------",d)
            if(d){
                const data = this.state.consultationData
                if(data){
                    data.paidAmount = data.fees
                    this.setState({consultationData:data})
                }
               
            }
        })
       
    }
    render() {
        const data = this.state.consultationData
        
        const appoStat = data ? data.appointmentStatus : ""
        const dt = data ? moment(data.appointmentDate, "YYYY-MM-DDThh:mm:ss").format('ddd, Do MMM DD h:mm A') : ""
        //console.log(this.state.attachments)
        const due = data?data.fees - data.paidAmount:0
        return (
            <View style={[styles.loginScreenContainer, { flexDirection: "column" }]}>
                <ScrollView>
                    {/*<View style={[{ flexDirection: "column", borderBottomColor: "#a6a6a7", borderBottomWidth: 1, }]}>
                    <View style={[{ flexDirection: "row", justifyContent: "space-between", height: 40, marginHorizontal: 15, alignItems: "center" }]}>
                        <TouchableOpacity onPress={() => { }} style={{ flex: 1, flexDirection: "row", alignItems: "center", height: 30, }} >
                            <Icon name={"angle-left"} size={30} color="#00acc1" />
                            <Text style={{ fontSize: 16, color: "#00acc1", paddingLeft: 5, }}>Back</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center", flexWrap: "nowrap" }}>Consultation</Text>
                        <TouchableOpacity onPress={() => { }} style={{ flex: 1, height: 30, alignItems: "flex-end" }} >
                            <Icon name={"heart-o"} size={25} color="#8f9cb3" />
                        </TouchableOpacity>
                    </View>
        </View>*/}
                    {getHeader("Consultation", this.props, "back", true)}
                    {this.state.showOptionModal ? this.showDocPick() : null}
                    {!this.state.showOptionModal ? <View style={{ flex: 1, paddingTop: 10, marginBottom: 20, }}>

                        <View style={{ marginHorizontal: 15 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1, textAlign: "left", marginBottom: 10, }}>Doctor</Text>
                            {this.getDoctorCard(data)}
                            {due > 0?
                         <TouchableOpacity onPress={()=>{this.makePay(due,data.eventId)}} style={{ flexDirection: "row", alignItems: "center",justifyContent:"center", marginTop: 5,marginBottom:10, backgroundColor: "#00acc1", borderRadius: 5, paddingHorizontal: 5, paddingVertical: 5 }}>
                         <Icon name={"inr"} size={25} color="#ffffff" />
                         <Text style={{ fontSize: 14, color: "#ffffff" }}> {"Pay"}</Text>
                     </TouchableOpacity>:null
                    }
                            <View style={[{ flexDirection: "row", justifyContent: "space-between", height: 40, alignItems: "center" }]}>
                                <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1, textAlign: "left", }}>Timings</Text>
                                    <Text style={{ fontSize: 14, flex: 1, textAlign: "left", color: "#8f9cb3" }}>{"\n"}{dt}</Text>
                                </Text>
                                <Button
                                    buttonStyle={[{ backgroundColor: data && data.conferenceUrl ? '#00acc1' : "#ccc", borderRadius: 5, height: 35, paddingTop: 5, }]}
                                    onPress={() => { this.goToConference(data && data.conferenceUrl ? data.conferenceUrl : null) }}
                                    title="Join"
                                />
                            </View>
                            <View style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 10, }]}>
                                <View style={[LayoutStyles.card, LayoutStyles.squareButtonCard, { justifyContent: "flex-start" }]}>
                                    <Icon name={"phone"} size={30} color={appoStat == "confirm" ? "#007c91" : "#ccc"} />
                                    <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1, textAlign: "left", color: appoStat == "confirm" ? "#007c91" : "#ccc" }}>Call</Text>
                                        <Text style={{ fontSize: 11, flex: 1, textAlign: "left", color: appoStat == "confirm" ? "#8f9cb3" : "#ccc" }}>{"\n"}Appointment</Text>
                                    </Text>
                                </View>
                                <View style={[LayoutStyles.card, LayoutStyles.squareButtonCard]}>
                                    <Icon name={"comments"} size={30} color={appoStat == "confirm" ? "#007c91" : "#ccc"} />
                                    <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1, textAlign: "left", color: appoStat == "confirm" ? "#007c91" : "#ccc" }}>Chat</Text>
                                        <Text style={{ fontSize: 11, flex: 1, textAlign: "left", color: appoStat == "confirm" ? "#8f9cb3" : "#ccc" }}>{"\n"}With Doctor</Text>
                                    </Text>
                                </View>
                                <View style={[LayoutStyles.card, LayoutStyles.squareButtonCard]}>

                                    <Icon name={"video-camera"} size={30} color={appoStat == "confirm" ? "#007c91" : "#ccc"} />
                                    <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1, textAlign: "left", color: appoStat == "confirm" ? "#007c91" : "#ccc" }}>video</Text>
                                        <Text style={{ fontSize: 11, flex: 1, textAlign: "left", color: appoStat == "confirm" ? "#8f9cb3" : "#ccc" }}>{"\n"}Consultation</Text>
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => { this.openDoc() }} style={[LayoutStyles.card, LayoutStyles.squareButtonCard]}>

                                    <Icon name={"upload"} size={30} color={appoStat == "confirm" ? "#007c91" : "#ccc"} />
                                    <Text style={{ flexDirection: 'row', flexWrap: 'wrap', textAlign: "left", }}>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1, textAlign: "left", color: appoStat == "confirm" ? "#007c91" : "#ccc" }}>Upload</Text>
                                        <Text style={{ fontSize: 11, flex: 1, textAlign: "left", color: appoStat == "confirm" ? "#8f9cb3" : "#ccc" }}>{"\n"}Test Report</Text>
                                    </Text>

                                </TouchableOpacity>
                            </View>

                        </View>



                    </View> : null}

                    {!this.state.showOptionModal ?<View style={{ flex: 1 }}>

                        {this.renderQuestionAir()}
                        {this.state.attachments && this.state.attachments.length > 0 ?
                        
                            <View style={{ flex: 1, paddingTop: 35, marginBottom: 20, marginHorizontal: 15, }}>
                                <Text style={{ fontSize: 14, fontWeight: "bold", flex: 1, textAlign: "left", color: "#000" }}>Attachments:</Text>
                                {this.state.attachments.map((d, index) => { return this.timeRenderer(d, index) })}
                            </View> : null

                        }

                    </View>:null}

                </ScrollView>
            </View>
        )
    }

}