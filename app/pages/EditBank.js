import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    TouchableOpacity,
    TextInput, AsyncStorage,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import {observer} from 'mobx-react'
import { Picker } from 'antd-mobile'
import store from '../store'
import utils from "../utils";
import {Toast} from "antd-mobile/lib/index";

const CustomChildren = props => (
    <TouchableOpacity activeOpacity={1} style={styles.binkItem} onPress={() => {props.onClick()}}>
        <Text style={styles.binkItemTxt}>{props.title}</Text>
        <Image source={require('../assets/index_next.png')} style={{width:8,height:15,marginLeft:5}}/>
    </TouchableOpacity>
)


@observer
export default class EditBank extends Component {
    constructor(props){
        super(props)
        this.state={
            binkTypeList:[],
            binkType:'',
            card:'',
            name:'',
            defaultName:'',
            Branch:'',
            defaultBranch:'',
            number:'',
            tel:'',
            list:[]
        }
    }
    componentDidMount() {
        let cardInfo=store.userStore.bink;
        if(!cardInfo.AccountNo){
            utils.axios.get('member/info').then(res => {
                let data=res.data.Data;
                this.setState({card:data.Accountno,
                    binkType:data.Bank?data.Bank.split():'',
                    defaultName:data.Accountname,
                    defaultBranch:data.Zbank,
                    name:data.Accountname,
                    Branch:data.Zbank,
                    tel:data.Mobile,
                    number:data.Certificateno});
            }).catch(err=>{
                utils.backLogin(err,this.props)
            })
        }else{
            this.setState({card:cardInfo.AccountNo,
                binkType:cardInfo.BankName?cardInfo.BankName.split():'',
                defaultName:cardInfo.AccountName,
                defaultBranch:cardInfo.Zbank,
                Branch:cardInfo.Zbank,
                name:cardInfo.AccountName,
                tel:cardInfo.Mobile,
                number:cardInfo.CertificateNo});
        }
        this.getBink();
    }
    getBink(){
        let t=this;
        utils.axios.get('member/banklist').then(res => {
            let list=[];
            res.data.Data.List.forEach(function (item,index) {
                let val={
                    label: item.Title,
                    value: item.Title,
                };
                list.push(val)
            });
            t.setState({binkTypeList:list,list: res.data.Data.List})
        }).catch(err=>{
        })
    }
    changeBink(value){
        this.setState({
            binkType:value
        })
    }
    send(){
        if(!this.state.card){
            Toast.fail('请输入银行卡号',1);
            return
        }
        if(!(/^[0-9]*$/.test(this.state.card))){
            Toast.fail('请输入正确银行卡号',1);
            return
        }
        if(!this.state.binkType){
            Toast.fail('请选择开户银行',1);
            return
        }
        if(!this.state.name){
            Toast.fail('请输入姓名',1);
            return
        }
        if(!this.state.number){
            Toast.fail('请输入身份证号',1);
            return
        }
        if(!this.state.tel){
            Toast.fail('请输入预留手机号',1);
            return
        }
        let Id='',t=this;
        t.state.list.forEach(function (item,index) {
            if(item.Title==t.state.binkType.join()){
                Id=item.Code
            }
        });
        let data={
            AccountNo:t.state.card,
            AccountName	:t.state.name,
            BankId:Id,
            BankName:t.state.binkType.join(),
            CertificateNo:t.state.number,
            Mobile:t.state.tel,
            Zbank:t.state.Branch
        };
        AsyncStorage.setItem('bink',JSON.stringify(data));
        store.userStore.setBink(data);
        t.props.navigation.goBack();
    }
    render() {
        return (
            <View style={styles.container}>
                <Header title='银行卡信息' left={<BackButton navigation={this.props.navigation}/>}/>
                <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}}>
                    <View style={styles.list}>
                        <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.card.focus()}}>
                            <View style={[styles.item,styles.bor]}>
                                <View style={styles.itemTitle}>
                                    <Text style={styles.head}>银行卡号：</Text>
                                </View>
                                <TextInput
                                    ref="card"
                                    style={styles.itemInputValue}
                                    placeholder="请输入银行卡号"
                                    maxLength={19}
                                    keyboardType="numeric"
                                    defaultValue={this.state.card}
                                    onChangeText={text => this.setState({card:text})}
                                    placeholderTextColor="#5D5D69"
                                    underlineColorAndroid={"transparent"}/>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.item,styles.bor]}>
                            <View style={styles.itemTitle}>
                                <Text style={styles.head}>开户银行：</Text>
                            </View>
                            <Picker
                                data={this.state.binkTypeList}
                                value={this.state.binkType}
                                cols={1}
                                onChange={this.changeBink.bind(this)}>
                                <CustomChildren title={this.state.binkType?this.state.binkType:'选择银行'}/>
                            </Picker>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.name.focus()}}>
                            <View style={[styles.item,styles.bor]}>
                                <View style={styles.itemTitle}>
                                    <Text style={styles.head}>开户银行支行：</Text>
                                </View>
                                <TextInput
                                    ref="name"
                                    style={styles.itemInputValue}
                                    placeholder="请输入开户银行支行"
                                    onChangeText={text => this.setState({Branch:text})}
                                    placeholderTextColor="#5D5D69"
                                    defaultValue={this.state.defaultBranch}
                                    underlineColorAndroid={"transparent"}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.name.focus()}}>
                            <View style={[styles.item,styles.bor]}>
                                <View style={styles.itemTitle}>
                                    <Text style={styles.head}>姓名：</Text>
                                </View>
                                <TextInput
                                    ref="name"
                                    style={styles.itemInputValue}
                                    placeholder="请输入姓名"
                                    maxLength={18}
                                    onChangeText={text => this.setState({name:text})}
                                    placeholderTextColor="#5D5D69"
                                    defaultValue={this.state.defaultName}
                                    underlineColorAndroid={"transparent"}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.number.focus()}}>
                            <View style={[styles.item,styles.bor]}>
                                <View style={styles.itemTitle}>
                                    <Text style={styles.head}>身份证：</Text>
                                </View>
                                <TextInput
                                    ref="number"
                                    style={styles.itemInputValue}
                                    placeholder="请输入身份证"
                                    maxLength={18}
                                    defaultValue={this.state.number}
                                    onChangeText={text => this.setState({number:text})}
                                    placeholderTextColor="#5D5D69"
                                    underlineColorAndroid={"transparent"}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.tel.focus()}}>
                            <View style={styles.item}>
                                <View style={styles.itemTitle}>
                                    <Text style={styles.head}>预留手机号：</Text>
                                </View>
                                <TextInput
                                    ref="tel"
                                    keyboardType="numeric"
                                    style={styles.itemInputValue}
                                    placeholder="请输入预留手机号"
                                    maxLength={11}
                                    defaultValue={this.state.tel}
                                    onChangeText={text => this.setState({tel:text})}
                                    placeholderTextColor="#5D5D69"
                                    underlineColorAndroid={"transparent"}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnBox}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={()=>this.send()}>
                            <Text style={styles.btnText}>完成</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#24252C'
    },
    binkItem:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },
    binkItemTxt:{
        color:'#fff',
        fontSize:14
    },
    list:{
        width:SCREEN_WIDTH,
        paddingLeft:15,
        paddingRight:15,
        backgroundColor: '#28282F',
    },
    item:{
        width:'100%',
        height:65,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    bor:{
        borderBottomWidth:1,
        borderBottomColor:'#3C3F49'
    },
    itemTitle:{
        width:100
    },
    head:{
        fontSize:13,
        color:'#C4C6D3'
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
        marginRight:12
    },
    itemInputValue:{
        flex:1,
        paddingLeft:10,
        paddingRight:10,
        fontSize:14,
        color:'#fff',
        textAlign:'right',
    }
});
