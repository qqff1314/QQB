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
    AsyncStorage,
	TouchableOpacity
} from 'react-native';
import {observer} from 'mobx-react'
import {Toast} from 'antd-mobile'
import store from '../store'
import utils from '../utils'
import BackButton from '../components/BackButton'
import {NavigationActions} from "react-navigation";
@observer
export default class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
            tel:'',
            psw:''
		}
	}

	componentDidMount() {
	}
    loginGo(){
        if(this.props.navigation.state.params&&this.props.navigation.state.params.checkLogin==1){
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Page'})
                ]
            });
            this.props.navigation.dispatch(resetAction)
		}else{
            this.props.navigation.goBack()
        }
	}
//登录
    login(){
        if(!this.state.tel){
            Toast.fail('请输入手机号码');
            return
        }
        if(!(/^1[0-9]{10}$/.test(this.state.tel))){
            Toast.fail('请输入正确手机号码');
            return
        }
        if(!this.state.psw){
            Toast.fail('请输入密码');
            return
        }
        let data = {
            Phone:this.state.tel,
            Password :this.state.psw
		};
        Toast.loading('登录中');
        utils.axios.post('member/signin',data)
            .then(res => {
                let data = res.data.Data;
                store.userStore.setToken(data.Token);
                store.userStore.setUserInfo(data);
                AsyncStorage.setItem('token',data.Token);
                AsyncStorage.setItem('userInfo',JSON.stringify(data));
                Toast.success('登录成功',1);
                this.loginGo();
            })
    }

	render() {
        const {navigate} = this.props.navigation;
		return (
			<View style={styles.container}>
				<ImageBackground source={require('../assets/login_bg.png')} style={styles.container}>
					<ScrollView style={styles.container} bounces={false}>
						<View style={styles.content}>
							<View style={styles.top}>
                                <TouchableOpacity activeOpacity={0.8} style={styles.back} onPress={() => this.loginGo()}>
                                    <Image source={require('../assets/close.png')} style={styles.closeIcon}/>
                                    <Text style={styles.backTitle}>关闭</Text>
                                </TouchableOpacity>
							</View>
							<View style={styles.form}>
								<View style={styles.formTitle}>
									<Image style={styles.formIcon} source={require('../assets/login_smile.png')}/>
									<Text style={styles.formTitleText}>欢迎回来期权宝</Text>
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
											placeholder="请输入手机号"
                                            keyboardType={'phone-pad'}
                                            returnKeyType="join"
											maxLength={11}
											onChangeText={text => this.setState({tel:text})}
											placeholderTextColor="#848495"
                                            underlineColorAndroid={"transparent"}/>
									</View>
								</TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.psw.focus()}}>
									<View style={styles.cell}>
										<View style={styles.cellIcon}>
											<Image source={require('../assets/login_pw.png')}
												   style={{width:13.5,height:17}}/>
										</View>
										<TextInput
                                            ref="psw"
											style={styles.input}
											placeholder="请输入密码"
											placeholderTextColor="#848495"
											underlineColorAndroid={"transparent"}
											secureTextEntry={true}
											onChangeText={text => this.setState({psw:text})}
											returnKeyType="join"
											/>
									</View>
								</TouchableOpacity>
								<TouchableOpacity activeOpacity={0.8} onPress={() => this.login()} style={styles.btn}>
									<Text style={styles.btnText}>登录</Text>
								</TouchableOpacity>
								<View style={styles.linkBox}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() =>navigate('Register')}>
                                        <Text style={styles.link}>新用户注册</Text>
                                    </TouchableOpacity>
									<View style={styles.linkLine}/>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() =>navigate('Forget')}>
                                        <Text style={styles.link}>忘记密码？</Text>
                                    </TouchableOpacity>
								</View>
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
		fontSize: 16,
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
	}
});