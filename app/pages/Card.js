import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton'
export default class Agree extends Component{
	constructor(props) {
		super(props)
		this.state = {

        }
	}
	render(){
		return(
			<View style={styles.container}>
				<Header
					title={'银行转账'}
					left={<BackButton backTitle='返回' navigation={this.props.navigation}/>}/>
                <View style={styles.main}>
                    <ImageBackground source={require('../assets/xlogo21.png')} style={styles.card}>
                        <Image source={require('../assets/xlogo22.png')} style={styles.ico}/>
                        <View>
                            <Text style={styles.name}>1202011109800087288</Text>
                            <Text style={styles.txt}>深圳前海中恒恒达互联网金融服务有限公司</Text>
                            <Text style={styles.txt}>中国工商银行浙江省分行营业部本级业务部</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.intr}>
                    <Text style={styles.intrHead}>温馨提示:</Text>
                    <Text style={styles.intrInfo}>1.转账时请仔细核对卡号、户名及支行信息,避免操作出错</Text>
                    <Text style={styles.intrInfo}>2.转专账时请备注您在平台注册的用户名和手机号码,以便财务核对及时入账</Text>
                    <Text style={styles.intrInfo}>3.转专账成功后请保存好交易回执单并及时致电平台客服</Text>
                </View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor:"#282A35"
    },
    main:{
	  flexDirection:'row',
      justifyContent:'center'
    },
    intr:{
	    marginTop:35,
        paddingLeft:15,
        paddingRight:15
    },
    intrHead:{
        fontSize:14,
        color: '#AEAEAE',
        lineHeight:20,
        paddingBottom:7
    },
    intrInfo:{
        fontSize:13,
        color: '#898CA1',
        lineHeight:19,
        paddingBottom:3
    },
    ico:{
        width:56,
        height:56,
        marginRight:15
    },
    card:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
	    marginTop:15,
	    width:'100%',
        height:169
    },
    name:{
        fontSize:24,
        color: '#000000',
        lineHeight:33
    },
    txt:{
        fontSize:12,
        color: '#9C875D',
        lineHeight:17
    }
});
