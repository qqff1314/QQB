import Axios from './AxiosUtil'
import {Toast} from "antd-mobile/lib/index";
import {AsyncStorage} from "react-native";
import store from "../store";
export default {
    axios:Axios.axios,
    // path:'http://demo.yunmofo.cn:8096/kunyang/index.php/api/',
    path:'http://www.hdqiquan.com/index.php/api/',
    // path2:'http://demo.yunmofo.cn:8096/kunyang',
    path2:'http://www.hdqiquan.com',
    moneyFormat:(num) => {
        let parts;
        num = parseFloat(num)
        if (!isNaN(parseFloat(num)) && isFinite(num)) {
            num = num.toString();
            parts = num.split('.');
            parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');
            return parts.join('.');
        }
        return '0';
    },
    backLogin:(err,props)=>{
        if (err.ReturnCode!= '200'&&err.Msg!='订单处理中') {
            Toast.fail(err.Msg, 1);
        }
        if(err.Msg=='订单处理中'){
            props.navigation.replace('PayWait');
        }
        if(err.ReturnCode=='0012'){
            store.userStore.setToken('');
            store.userStore.setUserInfo({});
            AsyncStorage.removeItem('token');
            AsyncStorage.removeItem('userInfo');
            props.navigation.navigate('Login',{checkLogin:1});
        }
    }
}

