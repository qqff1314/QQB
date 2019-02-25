import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
    FlatList
} from 'react-native';
import moment from 'moment';
import {DatePicker} from 'antd-mobile'
import Empty from '../components/Empty'
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import utils from "../utils";
import {Toast} from "antd-mobile/lib/index";

const CustomChildren = props => (
    <TouchableOpacity activeOpacity={1} style={styles.headRight} onPress={() => {props.onClick()}}>
        <Image style={styles.headIcon} source={require('../assets/icon18.png')} />
        <Text style={styles.headTime}>{props.extra}</Text>
        <View  style={styles.headSelect}>
            <Image style={styles.headSelectIcon} source={require('../assets/icon20.png')}></Image>
        </View>
    </TouchableOpacity>
)
export default class NewsList extends Component{
    constructor(props) {
        super(props)
        this.state = {
            nomore: true,
            refreshing: false,
            page: 1,
            limit: 16,
            total: 0,
            type:0,
            startTime:'',
            alert:false,
            list:[]
        }
    }
    componentDidMount() {
        if(this.props.navigation.state.params&&this.props.navigation.state.params.Type){
            this.setState({type: this.props.navigation.state.params.Type,nomore: false}, () => {
                this.getList()
            })
        }else{
            this.setState({nomore: false}, () => {
                this.getList()
            })
        }
    }
    changeTime(startTime){
        Toast.loading('加载中...');
        this.setState({startTime:startTime,page:1},()=>{
            this.getList()
        })
    }
    //上拉加载
    pullUp() {
        if (this.state.nomore) {
            return
        }
        this.setState({page: this.state.page + 1}, () => {
            this.getList()
        })

    }
    getList(){
        utils.axios.get('member/moneylist?page='+this.state.page+'&size='+this.state.limit+'&type='+(this.state.type!=0?this.state.type:'')+'&day='+moment(this.state.startTime).format('YYYY-MM-DD')).then(res => {
            let data = res.data.Data;
            console.log(res)
            let list = []
            if (this.state.page == 1) {
                list = data.List || [];
            } else {
                list = this.state.list.concat((data.List || []));
            }
            this.setState({
                refreshing: false,
                list: list,
                total: data.Total || 0,
                nomore: ((data.Total || 0) / this.state.limit) <= this.state.page ? true : false
            },()=>{
                Toast.hide()
            });
        }).catch(err=>{
            Toast.hide();
            utils.backLogin(err,this.props);
        })
    }
    changeTab(type){
        let t=this;
        Toast.loading('加载中...');
        t.setState({page:1,alert:false,type:type},()=>{
            t.getList()
        })
    }
    //下拉刷新
    _onRefresh() {
        this.setState({
            refreshing: true,
            page: 1
        }, () => {
            this.getList()
        })
    }
    //渲染底部
    renderfooter = () => {
        if (this.state.nomore) {
            if (this.state.list.length > 0) {
                return (
                    <View style={styles.noMoreBox}>
                        <Text style={styles.noMoreText}>没有更多数据</Text>
                    </View>
                )
            } else {
                return null
            }
        } else {
            return (<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
                <ActivityIndicator />
            </View>);
        }
    }
    _keyExtractor = (item, index) => item.Id;
    _renderItem = ({item}) => (
        <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={() => {item.Gid!=0?this.props.navigation.navigate('IncomeDetail',{Id:item.Id}):''}}>
            {
                item.T==0?
                    <View style={styles.itemLeft}>
                        <Text style={styles.itemTxt}>{item.Gtitle}</Text>
                        <Text style={styles.itemName}>{item.Gcode}</Text>
                    </View>
                    :
                    <View style={[styles.itemLeft,{width:200}]}>
                        <Text style={styles.itemTxt}>{item.Title}</Text>
                        <Text style={styles.itemName}>{item.Timeline}</Text>
                    </View>
            }
            {
                item.T==0?
                    <View style={styles.itemMiddle}>
                        <Text style={styles.itemTxt}>{item.Gorder}</Text>
                        <Text style={styles.itemName}>订单号</Text>
                    </View>
                    :null
            }
            {
                item.T==0?
                    <View>
                        <Text style={[item.Type==1?styles.itemMoneyUp:styles.itemMoneyDown,styles.tar]}>{item.Type==1?'+':'-'}{item.Money}</Text>
                        <Text style={[styles.itemName,styles.tar]}>{item.Timeline}</Text>
                    </View>
                    :
                    <View>
                        <Text style={[item.Type==1&&(item.Title=='充值成功'||item.Title=='系统充值')?styles.itemMoneyUp:styles.itemMoneyDown,styles.tar]}>
                            {(item.Title=='充值成功'||item.Title=='系统充值'||item.Title=='提现成功')?(item.Type==1?'+':'-'):''}{item.Money}
                        </Text>
                        <Text style={[styles.itemName,styles.tar]}>{item.Timeline}</Text>
                    </View>
            }
        </TouchableOpacity>
    );
    //渲染空数据展示
    renderEmpty() {
        if (this.state.nomore && this.state.list.length == 0) {
            return (<Empty />)
        } else {
            return null
        }
    }
    renderContent(){
        if(this.state.alert){
            return  <TouchableOpacity style={styles.headLeft} activeOpacity={0.8} onPress={()=>this.setState({alert:!this.state.alert})}>
                        <Image style={styles.headIcon} source={require('../assets/close.png')} />
                        <Text style={styles.headTxt}>分类</Text>
                    </TouchableOpacity>
        }else{
            switch (this.state.type){
                case 0 :
                    return  <TouchableOpacity style={styles.headLeft} activeOpacity={0.8} onPress={()=>this.setState({alert:!this.state.alert})}>
                                <Image style={{width:14,height:13}} source={require('../assets/icon17.png')} />
                                <Text style={styles.headTxt}>分类</Text>
                            </TouchableOpacity>
                    break
                case 1 :
                    return  <TouchableOpacity style={styles.headLeft} activeOpacity={0.8} onPress={()=>this.setState({alert:!this.state.alert})}>
                                <Image style={{width:16,height:17}} source={require('../assets/icon19.png')} />
                                <Text style={styles.headTxt}>收入</Text>
                            </TouchableOpacity>
                    break
                case 2:
                    return  <TouchableOpacity style={styles.headLeft} activeOpacity={0.8} onPress={()=>this.setState({alert:!this.state.alert})}>
                                <Image style={{width:14,height:15}} source={require('../assets/icon23.png')} />
                                <Text style={styles.headTxt}>支出</Text>
                            </TouchableOpacity>
                    break
                case 3:
                    return  <TouchableOpacity style={styles.headLeft} activeOpacity={0.8} onPress={()=>this.setState({alert:!this.state.alert})}>
                                <Image style={{width:15,height:13}} source={require('../assets/icon21.png')} />
                                <Text style={styles.headTxt}>充值</Text>
                            </TouchableOpacity>
                    break
                case 4:
                    return  <TouchableOpacity style={styles.headLeft} activeOpacity={0.8} onPress={()=>this.setState({alert:!this.state.alert})}>
                                <Image style={{width:14,height:13}} source={require('../assets/icon22.png')} />
                                <Text style={styles.headTxt}>提现</Text>
                            </TouchableOpacity>
                    break
                default:
                    return null
            }
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <Header title={'资金明细'} left={<BackButton navigation={this.props.navigation}/>}/>
                <View style={styles.head}>
                    {this.renderContent()}
                    <DatePicker
                        mode="date"
                        value={this.state.startTime}
                        minDate={new Date('Thu Jan 01 1900 08:00:00 GMT+0800 (CST)')}
                        maxDate={new Date(Date.now())}
                        onChange={(startTime) =>  {this.changeTime(startTime)}}
                    >
                        <CustomChildren/>
                    </DatePicker>

                </View>
                <View style={styles.list}>
                    <FlatList
                        data={this.state.list}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {this._onRefresh()}}
                        ListFooterComponent={this.renderfooter}
                        ListEmptyComponent={() => this.renderEmpty()}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => this.pullUp()}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </View>
                {
                    this.state.alert?
                        <View style={styles.alertBox}>
                            <View style={styles.alert}>
                                <TouchableOpacity activeOpacity={0.8} onPress={()=>this.changeTab(1)} style={styles.alertItem}>
                                    <Image style={{width:19,height:20}} source={require('../assets/icon26.png')} />
                                    <Text style={styles.alertTxt}>收入</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={()=>this.changeTab(2)} style={styles.alertItem}>
                                    <Image style={{width:18,height:18}} source={require('../assets/icon27.png')} />
                                    <Text style={styles.alertTxt}>支出</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={()=>this.changeTab(3)} style={styles.alertItem}>
                                    <Image style={{width:20,height:16}} source={require('../assets/icon24.png')} />
                                    <Text style={styles.alertTxt}>充值</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={()=>this.changeTab(4)} style={styles.alertItem}>
                                    <Image style={{width:19,height:18}} source={require('../assets/icon25.png')} />
                                    <Text style={styles.alertTxt}>提现</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        :
                        null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:SCREEN_WIDTH,
        backgroundColor:'#24252C'
    },
    noMoreBox: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noMoreText: {
        fontSize: 12,
        color: '#999'
    },
    head:{
        width:SCREEN_WIDTH,
        backgroundColor: '#18181C',
        height:46,
        paddingLeft:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    list:{
        paddingLeft:15,
        paddingRight:15,
        flex:1
    },
    headLeft:{
        height:46,
        flexDirection:'row',
        alignItems:'center',
    },
    headIcon:{
        width:13,
        height:13,
    },
    headTxt:{
        marginLeft:10,
        fontSize:14,
        color:'#fff'
    },
    headRight:{
        flexDirection:'row',
        alignItems:'center',
    },
    headTime:{
        fontSize:14,
        color:'#fff',
        paddingRight:8,
        marginLeft:10,
    },
    headSelect:{
        height:10,
        borderLeftColor:'rgb(62,63,74)',
        borderLeftWidth:1,
        paddingRight:9,
        paddingLeft:9,
        justifyContent:'center'
    },
    headSelectIcon:{
        width:8,
        height:6
    },
    item:{
        paddingTop:11,
        paddingBottom:11,
        borderBottomWidth: 1,
        borderBottomColor:'#454955',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    itemLeft:{
        width:85,
        paddingRight:5,
        justifyContent:'center',
    },
    itemTxt:{
        fontSize:14,
        color:'#fff',
        lineHeight:20
    },
    itemName:{
        fontSize:12,
        color:'#93949E',
        lineHeight:16
    },
    itemMoneyUp:{
        fontSize:17,
        color:'#EC524C',
    },
    itemMoneyDown:{
        fontSize:17,
        color:'#0CA500',
    },
    itemMiddle:{
        flex:1,
        paddingRight:5
    },
    tar:{
        textAlign:'right'
    },
    alertBox:{
        position:'absolute',
        backgroundColor: 'rgba(0,0,0,0.50)',
        top:46+(iOS?64:44),
        bottom:0,
        left:0,
        width:SCREEN_WIDTH
    },
    alert:{
        width:'100%',
        height:70,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around'
    },
    alertItem:{
        height:70,
        width:'25%',
        alignItems:'center',
        justifyContent:'center'
    },
    alertTxt:{
        lineHeight:17,
        marginTop:3,
        fontSize:12,
        color:'#18181C'
    }

});
