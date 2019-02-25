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
	AsyncStorage
} from 'react-native';
import utils from "../utils";
import {Toast} from "antd-mobile/lib/index";
import store from '../store'
import BackButton from '../components/BackButton'
export default class Register extends Component {
	constructor(props) {
		super(props)
		this.state = {
            codeText:'获取验证码',
            codeFlag:true,
			error:false,
            tel:'',
            code:'',
			psw:'',
			psw2:'',
			step:1,  //步骤 1:验证手机  2:重设密码  3:设置成功
		}
	}

	componentDidMount() {

	}
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
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
            Type: 1
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
    stepOne(){
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
        utils.axios.post('member/check_sms',{Phone:this.state.tel,
            Type:1,Sms:this.state.code})
            .then(res => {
                this.setState({step:2});
            })
	}
    stepTwo(){
        if(!this.state.psw){
            Toast.fail('请输入密码',1);
            return
        }
        if(!this.state.psw2){
            Toast.fail('请再次输入密码',1);
            return
        }
        if(this.state.psw!==this.state.psw2){
            this.setState({error:true});
            return
        }
        this.setState({error:false});
        let data = {
            Phone:this.state.tel,
            Smscode:this.state.code,
            Password :this.state.psw,
        };
        Toast.loading('重设中');
        utils.axios.post('member/find_password',data)
            .then(res => {
                Toast.loading('重设密码成功' ,1, () => {
                    this.setState({step:3});
                });
            })
	}
    stepThree(){
        store.userStore.setToken('');
        store.userStore.setUserInfo({});
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('userInfo');
        this.props.navigation.goBack();
	}
	renderStep1(){  //步骤 1:验证手机
		return(
			<View style={styles.form}>
				<View style={styles.formTitle}>
					<Image style={styles.formIcon} source={require('../assets/login_cry.png')}/>
					<Text style={styles.formTitleText}>忘记密码</Text>
				</View>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.tel.focus()}}>
					<View style={styles.cell}>
						<View style={styles.cellIcon}>
							<Image source={require('../assets/login_phone.png')}
								   style={{width:12.5,height:19}}/>
						</View>
						<TextInput
                            ref="tel"
                            style={styles.input}
							placeholder="请输入您的手机号"
							keyboardType="numeric"
							maxLength={11}
							placeholderTextColor="#848495"
							onChangeText={text => this.setState({tel:text})}
							underlineColorAndroid={"transparent"}/>
					</View>
				</TouchableOpacity>
				<View style={styles.cell}>
					<View style={styles.cellIcon}>
						<Image source={require('../assets/login_code.png')}
						       style={{width:15,height:17}}/>
					</View>
					<TextInput
						style={styles.input}
						placeholder="请输入短信验证码"
						placeholderTextColor="#848495"
						underlineColorAndroid={"transparent"}
                        onChangeText={text => this.setState({code:text})}
                        />
					<TouchableOpacity style={styles.cellCodeBox} activeOpacity={0.8} onPress={() =>this.send()}>
						<Text style={styles.cellCodeText}>{this.state.codeText}</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() =>this.stepOne()}>
					<Text style={styles.btnText}>下一步</Text>
				</TouchableOpacity>
			</View>
		)
	}

	renderStep2(){  //步骤 2:重设密码
		return(
			<View style={styles.form}>
				<View style={styles.formTitle}>
					<Image style={styles.formIcon} source={require('../assets/login_cry.png')}/>
					<Text style={styles.formTitleText}>重设密码</Text>
				</View>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.psw.focus()}}>
					<View style={styles.cell}>
						<View style={styles.cellIcon}>
							<Image source={require('../assets/login_pw.png')}
								   style={{width:13.5,height:17}}/>
						</View>
						<TextInput
                            ref="psw"
                            style={styles.input}
							placeholder="请输入新的密码"
							placeholderTextColor="#848495"
							onChangeText={text => this.setState({psw:text})}
							underlineColorAndroid={"transparent"}
							secureTextEntry={true}/>
					</View>
				</TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.psw2.focus()}}>
					<View style={styles.cell}>
						<View style={styles.cellIcon}>
							<Image source={require('../assets/login_pw.png')}
								   style={{width:13.5,height:17}}/>
						</View>
						<TextInput
                            ref="psw2"
                            style={styles.input}
							placeholder="请再次输入密码"
							placeholderTextColor="#848495"
							onChangeText={text => this.setState({psw2:text})}
							underlineColorAndroid={"transparent"}
							secureTextEntry={true}/>
					</View>
				</TouchableOpacity>
				{
					this.state.error?
						<View style={styles.errBox}>
							<Text style={styles.errText}>两次密码输入不一致</Text>
						</View>
						:
						null
				}
				<TouchableOpacity activeOpacity={0.8} style={[styles.btn,{marginTop:24}]} onPress={() =>this.stepTwo()}>
					<Text style={styles.btnText}>下一步</Text>
				</TouchableOpacity>
			</View>
		)
	}

	renderStep3(){  //步骤 2:设置成功
		return(
			<View>
				<View style={styles.successBox}>
					<Image style={styles.successSmile} source={require('../assets/login_smile.png')}/>
					<Text style={styles.successText}>您的登录密码已经重新设置{'\n'}请妥善保管</Text>
				</View>
				<View style={{paddingLeft:15,paddingRight:15}}>
					<TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={()=>this.stepThree()}>
						<Text style={styles.btnText}>立即登录</Text>
					</TouchableOpacity>
				</View>

			</View>

		)
	}

	renderContent(){
		switch (this.state.step){
			case 1 :
				return this.renderStep1()
				break
			case 2 :
				return this.renderStep2()
				break
			case 3 :
				return this.renderStep3()
				break
			default:
				return null
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<ImageBackground source={require('../assets/login_bg.png')} style={styles.container}>
					<ScrollView style={styles.container} bounces={false}>
						<View style={styles.content}>
							<View style={styles.top}>
                                <TouchableOpacity activeOpacity={0.8} style={styles.back} onPress={() =>this.props.navigation.goBack()}>
                                    <Image source={require('../assets/close.png')} style={styles.closeIcon}/>
                                    <Text style={styles.backTitle}>关闭</Text>
                                </TouchableOpacity>
							</View>
							{this.renderContent()}
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
	errBox:{
		marginLeft:36,
		height:17,
		justifyContent:'center',
		marginTop:9
	},
	errText:{
		fontSize:12,
		color:'#FE755F'
	},
	successBox:{
		justifyContent:'center',
		alignItems:'center',
		height:275,
		marginTop:60
	},
	successSmile:{
		width:48,
		height:38
	},
	successText:{
		fontSize:14,
		lineHeight:20,
		color:'#848495',
		textAlign:'center',
		marginTop:21
	}
});
