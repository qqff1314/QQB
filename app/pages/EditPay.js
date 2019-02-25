import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity, AsyncStorage,
} from 'react-native';
import utils from "../utils";
import Header from '../components/Header';
import {Toast} from "antd-mobile/lib/index";
import BackButton from '../components/BackButton'
import store from "../store";
export default class Register extends Component {
	constructor(props) {
		super(props)
		this.state = {
            codeText:'获取验证码',
            codeFlag:true,
            tel:'',
            code:'',
			psw:'',
			psw2:'',
			step:1,  //步骤 1:验证手机  2:重设密码
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
            Type: 5
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
            Type:5,Sms:this.state.code})
            .then(res => {
                this.setState({step:2});
            }).catch(err=>{
            utils.backLogin(err,this.props)
        })
	}
    stepTwo(){
        if(!this.state.psw){
            Toast.fail('请输入交易密码',1);
            return
        }
        if(!this.state.psw2){
            Toast.fail('请再次输入交易密码',1);
            return
        }
        if(this.state.psw.length!==6){
            Toast.fail('请输入6位交易密码',1);
            return
        }
        if(this.state.psw!==this.state.psw2){
            Toast.fail('两次密码输入不一致',1);
            return
        }
        let data = {
            Phone:this.state.tel,
            Smscode:this.state.code,
            PasswordPay :this.state.psw,
        };
        Toast.loading('设置中');
        utils.axios.post('member/password_pay',data)
            .then(async res => {
                let userInfo = await AsyncStorage.getItem('userInfo');
                userInfo = JSON.parse(userInfo);
                userInfo.PasswordPay= '设置成功';
                AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
                store.userStore.setUserInfo(userInfo);
                Toast.loading('设置提现密码成功' ,1, () => {
                   this.props.navigation.goBack();
                });
            }).catch(err=>{

            utils.backLogin(err,this.props)
        })
	}
	renderStep1(){  //步骤 1:验证手机
		return(
			<View style={styles.form}>
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
                <View style={styles.list}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.psw.focus()}}>
						<View style={styles.item}>
							<Text style={styles.value}>交易密码</Text>
							<TextInput
								ref="psw"
								style={styles.inputPsw}
								keyboardType="numeric"
								placeholder="请输入你设置的交易密码"
								maxLength={6}
								placeholderTextColor="#7B7D8F"
								onChangeText={text => this.setState({psw:text})}
								secureTextEntry={true}
								underlineColorAndroid={"transparent"}/>
						</View>
					</TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.psw2.focus()}}>
						<View style={styles.item}>
							<Text style={styles.value}>确认交易密码</Text>
							<TextInput
								ref="psw2"
								style={styles.inputPsw}
								secureTextEntry={true}
								keyboardType="numeric"
								placeholder="请重新输入你设置的交易密码"
								maxLength={6}
								onChangeText={text => this.setState({psw2:text})}
								placeholderTextColor="#7B7D8F"
								underlineColorAndroid={"transparent"}/>
						</View>
					</TouchableOpacity>
                </View>
				<TouchableOpacity activeOpacity={0.8} style={[styles.btn,{marginTop:24}]} onPress={() =>this.stepTwo()}>
					<Text style={styles.btnText}>立即确认</Text>
				</TouchableOpacity>
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
			default:
				return null
		}
	}

	render() {
		return (
			<View style={styles.container}>
                <Header title={this.state.step==1?'获取验证码':'设置交易密码'} left={<BackButton navigation={this.props.navigation}/>}/>
				<ScrollView style={styles.container} bounces={false}>
						{this.renderContent()}
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
	content: {
		flex: 1,
	},
	top: {
		paddingLeft: 12.5,
		width: '100%'
	},
	form: {
		width:'100%',
		paddingLeft: 15,
		paddingRight: 15,
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
    list:{
        width:'100%'
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
    inputPsw:{
        flex:1,
        textAlign:'right',
        paddingLeft:10,
        fontSize:14,
        color:'#fff'
    },
});
