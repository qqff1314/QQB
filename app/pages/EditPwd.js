import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import store from '../store'
import {observer} from 'mobx-react'
import utils from "../utils";
import {Toast} from "antd-mobile/lib/index";
import {NavigationActions} from "react-navigation";
@observer
export default class EditPwd extends Component {
    constructor(props){
        super(props)
        this.state={
            psw:'',
            psw2:'',
            psw3:'',
        }
    }

    change(){
        if(!this.state.psw){
            Toast.fail('请输入原密码',1);
            return
        }
        if(!this.state.psw2){
            Toast.fail('请输入新密码',1);
            return
        }
        if(!this.state.psw3){
            Toast.fail('请再次输入新密码',1);
            return
        }
        if(this.state.psw2!==this.state.psw3){
            Toast.fail('两次密码输入不相等',1);
            return
        }
        let data = {
            Password:this.state.psw,
            NewPassword:this.state.psw2,
        };
        Toast.loading('修改中');
        utils.axios.post('member/reset_password',data)
            .then(res => {
                Toast.loading('修改成功' ,1, () => {
                    store.userStore.setToken('');
                    store.userStore.setUserInfo({});
                    AsyncStorage.removeItem('token');
                    AsyncStorage.removeItem('userInfo');
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'HomeTab'})
                        ]
                    });
                    this.props.navigation.dispatch(resetAction)
                });
            }).catch(err=>{
            utils.backLogin(err,this.props)
        })
    }
    info(){
        return(
            <View style={styles.list}>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.psw.focus()}}>
                    <View style={styles.item}>
                        <Text style={styles.value}>原密码</Text>
                        <TextInput
                            ref="psw"
                            style={styles.input}
                            placeholder="请输入原密码"
                            maxLength={18}
                            placeholderTextColor="#7B7D8F"
                            onChangeText={text => this.setState({psw:text})}
                            secureTextEntry={true}
                            underlineColorAndroid={"transparent"}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.psw2.focus()}}>
                    <View style={styles.item}>
                        <Text style={styles.value}>新密码</Text>
                        <TextInput
                            ref="psw2"
                            style={styles.input}
                            placeholder="请输入你要设置的新密码"
                            maxLength={18}
                            placeholderTextColor="#7B7D8F"
                            secureTextEntry={true}
                            onChangeText={text => this.setState({psw2:text})}
                            underlineColorAndroid={"transparent"}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.psw3.focus()}}>
                    <View style={styles.item}>
                        <Text style={styles.value}>确认密码</Text>
                        <TextInput
                            ref="psw3"
                            style={styles.input}
                            secureTextEntry={true}
                            placeholder="请重新输入你设置的密码"
                            maxLength={18}
                            onChangeText={text => this.setState({psw3:text})}
                            placeholderTextColor="#7B7D8F"
                            underlineColorAndroid={"transparent"}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <Header title='修改密码' left={<BackButton navigation={this.props.navigation}/>}/>
                {this.info()}
                <View style={styles.btnBox}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={()=>this.change()}>
                        <Text style={styles.btnText}>确认修改</Text>
                    </TouchableOpacity>
                </View>
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
        paddingBottom:35
    },
});
