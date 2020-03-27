import axios from 'axios'
import {message} from 'antd'
import Constant from '../utils/constant'

axios.interceptors.request.use(function (config) {
    config.baseURL=Constant.BaseUrl;
    // config.withCredentials = true;
    console.log("url",config.url)
    let token = '';
    if(config.url.startsWith("/admin")){
        token = window.localStorage.getItem('admin_token');
    }else if(config.url.startsWith("/student")) {
        token = window.localStorage.getItem('student_token');
    }else if(config.url.startsWith("/teacher")){
        token = window.localStorage.getItem('teacher_token');
    }
    if (token !=='' || token !==undefined ) {
        config.headers['Authorization'] = token
    }
    return config;
}, function (error) {
    return Promise.reject(error)
});
axios.interceptors.response.use(function (response) {
    if (response.status===401) {
        message.error("请重新登录后操作!");
        if(response.config.url.startsWith(`/admin/`)){
            window.localStorage.removeItem("admin_token");//可能为失效，所以移除
            window.location.href="/admin-login"
        }else if(response.config.url.startsWith('/student/')){
            window.localStorage.removeItem("student_token");
            window.location.href="/login"
        }else if(response.config.url.startsWith('/teacher/')){
            window.localStorage.removeItem("teacher_token");
            window.location.href="/login"
        }
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});


export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise;
        if (type === 'GET') {
            promise = axios.get(url, {params: data});
        } else if (type === 'POST') {
            promise = axios.post(url, data);
        } else if (type === 'PUT') {
            promise = axios.put(url, data);
        } else if (type === 'DELETE') {
            promise = axios.delete(url, data);
        }
        promise.then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        })
    })

}