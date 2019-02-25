import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
    Modal,
    ActivityIndicator,
	WebView
} from 'react-native';
import utils from "../utils";

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
				<WebView
                    bounces={false}
                    javaScriptEnabled={true}
                    onLoadEnd={()=>this.setState({load:false})}
                    style={[styles.container,this.state.load?styles.opc:'']}
                    source={{uri:utils.path2+'/html/video.html'}}/>
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
        backgroundColor:'#24252C',
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
