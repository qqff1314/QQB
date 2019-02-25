import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Image
} from 'react-native';
import Header from '../components/Header';
export default class PayWait extends Component{
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render(){
        return(
            <View style={styles.container}>
                <Header title={'账户充值'}/>
                <ScrollView style={{flex:1}} bounces={false}>
                    <View style={styles.main}>
                        <Image source={require('../assets/wait.png')} style={styles.image}/>
                        <Text style={styles.txt}>您的充值订单银行正在处理</Text>
                        <Text style={styles.txt}>请耐心等待</Text>
                        <TouchableOpacity style={styles.btn} activeOpacity={0.8}  onPress={() => {this.props.navigation.navigate('Center')}}>
                            <Text style={styles.btnTxt}>返回个人中心</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <Text style={styles.mark}>温馨提示：收到银行扣款短信后，可到充值明细中查看充值记录。</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#24252C'
    },
    mark:{
        position:'absolute',
        bottom:50,
        left:0,
        width:'100%',
        marginTop:100,
        textAlign:'center',
        fontSize:12,
        color:'#A4A6B8',
    },
    btn:{
        marginTop:40,
        width:130,
        height:30,
        borderRadius:50,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#D8B581'
    },
    btnTxt:{
        fontSize:14,
        color:'#282933',
    },
    txt:{
        width:'100%',
        fontSize:15,
        textAlign:"center",
        color:'#B6B8C8',
        lineHeight:21
    },
    main:{
        paddingRight:15,
        paddingLeft:15,
        flexWrap:'wrap',
        marginTop:'30%',
        width:'100%',
        flexDirection:'row',
        justifyContent:'center'
    },
    image:{
        marginBottom:20,
        width:75,
        height:75
    }

});