import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
export default Header = (props) => {
    return (
        <View style={styles.header}>
            <View style={styles.iconLeft}>{props.left}</View>
            <Text numberOfLines={1} style={styles.headerTitle}>{props.title}</Text>
            <View style={styles.iconRight}>{props.right}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    header:{
        width:'100%',
        height:iOS?64:44,
        paddingTop:iOS?20:0,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#302F37',
        paddingRight:15
    },
    headerTitle:{
        fontSize:17,
        color:'#Fff',
        flex:1,
        paddingLeft:10,
        textAlign:'center',
    },
    iconLeft:{
        height:'100%',
        width:80,
        flexDirection:'row',
        alignItems:'center'
    },
    iconRight:{
        width:80,
        height:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    }
})