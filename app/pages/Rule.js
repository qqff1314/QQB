import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import utils from "../utils";
export default class Rule extends Component{
    constructor(props) {
        super(props)
        this.state = {
            type:[]
        }
    }
    componentDidMount() {
        this.getList()
    }
    getList(){
        utils.axios.get('news/list?type=4').then(res => {
            this.setState({type:res.data.Data.List})
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <Header title={'新手上路'}
                    left={<BackButton navigation={this.props.navigation}/>}
                />
                {this.state.type.map((item, index) => (
                    <TouchableOpacity activeOpacity={0.8}  onPress={() => {this.props.navigation.navigate('NewsInfo',{Id:item.Id,Name:'规则'})}} key={index} style={styles.ruleList}>
                        <View style={[styles.ruleItem,index==this.state.type.length-1?'':styles.ruleLine]}>
                            <View style={styles.ruleLeft}>
                                <View style={styles.ruleIco} />
                                <Text style={styles.ruleValue}>{item.Title}</Text>
                            </View>
                            <Image source={require('../assets/index_next.png')} style={styles.ruleRight}/>
                        </View>
                    </TouchableOpacity>
                ))}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#24252C'
    },
    ruleList:{
        width:SCREEN_WIDTH,
        paddingLeft:15,
        backgroundColor:'#28282F'
    },
    ruleItem:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        paddingTop:20,
        paddingBottom:20,
        justifyContent:'space-between'
    },
    ruleLine:{
        borderBottomColor:'#3B3E47',
        borderBottomWidth:1
    },
    ruleLeft:{
        flexDirection:'row',
        alignItems:'center',
        flex:1,
        marginRight:40
    },
    ruleIco:{
        borderRadius:6,
        width:6,
        height:6,
        marginRight:10,
        backgroundColor:'#fff',
        opacity: 0.51
    },
    ruleValue:{
        color:'#D6D6E6',
        fontSize:14
    },
    ruleRight:{
        width:6,
        height:10,
        marginRight:16
    }
});