import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import Root from './root'
import SplashScreen from 'react-native-splash-screen';
import store from './store'
import {Carousel} from 'antd-mobile';

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showCarousel:null,
            loading:false
        }
    }
    componentDidMount() {
        SplashScreen.hide()
    }
    componentWillMount() {
        // AsyncStorage.clear()
        // 19906862592
        //18072949712
        AsyncStorage.getItem('token',(err,data) => {
            data && store.userStore.setToken(data)
        });
        AsyncStorage.getItem('userInfo',(err,data) => {
            data && store.userStore.setUserInfo(JSON.parse(data))
        });
        AsyncStorage.getItem('bink',(err,data) => {
            data && store.userStore.setBink(JSON.parse(data))
        });
        AsyncStorage.getItem('first',(err,data) => {
            if(!data){
                this.setState({showCarousel:true,loading:true})
            }else{
                this.setState({showCarousel:false,loading:true})
            }
        })
    }
    carouselClick(){
        this.setState({showCarousel:false});
        AsyncStorage.setItem('first','1')
    }
    render() {
        return (
            this.state.loading ?
                (
                    this.state.showCarousel  ?

                        <View style={styles.container}>
                            <StatusBar
                                backgroundColor="#302F37"
                                barStyle="light-content"/>
                            {
                                <Carousel
                                    bounces={false}
                                    dots={false}>
                                    <Image style={styles.carouselImage} source={require('./assets/1.png')}/>
                                    <Image style={styles.carouselImage} source={require('./assets/2.png')}/>
                                    <TouchableOpacity style={styles.carouselImage} activeOpacity={1} onPress={() => this.carouselClick()}>
                                        <Image style={styles.carouselImage} source={require('./assets/3.png')}/>
                                    </TouchableOpacity>

                                </Carousel>
                            }

                        </View>
                        :
                        <Root/>
                )
                :
                null
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carouselImage:{
        width:'100%',
        height:'100%'
    }
});