import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import axios from 'axios'
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import ImagePicker from 'react-native-image-picker'
import store from '../store'
import {observer} from 'mobx-react'
import {Toast} from 'antd-mobile'
import utils from '../utils'
import { NavigationActions } from 'react-navigation'

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
            avatarSource:'',
            info:{}
        }
    }
    componentDidMount() {
        this.init();
    }
    init(){
        utils.axios.get('member/info').then(res => {
            console.log(res)
            this.setState({info:res.data.Data})
        }).catch(err=>{
            utils.backLogin(err,this.props)
        })
    }
    //选择图片
    pickImage() {
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
                Toast.loading('上传中',5);
                let body = new FormData();
                body.append('File',{
                    type : 'image/jpeg',
                    uri : response.uri,
                    name: response.uri
                });
                axios({
                    method: 'post',
                    url: utils.path + 'member/avatar',
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    data: body
                }).then(async res => {
                    if(res.data.ReturnCode == '200'){
                        Toast.success('修改成功', 1);
                        let data = res.data.Data;
                        let userInfo = await AsyncStorage.getItem('userInfo');
                        userInfo = JSON.parse(userInfo);
                        userInfo.Avatar.RelativePath= data.Avatar.RelativePath;
                        AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
                        store.userStore.setUserInfo(userInfo)
                    }else{
                        Toast.fail(res.data.Msg,1);
                        console.log(res)
                    }
                }).catch((err) => {
                    Toast.hide()
                    utils.backLogin(err,this.props)
                })
            }
        });
    }
    async logout(){
        let userInfo = await AsyncStorage.getItem('userInfo');
        userInfo = JSON.parse(userInfo);
        Toast.loading('退出中');
        utils.axios.post('member/signout',{Id:userInfo.Id})
            .then(res => {
                console.log(res)
                Toast.success('退出成功' ,1, () => {
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
                utils.backLogin(err,this.props);
            }
        )
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header title='账户设置' left={<BackButton navigation={this.props.navigation}/>}/>
                <View style={styles.navBox}>
                    <TouchableOpacity style={styles.navIn} activeOpacity={0.8} onPress={()=>this.pickImage()}>
                        <Text style={[styles.navTitle, styles.avatorTitle]}>修改头像</Text>
                        <View style={styles.navRight}>
                            <View style={[styles.imgBox]}>
                                {
                                    store.userStore.userInfo.Avatar&&store.userStore.userInfo.Avatar.RelativePath ?
                                        <ImageBackground style={styles.avator} opacity={0.3}
                                                         source={{uri:store.userStore.userInfo&&store.userStore.userInfo.Avatar.RelativePath}}>
                                            <Image style={styles.photogra} source={require('../assets/xlogo18.png')} />
                                        </ImageBackground>
                                        :
                                        <ImageBackground style={styles.avator} opacity={0.3}
                                                         source={require('../assets/avatar.png')}>
                                            <Image style={styles.photogra} source={require('../assets/xlogo18.png')} />
                                        </ImageBackground>
                                }
                            </View>
                         </View>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={styles.navIn}  activeOpacity={0.8} onPress={()=>this.state.info.IsIdentified==2?'':navigate('Authentication')}>*/}
                        {/*<Text style={styles.navTitle}>实名认证</Text>*/}
                        {/*<View style={styles.navRight}>*/}
                            {/*{*/}
                                {/*this.state.info.IsIdentified==2?*/}
                                    {/*<View style={styles.navRight}>*/}
                                        {/*<Image style={styles.navLogo} source={require('../assets/xlogo17.png')} />*/}
                                        {/*<Text style={styles.navNames}>{this.state.info.IdNumber}</Text>*/}
                                    {/*</View>*/}
                                    {/*:*/}
                                    {/*<Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>*/}
                            {/*}*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    <TouchableOpacity style={styles.navIn} activeOpacity={0.8}  onPress={()=>navigate('EditPhone')}>
                        <Text style={styles.navTitle}>手机号码</Text>
                        <View style={styles.navRight}>
                            <Text style={styles.navNames}>{store.userStore.userInfo.Phone}</Text>
                            <Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIn} activeOpacity={0.8} onPress={()=>navigate('EditPay')}>
                        <Text style={styles.navTitle}>交易密码</Text>
                        <View style={styles.navRight}>
                            <Text style={styles.navNames}>修改</Text>
                            <Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIn} activeOpacity={0.8} onPress={()=>navigate('EditPwd')}>
                        <Text style={styles.navTitle}>登录密码</Text>
                        <View style={styles.navRight}>
                            <Text style={styles.navNames}>修改</Text>
                            <Image style={styles.navJt} source={require('../assets/xlogo12.png')}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.navIn, {
                        paddingTop: 20,
                    }]} activeOpacity={0.8} onPress={()=>this.logout()}>
                        <Text style={styles.navTitle}>退出登录</Text>
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
        navBox: {
            paddingLeft: 15,
            paddingRight: 15,
        },
        navIn: {
            borderBottomWidth: 1,
            borderBottomColor: '#3C3F49',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        navLogo: {
            width: 22,
            height: 16,
            marginRight:10,
        },
        avator: {
            width: 60,
            height: 60,
            justifyContent:'center',
            alignItems:'center',
        },
        imgBox:{
            width: 60,
            height: 60,
            borderRadius:100,
            overflow:'hidden',
            justifyContent:'center',
            alignItems:'center',
        },
        navRight: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        navNames: {
            fontSize: 15,
            color: '#fff'
        },
        navTitle: {
            fontSize: 15,
            color: '#fff',
            lineHeight: 56,
        },
        navJt: {
            marginLeft: 12,
            width: 6,
            height: 11,
        },
        marginB17: {
            marginBottom: 17
        },
        photogra: {
            width: 25,
            height: 21,
        },
        avatorTitle: {
            lineHeight: 95,
        }
    })
;