import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Linking
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import {Toast} from "antd-mobile/lib/index";
import utils from "../utils";
export default class Message extends Component{
    constructor(props) {
        super(props);
        this.state = {
            text:'',
            type:1,
            tel:'',
            typeValue:['问题咨询','意见反馈','投诉']
        }
    }
    componentDidMount() {
        this.init();
    }
    init(){
        utils.axios.get('news/about').then(res => {
            this.setState({
                tel:res.data.Data.Tel,
            });
        })
    }
    send(){
        if(!this.state.text){
            Toast.fail('请输入文字',1);
            return
        }
        utils.axios.post('news/feedback',
            {Type:this.state.type,Title:this.state.text})
            .then(res => {
                Toast.success('提交成功',1,()=>{
                    this.props.navigation.goBack();
                });
            }).catch(err=>{
                utils.backLogin(err,this.props)
            })
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
    render(){

        return(
            <View style={styles.container}>
                <Header title={'在线留言'}
                    left={<BackButton navigation={this.props.navigation}/>}
                    right={<TouchableOpacity
                        onPress={()=>this.state.tel?this.linking('tel:'+this.state.tel):Toast.loading('暂无客服电话',1)}
                    ><Image source={require('../assets/phone_outgoing.png')} style={styles.messagePhoneIcon}/></TouchableOpacity>}
                />
                <ScrollView  bounces={false}>
                    <View style={styles.selectType}>
                        <View style={styles.selectHead}>
                            <View style={styles.selectHeadIco}></View>
                            <Text style={styles.selectHeadTxt}>请选择留言类别</Text>
                        </View>
                        <View style={styles.selectList}>
                            {this.state.typeValue.map((item, index) => (
                                <TouchableOpacity activeOpacity={1}  onPress={() => this.setState({type:index+1})} key={index}>
                                    <View style={styles.selectItem}>
                                        {this.state.type==index+1?
                                            <Image source={require('../assets/message_selected.png')} style={styles.selectIco}/>
                                            :
                                            <Image source={require('../assets/message_select.png')} style={styles.selectIco}/>
                                        }
                                        <Text style={styles.selectTxt}>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => {this.refs.text.focus()}}>
                        <View style={styles.selectInputBox}>
                            <TextInput
                                ref="text"
                                underlineColorAndroid={"transparent"}
                                style={styles.selectInput}
                                onChangeText={(text) => this.setState({text:text})}
                                multiline={true}
                                maxLength={200}
                                placeholder={'请输入文字'}
                                placeholderTextColor={'#656775'}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.btnBox}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={()=>this.send()}>
                            <Text style={styles.btnText}>立即提交</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#24252C'
    },
    messagePhoneIcon:{
        width:15,
        height:15
    },
    selectType:{
        width:	SCREEN_WIDTH,
        backgroundColor:'#28282F',
        paddingLeft:20
    },
    selectHead:{
        paddingTop:24,
        paddingBottom:10,
        borderBottomWidth:1,
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#4C505C'
    },
    selectList:{
        paddingTop:23,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingRight:31,
        paddingLeft:5
    },
    selectItem:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:20
    },
    selectIco:{
        width:12,
        height:12,
        marginRight:5,
    },
    selectTxt:{
        fontSize:13,
        color:'#777987',
    },
    selectInputBox:{
        marginTop:10,
        width:	SCREEN_WIDTH,
        height:223,
        paddingTop:19,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:'#28282F',
    },
    selectInput:{
        padding:0,
        backgroundColor:'#28282F',
        fontSize:13,
        color:'#656775',
        textAlignVertical: 'top'
    },
    selectHeadIco:{
        width:8,
        height:8,
        backgroundColor:'#D8B581',
        borderRadius:8,
        marginRight:10
    },
    selectHeadTxt:{
        fontSize:14,
        color:'#D8B581'
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
    btnBox:{
        paddingRight:15,
        paddingLeft:15
    }
});