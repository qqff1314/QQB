import React, {Component} from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import Header from '../components/Header';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import NewsList from './NewsList'
import NewsFast from './NewsFast'
import NewsVideo from './NewsVideo'

const TabBar = (props) => {
	return (
		<View style={styles.tabBarBox}>
            <View style={styles.tabBarScroll}>

			{/*<ScrollView style={styles.tabBarScroll} horizontal={true} showsHorizontalScrollIndicator={false}>*/}
				{
					props.list.map((item,index) => (
						<TouchableOpacity style={styles.tabBarItem} activeOpacity={0.8} key={index} onPress={() => props.goToPage(index)}>
							<Text style={props.activeTab == index ? styles.tabBarTextActive : styles.tabBarText}>{item}</Text>
							{
								props.activeTab == index ?
									<View style={styles.tabBarLine}></View>
									:
									null
							}

						</TouchableOpacity>
					))
				}
			{/*</ScrollView>*/}
			</View>
		</View>
	)
}

export default class News extends Component {

	constructor(props){
		super(props)
		this.state = {
			titles : ['新闻','快讯','文章','视频']
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Header title="资讯"/>
				<ScrollableTabView
					locked={true}
					renderTabBar={() => <TabBar list={this.state.titles}/> }
					scrollWithoutAnimation={true}>
					<NewsList {...this.props} type={1} name={'新闻'}/>
					<NewsFast {...this.props}/>
					<NewsList {...this.props} type={2} name={'文章'}/>
					<NewsVideo {...this.props}/>
					{/*<NewsList {...this.props} type={1} name={'其他'}/>*/}
				</ScrollableTabView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#24252C'
	},
	tabBarBox: {
		backgroundColor: '#302F37',
		height:34,
	},
	tabBarScroll:{
		flex:1,
		flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
	},
	tabBarItem:{
		width:85,
        height:34,
		justifyContent:'center',
		alignItems:'center'
	},
	tabBarText:{
		fontSize:14,
		color:'#BFBFCC'
	},
	tabBarTextActive:{
		fontSize:14,
		color:'#D8B581'
	},
	tabBarLine:{
		width:25,
		height:3,
		borderRadius:1.5,
		backgroundColor:'#D8B581',
		position:'absolute',
		bottom:0,
		left:30
    }
});