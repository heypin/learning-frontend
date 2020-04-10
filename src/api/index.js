import {ajax} from "./ajax";
import {download} from './ajax'
export default {
    userLogin:(user)=> ajax(`/login`,user,'POST'),
    userRegister:(user)=>ajax(`/register`,user,'POST'),
    getUserByToken:()=>ajax(`/user`),//axios拦截器添加了token不用传入
    getAdminByToken:()=>ajax(`/admin`),
    updateUserPassword:(user)=>ajax(`/user/password`,user,'PUT'),
    updateUserById:(user)=>ajax(`/user`,user,'PUT'),
    createCourse:(course)=>ajax(`/course`,course,'POST'),
    getTeachCourse:()=>ajax(`/course/teach`),
    getChildFile:(file)=>ajax(`/file/children`,file,'GET'),
    createFile:(file)=>ajax(`/file`,file,'POST'),
    createFolder:(file)=>ajax(`/file/folder`,file,'POST'),
    downloadFile:(id)=>download(`/file/download?id=${id}`),
    deleteFile:(id)=>ajax(`/file`,{id:id},'DELETE'),
    getChapterByCourseId:(id)=>ajax(`/chapter`,{courseId:id}),
    createChapter:(chapter)=>ajax(`/chapter`,chapter,'POST'),
    updateChapterName:(chapter)=>ajax(`/chapter`,chapter,'PUT'),
    deleteChapterById:(id)=>ajax(`/chapter`,{id:id},'DELETE'),
    deleteChapterVideoById:(id)=>ajax(`/chapter/video`,{id:id},'DELETE'),
    updateChapterVideo:(chapter)=>ajax(`/chapter/video`,chapter,'PUT'),

}