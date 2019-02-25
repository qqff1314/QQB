import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    KeyboardAvoidingView,
    TouchableOpacity,
    TextInput, AsyncStorage,
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import {observer} from 'mobx-react'
import utils from "../utils";
import store from '../store'
import {Toast} from "antd-mobile/lib/index";
@observer
export default class EditBank extends Component {
    constructor(props){
        super(props)
        this.state={
            text:'',
            modalVisible:false,
            isPay:false,
            info:'',
            Money:'',
            isajax:false
        }
    }
    componentDidMount() {
        this.getBalance();
    }
    getBalance(){
        utils.axios.get('member/info').then(async res => {
            let data = res.data.Data;
            this.setState({info:data});
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            userInfo.Balance= data.Balance;
            AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
            store.userStore.setUserInfo(userInfo)
        }).catch(err=>{
            utils.backLogin(err,this.props)
        })
    }
    send(){
        if(this.state.isajax) return false;
        if(this.state.info.PasswordPay==''){
            Toast.fail('请设置先支付密码',1);
            return
        }
        if(!store.userStore.bink.AccountNo){
            Toast.fail('请填写银行卡信息',1);
            return
        }
        if(!this.state.Money){
            Toast.fail('请输入充值金额',1);
            return
        }
        if (!/^[0-9]+(.[0-9]{1,2})?$/.test(this.state.Money)) {
            Toast.fail('小数点后面最多填写2位小数',1);
            return
        }
        this.refs.Money.blur();
        this.setState({
            modalVisible:true,
        });
    }
    inputPsw(text){
        let t=this,datas={};
        t.setState({text:text},() => {
            if(t.state.text.length ===6){
                if(t.state.isajax){
                    return false
                }
                t.setState({modalVisible:false,isajax:true},()=>{
                    Toast.loading('充值中',1000);
                    datas={
                        AccountNo:store.userStore.bink.AccountNo,
                        AccountName	:store.userStore.bink.AccountName,
                        BankId:store.userStore.bink.BankId,
                        CertificateNo:store.userStore.bink.CertificateNo,
                        Money:t.state.Money,
                        MobileNo:store.userStore.bink.Mobile,
                        Zbank:store.userStore.bink.Zbank||'',
                        Passwordpay:t.state.text
                    };
                    utils.axios.post('member/recharge',datas).then(res => {
                        Toast.hide();
                        t.getBalance();
                        t.setState({isPay:true,modalVisible:true,isajax:false,text:''})
                    }).catch(err=>{
                        Toast.hide();
                        t.setState({isajax:false,text:''});
                        utils.backLogin(err,this.props)
                    })
                });

            }
        });
    }
    forget(){
        this.setState({text:'',modalVisible:false},()=>{
            this.props.navigation.navigate('EditPay',{forget:1})
        })
    }
    success(){
        this.setState({isPay:false,modalVisible:false},()=>{
            this.props.navigation.replace('CapitalList',{Type:3})
        })
    }
    getInputItem(){
        let inputItem = [];
        let text=this.state.text;
        for (let i = 0; i < 6; i++) {
            if (i == 0) {
                inputItem.push(
                    <View key={i} style={styles.payInputItem}>
                        {i < text.length ? <View style={styles.iconStyle} /> : null}
                    </View>)
            }
            else {
                inputItem.push(
                    <View key={i} style={[styles.payInputItem,styles.inputItemBorderLeftWidth]}>
                        {i < text.length ?
                            <View style={styles.iconStyle}>
                            </View> : null}
                    </View>)
            }
        }
        return inputItem;
    }


    step(){
        return(
            <View style={styles.inputInfo}>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('EditBank')}} activeOpacity={0.8} style={[styles.inputItem,styles.inputTop]}>
                    <View style={styles.inputCardTitle}>
                        <Text style={styles.inputCardTxt}>
                            {store.userStore.bink.AccountNo?
                                store.userStore.bink.BankName+'('+
                                store.userStore.bink.AccountNo.substr(0,4)+"********"+store.userStore.bink.AccountNo.substr(-4)
                                +')'
                                :'请填写银行卡信息'}
                        </Text>
                    </View>
                    <Image source={require('../assets/index_next.png')} style={{width:8,height:15}}/>

