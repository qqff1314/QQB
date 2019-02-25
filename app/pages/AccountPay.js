import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton'
import store from "../store";
import {Toast} from "antd-mobile/lib/index";

export default class Home extends Component{
	constructor(props) {
		super(props)
		this.state = {
		}
	}
    go(url){
        const nav=this.props.navigation;
        if(store.userStore.userInfo.IsIdentified!=2){
            Toast.fail('请先实名认证',1);
            return false
        }
        nav.navigate(url)
    }
    render(){
        return(
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#302F37"
                    barStyle="light-content"/>
                <Header
                    title={'账户充值'}
                    left={<BackButton backTitle='返回' navigation={this.props.navigation}/>}
                    right={<TouchableOpacity onPress={()=>this.props.navigation.navigate('CapitalList',{Type:3})}><Text style={styles.rightTxt}>充值记录</Text></TouchableOpacity>}
                />
                <View style={styles.list}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.item,styles.bor]} onPress={() => this.go('Pay')}>
                        <View style={styles.info}>
                            <Image style={{width:38,height:31,marginRight:12}} source={require('../assets/xlogo19.png')} />
                            <View style={styles.txt}>
                                <Text style={styles.name}>在线支付</Text>
                                <Text style={styles.value}>即时到账，无需网银</Text>
                            </View>
                        </View>
                        <Image style={styles.next} source={require('../assets/index_next.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={() => this.props.navigation.navigate('Card')}>
                        <View style={styles.info}>
                            <Image style={{width:50,height:28}} source={require('../assets/xlogo20.png')} />
                            <View style={styles.txt}>
                                <Text style={styles.name}>银行转账</Text>
                                <Text style={styles.value}>支持大额支付</Text>
                            </View>
                        </View>
                        <Image style={styles.next} source={require('../assets/index_next.png')} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#282A35'
    },
    rightTxt:{
        fontSize:15,
        color:'#fff',
    },
    list:{
        backgroundColor:'#28282F',
        width:'100%',
        paddingLeft:15
    },
    txt:{
        marginLeft:28,
    },
    name:{
        fontSize:15,
        color:'#FFF',
        lineHeight:21
    },
    value:{
        fontSize:13,
        color:'#686970',
        lineHeight:19
    },
    info:{
        flexDirection:'row',
        alignItems:'center',
    },
    bor:{
        borderBottomColor:'#454955',
        borderBottomWidth:1
    },
    item:{
        height:68,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',

    },
    next:{
        width:6,
        height:10,
        marginRight:15
    }
});