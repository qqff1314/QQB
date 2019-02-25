import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    WebView,
    ActivityIndicator,
    Modal, AsyncStorage
} from 'react-native';
import store from "../store";
import utils from "../utils";

export default class OptionView extends Component{
    constructor(props) {
        super(props)
        this.state = {
            load: true,
            url:''
        }
    }
    componentDidMount() {
            this.init()
    }
    init(){
        const state=this.props.navigation.state;
        let url;
        if(state.params&&state.params.Id==1){
            url=utils.path2+'/html/index_pos.html?Token='+store.userStore.token+'&Type='+state.params.Type;
        }else if(state.params&&state.params.Id==2){
            url=utils.path2+'/html/index_set.html?Token='+store.userStore.token;
        }else{
            url=utils.path2+'/html/index_pur.html?Token='+store.userStore.token+'&Id='+(this.props.navigation.state.params?this.props.navigation.state.params.Id:'')+'&Title='+(this.props.navigation.state.params?this.props.navigation.state.params.Title:'')
        }
        console.log(url)
        this.setState({url:url})
    }
    onMessage = (e) => {
        if(e.nativeEvent.data=='back') this.props.navigation.goBack();
        if(e.nativeEvent.data=='checkLogin') {
            store.userStore.setToken('');
            store.userStore.setUserInfo({});
            AsyncStorage.removeItem('token');
            AsyncStorage.removeItem('userInfo');
            this.props.navigation.navigate('Login',{checkLogin:1})
        }
    }
    render(){

        return(

            <View style={styles.container}>
                <WebView
                    onLoadEnd={()=>this.setState({load:false})}
                    bounces={false}
                    onMessage={this.onMessage.bind(this)}
                    style={[styles.web,this.state.load?styles.opc:'']}
                    source={{uri:this.state.url}}
                />
                <Modal visible={this.state.load} transparent={true} style={[styles.centering]}>
                    <View style={[styles.centering]}>
                        <ActivityIndicator size="large" color="#fff"/>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#302F37"
    },
    web:{
        backgroundColor:"#302F37",
        marginTop:iOS?20:0,
        width:'100%',
        height:'100%'
    },
    opc:{
        opacity:0,
    },
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});