import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList
} from 'react-native';
import Empty from '../components/Empty'
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import utils from "../utils";
export default class NewsList extends Component{
    constructor(props) {
		super(props)
		this.state = {
            nomore: true,
			refreshing: false,
			page: 1,
			limit: 16,
			total: 0,
            list:[]
		}
    }
    componentDidMount() {
        this.setState({nomore: false}, () => {
            this.getList()
        })
    }
    getList(){
        utils.axios.get('news/list?page='+this.state.page+'&size='+this.state.limit+'&type=5').then(res => {
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
    _keyExtractor = (item, index) => item.Id;
    _renderItem = ({item}) => (
        <View style={styles.newItem}>
            <View style={styles.newTitleBox}>
                <Text style={styles.newTitle}>{item.Title}</Text>
            </View>
            <View style={styles.newTimeBox}>
                <Text style={styles.newTime}>{item.Timeline}</Text>
            </View>
            {/*<View style={styles.newInfoBox}>*/}
                {/*<Text style={styles.newInfo}>{item.Content}</Text>*/}
            {/*</View>*/}
        </View>
    );
    //渲染空数据展示
    renderEmpty() {
        if (this.state.nomore && this.state.list.length == 0) {
            return (<Empty />)
        } else {
            return null
        }
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
    render(){
        return(
            <View style={styles.container}>
                <Header title={'公告'} left={<BackButton navigation={this.props.navigation}/>}/>
                <View style={styles.newList}>
                    <FlatList
                        data={this.state.list}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {this._onRefresh()}}
                        ListEmptyComponent={() => this.renderEmpty()}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => this.pullUp()}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        ListFooterComponent={this.renderfooter}
                    />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#24252C',
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
    newList:{
        flex: 1,
        width:	SCREEN_WIDTH,
        paddingLeft:15,
        paddingRight:15,
        marginBottom:13
    },
    newItem:{
        width:'100%',
        borderRadius:5,
        backgroundColor:'rgba(47,47,56,0.52)',
        paddingTop:11,
        paddingBottom:20,
        paddingLeft:15,
        paddingRight:15,
        marginTop:13,
    },
    newTitleBox:{
        marginBottom:6
    },
    newTitle:{
        lineHeight:21,
        fontSize:15,
        color: '#FAFAFC'
    },
    newTime:{
        lineHeight:13,
        fontSize:13,
        color: '#7F7F8B'
    },
    newTimeBox:{
        marginTop:15
    },
    newInfo:{
        lineHeight:18,
        fontSize:13,
        color: '#B5B5C2'
    }
});