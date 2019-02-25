import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    ActivityIndicator,
    WebView,
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton'
import utils from "../utils";
export default class Agree extends Component{
	constructor(props) {
		super(props)
		this.state = {
            load: true,
        }
	}
	render(){
		return(
			<View style={styles.container}>
				<Header
					title={'注册协议'}
					left={<BackButton close backTitle='关闭' navigation={this.props.navigation}/>}/>
                <WebView
                    bounces={false}
                    onLoadEnd={()=>this.setState({load:false})}
                    style={[styles.container,this.state.load?styles.opc:'']}
                    source={{uri:utils.path2+'/html/agree.html'}}
                />
                <Modal visible={this.state.load} transparent={true}
                       style={styles.centering}
                >
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
    opc:{
        opacity:0,
    },
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
