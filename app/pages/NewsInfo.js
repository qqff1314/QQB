import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	WebView,
    Modal,
    ActivityIndicator
} from 'react-native';
import Header from '../components/Header';
import BackButton from '../components/BackButton'
import utils from "../utils";
import store from "../store";
export default class App extends Component{
	constructor(props) {
		super(props)
        this.state = {
            load: true,
        }
	}
	componentDidMount() {
	}
	render(){
		return(
			<View style={styles.container}>
				<Header
					title={this.props.navigation.state.params.Name+'详情'}
					left={<BackButton navigation={this.props.navigation}/>}/>
				<WebView
                    bounces={false}
                    onLoadEnd={()=>this.setState({load:false})}
                    style={[styles.container,this.state.load?styles.opc:'']}
                    source={{uri:utils.path2+'/html/page.html?id='+this.props.navigation.state.params.Id}}
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
