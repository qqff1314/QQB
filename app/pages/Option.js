import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import store from "../store";

export default class Option extends Component{
    static navigationOptions = ({navigation,screenProps}) => ({
		tabBarOnPress:({scene}        )=>{
            if(!store.userStore.token){
                navigation.navigate('Login',{checkLogin:0})
            }else{
                navigation.navigate('OptionView')
            }

		},
	});
    render(){
        return(
            <View style={styles.container}>
                <Text>option</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});