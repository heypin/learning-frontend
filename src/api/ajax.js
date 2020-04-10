import axios from 'axios'
import {message} from 'antd'
import Constant from '../utils/constant'

axios.interceptors.request.use(function (config) {
    config.baseURL=Constant.BaseUrl;
    // config.withCredentials = true;
    let token = '';
    if(config.url.startsWith("/admin")){
        token = window.localStorage.getItem('admin_token');
    }else{
        token = window.localStorage.getItem('token');

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
        }else {
            window.localStorage.removeItem("token");
            window.location.href="/#login";
        }
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});


export  function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise;
        if (type === 'GET') {
            promise = axios.get(url, {params: data});
        } else if (type === 'POST') {
            promise = axios.post(url, data);
        } else if (type === 'PUT') {
            promise = axios.put(url, data);
        } else if (type === 'DELETE') {
            promise = axios.delete(url,{params:data});
        }
        promise.then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        })
    })
}
export function download(url) {
    return axios({
        url: url,
        method: 'get',
        responseType: 'blob'
    }).then((res)=>{
        if (res.data.type === "application/json") {
            message.error("下载失败")
        } else {
            let blob = new Blob([res.data]);
            let link = document.createElement("a");
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, false);
            link.href = URL.createObjectURL(blob);
            //用split简单的获取文件名
            let filename=res.headers["content-disposition"].split("filename=").pop().toString();
            console.log(res,filename);
            link.download = filename;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href);
        }
    })
}