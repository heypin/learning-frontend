import ajax from "./ajax";
export default {
    userLogin:(user)=> ajax(`/login`,user,'POST'),
    userRegister:(user)=>ajax(`/register`,user,'POST'),
    getUserByToken:()=>ajax(`/user`),//axios拦截器添加了token不用传入
    getAdminByToken:()=>ajax(`/admin`),
    updateUserPassword:(user)=>ajax(`/user/password`,user,'PUT'),
    updateUserById:(user)=>ajax(`/user`,user,'PUT')
}