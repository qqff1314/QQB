import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    TextInput, AsyncStorage
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import ImagePicker from 'react-native-image-picker'
import store from '../store'
import {observer} from 'mobx-react'
import axios from "axios/index";
import {Toast} from 'antd-mobile'
import utils from "../utils";
let photoOptions = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: 0.5,
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
@observer
export default class Setting extends Component {
    constructor(props){
        super(props)
        this.state={
            number:'',
            name:'',
            defaultName:'',
            imgA:'',
            imgB:'',
            editable:true
        }
    }
    componentDidMount() {
        this.getDetail();
    }
    getDetail(){
        utils.axios.get('member/info').then(async res => {
            let data = res.data.Data;
            if(data.IsIdentified==2||data.IsIdentified==1){
                this.setState({editable:false})
            }
            this.setState({number:data.IdNumber,
                name:data.NickName,
                defaultName:data.NickName,
                imgA:data.IdentifyFront,
                imgB:data.IdentifyBack});
        }).catch(err=>{
            utils.backLogin(err,this.props)
        })
    }
    send(){
        if(!this.state.number){
            Toast.fail('请输入身份证号',1);
            return
        }
        if(!this.state.name){
            Toast.fail('请输入姓名',1);
            return
        }
        if(!this.state.imgA||!this.state.imgB){
            Toast.fail('请上传身份证信息',1);
            return
        }
        Toast.loading('上传中',5);
        let body = new FormData();
        body.append('IdNumber',this.state.number);
        body.append('NickName',this.state.name);
        body.append('IdentifyFront',{
            type : 'image/jpeg',
            uri : this.state.imgA,
            name: this.state.imgA
        });
        body.append('IdentifyBack',{
            type : 'image/jpeg',
            uri : this.state.imgB,
            name: this.state.imgB
        });
        axios({
            method: 'post',
            url: utils.path + 'member/submit_information',
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: body
        }).then(async res => {
            if(res.data.ReturnCode == '200'){
                Toast.success('提交成功', 1,()=>{
                    this.props.navigation.goBack();
                });

            }else{
                Toast.fail(res.data.Msg,1);
                console.log(res)
            }
        }).catch((err) => {
            Toast.hide();
            utils.backLogin(err,this.props)
        })


    }
    //选择图片
    pickImage(type) {
        if(!this.state.editable) return false;
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                if(type=='1'){
                    this.setState({imgA:response.uri});
                }else{
                    this.setState({imgB:response.uri});
                }
            }
        });
    }


    render() {
        return (
            //0 未认证 1正在认证 2 认证通过 3认证失效
            <View style={styles.container}>
                <Header title='实名认证' left={<BackButton navigation={this.props.navigation}/>}
                        right={store.userStore.userInfo.IsIdentified==2||store.userStore.userInfo.IsIdentified==1?null:
                            <TouchableOpacity activeOpacity={0.8}  onPress={()=>this.send()}>
                                <Text style={styles.sendBtn}>完成</Text>
                            </TouchableOpacity>}/>

                <ScrollView bounces={false}>
                    <View style={styles.list}>
                        <View style={styles.item}>
                            <Text style={styles.value}>证件类型</Text>
                            <Text style={styles.value}>身份证</Text>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={() => {this.state.editable?this.refs.number.focus():''}}>
                            <View style={styles.item}>
                                <Text style={styles.value}>证件号码</Text>
                                <TextInput
                                    ref="number"
                                    style={styles.inputValue}
                                    placeholder="请输入您的身份证号码"
                                    maxLength={18}
                                    defaultValue={this.state.number}
                                    editable={this.state.editable}
                                    placeholderTextColor="#848495"
                                    onChangeText={text => this.setState({number:text})}
                                    underlineColorAndroid={"transparent"}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => {this.state.editable?this.refs.name.focus():''}}>
                            <View style={styles.item}>
                                <Text style={styles.value}>姓名</Text>
                                <TextInput
                                    ref="name"
                                    style={styles.inputValue}
                                    placeholder="请输入您的姓名"
                                    maxLength={18}
                                    editable={this.state.editable}
                                    defaultValue={this.state.defaultName}
                                    onChangeText={text => this.setState({name:text})}
                                    placeholderTextColor="#848495"
                                    underlineColorAndroid={"transparent"} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photo} activeOpacity={1}  onPress={()=>this.pickImage(1)}>
                            {
                                this.state.imgA?
                                    <View style={styles.statusBox}>
                                        <Image style={styles.photoImg} source={{uri:this.state.imgA}} resizeMode='contain'/>
                                        {
                                            store.userStore.userInfo.IsIdentified==1?
                                                <Image source={require('../assets/an_stauts1.png')} style={styles.status}/>
                                                :null
                                        }
                                        {
                                            store.userStore.userInfo.IsIdentified==2?
                                                <Image source={require('../assets/an_stauts2.png')} style={styles.status}/>
                                                :null
                                        }
                                    </View>
                                    :
                                    <View>
                                        <Image style={styles.photoIcon} source={require('../assets/icon10.png')}/>
                                        <Text style={styles.photoTxt}>上传身份证正面</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photo} activeOpacity={1}  onPress={()=>this.pickImage(2)}>
                            {
                                this.state.imgB?
                                    <View style={styles.statusBox}>
                                        <Image style={styles.photoImg} source={{uri:this.state.imgB}} resizeMode='contain'/>
                                        {
                                            store.userStore.userInfo.IsIdentified==1?
                                                <Image source={require('../assets/an_stauts1.png')} style={styles.status}/>
                                                :null
                                        }
                                        {
                                            store.userStore.userInfo.IsIdentified==2?
                                                <Image source={require('../assets/an_stauts2.png')} style={styles.status}/>
                                                :null
                                        }
                                    </View>
                                    :
                                    <View>
                                        <Image style={styles.photoIcon} source={require('../assets/icon10.png')}/>
                                        <Text style={styles.photoTxt}>上传身份证反面</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    statusBox:{
      flex:1
    },
    status:{
        position:'absolute',
        right:0,
        width:104,
        height:90,
        bottom:0
    },

    container: {
        flex: 1,
        backgroundColor: '#24252C'
    },
    sendBtn:{
        color:'#fff',
        fontSize:13
    },
    list:{
        width:SCREEN_WIDTH,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:21
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
    inputValue:{
        fontSize:15,
        color:'#fff',
        textAlign:'right',
        flex:1
    },
    photo:{
        width:'100%',
        height:173,
        flexDirection:'row',
        backgroundColor: '#2F3039',
        borderRadius:6,
        alignItems:'center',
        justifyContent:'center',
        marginTop:21
    },
    photoImg:{
      width:'100%',
      height: '100%'
    },
    photoIcon:{
        width:75,
        height:60,
        marginBottom:20
    },
    photoTxt:{
        width:'100%',
        color: '#666876',
        fontSize:12,
        textAlign:'center'
    }
});