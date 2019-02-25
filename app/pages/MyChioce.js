import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import Empty from '../components/Empty'
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import utils from "../utils";

export default class Center extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            nomore: true,
            refreshing: false,
            page: 1,
            limit: 15,
            total: 0,
            isajax:false
        }
    }

    componentDidMount() {
        this.setState({nomore: false}, () => {
            this.getList()
        })
    }
    getList(){
        utils.axios.get('option/collectionlist?page='+this.state.page+'&size='+this.state.limit+'&type=1').then(res => {
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
        }).catch(err=>{
            utils.backLogin(err,this.props)
        })
    }
    del(id,index){
        let t=this;
        if(t.state.isajax){
            return false
        }
        t.state.isajax=true;
        utils.axios.post('option/collection',{
            Id:id,
        }).then(res => {
            console.log(res)
            let list=t.state.list;
            list.splice(index,1);
            this.setState({
                list:list,
                isajax: false,
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

    //设置key
    _keyExtractor = (item, index) => this.props.navigation.state.params.Type==0?item.Oid:item.Id;

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

    renderItem({item,index}){
        return(
            <View style={styles.perBox}>
                <View style={styles.navIn}>
                    <View style={styles.companyBox}>
                        <Text style={styles.companyName}>{item.Title}</Text>
                        <Text style={styles.companyName}>{item.Code}</Text>
                    </View>
                    <TouchableOpacity style={styles.Detebutton} activeOpacity={0.8} onPress={()=>{this.del(item.Oid,index)}}>
                        <Image style={styles.deteLogo} source={require('../assets/xlogo15.png')}/>
                        <Text style={styles.deteName}>删除</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <Header title={this.props.navigation.state.params.Name} left={<BackButton navigation={this.props.navigation} />}/>
                <View style={styles.perTopBox}>
                    <View style={styles.imgBox}>
                        <Image style={styles.avator} source={require('../assets/xlogo13.png')} />
                        <Text style={styles.name}>公司名称</Text>
                    </View>
                    {/*<TouchableOpacity style={styles.imgBox} onPress={() => navigate('Setting')}>*/}
                        {/*<Image style={styles.setLogo} source={require('../assets/xlogo14.png')} />*/}
                        {/*<Text style={styles.setWz}>操作</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                <View style={styles.perBox}>
                    <FlatList
                        style={{flex:1}}
                        data={this.state.list}
                        renderItem={this.renderItem.bind(this)}
                        ListEmptyComponent={() => this.renderEmpty()}
                        ListFooterComponent={this.renderfooter}
                        refreshing={this.state.refreshing}
                        keyExtractor={this._keyExtractor}
                        onEndReachedThreshold={0.1}
                        onEndReached={(info) => this.pullUp()}
                        onRefresh={() => {this._onRefresh()}}
                    />
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
        noMoreBox: {
            height: 30,
            justifyContent: 'center',
            alignItems: 'center'
        },
        noMoreText: {
            fontSize: 12,
            color: '#999'
        },
        perBox: {
            flex:1,
            paddingLeft: 10,
            paddingRight: 10,
        },
        perTopBox: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 45,
            backgroundColor: '#18181C',
            paddingLeft: 15,
            paddingRight: 15,
        },
        imgBox: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        avator: {
            width: 15,
            height: 15
        },
        name: {
            fontSize: 14,
            color: '#FFFFFF',
            lineHeight: 40,
            marginLeft: 8
        },
        setLogo: {
            width: 11,
            height: 11,
            marginRight: 4
        },
        setWz: {
            fontSize: 13,
            color: '#fff',
            lineHeight: 40
        },
        navIn: {
            borderBottomWidth: 1,
            borderBottomColor: '#3C3F49',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems:'center',
            paddingTop:17,
            paddingBottom:17,
        },
        companyBox: {
            flexDirection: 'row',

        },
        companyName: {
            fontSize: 13,
            color: '#fff'
        },
        Detebutton: {
            flexDirection: 'row',
            paddingTop: 4,
            paddingLeft: 10,
            paddingBottom: 4,
            paddingRight: 10,
            alignItems:'center',
            backgroundColor: '#D8B581',
            borderRadius:20,
        },
        deteLogo: {
            width: 10,
            height: 12,
            marginRight: 8
        },
        deteName: {
            fontSize: 12,
            color: '#282933'
        }
    })
;