import {ajax} from "./ajax";
import {download} from './ajax'
import notify from "../pages/teacher-course/notify";
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
    getChapterByCourseId:(courseId)=>ajax(`/chapter`,{courseId:courseId}),
    createChapter:(chapter)=>ajax(`/chapter`,chapter,'POST'),
    updateChapterName:(chapter)=>ajax(`/chapter`,chapter,'PUT'),
    deleteChapterById:(id)=>ajax(`/chapter`,{id:id},'DELETE'),
    deleteChapterVideoById:(id)=>ajax(`/chapter/video`,{id:id},'DELETE'),
    updateChapterVideo:(chapter)=>ajax(`/chapter/video`,chapter,'PUT'),
    getNotifyByCourseId:(courseId)=>ajax(`/notify`,{courseId:courseId}),
    createNotify:(notify)=>ajax(`/notify`,notify,'POST'),
    updateNotifyById:(notify)=>ajax(`/notify`,notify,'PUT'),
    deleteNotifyById:(id)=>ajax(`/notify`,{id:id},'DELETE'),
    getCommentByCourseId:(courseId)=>ajax(`/comment`,{courseId:courseId}),
    getCommentByUserId:(courseId)=>ajax(`/comment/user`,{courseId:courseId}),
    getCommentReplyToUser:(courseId)=>ajax(`/comment/reply`,{courseId:courseId}),
    createComment:(comment)=>ajax(`/comment`,comment,'POST'),
    deleteCommentById:(id)=>ajax(`/comment`,{id:id},'DELETE'),
}