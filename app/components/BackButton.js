import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
export default BackButton = (props) => {
        return(
            <TouchableOpacity activeOpacity={0.8} style={styles.back} onPress={() =>  props.nav?props.navigation.navigate(props.nav):props.navigation.goBack()}>
                {
                    props.close ?
                        <Image source={require('../assets/close.png')} style={styles.closeIcon}/>
                        :
                        <Image source={require('../assets/back.png')} style={styles.backIcon}/>
                }
                <Text style={styles.backTitle}>{props.backTitle ? props.backTitle : '返回'}</Text>
            </TouchableOpacity>
        )
}

const styles = StyleSheet.create({
    back:{
        paddingLeft:15,
        paddingRight:15,
        flexDirection:'row',
        alignItems:'center',
        width:80,
        height:'100%'
    },
    closeIcon:{
        width:12,
        height:12
    },
    backIcon:{
        width:8,
        height:15
    },
    backTitle:{
        fontSize:16,
        color:'#fff',
        marginLeft:5
    }
})