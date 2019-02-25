import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    RefreshControl,
    TouchableOpacity,
    ImageBackground,
    ScrollView, AsyncStorage
} from 'react-native';
import Header from '../components/Header';
import store from '../store'
import {observer} from 'mobx-react'
import utils from "../utils";
import {Toast} from "antd-mobile/lib/index";

@observer
export default class Center extends Component {
    static navigationOptions = ({navigation,screenProps}) => ({
        tabBarOnPress:({scene,jumpToIndex})=>{
            if(!store.userStore.token){
                navigation.navigate('Login',{checkLogin:0})
            }else{
                utils.axios.get('member/info').then(async res => {
                    let data = res.data.Data;
                    let userInfo = await AsyncStorage.getItem('userInfo');
                    userInfo = JSON.parse(userInfo);
                    userInfo.Balance= data.Balance;
                    userInfo.IsIdentified= data.IsIdentified;
                    AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
                    store.userStore.setUserInfo(userInfo)
                    jumpToIndex(3)
                }).catch(err=>{
                    utils.backLogin(err,this.props)
                });
            }
        },
    });
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isRefreshing: false
        }
    }
    init(){
        utils.axios.get('member/info').then(async res => {
            let data = res.data.Data;
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            userInfo.Balance= data.Balance;
            userInfo.IsIdentified= data.IsIdentified;
            AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
            store.userStore.setUserInfo(userInfo)
        }).catch(err=>{
            utils.backLogin(err,this.props)
        });
    }
    _onRefresh(){
        this.setState({isRefreshing: true});
        this.init();
        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        },1000);
    }
    go(url){
        const nav=this.props.navigation;
        if(store.userStore.userInfo.IsIdentified!=2){
            Toast.fail('请先实名认证',1);
            return false
        }
        nav.navigate(url)
    }
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header title='个人中心'/>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    <View style={styles.perBox}>
                        <View style={styles.perTopBox}>
                            <View style={styles.imgBox}>
                                {
                                    store.userStore.userInfo.Avatar&&store.userStore.userInfo.Avatar.RelativePath ?
                                        <Image style={styles.avator} source={{uri:store.userStore.userInfo.Avatar&&store.userStore.userInfo.Avatar.RelativePath}}/>
                                        :
                                        <Image style={styles.avator} source={require('../assets/avatar.png')}/>
                                }
                                <Text style={styles.name}> {store.userStore.userInfo.NickName}</Text>
                            </View>
                            <TouchableOpacity  activeOpacity={0.8} style={styles.imgBox} onPress={() => navigate('Setting')}>
                                <Image style={styles.setLogo} source={require('../assets/xico1.png')} />
                                <Text style={styles.setWz}>设置</Text>
                            </TouchableOpacity>
                        </View>
                        <ImageBackground style={styles.yBg} source={require('../assets/ximg1.png')}>
                            <View style={styles.priceBox}>
                                <Text style={styles.priceWz}>可用余额(元)</Text>
                                <Text style={styles.price}>{store.userStore.userInfo.Balance}</Text>
                            </View>
                            <View style={styles.lineBox}>
                                <View style={styles.line}/>
                            </View>
                            <View style={styles.priceToolBox}>
                                <TouchableOpacity  activeOpacity={0.8}  onPress={() => navigate('CapitalList')} style={styles.priceTool}>
                                    <Image style={styles.tool1} source={require('../assets/xlogo3.png')}/>
                                    <Text style={styles.toolName}>明细</Text>
                                </TouchableOpacity>
                                <View style={styles.rightLine}/>
                                <TouchableOpacity  activeOpacity={0.8}  onPress={() => navigate('AccountPay')} style={styles.priceTool}>
                                    <Image style={styles.tool2} source={require('../assets/xlogo4.png')}/>
                                    <Text style={styles.toolName}>充值</Text>
                                </TouchableOpacity>
                                <View style={styles.rightLine}/>
                                <TouchableOpacity style={styles.priceTool}  onPress={() =>  this.go('Recharge')} activeOpacity={0.8}>
                                    <Image style={styles.tool3} source={require('../assets/xlogo5.png')}/>
                                    <Text style={styles.toolName}>提现</Text>
                                </TouchableOpacity>
                            </View>

                        </ImageBackground>
                    </View>
                    <View style={styles.navBox}>

                        <TouchableOpacity style={styles.navIn} onPress={()=>navigate('Authentication')} activeOpacity={0.8}>
                            <Image style={{width: 20,height: 15}} source={require('../assets/xlogo17.png')}/>
                            <View style={styles.navRight}>
                                <Text style={styles.navNames}>实名认证</Text>
                                <View style={{flex:1,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
                                    {/*{*/}
                                        {/*store.userStore.userInfo.IsIdentified==2?*/}
                                            {/*<Text style={styles.navNames}>{store.userStore.userInfo.IdNumber}</Text>*/}
                                            {/*:*/}
                                            {/*null*/}
                                    {/*}*/}
                                    <Image style={[styles.navJt,{marginLeft:15}]} source={require('../assets/xlogo12.png')}/>
                                </View>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navIn}  activeOpacity={0.8} onPress={() => navigate('MyChioce',{Name:'我的自选'})}>
                            <Image style={styles.navLogo} source={require('../assets/xlogo6.png')}/>
                            <View style={styles.navRight}>
                                <Text style={styles.navNames}>我的自选</Text>
                                <Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navIn} activeOpacity={0.8} onPress={() => navigate('OptionView',{Id:1,Type:1})}>
                            <Image style={styles.navLogo} source={require('../assets/xlogo7.png')}/>
                            <View style={styles.navRight}>
                                <Text style={styles.navNames}>我的申购</Text>
                                <Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navIn} activeOpacity={0.8} onPress={() => navigate('OptionView',{Id:1,Type:2})}>
                            <Image style={styles.navLogo} source={require('../assets/xlogo8.png')}/>
                            <View style={styles.navRight}>
                                <Text style={styles.navNames}>我的持仓</Text>
                                <Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navIn} activeOpacity={0.8} onPress={() => navigate('OptionView',{Id:2})}>
                            <Image style={styles.navLogo} source={require('../assets/xlogo9.png')}/>
                            <View style={styles.navRight}>
                                <Text style={styles.navNames}>我的结算</Text>
                                <Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.navIn,styles.navMarTop]} onPress={() => navigate('NewsCenter')} activeOpacity={0.8}>
                            <Image style={styles.navLogo} source={require('../assets/xlogo10.png')}/>
                            <View style={styles.navRight}>
                                <Text style={styles.navNames}>消息中心</Text>
                                <Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navIn} activeOpacity={0.8} onPress={() => navigate('Message')}>
                            <Image style={styles.navLogo} source={require('../assets/xlogo11.png')}/>
                            <View style={styles.navRight}>
                                <Text style={styles.navNames}>在线留言</Text>
                                <Image style={styles.navJt} source={require('../assets/xlogo12.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#24252C'
        },
        perBox: {
            padding: 15,
        },
        perTopBox: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 18
        },
        imgBox: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        avator: {
            width: 40,
            height: 40,
            borderRadius: 20
        },
        name: {
            fontSize: 14,
            color: '#FFFFFF',
            lineHeight: 40,
            marginLeft: 8
        },
        setLogo: {
            width: 14,
            height: 14,
            marginRight: 4
        },
        setWz: {
            fontSize: 13,
            color: '#fff',
            lineHeight: 40
        },
        yBg: {
            width: '100%',
            height: 175,
            borderRadius: 8,
            overflow: 'hidden'
        },
        priceBox: {
            marginLeft: 26,
            marginTop: 28
        },
        priceWz: {
            fontSize: 13,
            color: '#fff',
            marginBottom: 5,
            lineHeight: 19,
        },
        price: {
            fontSize: 45,
            color: '#FFFFFF',
            lineHeight: 52,
            marginBottom: 17
        },
        lineBox: {
            width: '100%',
            alignItems: 'center',
            borderRadius: 16,
        },
        line: {
            height: 1,
            width: '90%',
            backgroundColor: '#fff',
            opacity: 0.39,
        },
        priceToolBox: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 54,
        },
        priceTool: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '33.33%',
            height: 54,
        },
        rightLine:{
            height:12,
            width:1,
            backgroundColor: '#fff',
        },
        tool1: {
            width: 9,
            height: 12,
            marginRight: 8
        },
        tool2: {
            width: 14,
            height: 10,
            marginRight: 8
        },
        tool3: {
            width: 11,
            height: 11,
            marginRight: 8
        },
        toolName: {
            fontSize: 12,
            color: '#fff',
        },
        navBox: {
            paddingLeft: 21,
            paddingRight: 21,
            paddingBottom:20
        },
        navNames: {
            fontSize: 14,
            color: '#D3D5E4',
        },
        navLogo: {
            width: 17,
            height: 15
        },
        navJt: {
            width: 6,
            height: 11,
        },
        navIn: {
            paddingBottom: 11,
            paddingTop: 17,
            borderBottomWidth: 1,
            borderBottomColor: '#3C3F49',
            flexDirection: 'row',
            alignItems:'center',
            justifyContent: 'space-between',
        },
        navRight: {
            width: '91.5%',
            flexDirection: 'row',
            alignItems:'center',
            justifyContent: 'space-between',
        },
        navMarTop: {
            marginTop: 17,
        },
    })
;