import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	FlatList,
	Image,
    ActivityIndicator
} from 'react-native';
import utils from "../utils";

export default class App extends Component{
	constructor(props) {
		super(props)
		this.state = {
			list: [],
			nomore: true,
			refreshing: false,
			page: 1,
			limit: 10,
			total: 0,
		}
	}

	componentDidMount() {
		this.setState({nomore: false}, () => {
			this.getList()
		})
	}

	//加载列表
	getList() {
        utils.axios.get('news/xlist?page='+this.state.page+'&size='+this.state.limit).then(res => {
        	console.log(res)
            let data = res.data.Data;
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
        })
	}
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
			page: 1
		}, () => {
			this.getList()
		})
	}
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


	renderItem({item}){
		return(
			<View style={styles.item}>
				<Image style={styles.icon} source={require('../assets/news_icon.png')}/>
				<View style={styles.time}><Text style={styles.timeText}>{item.Title?item.Title.substring(0,5):''}</Text></View>
				<View style={styles.infoBox}>
					<Text style={styles.info}>{item.Digest}</Text>
				</View>

			</View>
		)
	}

	renderLineItem(){
		let height = SCREEN_HEIGHT - (iOS?64:44) - 105
		let length = parseInt(height / 8)
		let arr = []
		for(let i = 0; i < length; i++){
			arr.push(1)
		}
		return(
			arr.map((item,index) => (
				<View style={styles.lineItem} key={index} />
			))
		)

	}

	render(){
		return(
			<View style={styles.container}>
				<View style={styles.content}>
					<FlatList
						style={styles.flatList}
						data={this.state.list}
						renderItem={this.renderItem.bind(this)}
						refreshing={this.state.refreshing}
                        ListFooterComponent={this.renderfooter}
                        onEndReached={(info) => this.pullUp()}
                        onRefresh={() => {this._onRefresh()}}
					/>
					{
						this.state.list.length>0?
                            <View style={styles.line}>
                                {this.renderLineItem()}
                            </View>
							:
							null
					}

				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
	content:{
        flex: 1,
		paddingLeft:10,
		// paddingTop:23.5
	},
	item:{
        paddingTop:20,
		flexDirection:'row',
		// marginBottom:15
	},
	icon:{
		width:26.5,
		height:26.5,
	},
	time:{
		width:50,
	},
	timeText:{
		fontSize:16,
		color:'#D8B581',
		lineHeight:26.5
	},
	info:{
		fontSize:13,
		color:'#fff',
		lineHeight:18.5,
		marginTop:5,
		textAlign:'left'
	},
	infoBox:{
		paddingBottom:20,
		borderBottomWidth:1,
		borderBottomColor:'#3C3F49',
		flex:1,
		paddingRight:15
	},
	line:{
		height:SCREEN_HEIGHT - (iOS?64:44) - 105,
		width:1,
		position:'absolute',
		left:23.2,
		top:23.5
	},
	lineItem:{
		width:1,
		height:5,
		marginBottom:3,
		backgroundColor:'#D8B581'
	}
});
