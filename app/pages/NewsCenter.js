import React, {Component} from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
    FlatList,
    ActivityIndicator,
    Image
} from 'react-native';
import Empty from '../components/Empty'
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import utils from "../utils";

export default class News extends Component {

	constructor(props){
		super(props)
		this.state = {
            nomore: true,
            refreshing: false,
            page: 1,
            limit: 10,
            total: 0,
            list:[],
		}
	}
    componentDidMount() {
        this.setState({nomore: false}, () => {
        	this.getList()
        })

    }
    getList(){
        utils.axios.get('member/emaillist?page='+this.state.page+'&size='+this.state.limit).then(res => {
            let data = res.data.Data;
            console.log(res)
            let list = [];
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
            });
        }).catch(err=>{
            utils.backLogin(err,this.props)
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
    //下拉刷新
    _onRefresh() {
        this.setState({
            refreshing: true,
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
    renderEmpty() {
        if (this.state.nomore && this.state.list.length == 0) {
            return (<Empty />)
        } else {
            return null
        }
    }
    _keyExtractor = (item, index) => item.Id;
    _renderItem = ({item}) => (
        <View style={styles.itemBox}>
            <View style={styles.itemTime}>
                <Text style={styles.itemTimeTxt}>{item.Timeline}</Text>
            </View>
            <View style={styles.newInfo}>
				<View style={styles.infoHead}>
                    <Image style={styles.infoHeadIco} source={require('../assets/icon9.png')}/>
					<Text style={styles.infoHeadName}>系统消息：</Text>
				</View>
                <View style={styles.infoValue}>
                    <Text style={styles.infoValueTxt}>{item.Title}</Text>
                </View>
            </View>
        </View>
    );
    //渲染空数据展示
	render() {
		return (
			<View style={styles.container}>
				<Header  left={<BackButton navigation={this.props.navigation}/>} title="消息中心"/>
                <FlatList
                    style={styles.newList}
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
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#24252C'
	},
    itemBox:{
		width:SCREEN_WIDTH,
		paddingLeft:15,
		paddingRight:15,
		paddingTop:23,
		paddingBottom:7
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
    itemTime:{
		paddingBottom:17,
		width:'100%'
	},
    itemTimeTxt:{
		fontSize:13,
		color:'#7F7F8B',
		lineHeight:13,
		textAlign:'center'
	},
    newInfo:{
        width:'100%',
        paddingLeft:15,
        paddingRight:15,
        paddingTop:13,
        paddingBottom:21,
        backgroundColor: '#393A44',
		borderRadius: 5
	},
    infoHead:{
		marginBottom:6,
		flexDirection:'row',
		alignItems:'center'
	},
    infoHeadIco:{
		width:13,
		height:15,
		marginRight:8
	},
    infoHeadName:{
        fontSize:14,
        color:'#D6D6E6',
	},
    infoValue:{
		paddingLeft:20
	},
    infoValueTxt:{
        fontSize:13,
        color:'#B5B5C2',
        lineHeight:18
	}

});
