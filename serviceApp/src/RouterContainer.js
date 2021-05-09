import {  createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
//import { NavigationContainer } from '@react-navigation/native';
import {Dimensions} from 'react-native';

import Menu from './screens/Menu';
import LOGIN from './screens/Login';
import DASHBOARD from './screens/Dashboard';
import DETAILS from './screens/Details';
import DOCTORSEARCH from './screens/Doctorsearch';
import CONSULTATION from './screens/Consultation';
import PAYMENTSUCCESS from './screens/Paymentsuccess';
const DeviceWidth = Dimensions.get('window').width;
const DrawerStack = createDrawerNavigator({

  Login:LOGIN,
  Doctorsearch:DOCTORSEARCH,
  Details:DETAILS,
  Dashboard:DASHBOARD,
  Consultation:CONSULTATION,
  Paymentsuccess:PAYMENTSUCCESS,

  },
  {
    contentComponent: Menu,
  drawerWidth: DeviceWidth*0.7,
  
  }
);

export default AppContainer = createAppContainer(DrawerStack);