                </TouchableOpacity>
                <View style={styles.inputItem}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.Money.focus()}}>
                        <View style={styles.flexAlign}>
                            <Text style={styles.inputMoneyTxt}>¥</Text>
                            <TextInput
                                ref="Money"
                                style={styles.inputMoney}
                                placeholder="请输入充值金额（元）"
                                keyboardType="numeric"
                                maxLength={8}
                                onChangeText={text => this.setState({Money:text})}
                                placeholderTextColor="#787884"
                                underlineColorAndroid={"transparent"}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <Header title='充值' left={<BackButton navigation={this.props.navigation}/>}/>
                {
                    this.step()
                }
                {
                    this.state.info?
                        <View style={styles.inputItemRight}>
                            <Text style={styles.canUseMoney}>可用余额：{store.userStore.userInfo.Balance}元</Text>
                        </View>
                        :null
                }
                <View style={styles.btnBox}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={()=>this.send()}>
                        <Text style={styles.btnText}>确认充值</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={styles.payBg}>

                        {
                            !this.state.isPay?
                            <KeyboardAvoidingView style={styles.payBox}>
                                <View  style={styles.payHead}>
                                    <TouchableOpacity activeOpacity={0.8}  style={styles.payDel} onPress={()=>{ this.setState({text:'',modalVisible:false})}}>
                                        <Image source={require('../assets/paydel.png')} style={styles.payDelIco}/>
                                    </TouchableOpacity>
                                    <Text style={styles.payTitle}>请输入支付密码</Text>
                                </View>
                                <View  style={styles.payMark}>
                                    <Text style={styles.payMarkInfo}>充值</Text>
                                    <Text style={styles.payMarkMoney}>¥{this.state.Money}</Text>
                                </View>
                                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.payInput.focus()}}>
                                    <View style={styles.payInput}>
                                        <TextInput
                                            style={styles.payInputBox}
                                            ref='payInput'
                                            maxLength={6}
                                            autoFocus={false}
                                            onChangeText={text => {
                                                this.inputPsw(text)
                                            }}
                                            keyboardType="numeric"
                                            placeholderTextColor="#848495"
                                            underlineColorAndroid={"transparent"}
                                        />
                                        {
                                            this.getInputItem()
                                        }
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} style={styles.payBtn} onPress={()=>{this.forget()}}>
                                    <Text style={styles.payBtnText}>忘记密码？</Text>
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                            :
                            <View style={styles.paySuccessBox}>
                                <View style={styles.paySuccess}>
                                    <Image source={require('../assets/paysuccess.png')} style={styles.paySuccessIco}/>
                                    <View style={styles.paySuccessTxtBox}>
                                        <Text style={styles.paySuccessTxt}>充值成功！</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.8} style={styles.paySuccessBtn} onPress={()=>{this.success()}}>
                                        <Text style={styles.paySuccessBtnTxt}>确认</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#24252C'
    },
    canUseMoney:{
        color: '#E5E5E5',
        fontSize:13
    },
    inputItemRight:{
        height:15,
        alignItems:'center',
        flexDirection:'row',
        paddingLeft:15,
        marginTop:15
    },
    btn:{
        width:'100%',
        height:42,
        backgroundColor:'#D8B581',
        borderRadius:21,
        justifyContent:'center',
        alignItems:'center',
        shadowColor:'#D8B581',
        shadowOffset:{width:0,height:3},
        shadowOpacity:0.5,
        shadowRadius:2
    },
    btnText:{
        fontSize:14,
        color:'#282933'
    },
    btnBox:{
        paddingTop:35,
        paddingLeft:25,
        paddingRight:25,
        paddingBottom:35
    },

    inputInfo:{
        backgroundColor:'#28282F',
        paddingLeft:15,
        paddingRight:15
    },
    inputItem:{
        width:'100%',
        paddingTop:15,
        paddingBottom:15,
    },
    inputTop:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#454955'
    },
    inputCardTitle:{
        width:'80%',
    },
    inputCardTxt:{
        lineHeight:23,
        fontSize:16,
        color:'#fff',
    },
    inputCard:{
        marginTop:10,
        paddingBottom:10,
        height:40,
        width:'100%',
        fontSize:30,
        color:'#D8B581',
        borderBottomWidth:1,
        borderBottomColor:'#454955'
    },
    inputMoneyTxt:{
        color: '#BEBEC8',
        fontSize:36,
    },
    inputMoney:{
        marginLeft:15,
        color: '#fff',
        fontSize:15,
        flex:1,
    },
    flexAlign:{
        flexDirection:'row',
        alignItems:'center',
    },
    //以下是支付弹窗
    payBg:{
        width: SCREEN_WIDTH,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0, 0, 0, 0.7)'
    },
    payBox:{
        width: SCREEN_WIDTH/1.23,
        backgroundColor:'#fff',
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'center',
        borderRadius:4
    },
    payHead:{
        position:'relative',
        height:49,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:1,
        borderBottomColor:'#D7D7D7'
    },
    payTitle:{
        fontSize:15,
        color:'#333'
    },
    payDel:{
        position:'absolute',
        left:0,
        top:0,
        height:49,
        width:49,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    payDelIco:{
        width:13,
        height:13,
    },
    payMark:{
        paddingTop:18,
        paddingBottom:18,
        paddingLeft:13,
        paddingRight:13
    },
    payMarkInfo:{
        lineHeight:20,
        color: '#8C8C8C',
        fontSize:14,
        textAlign:'center'
    },
    payMarkMoney:{
        color: '#333',
        fontSize:30,
        paddingTop:5,
        textAlign:'center'
    },
    payBtn:{
        marginTop:18,
        marginBottom:20,
    },
    payBtnText:{
        textAlign:'center',
        fontSize:14,
        color:'#8C8C8C'
    },
    payInputBox:{
        width:'100%',
        height:'100%',
        zIndex:99,
        position:'absolute',
        opacity:0
    },
    payInput:{
        marginLeft:20,
        marginRight:20,
        height:44,
        width:SCREEN_WIDTH/1.41,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff'
    },
    iconStyle: {
        width: 16,
        height: 16,
        backgroundColor: '#222',
        borderRadius: 8,
    },
    payInputItem: {
        height: '100%',
        width:SCREEN_WIDTH/8.46,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 1,
        borderColor: '#ccc',
    },
    //以下是支付成功弹窗
    paySuccessBox:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        // paddingBottom:35
    },
    paySuccess:{
        width:SCREEN_WIDTH/1.59,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:4,
    },
    paySuccessIco:{
        width:49,
        height:49,
        marginTop:24,
        marginBottom:12,
    },
    paySuccessTxtBox:{
        paddingBottom:22
    },
    paySuccessTxt:{
        fontSize:16,
        color:'#000'
    },
    paySuccessBtn:{
        height:39,
        borderTopWidth:1,
        borderTopColor:'#D7D7D7',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
    },
    paySuccessBtnTxt:{
        fontSize:15,
        color: '#D8B581'
    },
});
