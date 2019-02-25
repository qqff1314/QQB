import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import './utils/global'
import {StackNavigator, TabNavigator} from 'react-navigation';
import Home from './pages/Home'
import Option from './pages/Option'
import Center from './pages/Center'
import News from './pages/News'
import NewsInfo from './pages/NewsInfo'
import Login from './pages/Login'
import NoticeList from './pages/NoticeList'
import Register from './pages/Register'
import Forget from './pages/Forget'
import Message from './pages/Message'
import Rule from './pages/Rule'
import OptionView from './pages/OptionView'
import Setting from './pages/Setting'
import MyChioce from './pages/MyChioce'
import NewsCenter from './pages/NewsCenter'
import EditBank from './pages/EditBank'
import EditPwd from './pages/EditPwd'
import EditPhone from './pages/EditPhone'
import IncomeDetail from './pages/IncomeDetail'
import CapitalList from './pages/CapitalList'
import Recharge from './pages/Recharge'
import Pay from './pages/Pay'
import Agree from './pages/Agree'
import EditPay from './pages/EditPay'
import AccountPay from './pages/AccountPay'
import Authentication from './pages/Authentication'
import Card from './pages/Card'
import PayWait from './pages/PayWait'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';


console.disableYellowBox = true;



const HomeTab = TabNavigator({
    Home: {
		screen: Home,
		navigationOptions: {
            header:null,
            tabBarLabel: '首页',
            tabBarIcon: ({focused}) => (
                <Image
                    source={focused ? require('./assets/icon5.png') : require('./assets/icon1.png')}
                    style={styles.tabIcon}
                />
            ),
		}
    },
    Option: {
        screen: Option,
		navigationOptions: {
            header:null,
            tabBarLabel: '期权',
            tabBarIcon: ({focused}) => (
                <Image
                    source={focused ? require('./assets/icon6.png') : require('./assets/icon2.png')}
                    style={styles.tabIcon}
                />
            ),
		}
    },
    News: {
		screen:News,
		navigationOptions: {
            header:null,
            tabBarLabel: '资讯',
            tabBarIcon: ({focused}) => (
                <Image
                    source={focused ? require('./assets/icon7.png') : require('./assets/icon3.png')}
                    style={styles.tabIcon}
                />
            ),
		}
    },
    Center: {
		screen: Center,
		navigationOptions: {
            header:null,
            tabBarLabel: '我的',
            tabBarIcon: ({focused}) => (
                <Image
                    source={focused ? require('./assets/icon8.png') : require('./assets/icon4.png')}
                    style={styles.tabIcon}
                />
            ),
		}
	},
},{
    tabBarPosition: 'bottom',
    lazy: iOS?true:false,
    initialRouteName:'Home',
    swipeEnabled:false,
    animationEnabled:false,
    tabBarOptions: {
        style: {
            height:49,
            backgroundColor:'#272932',
        },
        activeBackgroundColor:'#272932',
        activeTintColor:'#D4B781',
        inactiveBackgroundColor:'#272932',
        inactiveTintColor:'#797C89',
        showLabel:true,
        showIcon: true,
        labelStyle:{
			fontSize:10,
            margin:0,
            marginBottom:7,
            textAlign:'center'
		},
        indicatorStyle:{
			height:0
		},
        iconStyle:{
			width:25,
			height:25,
			margin:0
        },
        
    }
})
const Page = StackNavigator({
    HomeTab: {
        screen: HomeTab,
    },
    PayWait:{
        screen:PayWait,
        navigationOptions:{
            header:null
        }
    },
    Card:{
        screen:Card,
        navigationOptions:{
            header:null
        }
    },
    AccountPay:{
        screen:AccountPay,
        navigationOptions:{
            header:null
        }
    },
    Pay:{
        screen:Pay,
        navigationOptions:{
            header:null
        }
    },
    EditBank: {
        screen: EditBank,
        navigationOptions:{
            header:null
        }
    },
    MyChioce:{
        screen:MyChioce,
        navigationOptions:{
            header:null
        }
    },
    Authentication:{
        screen:Authentication,
            navigationOptions:{
            header:null
        }
    },
    IncomeDetail: {
        screen: IncomeDetail,
        navigationOptions:{
            header:null
        }
    },
    EditPay: {
        screen: EditPay,
        navigationOptions:{
            header:null
        }
    },
    CapitalList: {
        screen: CapitalList,
        navigationOptions:{
            header:null
        }
    },
    Recharge:{
        screen:Recharge,
        navigationOptions:{
            header:null
        }
    },
    NewsCenter:{
        screen:NewsCenter,
        navigationOptions:{
            header:null
        }
    },
    EditPhone: {
        screen: EditPhone,
        navigationOptions:{
            header:null
        }
    },


    EditPwd: {
        screen: EditPwd,
            navigationOptions:{
            header:null
        }
    },
    Setting:{
        screen:Setting,
        navigationOptions:{
            header:null
        }
    },
    OptionView:{
        screen:OptionView,
        navigationOptions:{
            header:null
        }
    },
    NoticeList:{
        screen:NoticeList,
        navigationOptions:{
            header:null
        }
    },
    Message:{
        screen:Message,
        navigationOptions:{
            header:null
        }
    },
    Rule:{
        screen:Rule,
        navigationOptions:{
            header:null
        }
    },
    NewsInfo:{
        screen:NewsInfo,
        navigationOptions:{
            header:null
        }
    },
},{
    headerMode: 'screen',
    transitionConfig:()=>({
        screenInterpolator:CardStackStyleInterpolator.forHorizontal,
    })
})

export default StackNavigator({
    Page:{
        screen:Page
    },
	Login:{
		screen:Login,
		navigationOptions:{
			header:null
		}
	},
    Agree:{
        screen:Agree,
        navigationOptions:{
            header:null
        }
    },
	Register:{
		screen:Register,
		navigationOptions:{
			header:null
		}
	},
	Forget:{
		screen:Forget,
		navigationOptions:{
			header:null
		}
	},
},{
    mode:'modal'
})

const styles = StyleSheet.create({
    tabIcon:{
        width:25,
        height:25,
    }
})