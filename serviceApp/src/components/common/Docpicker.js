import React, { Component } from "react";
import { DeviceHeight, getDevWidth,makeUploadOptionModal} from './CommonAction';
import { View, Platform,Text, ScrollView, BackHandler,FlatList,TouchableOpacity ,PermissionsAndroid} from 'react-native';

//import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
//import RNFetchBlob from 'rn-fetch-blob'
export default class Docpicker extends Component {

    constructor(props) {
        super(props);
      this.state = {showOptionModal: true,fileChooserMode:null}
    }
    componentDidMount() {
        if(Platform.OS != 'ios'){
            this.requestStoragePermission()
        }
        if(this.props.openMode == "browse"){
            this.state.showOptionModal = false
            //alert("Not yet ready");
            this.chooseAnyFile()
        }
        
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.handleError()
            return true;
        });
    }
    /*onMsg=(__key, __lbl)=>{
      
            if (__lbl == "OK") {
                this.setState({ showOptionModal: false })
                if(this.props.cancelAction ){
                    this.props.cancelAction();
                }
            }
    }*/
    componentWillUnmount() {
        this.backHandler.remove()
      }
requestStoragePermission =async()=>{
  try {
    var granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
 
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the storage');
    } else {
        granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'MEDePAL Storage Permission',
              message:
                'MEDePAL needs access to your storage ' ,
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
    }
  } catch (err) {
    console.warn(err);
  }
}
handleError=()=>{
    this.setState({ showOptionModal: false })
    if(this.props.cancelAction){
        this.props.cancelAction();
    }
}
    chooseMode=()=>{
        this.setState({showOptionModal:true})
    }
    chooseAnyFile =async ()=>{
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log("doctorDetails  chooseFile",JSON.stringify(res) );
            if(Platform.OS === 'ios'){
                const __img = {
                    uri: res.uri,
                    type: res.type,
                    name: res.name
                    }
                this.setState({currentDoc:__img})
                
                if(this.props.onFinished){
                    setTimeout(this.props.onFinished,100,__img)
                }
            }else{
            var RNGRP = require('react-native-get-real-path');
            console.log("res----",res)
            RNGRP.getRealPathFromURI(res.uri).then(filePath =>{
                const __img = {
                    uri: "file://"+filePath,
                    type: res.type,
                    name: res.name
                    }
                    this.setState({currentDoc:__img})
                    console.log("doctorDetails  chooseFile",JSON.stringify(__img) );
                    if(this.props.onFinished){
                        this.props.onFinished(__img)
                    }
            })
        }
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );
        } catch ( err ) {
            if ( DocumentPicker.isCancel(err) ) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } 
            this.handleError()
        }
        /*
        try {
            const __oo={}
            __oo.filetype= [DocumentPickerUtil.allFiles()]
            //const { pageX, pageY } = event.nativeEvent;
           
        DocumentPicker.show(__oo,(error,res) => {
            // Android
            console.log("doctorDetails    DocumentPicker   ",__oo.filetype,res,JSON.stringify(error),this.props.cancelAction)
            if(error){
               this.handleError()
               //alert("error",JSON.stringify(error))
                return
            }
            if(Platform.OS === 'ios'){
                const __img = {
                    uri: res.uri,
                    type: res.type,
                    name: res.fileName
                    }
                this.setState({currentDoc:__img})
                console.log("doctorDetails  chooseFile",JSON.stringify(res) );
                if(this.props.onFinished){
                    this.props.onFinished(__img)
                }
            }else{
            var RNGRP = require('react-native-get-real-path');
            RNGRP.getRealPathFromURI(res.uri).then(filePath =>{
                const __img = {
                    uri: "file://"+filePath,
                    type: res.type,
                    name: res.fileName
                    }
                    this.setState({currentDoc:__img})
                    console.log("doctorDetails  chooseFile",JSON.stringify(__img) );
                    if(this.props.onFinished){
                        this.props.onFinished(__img)
                    }
            }
                
              )
        }
            
            //this.uploadSelectedFile(__img)
           
          });
        }catch ( err ) {
            console.log("doctorDetails    DocumentPicker  catch ",__oo.filetype,JSON.stringify(err),this.props.cancelAction)
            this.handleError()
            
          }*/
      }
    chooseFile = () => {
        ImagePicker.openPicker({ 
            freeStyleCropEnabled:true,
            compressImageQuality:0.8, 
            cropping: true,
        }).then(image => {    
            console.log("doctorDetails    openPicker   ",JSON.stringify(image))
                var __arr =image.path.split("/")
                const __ooo ={
                    uri: image.path,
                    type: image.mime,
                    name: __arr[__arr.length -1]
                    }
               this.setState({currentDoc:__ooo})
               if(this.props.onFinished){
                this.props.onFinished(__ooo,image)
            }
        }).catch(err => {this.handleError();console.log("doctorDetails    openCamera   ",JSON.stringify(err))});
    }
    takeSnapshot = () => {
        ImagePicker.openCamera({
            freeStyleCropEnabled:true,
            compressImageQuality:0.8, 
            cropping: true,
        }).then(image => {
            console.log("doctorDetails    openCamera   ",JSON.stringify(image))
                var __arr =image.path.split("/")
                const __ooo ={
                    uri: image.path,
                    type: image.mime,
                    name: __arr[__arr.length -1]
                    }
                    this.setState({currentDoc:__ooo})   
                    if(this.props.onFinished){
                        this.props.onFinished(__ooo,image)
                    }      
        }).catch(err => {this.handleError();console.log("doctorDetails    openCamera   ",JSON.stringify(err))});
    
    }
    onModeSelect = (key) => {
        const fileChooserMode = this.state.fileChooserMode
        if (typeof (key) === 'string' || key instanceof String) {
            this.setState({ fileChooserMode: key })
        } else {
            if (key[0] == "ok") {
                //alert("Not yet ready");
                //return;
                if (!fileChooserMode || fileChooserMode == "") {
                    alert("Please select an option")
                    return
                } else {
                    if (fileChooserMode == "snapshot") {
                        setTimeout(this.takeSnapshot, 1000)
                    } else if (fileChooserMode == "browse") {
                        if(this.props.imageOnly === true){
                            setTimeout(this.chooseFile, 1000)
                        }else{
                            setTimeout(this.chooseAnyFile, 1000)
                            
                        }
                        
                    }
                }
                this.setState({ showOptionModal: false })

            } else {
                this.setState({ showOptionModal: false })
                if(this.props.cancelAction ){
                    this.props.cancelAction();
                }
            }
        }

    }
      render() {
    
        return (
            <View style={{width:getDevWidth(),height:DeviceHeight-110, backgroundColor:"rgba(0, 0, 0, 0.1)"}} >
               
                {this.state.showOptionModal?makeUploadOptionModal(this.onModeSelect, this.onModeSelect, this.onModeSelect, this.state.fileChooserMode):null }
               </View>
        )


    }
    
}