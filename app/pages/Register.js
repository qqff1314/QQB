import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import BackButton from '../components/BackButton'
import utils from "../utils";
import {Toast} from "antd-mobile/lib/index";
export default class Register extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tel:'',
			code:'',
			psw:'',
			psw2:'',
			inCode:'',
            codeText:'获取验证码',
            codeFlag:true,
        }
	}

	componentDidMount() {

	}
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    register(){
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
        if(!this.state.psw){
            Toast.fail('请输入密码',1);
            return
        }
        if(!this.state.psw2){
            Toast.fail('请再次输入密码',1);
            return
        }
        if(this.state.psw!==this.state.psw2){
            Toast.fail('两次密码输入不相等',1);
            return
        }
        let data = {
            Phone:this.state.tel,
            SmsCode:this.state.code,
            Password :this.state.psw,
            InviteCode:this.state.inCode,
        };
        Toast.loading('注册中');
        utils.axios.post('member/signup',data)
            .then(res => {
                Toast.loading('注册成功' ,1, () => {
                    this.props.navigation.goBack();
                });
            })
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
			Type: 0
		}).then(res => {
            this.setState({codeFlag:false});
            this.CountDown();
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
	render() {
		return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/login_bg.png')} style={styles.container}>
                    <ScrollView style={styles.container} bounces={false}>
                        <View style={styles.content}>
                            <View style={styles.top}>
                                <TouchableOpacity activeOpacity={0.8} style={styles.back} onPress={() => this.props.navigation.state.params&&this.props.navigation.state.params.checkLogin==1?this.props.navigation.navigate('Home'):this.props.navigation.goBack()}>
                                    <Image source={require('../assets/close.png')} style={styles.closeIcon}/>
                                    <Text style={styles.backTitle}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.form}>
                                <View style={styles.formTitle}>
                                    <Image style={styles.formIcon} source={require('../assets/login_smile.png')}/>
                                    <Text style={styles.formTitleText}>你好，期权宝</Text>
                                </View>
                                <View style={styles.cell}>
                                    <View style={styles.cellIcon}>
                                        <Image source={require('../assets/login_phone.png')}
                                               style={{width:12.5,height:19}}/>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="请输入您的手机号"
                                        keyboardType="numeric"
                                        maxLength={11}
                                        placeholderTextColor="#848495"
                                        onChangeText={text => this.setState({tel:text})}
                                        underlineColorAndroid={"transparent"}/>
                                </View>
                                <View style={styles.cell}>
                                    <View style={styles.cellIcon}>
                                        <Image source={require('../assets/login_code.png')}
                                               style={{width:15,height:17}}/>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="请输入短信验证码"
                                        placeholderTextColor="#848495"
                                        onChangeText={text => this.setState({code:text})}
                                        underlineColorAndroid={"transparent"}/>
	                                <TouchableOpacity style={styles.cellCodeBox} activeOpacity={0.8} onPress={() =>this.send()}>
										<Text style={styles.cellCodeText}>{this.state.codeText}</Text>
	                                </TouchableOpacity>
                                </View>
                                <View style={styles.cell}>
                                    <View style={styles.cellIcon}>
                                        <Image source={require('../assets/login_pw.png')}
                                               style={{width:13.5,height:17}}/>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="请输入您要设置的密码"
                                        placeholderTextColor="#848495"
                                        onChangeText={text => this.setState({psw:text})}
                                        underlineColorAndroid={"transparent"}
                                        secureTextEntry={true}/>
                                </View>
	                            <View style={styles.cell}>
		                            <View style={styles.cellIcon}>
			                            <Image source={require('../assets/login_pw.png')}
			                                   style={{width:13.5,height:17}}/>
		                            </View>
		                            <TextInput
			                            style={styles.input}
                                        onChangeText={text => this.setState({psw2:text})}
			                            placeholder="请再次输入您要设置的密码"
			                            placeholderTextColor="#848495"
			                            underlineColorAndroid={"transparent"}
			                            secureTextEntry={true}/>
	                            </View>
	                            <View style={styles.cell}>
		                            <View style={styles.cellIcon}>
			                            <Image source={require('../assets/login_inv.png')}
			                                   style={{width:15.5,height:15}}/>
		                            </View>
		                            <TextInput
			                            style={styles.input}
			                            placeholder="请输入邀请码(选填)"
			                            placeholderTextColor="#848495"
                                        onChangeText={text => this.setState({inCode:text})}
			                            underlineColorAndroid={"transparent"}/>
	                            </View>
                                <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() =>this.register()}>
                                    <Text style={styles.btnText}>注册</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.linkBox} activeOpacity={0.8} onPress={() =>this.props.navigation.goBack()}>
                                    <Text style={styles.link}>已有账号，去登录</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.agreeBox} activeOpacity={0.8} onPress={() =>this.props.navigation.navigate('Agree')}>
                                    <Text style={styles.agree}>点击注册，即表示同意 <Text style={styles.agreeLink}>注册协议</Text></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </View>
		)
	}
}

const styles = StyleSheet.create({
    back:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        flexDirection:'row',
        alignItems:'center',
        width:80,
    },
    closeIcon:{
        width:12,
        height:12
    },
    backTitle:{
        fontSize:16,
        color:'#fff',
        marginLeft:5
    },
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		paddingTop: 37
	},
	top: {
		paddingLeft: 12.5,
		width: '100%'
	},
	form: {
		paddingLeft: 25,
		paddingRight: 25,
		marginTop: 65
	},
	formTitle: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 24
	},
	formIcon: {
		width: 27,
		height: 21.5,
		marginRight: 9
	},
	formTitleText: {
		fontSize: 23,
		color: '#fff'
	},
	cell: {
		paddingLeft: 10,
		paddingRight: 10,
		height: 55,
		width: '100%',
		borderBottomColor: '#454955',
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	cellIcon: {
		width: 28
	},
	input: {
		height: 40,
		color: '#848495',
		fontSize: 13,
		flex: 1
	},
	btn:{
		width:'100%',
		height:42,
		backgroundColor:'#D8B581',
		borderRadius:21,
		marginTop:50,
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
	linkBox:{
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		marginTop:18
	},
	link:{
		fontSize:12,
		color: '#7D7E8A'
	},
	linkLine:{
		width:1,
		height:10,
		backgroundColor:'#979797',
		marginLeft:12.5,
		marginRight:12.5
	},
	cellCodeBox:{
		width:80,
		alignItems:'flex-end',
		borderLeftColor:'rgba(216,181,129,.29)',
		borderLeftWidth:1
	},
	cellCodeText:{
		fontSize:12,
		color:'#D8B581'
	},
    agreeBox:{
		marginTop:100,
        marginBottom:20,
        textAlign:'center'
	},
	agree:{
        textAlign:'center',
        fontSize:11,
        color:'#7D7E8A'
	},
	agreeLink:{
        color:'#D8B581',
	}

});