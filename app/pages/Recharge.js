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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import store from '../store'
import {observer} from 'mobx-react'
import utils from "../utils";
import {Toast} from "antd-mobile/lib/index";
@observer
export default class EditBank extends Component {
    constructor(props){
        super(props)
        this.state={
            text:'',
            modalVisible:false,
            isPay:false,
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
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            userInfo.Balance= data.Balance;
            userInfo.PasswordPay= data.PasswordPay;
            AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
            store.userStore.setUserInfo(userInfo)
        }).catch(err=>{
            utils.backLogin(err,this.props)
        })
    }
    all(){
        if(parseFloat(store.userStore.userInfo.Balance)==0){
            Toast.fail('余额不足',1);
            return
        }else{
            this.setState({Money:store.userStore.userInfo.Balance})
        }
    }
    send(){
        if(this.state.isajax) return false;
        if(store.userStore.userInfo.PasswordPay==''){
            Toast.fail('请设置先支付密码',1);
            return
        }
        if(!store.userStore.bink.AccountNo){
            Toast.fail('请绑定银行卡信息',1);
            return
        }
        if(!this.state.Money){
            Toast.fail('请输入提现金额',1);
            return
        }
        if (!/^[0-9]+(.[0-9]{1,2})?$/.test(this.state.Money)) {
            Toast.fail('小数点后面最多填写2位小数',1);
            return
        }
        this.refs.Money.blur();
        this.setState({
            modalVisible:true,
        })
    }
    forget(){
        this.setState({modalVisible:false,text:''},()=>{
            this.props.navigation.navigate('EditPay',{forget:1})
        })
    }
    success(){
        this.setState({isPay:false,modalVisible:false},()=>{
            this.props.navigation.replace('CapitalList',{Type:4})
        })
    }
    inputPsw(text){
        let t=this,datas={};
        t.setState({text:text},() => {
            if(t.state.text.length ===6){
                if(t.state.isajax){
                    return false
                }
                t.setState({modalVisible:false,isajax:true},()=>{
                    Toast.loading('提现中',1000);
                    datas={
                        AccountNo:store.userStore.bink.AccountNo,
                        AccountName	:store.userStore.bink.AccountName,
                        Bank:store.userStore.bink.BankName,
                        Money:t.state.Money,
                        Zbank:store.userStore.bink.Zbank||'',
                        Passwordpay:t.state.text
                    };
                    utils.axios.post('member/forward',datas).then(res => {
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


    getInput(){
        return(
            <View style={styles.inputInfo}>
                <TouchableOpacity activeOpacity={0.8} onPress={() =>{this.props.navigation.navigate('EditBank')}}>
                    <View style={styles.inputItemHead}>
                        <View  style={styles.inputHeadLeft}>
                            <Image source={require('../assets/icon28.png')} style={styles.inputHeadIco}/>
                            <Text style={styles.inputHeadNum}>
                                {store.userStore.bink.AccountNo?
                                    store.userStore.bink.BankName+'('+
                                    store.userStore.bink.AccountNo.substr(0,4)+"********"+store.userStore.bink.AccountNo.substr(-4)
                                    +')'
                                    :'请先绑定一张银行卡'}
                                </Text>
                        </View>
                        <Image source={require('../assets/index_next.png')} style={styles.inputHeadNext}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.inputItem}>
                    <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={() => {this.refs.Money.focus()}}>
                        <View style={styles.inputItemLeft}>
                            <Text style={styles.inputMoneyTxt}>¥</Text>
                            <TextInput
                                ref="Money"
                                style={styles.inputMoney}
                                placeholder={"可提现余额"+store.userStore.userInfo.Balance+"元"}
                                keyboardType="numeric"
                                maxLength={8}
                                value={this.state.Money}
                                placeholderTextColor="#787884"
                                onChangeText={text => this.setState({Money:text})}
                                underlineColorAndroid={"transparent"}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inputItemRight} activeOpacity={0.8} onPress={()=>{this.all()}}>
                        <Text style={styles.canUseMoney}>全部提现</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <Header title='提现' left={<BackButton navigation={this.props.navigation}/>}/>
                {
                    this.getInput()

                }
                <View style={styles.btnBox}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={()=>this.send()}>
                        <Text style={styles.btnText}>确认提现</Text>
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
                                        <Text style={styles.payMarkInfo}>提现</Text>
                                        <Text style={styles.payMarkMoney}>¥{this.state.Money}</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.textInput.focus()}}>
                                        <View style={styles.payInput}>
                                            <TextInput
                                                style={styles.payInputBox}
                                                ref='textInput'
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
                                            <Text style={styles.paySuccessTxt}>提交成功！</Text>
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
    inputItemHead:{
        height:55,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderBottomColor:'#454955',
        paddingRight:15
    },
    inputHeadLeft:{
        height:55,
        flexDirection:'row',
        alignItems:'center',
    },
    inputHeadNext:{
        width:5.5,
        height:10
    },
    inputHeadNum:{
        fontSize:15,
        color:'#fff'
    },
    inputHeadIco:{
        width:21,
        height:21.5,
        marginRight:15
    },
    container: {
        flex: 1,
        backgroundColor: '#24252C'
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
    },
    inputItem:{
        height:106,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    inputItemLeft:{
        flexDirection:'row',
        alignItems:'center',
    },
    inputMoneyTxt:{
        color: '#BEBEC8',
        fontSize:36
    },
    canUseMoney:{
        color: '#D8B581',
        fontSize:13
    },
    inputMoney:{
        marginLeft:15,
        color: '#fff',
        fontSize:15,
        flex:1,
        paddingRight:5,
    },
    inputItemRight:{
        borderLeftWidth:1,
        borderLeftColor:'#454549',
        paddingLeft:10,
        paddingRight:10,
        height:46,
        justifyContent:'center',
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
        borderRadius:4
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
