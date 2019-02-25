import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Linking
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import store from '../store'
import {observer} from 'mobx-react'
import utils from "../utils";
import {Toast} from "antd-mobile/lib/index";
@observer
export default class EditTrans extends Component {
    constructor(props){
        super(props)
        this.state={
            next:false,
            tel:'',
            code:'',
            tel2:'',
            code2:'',
            phone:'',//客服电话
            codeText:'获取验证码',
            codeFlag:true,
        }
    }
    componentDidMount() {
        this.init();
    }
    init(){
        utils.axios.get('news/about').then(res => {
            this.setState({
                phone:res.data.Data.Tel,
            });
        })
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    //拨打电话
    linking=(url)=>{
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));

    }
    send(){
        if(!this.state.codeFlag) return false;
        let isMob = /^1\d{10}$/; //手机格式验证
        if(!this.state.tel){
            Toast.fail('请输入手机号！',1);
            return false;
        }else if(!isMob.test(this.state.tel)){
            Toast.fail('手机号码格式不正确！',1);
            return false;
        }
        utils.axios.post('member/send_sms',{
            Phone: this.state.tel,
            Type: this.state.next?2:1
        }).then(res => {
            this.setState({codeFlag:false});
            this.CountDown();
        }).catch(err=>{
            utils.backLogin(err,this.props)
        })
    }
    //倒计时
    CountDown(){
        let t = 60;
        this.setState({codeText:t + '秒后重发'});
        this.timer = setInterval(()=> {
            if (t == 0) {
                this.setState({codeText:'获取验证码'});
                this.setState({codeFlag:true});
                clearInterval(this.timer);
            } else {
                t--;
                this.setState({codeText:t + '秒后重发'});
            }
        }, 1000)
    }
    nextStep(){
        if(!this.state.next){
            if(!this.state.tel){
                Toast.fail('请输入手机号码',1);
                return
            }
            if(!(/^1[0-9]{10}$/.test(this.state.tel))){
                Toast.fail('请输入正确手机号码',1);
                return
            }
            if(!this.state.code){
                Toast.fail('请输入验证码',1);
                return
            }
            utils.axios.post('member/check_sms',
                {Phone:this.state.tel, Type:2,Sms:this.state.code})
                .then(res => {
                    this.timer && clearTimeout(this.timer);
                    this.setState(
                        {
                            next:true,
                            codeText:'获取验证码',
                            codeFlag:true,
                        }
                    )
                }).catch(err=>{
                utils.backLogin(err,this.props)
            })
        }else{
            if(!this.state.tel2){
                Toast.fail('请输入手机号码',1);
                return
            }
            if(!(/^1[0-9]{10}$/.test(this.state.tel2))){
                Toast.fail('请输入正确手机号码',1);
                return
            }
            if(!this.state.code2){
                Toast.fail('请输入验证码',1);
                return
            }
            let data = {
                Phone:this.state.tel,
                NewPhone:this.state.tel2,
                NewSmsCode :this.state.code2,
            };
            Toast.loading('修改中');
            utils.axios.post('member/phone',data)
                .then(res => {
                    Toast.loading('修改成功' ,1, () => {
                        this.props.navigation.goBack();
                    });
                }).catch(err=>{
                utils.backLogin(err,this.props)
            })

        }
    }
    step1(){
        return(
            <View style={styles.list}>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.tel.focus()}}>
                    <View style={styles.item}>
                        <Image style={{width:13,height:19}} source={require('../assets/icon16.png')}/>
                        <TextInput
                            ref="tel"
                            style={styles.itemInputValue}
                            placeholder="请输入手机号"
                            keyboardType="numeric"
                            maxLength={11}
                            onChangeText={text => this.setState({tel:text})}
                            placeholderTextColor="#7B7D8F"
                            underlineColorAndroid={"transparent"}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.code.focus()}}>
                    <View style={styles.item}>
                        <View style={styles.itemInput}>
                            <Image style={styles.itemInputIco} source={require('../assets/icon11.png')}/>
                            <TextInput
                                ref="code"
                                style={styles.itemInputValue}
                                placeholder="请输入短信验证码"
                                onChangeText={text => this.setState({code:text})}
                                placeholderTextColor="#7B7D8F"
                                underlineColorAndroid={"transparent"}/>
                            <TouchableOpacity style={styles.itemCode} activeOpacity={0.8} onPress={() =>this.send()}>
                                <Text style={styles.itemCodeValue}>{this.state.codeText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    step2(){
        return(
            <View style={styles.list}>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.tel2.focus()}}>
                    <View style={styles.item}>
                        <Image style={{width:13,height:19}} source={require('../assets/icon16.png')}/>
                        <TextInput
                            ref="tel2"
                            style={styles.itemInputValue}
                            placeholder="请输入您的手机号"
                            keyboardType="numeric"
                            maxLength={11}
                            onChangeText={text => this.setState({tel2:text})}
                            placeholderTextColor="#7B7D8F"
                            underlineColorAndroid={"transparent"}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.code2.focus()}}>
                    <View style={styles.item}>
                        <View style={styles.itemInput}>
                            <Image style={styles.itemInputIco} source={require('../assets/icon11.png')}/>
                            <TextInput
                                ref="code2"
                                style={styles.itemInputValue}
                                placeholder="请输入短信验证码"
                                maxLength={8}
                                onChangeText={text => this.setState({code2:text})}
                                placeholderTextColor="#7B7D8F"
                                underlineColorAndroid={"transparent"}/>
                            <View style={styles.itemCode}>
                                <Text style={styles.itemCodeValue}>{this.state.codeText}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title={!this.state.next?'更换绑定手机号':'绑定新手机号'} left={<BackButton navigation={this.props.navigation}/>}/>
                {!this.state.next ?
                    this.step1()
                    :
                    this.step2()
                }
                <View style={styles.btnBox}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={()=>this.nextStep()}>
                        <Text style={styles.btnText}>{!this.state.next?'下一步':'确认'}</Text>
                    </TouchableOpacity>
                </View>
                {!this.state.next ?
                    <TouchableOpacity activeOpacity={0.8} style={styles.mark} onPress={()=>this.state.phone?this.linking('tel:'+110):Toast.loading('暂无客服电话',1)}>
                        <Text style={styles.markText}>手机号无法使用？<Text style={styles.markValue}>联系客服</Text></Text>
                    </TouchableOpacity>
                    :
                    null
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#24252C'
    },
    list:{
        width:SCREEN_WIDTH,
        paddingLeft:15,
        paddingRight:15
    },
    item:{
        width:'100%',
        height:65,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderBottomColor:'#3C3F49'
    },
    value:{
        fontSize:15,
        color:'#fff'
    },
    input:{
        flex:1,
        textAlign:'right',
        paddingLeft:10,
        fontSize:14,
        color:'#fff'
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
    },
    head:{
        fontSize:13,
        color:'#C4C6D3'
    },
    itemInput:{
        width:'100%',
        paddingTop:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    itemInputIco:{
        width:15,
        height:17,
    },
    itemInputValue:{
        flex:1,
        paddingLeft:12,
        paddingRight:10,
        fontSize:14,
        color:'#fff'
    },
    itemCode:{
        paddingLeft:16,
        borderLeftColor: '#D8B581',
        borderLeftWidth:1
    },
    itemCodeValue:{
        textAlign:'right',
        color: '#D8B581',
        fontSize:13,
    },
    mark:{
        paddingTop:15,
        paddingBottom:35
    },
    markText:{
        textAlign:'center',
        fontSize:12,
        color: '#9A9DB4'
    },
    markValue:{
        color: '#D8B581'
    }
});
