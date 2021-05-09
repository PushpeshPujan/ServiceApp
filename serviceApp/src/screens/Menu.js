
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions,StackActions  } from 'react-navigation';
import { ScrollView, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import imageConstantURI from "../constants/imageConst"


const completedMenu = []
class Menu extends Component {
  constructor(props) {
    super(props);
    //global.setScreenName("Mapview")
    global.globalprops = props
  this.state = {
    'username': '',
    "profileImage": "",
    "roleName": "",
    isImageUpdated:false,
    userData:null,
    menuData:[{ItemLabel:"PROFILE",itemId:"",subMenu:[]},{ItemLabel:"HOME",itemId:"",subMenu:[]},{ItemLabel:"SEARCH", itemId:"",subMenu:[]},{ItemLabel:"HISTORY",itemId:"",subMenu:[]},{ItemLabel:"FAVORITE",itemId:"",subMenu:[]}]
  }
}


  componentDidMount = () => {
  
  }
  makeMenuItem=(__label, __style, subMenuCount, menuId, __action)=> {
    return ((subMenuCount > 0) ? (<Text style={__style}>
        {__label.toUpperCase()}
    </Text>) : (<TouchableOpacity onPress={() => __action(menuId)} key={menuId} >
        <Text style={__style} >
            {__label.toUpperCase()}
        </Text>
    </TouchableOpacity>))
}
navigateToScreen=(__key)=>{
alert("this menu will active soon")
}
makeSubmenuItem=(__label, __action, __key, __style)=> {
  return (<TouchableOpacity onPress={() => __action(__key)} key={__key} >
      <Text style={__style} >
          {__label.toUpperCase()}
      </Text>
  </TouchableOpacity>)
}
  makeMenuBlock = (menuItem,index) => {


    return (<View style={styles.menuSection} key={"menu_"+index}>
   
      {this.makeMenuItem(menuItem.ItemLabel, styles.sectionHeadingStyle,menuItem.subMenu.length,menuItem.itemId.split(".").join("_"),this.navigateToScreen)}
      <View style={styles.navSectionStyle}>
        {menuItem.subMenu.map((item, index) => { return this.makeSubmenuItem(item.ItemLabel, this.navigateToScreen, item.itemId.split(".").join("_"), styles.navItemStyle) })}
      </View>
    </View>)
  }
  render() {
    const menuData =  global.userData && global.userData.menuItems?global.userData.menuItems:[];
    
const username =global.userData && global.userData.displayName?global.userData.displayName:"";
//var pic = null
var picUrl = global.userData && global.userData.profilePicture?global.userData.profilePicture:null
const pic = picUrl && (picUrl.indexOf("https://") > -1 || picUrl.indexOf("http://") > -1)?picUrl:picUrl?global.baseUrl+picUrl:null
//if(global.userData)pic = global.userData.profilePicture global.baseUrl+global.userData.profilePicture
//console.log("pic  ",pic)
    return (
     
     
      <View style={styles.container}>
        <View style={{ alignItems: 'center', flexDirection: "column", borderBottomColor: '#93278f', borderBottomWidth: 0.5, marginBottom: 10, }}>
          <View style={{ paddingBottom: 10, alignItems: 'center', }}>
            <Image source={(pic && pic != "") ? { uri: pic } : imageConstantURI.profileImage.src}
              style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
            <Text  >{(username && username != "") ? "Hello, " + username : ""}
            </Text>
          </View>
        </View>
        <ScrollView>
          {global.isUserLoggedin && menuData?menuData.map((item, index) => { return this.makeMenuBlock(item,index) }):null}

        </ScrollView>
      </View>
    );
  }
}

Menu.propTypes = {
  navigation: PropTypes.object,
};



export default Menu;
const styles = {
  container: { paddingTop: 10, flex: 1 },
  navItemStyle: { paddingBottom: 10, paddingLeft: 15, fontFamily: 'Roboto', fontSize: 12, color: '#000', paddingLeft: 25, },
  navSectionStyle: { paddingHorizontal: 5, },
  sectionHeadingStyle: { paddingLeft: 15, fontFamily: 'Roboto', fontSize: 12, color: '#00acc1', fontWeight: 'bold', marginBottom: 10, },
  menuSection: { borderBottomColor: '#ccc', borderBottomWidth: 0.5, marginBottom: 10, }
};