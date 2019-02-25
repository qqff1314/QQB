import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import utils from "../utils";
export default class Home extends Component{
    constructor(props) {
        super(props)
        this.state = {
            data:{}
        }
    }
    componentDidMount() {
        this.getList()
    }
    getList(){
        utils.axios.get('member/moneyinfo?id='+this.props.navigation.state.params.Id).then(res => {
            console.log(res)
            this.setState({data:res.data.Data})
        }).catch(err=>{
            utils.backLogin(err,this.props)
        })
    }
    render() {
        const data=this.state.data;
        return (
            <View style={styles.container}>
                <Header title={'收入明细'} left={<BackButton navigation={this.props.navigation}/>}/>
                <ScrollView bounces={false}>
                    <View style={styles.viewList}>
                        <View style={styles.viewItem}>
                            <View style={styles.viewTop}>
                                <Text style={styles.viewNum}>订单号：{this.state.data.Gorder}</Text>
                                <View style={styles.viewSta}>
                                    <Image source={require('../assets/option_set.png')} style={styles.viewStaIco}/>
                                    <Text style={styles.viewStaTxt}>
                                        {this.state.data.Gstatus!=5&&this.state.data.Gstatus!=0?'已结算':'已退回'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.viewInfo}>
                                <View>
                                    <Text style={styles.infoValue}>{this.state.data.GoPrice}</Text>
                                    <Text style={styles.infoTxt}>名义本金</Text>
                                </View>
                                {
                                    this.state.data.Gstatus==5||this.state.data.Gstatus==0?
                                        <View>
                                            <Text style={styles.infoValueUp}>+{this.state.data.Gprice}</Text>
                                            <Text style={styles.infoTxt}>余额</Text>
                                        </View>
                                        :null
                                }
                                {

                                    this.state.data.Gptype==1&&this.state.data.Gstatus!=5&&this.state.data.Gstatus!=0?
                                        <View>
                                            <Text style={styles.infoValueUp}>+{this.state.data.Money}</Text>
                                            <Text style={styles.infoTxt}>余额</Text>
                                        </View>
                                        :null
                                }
                                {
                                    this.state.data.Gptype==2&&this.state.data.Gstatus!=5&&this.state.data.Gstatus!=0?
                                        <View>
                                            <Text style={styles.infoValueDown}>-{this.state.data.Gprice}</Text>
                                            <Text style={styles.infoTxt}>余额</Text>
                                        </View>
                                        :null
                                }

                                <View>
                                    <Text style={styles.infoValue}>{this.state.data.Gprice}</Text>
                                    <Text style={styles.infoTxt}>权利金</Text>
                                </View>
                            </View>
                            <View  style={styles.paramList}>
                                <View  style={styles.paramItem}>
                                    <View  style={styles.paramTxtBox}>
                                        <Text style={styles.paramTxt}>股票标的：</Text>
                                    </View>
                                    <Text style={styles.paramValue}>{this.state.data.Gtitle}（{this.state.data.Gcode}）</Text>
                                </View>
                                <View  style={styles.paramItem}>
                                    <View  style={styles.paramTxtBox}>
                                        <Text style={styles.paramTxt}>买入价格：</Text>
                                    </View>
                                    <Text style={styles.paramValue}><Text style={styles.paramMoney}>{this.state.data.GcPrice||'0.00'} </Text>元</Text>
                                </View>
                                <View  style={styles.paramItem}>
                                    <View  style={styles.paramTxtBox}>
                                        <Text style={styles.paramTxt}>卖出价格：</Text>
                                    </View>
                                    <Text style={styles.paramValue}>
                                        {
                                            this.state.data.Gstatus == 5 || this.state.data.Gstatus == 0 ? '---'
                                                :
                                                <Text
                                                    style={styles.paramMoney}>{this.state.data.GoutPrice || '0.00'}元</Text>
                                        }</Text>
                                </View>
                                <View  style={styles.paramItem}>
                                    <View  style={styles.paramTxtBox}>
                                        <Text style={styles.paramTxt}>购买日期：</Text>
                                    </View>
                                    <Text style={styles.paramValue}>{this.state.data.Gstatus!=5&&this.state.data.Gstatus!=0?this.state.data.Gstartime:'---'}</Text>
                                </View>
                                <View  style={styles.paramItem}>
                                    <View  style={styles.paramTxtBox}>
                                        <Text style={styles.paramTxt}>卖出日期：</Text>
                                    </View>
                                    <Text style={styles.paramValue}>{this.state.data.Gstatus!=5&&this.state.data.Gstatus!=0?this.state.data.Gjtime:'---'}</Text>
                                </View>
                                <View  style={styles.paramItem}>
                                    <View  style={styles.paramTxtBox}>
                                        <Text style={styles.paramTxt}>买入方式：</Text>
                                    </View>
                                    <Text style={styles.paramValue}>{this.state.data.Gtype==1?'市价买入':'限价卖出'}</Text>
                                </View>
                                <View  style={styles.paramItem}>
                                    <View  style={styles.paramTxtBox}>
                                        <Text style={styles.paramTxt}>行权周期：</Text>
                                    </View>
                                    <Text style={styles.paramValue}>{this.state.data.Gweek}周</Text>
                                </View>
                            </View>
                            <Image source={require('../assets/option_left.png')} style={styles.optionLeft}/>
                            <Image source={require('../assets/option_line.png')} style={styles.optionLine}/>
                            <Image source={require('../assets/option_right.png')} style={styles.optionRight}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#24252C'
    },
    viewList:{
        width:	SCREEN_WIDTH,
        backgroundColor:'#24252C',
        paddingLeft:15,
        paddingRight:15,
    },
    viewItem:{
        width:'100%',
        marginBottom:15,
        marginTop:27,
        borderRadius:5,
        overflow:'hidden'
    },
    viewTop:{
        width:'100%',
        height:54,
        backgroundColor: '#28282F',
        paddingLeft:15,
        paddingRight:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    viewNum:{
        fontSize:14,
        color:'#D8B581',
        lineHeight:20
    },
    viewSta:{
        height:20,
        flexDirection:'row',
        alignItems:'center',
    },
    viewStaIco:{
        width:14,
        height:14,
        marginRight:5,
    },
    viewStaTxt:{
        fontSize:13,
        color:'#fff'
    },
    optionLeft:{
        width:7,
        height:13,
        position:'absolute',
        left:0,
        top:47.5
    },
    optionRight:{
        width:7,
        height:13,
        position:'absolute',
        right:0,
        top:47.5
    },
    optionLine:{
        width:312,
        height:1,
        position:'absolute',
        left:'50%',
        marginLeft:-156,
        top:54
    },
    viewInfo:{
        width:'100%',
        paddingTop:18,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:18,
        backgroundColor:'#2C2C33',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    infoValue:{
        fontSize:18,
        color:'#D8B581',
        lineHeight:25,
        marginBottom:1
    },
    infoTxt:{
        fontSize:13,
        color:'#898994',
        lineHeight:19
    },
    infoValueUp:{
        fontSize:18,
        color:'#EC524C',
        lineHeight:25,
        marginBottom:1
    },
    infoValueDown:{
        fontSize:18,
        color:'#0CA500',
        lineHeight:25,
        marginBottom:1
    },
    paramList:{
        paddingTop:19,
        paddingBottom:40,
        backgroundColor:'#28282F',
        paddingRight:15,
        paddingLeft:15,
        overflow:'hidden'
    },
    paramItem:{
        width:'100%',
        paddingBottom:10,
        flexDirection:'row',
        alignItems:'center',
    },
    paramTxtBox:{
        width:94
    },
    paramTxt:{
        lineHeight:19,
        fontSize:13,
        color:'#ABADBF',
    },
    paramValue:{
        flex:1,
        lineHeight:19,
        fontSize:13,
        color:'#fff',
    },
    paramMoney:{
        color: '#EC524C'
    },
})
