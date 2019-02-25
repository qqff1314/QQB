import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

export default () => {
    return (
        <View style={{width: '100%', alignItems: 'center', marginTop: 100}}>
            <Image style={{width: 150, height: 160}} source={require('../assets/Bitmap.png')}/>
            <Text style={{textAlign: 'center', paddingTop: 15,fontSize:16,color:'#555'}}>暂无数据</Text>
        </View>
    )
}
