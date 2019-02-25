import axios from "axios";
import qs from "qs";
import {Toast} from 'antd-mobile';
import { autorun } from 'mobx';
import store from '../store'
const Axios = axios.create({
    // baseURL:'http://demo.yunmofo.cn:8096/kunyang/index.php/api/',
    baseURL:'http://www.hdqiquan.com/index.php/api/',
    timeout: 10000,
    responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers:{
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        'Platform':'2',
    }
});

//mobx监听 axios headers信息
autorun(() => {
    console.log(store.userStore.token)
    Axios.defaults.headers.common['Authorization'] = store.userStore.token;

})

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
    config => {
        // 在发送请求之前做某件事
        if (
            config.method === "post" ||
            config.method === "put"||
            config.method === "patch"
        ) {
            // 序列化
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    error => {
        Toast.fail(error.data.error.message, 1);
        return Promise.reject(error.data.error.message);
    }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
    res => {
        if (res.data.ReturnCode === '200') {
            return res;
        }else{
            Toast.fail(res.data.Msg, 1);
            return Promise.reject(res.data);
        }
    },
    error => {
        if(error.message.indexOf('timeout') > -1){
            Toast.fail('请求超时,请检查网络', 1);
        }
        if(error.message.indexOf('Network Error') > -1){
            Toast.fail('当前无网络,请检查网络', 1);
        }
        return Promise.reject(error.message);
    }
);

export default {
    axios: Axios
}
