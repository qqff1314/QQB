import React, { Component } from 'react';
import {
  Platform,
  Linking,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  BackHandler,
    WebView,
    Modal,
  RefreshControl
} from 'react-native';
import moment from 'moment';
import Header from '../components/Header';
import {Carousel} from 'antd-mobile';
import Swiper from 'react-native-swiper';
import utils from "../utils";
import store from "../store";
import {observer} from 'mobx-react'
@observer
export default class Home extends Component{
    static navigationOptions = ({navigation,screenProps}) => ({
        tabBarOnPress:({scene}        )=>{
            navigation.navigate('Home');
            store.userStore.setHome(true)
        },
    });
	constructor(props) {
		super(props)
		this.state = {
            bannerList: [],
            isRefreshing:false,
            noticeList:[],
            newList:[],
            goodList:[],
            Sh:'',
            Sz:'',
            Cy:'',
		}
	}
	componentDidMount() {
        this.init();
        this.mark();
	}
    init(){
        utils.axios.get('news/home').then(res => {
            let data=res.data.Data;
            this.setState({
                Sh:data.Sh,
                Sz:data.Sz,
                Cy:data.Cy,
                goodList:data.Goodslist,
                bannerList:data.Banlist,
                newList:data.Newslist,
                noticeList: data.Noticelist
            });
        })
    }
    mark(){
        utils.axios.get('news/agreement?id=34').then(res => {
            store.userStore.setMark(res.data.Data);
        })
    }
    action(url){
        if(!store.userStore.token&&url=='Message'){
            this.props.navigation.navigate('Login',{checkLogin:0});
            return
        }
        this.props.navigation.navigate(url)
    }
    componentWillMount() {
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    componentWillUnmount() {
        if (Android) {
            BackHandler.removeEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    _onBackAndroid = () => {
        return true;
    };
    buy(item){
        if(!store.userStore.token){
            this.props.navigation.navigate('Login',{checkLogin:0})
            return false
        }
	    this.props.navigation.navigate('OptionView',{Id:item.Oid,Title:item.Title})
    }
    //跳转外链
	linkWeb(title,url){
		if(url){
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
		}
	}
    //下拉刷新
    _onRefresh(){
		this.setState({isRefreshing: true});
        this.init();
		setTimeout(() => {
			this.setState({
				isRefreshing: false,
			});
		}, 2000);
	}
    //渲染banner
	renderBanner() {
		return (
				this.state.bannerList.length > 0 ?
				<Carousel
					autoplay={true}
					infinite={this.state.bannerList.length > 1 ? true : false}
					selectedIndex={0}
					dotStyle={styles.dotStyle}
					dotActiveStyle={styles.dotActiveStyle}>
					{this.state.bannerList.map((item, index) => (
						<TouchableOpacity activeOpacity={1}  onPress={() => this.linkWeb(item.Title,item.Link)} key={index}>
							<Image style={styles.banner} source={{uri:item.Photo}} defaultSource={require('../assets/banner.png')}/>
						</TouchableOpacity>
					))}
				</Carousel>
				:
				<Image style={styles.banner} source={require('../assets/banner.png')}/>

		)
    }
    //渲染指数信息
	renderIndexInfo() {
		return (
            this.state.Sz&&this.state.Sh&&this.state.Cy?
            <View style={styles.info}>
                <View style={styles.infoView}>
                    <Text style={styles.infoTitle}>上证指数</Text>
                    <View style={styles.infoMain}>
                        <Text style={[styles.infoValue,this.state.Sh.Type==1?styles.cec:styles.c0c]}>{this.state.Sh.NowPri}</Text>
                        {
                            this.state.Sh.Type!=1?
                                <Image style={styles.infoIcon} source={require('../assets/down.png')}/>
                                :
                                <Image style={styles.infoIcon} source={require('../assets/up.png')}/>
                        }
                    </View>
                    <View style={styles.infoParam}>
                        <Text style={[styles.infoTxt,this.state.Sh.Type==1?styles.cec:styles.c0c,styles.mgr10]}>{this.state.Sh.NowPic}</Text>
                        <Text style={[styles.infoTxt,this.state.Sh.Type==1?styles.cec:styles.c0c]}>{this.state.Sh.Rate}%</Text>
                    </View>
                </View>
                <View  style={styles.infoLine} />
                <View style={styles.infoView}>
                    <Text style={styles.infoTitle}>深证成指</Text>
                    <View style={styles.infoMain}>
                        <Text style={[styles.infoValue,this.state.Sz.Type==1?styles.cec:styles.c0c]}>{this.state.Sz.NowPri}</Text>
                        {
                            this.state.Sz.Type!=1?
                                <Image style={styles.infoIcon} source={require('../assets/down.png')}/>
                                :
                                <Image style={styles.infoIcon} source={require('../assets/up.png')}/>
                        }
                    </View>
                    <View style={styles.infoParam}>
                        <Text style={[styles.infoTxt,this.state.Sz.Type==1?styles.cec:styles.c0c,styles.mgr10]}>{this.state.Sz.NowPic}</Text>
                        <Text style={[styles.infoTxt,this.state.Sz.Type==1?styles.cec:styles.c0c]}>{this.state.Sz.Rate}%</Text>
                    </View>
                </View>
                <View  style={styles.infoLine}/>
                <View style={styles.infoView}>
                    <Text style={styles.infoTitle}>创业版</Text>
                    <View style={styles.infoMain}>
                        <Text style={[styles.infoValue,this.state.Cy.Type==1?styles.cec:styles.c0c]}>{this.state.Cy.NowPri}</Text>
                        {
                            this.state.Cy.Type!=1?
                                <Image style={styles.infoIcon} source={require('../assets/down.png')}/>
                                :
                                <Image style={styles.infoIcon} source={require('../assets/up.png')}/>
                        }
                    </View>
                    <View style={styles.infoParam}>
                        <Text style={[styles.infoTxt,this.state.Cy.Type==1?styles.cec:styles.c0c,styles.mgr10]}>{this.state.Cy.NowPic}</Text>
                        <Text style={[styles.infoTxt,this.state.Cy.Type==1?styles.cec:styles.c0c]}>{this.state.Cy.Rate}%</Text>
                    </View>
                </View>
            </View>
            :
            null
		)
    }
    //渲染公告
    renderNotice(){
        return (
            <TouchableOpacity activeOpacity={1}  onPress={() => this.action('NoticeList')}>
                <View style={styles.notice}>
                    <View style={styles.noticeBox}>
                        <View style={styles.noticeLeft}>
                            <Image source={require('../assets/horn.png')} style={styles.noticeLeftIcon}/>
                            <Text style={styles.noticeTxt}>公告：</Text>
                        </View>
                        {
                            this.state.noticeList.length>0?
                                <Swiper horizontal={false} autoplay={true} showsPagination={false}  >
                                    {this.state.noticeList.map((item, index) => (
                                        <View style={styles.noticeCenter} key={index}>
                                            <Text numberOfLines={1} style={styles.noticeValue}>{item.Title}</Text>
                                        </View>
                                    ))}
                                </Swiper>
                                :
                                null
                        }

                        <Image source={require('../assets/index_next.png')} style={styles.noticeRight}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    //渲染期权交易
    renderOption(){
        return (
            <View style={styles.optionList}>
                {this.state.goodList.map((item, index) => (
                 <View style={[styles.optionItem,styles.optionLine]} key={index}>
                    <View style={styles.optionTop}>
                        <Text style={styles.optionName}>{item.Phone.substr(0, 3) + '****' + item.Phone.substr(7)}</Text>
                        <Text style={styles.optionTime}>{item.Timeline}</Text>
                    </View>
                    <View style={styles.optionBottom}>
                        <View style={styles.optionWidth}>
                            <Text style={styles.optionInfo}>申购<Text style={styles.optionCompany}> {item.Title} </Text>名义本金<Text style={styles.optionMoney}> {item.OPrice} </Text>元</Text>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={() =>{this.buy(item)}}>
                            <View style={styles.optionBtn}>
                                <Text style={styles.optionBtnTxt}>跟购</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                 </View>
                ))}
            </View>
        )
    }
    //渲染消息
    renderNew(){
        return (
            <View style={styles.newList}>
                {this.state.newList.map((item, index) => (
                    <TouchableOpacity activeOpacity={1} key={index} onPress={() => this.props.navigation.navigate('NewsInfo',{Id:item.Id,Name:'文章'})}>
                        <View style={[styles.newItem,styles.optionLine]}>
                            <View style={styles.newInfo}>
                                <Text style={styles.newTxt} numberOfLines={2}>{item.Title}</Text>
                                <View style={styles.newParam}>
                                    <View style={styles.newRec}>
                                        <Text style={styles.newRecTxt}>推荐</Text>
                                    </View>
                                    <Text style={styles.newTime}>{moment(new Date(item.Timeline* 1000)).format('YYYY-MM-DD') }</Text>
                                    <Image source={require('../assets/eye.png')} style={styles.newIco}/>
                                    <Text style={styles.newRead}>{item.Click}</Text>
                                </View>
                            </View>
                            {
                                item.Photos?
                                    <Image source={{uri:item.Photos}} style={styles.newImage}/>
                                    :
                                    <Image source={require('../assets/default.png')} style={styles.newImage}/>
                            }
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#302F37"
                    barStyle="light-content"/>
                <Header
                    title={'恒达期权宝'}
                    left={<TouchableOpacity onPress={()=>this.action('Message')}><Image source={require('../assets/home_service.png')} style={styles.homeServerIcon}/></TouchableOpacity>}
                    right={<TouchableOpacity onPress={()=>this.action('Rule')}><Image source={require('../assets/home_help.png')} style={styles.homeHelpIcon}/></TouchableOpacity>}
                />
                <ScrollView
					refreshControl={
						<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh.bind(this)}
						/>
					}>
                    {/* banner */}
                    {this.renderBanner()}

                    {/*/!* 指数 *!/*/}
                    {this.renderIndexInfo()}

                    {/*/!* 公告 *!/*/}
                    {this.renderNotice()}

                    {/*<View style={styles.option}>*/}
                        {/*<Image source={require('../assets/index_right.png')} style={styles.optionIco}/>*/}
                        {/*<Text style={styles.optionTitle}>期权交易</Text>*/}
                        {/*<Image source={require('../assets/index_left.png')} style={styles.optionIco}/>*/}
                    {/*</View>*/}

                    {/*/!* 期权交易 *!/*/}
                    {/*{this.renderOption()}*/}
                    {/* 消息 */}
                    {this.renderNew()}
                    <View style={styles.newTitle}>
                        <Image source={require('../assets/umbrella.png')} style={styles.newTitleIco}/>
                        <Text style={styles.newTitleTxt}>投资有风险  入市需谨慎</Text>
                    </View>
                    <Modal
                        animationType={"none"}
                        transparent={true}
                        visible={store.userStore.mark!=''&&store.userStore.home}
                    >
                        <View style={styles.alertBg}>
                            <View style={styles.alertMain}>
                                <ScrollView style={{flex:1}}
                                      bounces={false}
                                >
                                    <View style={styles.alertTxtBox}>
                                        <Text style={styles.alertTxt}>{store.userStore.mark}</Text>
                                    </View>
                                </ScrollView>
                                <TouchableOpacity activeOpacity={0.8} style={styles.alertBtn} onPress={()=>{store.userStore.setHome(false)}}>
                                    <Text style={styles.alertBtnTxt}>确认</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                 </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    alertBtn:{
        height:39,
        borderTopWidth:1,
        borderTopColor:'#D7D7D7',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
    },
    alertTxtBox:{
      paddingRight:10,
      paddingLeft:10,
      paddingBottom:10
    },
    alertTxt:{
        lineHeight:20,
        color: '#333',
        fontSize:14
    },
    alertBtnTxt:{
        fontSize:15,
        color: '#D8B581'
    },
    alertMain:{
        paddingTop:10,
        width:SCREEN_WIDTH/1.5,
        height:SCREEN_HEIGHT/3.5,
        backgroundColor:'#fff',
        borderRadius:10
    },
    alertBg:{
        width: SCREEN_WIDTH,
        height:SCREEN_HEIGHT,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0, 0, 0, 0.7)'
    },
    container: {
      flex: 1,
      backgroundColor:'#282A35'
    },
    homeServerIcon:{
        width:21.5,
        height:18.5,
        marginLeft:15
    },
    homeHelpIcon:{
        width:19,
        height:19
    },
    dotStyle: {
		width: 15,
		height: 2.5,
		backgroundColor: 'rgba(255,255,255,.2)'
	},
    dotActiveStyle: {
		backgroundColor: '#fff'
	},
    banner: {
		width: SCREEN_WIDTH,
		height: SCREEN_WIDTH * 0.533,
    },
    // 以下是指数参数
    info:{
        width: SCREEN_WIDTH,
        height:SCREEN_WIDTH*0.231,
        backgroundColor:'#302F37',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:10,
        paddingBottom:12
    },
    infoView:{
        alignItems:'center',
        width: SCREEN_WIDTH/3,
    },
    infoTitle:{
        fontSize:14,
        lineHeight:21,
        color:'#D6D6E6',
        marginBottom:7,
    },
    infoLine:{
        width:1,
        height:48,
        backgroundColor:'#3C3F49'
    },
    infoMain:{
        flexDirection:'row',
        alignItems:'center',
        height:20,
        marginBottom:2,
    },
    infoParam:{
        flexDirection:'row',
        alignItems:'center',
        height:13
    },
    infoValue:{
        fontSize:20,
        lineHeight:20,
    },
    infoIcon:{
        width:8,
        height:9,
        marginLeft:3
    },
    c0c:{
        color:'#0CA500',
    },
    cec:{
        color: '#EC524C'
    },
    mgr10:{
        marginRight:10
    },
    infoTxt:{
        fontSize:13,
        lineHeight:13
    },
    // 以下是公告
    notice:{
        width:	SCREEN_WIDTH,
        height: 60,
        backgroundColor:'#24252C',
        alignItems:'center',
        justifyContent:'center',
        paddingLeft:10,
        paddingRight:10
    },
    noticeBox:{
        height:40,
        width:'100%',
        backgroundColor: '#2E3039',
        borderRadius:50,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    noticeLeft:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:19,
        marginRight:6,
    },
    noticeLeftIcon:{
        width:14,
        height:12,
        marginRight:6,
    },
    noticeTxt:{
        fontSize:13,
        lineHeight:18,
        color: '#D8B581'
    },
    noticeCenter:{
        paddingTop:11,
        paddingBottom:11,
        overflow:'hidden',
        justifyContent:'center'
    },
    noticeValue:{
        color:'#fff',
        fontSize:13,
        lineHeight:18
    },
    noticeRight:{
        width:7,
        height:9,
        marginRight:25,
        marginLeft:16
    },
    // 期权交易
    option:{
        width:	SCREEN_WIDTH,
        height:51,
        paddingTop:21,
        paddingBottom:4,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#282A35'
    },
    optionIco:{
        width:25,
        height:5
    },
    optionTitle:{
        fontSize:18,
        color: '#E8EAF7',
        lineHeight:24,
        paddingLeft:10,
        paddingRight:10
    },
    optionList:{
        width:	SCREEN_WIDTH,
        paddingBottom:15,
        paddingLeft:15,
        paddingRight:15,
    },
    optionItem:{
        width:'100%',
        paddingTop:15,
        paddingBottom:15,
        justifyContent:'center',
    },
    optionTop:{
        height:20,
        alignItems:'center',
        flexDirection:'row',
        marginBottom:7
    },
    optionName:{
        fontSize:14,
        color:'#fff',
        marginRight:17
    },
    optionTime:{
        fontSize:12,
        color:'#818181'
    },
    optionBottom:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
    },
    optionWidth:{
        width:	SCREEN_WIDTH/1.5,
    },
    optionInfo:{
        fontSize:14,
        color:'#fff'
    },
    optionCompany:{
        color: '#D8B581',
    },
    optionMoney:{
        color: '#EC524C',
    },
    optionLine:{
        borderColor: '#3C3F49',
        borderBottomWidth: 1
    },
    optionBtn:{
        width:50,
        height:21,
        borderRadius:50,
        backgroundColor:'#D8B581',
        alignItems:'center',
        justifyContent:'center'
    },
    optionBtnTxt:{
        fontSize:13,
        color: '#282933'
    },
    // 消息
    newTitle:{
        backgroundColor:'#24252C',
        width:	SCREEN_WIDTH,
        height:50,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center'
    },
    newTitleIco:{
        width:11,
        height:12,
        marginRight:9
    },
    newTitleTxt:{
        fontSize:12,
        color: '#676B7E'
    },
    newList:{
        width:	SCREEN_WIDTH,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:15
    },
    newItem:{
        paddingTop:21,
        paddingBottom:13,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center' 
    },
    newImage:{
        height:75,
        width:	SCREEN_WIDTH*0.281,
        borderRadius:5
    },
    newInfo:{
        flex:1,
        height:75,
        paddingRight:10,
        justifyContent:'space-between',
    },
    newTxt:{
        fontSize:15,
        color:'#fff',
        lineHeight:22,
        paddingRight:5
    },
    newParam:{
        flexDirection:'row',
        alignItems:'center' 
    },
    newRec:{
        width:30,
        height:15,
        borderRadius:50,
        borderColor: '#D8B581',
        borderWidth: 1,
        justifyContent:'center',
        alignItems:'center',
        marginRight:12
    },
    newRecTxt:{
        color: '#D8B581',
        fontSize:11
    },
    newTime:{
        fontSize:13,
        color: '#737478',
        marginRight:27,
    },
    newIco:{
        width:17,
        height:10,
        marginRight:3
    },
    newRead:{
        fontSize:13,
        color: '#737478'
    }
});