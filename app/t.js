import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class App extends Component{
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }
    componentDidMount() {
      
    }
    render(){
        return(
            <View style={styles.container}>
                <Text>111</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});