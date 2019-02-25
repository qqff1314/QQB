import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image, Linking
} from 'react-native';
import Empty from '../components/Empty'
import {Carousel} from 'antd-mobile';
import utils from '../utils'

export default class NewsList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			list: [],
			nomore: true,
			refreshing: false,
			page: 1,
			limit: 10,
			total: 0,
            ban:[]
		}
	}

	componentDidMount() {
		this.setState({nomore: false}, () => {
			this.getList()
		})
	}
    getList(){
        utils.axios.get('news/list?page='+this.state.page+'&size='+this.state.limit+'&type='+this.props.type).then(res => {
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
				ban:data.Banlist||[],
				total: data.Total || 0,
				nomore: ((data.Total || 0) / this.state.limit) <= this.state.page ? true : false
			});
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
    linkWeb(title,url){
        if(url){
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
        }
    }
	//设置key
	_keyExtractor = (item, index) => item.Id;

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

	//渲染头部
	renderHeader(){
		return(
			(
				this.state.ban.length>0?
                <Carousel
                    autoplay={true}
                    infinite={this.state.ban.length > 1 ? true : false}
                    selectedIndex={0}>
                    {this.state.ban.map((item, index) => (
                        <TouchableOpacity activeOpacity={1} key={index} onPress={() => this.linkWeb(item.Title,item.Link)}>
                            <Image style={styles.banner} source={{uri:item.Photo}} />
                        </TouchableOpacity>
                    ))}
                </Carousel>:
				null
            )

		)
	}

	//渲染空数据展示
	renderEmpty() {
		if (this.state.nomore && this.state.list.length == 0) {
			return (<Empty />)
		} else {
			return null
		}
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

	renderItem({item}){
		return(
			<TouchableOpacity style={styles.item} activeOpacity={1} onPress={() => this.props.navigation.navigate('NewsInfo',{Id:item.Id,Name:this.props.name})}>
				<View style={styles.content}>
					<Text numberOfLines={2} style={styles.title}>{item.Title}</Text>
					{
						item.Type == 1 ?
							<View style={styles.imageBox}>
                                {item.Photos.map((val, index) => (
                                    <Image style={styles.images} source={{uri:val}} key={index}/>
                                ))}
							</View>
							:
							null
					}

					<View style={styles.bottom}>
						{
							item.Tag?
                                <View style={styles.tag}><Text style={styles.tagText}>{item.Tag}</Text></View>
								:null
						}
						<Text style={styles.time}>{item.Timeline}</Text>
						<Image style={styles.eye} source={require('../assets/news_eye.png')}/>
						<Text style={styles.number}>{item.Click}</Text>
					</View>
				</View>
				{
					item.Type == 0 ?
						<View style={styles.singleImage}>
							<Image style={styles.image} source={{uri:item.Photos}}/>
						</View>
						:
						null
				}

			</TouchableOpacity>
		)
	}

	render(){
		return(
			<View style={styles.container}>
				<FlatList
					style={styles.flatList}
					data={this.state.list}
					renderItem={this.renderItem.bind(this)}
					ListEmptyComponent={() => this.renderEmpty()}
					ListHeaderComponent={() => this.renderHeader()}
					ListFooterComponent={this.renderfooter}
					refreshing={this.state.refreshing}
					keyExtractor={this._keyExtractor}
					onEndReachedThreshold={0.1}
					onEndReached={(info) => this.pullUp()}
					onRefresh={() => {this._onRefresh()}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:'#24252C',
	},
	flatList:{
		flex:1
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
	item:{
		flexDirection:'row',
		paddingTop:11,
        justifyContent:'space-between',
        paddingBottom:11,
		borderBottomColor:'#3C3F49',
		borderBottomWidth:1,
		marginLeft:15,
		marginRight:15
	},
	content:{
        justifyContent:'space-between',
		flex:1
	},
	title:{
		fontSize:15,
		lineHeight:21,
		color:'#fff',
		paddingRight:5,
	},
	bottom:{
		flexDirection:'row',
		alignItems:'center',
		marginTop:14
	},
	tag:{
		height:15,
		paddingLeft:4,
		paddingRight:4,
		borderWidth:0.5,
		borderColor:'#D8B581',
		justifyContent:'center',
		alignItems:'center',
		borderRadius:7.5,
		marginRight:8.5
	},
	tagText:{
		fontSize:11,
		color:'#D8B581'
	},
	time:{
		fontSize:13,
		lineHeight:18,
		color:'#737478',
		marginRight:17
	},
	eye:{
		width:16.5,
		height:10,
		marginRight:5
	},
	number:{
		fontSize:13,
		lineHeight:18,
		color:'#737478',
	},
	imageBox:{
		flexDirection:'row',
		justifyContent:'space-between',
		marginTop:15
	},
	images:{
		width:(SCREEN_WIDTH - 30) * 0.313,
		height:(SCREEN_WIDTH - 30) * 0.313 * 0.686,
		borderRadius:4,
	},
	singleImage:{
		width:105,
		height:75,
	},
	image:{
		width:105,
		height:75,
		borderRadius:4
	},
	banner:{
		width:SCREEN_WIDTH,
		height:SCREEN_WIDTH * 0.53
	}
});
