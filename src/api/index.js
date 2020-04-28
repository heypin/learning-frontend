import {ajax} from "./ajax";
import {download} from './ajax'
export default {
    userLogin:(user)=> ajax(`/login`,user,'POST'),
    userRegister:(user)=>ajax(`/register`,user,'POST'),
    executeProgram:(program)=>ajax(`/compile`,program,'POST'),
    getUserByToken:()=>ajax(`/user`),//axios拦截器添加了token不用传入
    getAdminByToken:()=>ajax(`/admin`),
    updateUserPassword:(user)=>ajax(`/user/password`,user,'PUT'),
    updateUserById:(user)=>ajax(`/user`,user,'PUT'),
    createCourse:(course)=>ajax(`/course`,course,'POST'),
    getTeachCourse:()=>ajax(`/course/teach`),
    createClass:(clazz)=>ajax(`/class`,clazz,'POST'),
    getClassesByCourseId:(courseId)=>ajax(`/class`,{courseId:courseId}),
    getChildFile:(file)=>ajax(`/file/children`,file,'GET'),
    createFile:(file)=>ajax(`/file`,file,'POST'),
    createFolder:(file)=>ajax(`/file/folder`,file,'POST'),

    downloadFile:(id)=>download(`/file/download?id=${id}`),
    exportExamToExcel:(id)=>download(`/exam/excel?examPublishId=${id}`),
    exportHomeworkToExcel:(id)=>download(`/homework/excel?homeworkPublishId=${id}`),

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
    joinClass:(code)=>ajax(`/classMember/join`,code,'POST'),
    getClassesByUserId:()=>ajax(`/classMember/class`),
    getUsersByClassId:(classId)=>ajax(`/classMember/user`,{classId:classId}),
    deleteClassMember:(classMember)=>ajax(`/classMember`,classMember,'DELETE'),
    getHomeworkLibsByCourseId:(courseId)=>ajax(`/homeworkLib`,{courseId:courseId}),
    getHomeworkLibWithItemsById:(id,answer)=>ajax(`/homeworkLib/items`,{id:id,answer:answer}),
    updateHomeworkLibNameById:(lib)=>ajax(`/homeworkLib/name`,lib,'PUT'),
    createHomeworkLib:(lib)=>ajax(`/homeworkLib`,lib,'POST'),
    createHomeworkLibItem:(item)=>ajax(`/homeworkLibItem`,item,'POST'),
    updateHomeworkLibItemAndOptions:(item)=>ajax(`/homeworkLibItem`,item,'PUT'),
    getHomeworkLibItemsByLibId:(libId)=>ajax(`/homeworkLibItem`,{homeworkLibId:libId}),
    deleteHomeworkLibItemById:(id)=>ajax(`/homeworkLibItem`,{id:id},'DELETE'),
    getHomeworkPublishById:(id)=>ajax(`/homeworkPublish`,{id:id}),
    getHomeworkPublishesByClassId:(classId)=>ajax(`/homeworkPublish/class`,{classId:classId}),
    getHomeworkPublishesWithSubmitByClassId:(classId)=>ajax(`/homeworkPublish/submit`,{classId:classId}),
    publishHomework:(publish)=>ajax(`/homeworkPublish`,publish,'POST'),
    updateHomeworkPublishById:(publish)=>ajax(`/homeworkPublish`,publish,'PUT'),
    getHomeworkSubmitById:(id)=>ajax(`/homeworkSubmit`,{id:id}),
    getHomeworkSubmitsByPublishId:(publishId)=>ajax(`/homeworkSubmit/publish`,{homeworkPublishId:publishId}),
    getHomeworkUserSubmitWithItems:(publishId,userId)=>ajax(`/homeworkSubmit/user`,{homeworkPublishId:publishId,userId:userId}),
    submitHomeworkWithItems:(submit)=>ajax(`/homeworkSubmit`,submit,'POST'),
    updateHomeworkSubmitMarkById:(submit)=>ajax(`/homeworkSubmit/mark`,submit,'PUT'),
    updateHomeworkSubmitItemsScore:(submit)=>ajax(`/homeworkSubmit/score`,submit,'PUT'),
    getExamLibsByCourseId:(courseId)=>ajax(`/examLib`,{courseId:courseId}),
    getExamLibWithItemsById:(id,answer)=>ajax(`/examLib/items`,{id:id,answer:answer}),
    updateExamLibNameById:(lib)=>ajax(`/examLib/name`,lib,'PUT'),
    createExamLib:(lib)=>ajax(`/examLib`,lib,'POST'),
    getExamLibItemsByLibId:(examLibId)=>ajax(`/examLibItem`,{examLibId:examLibId}),
    updateExamLibItemAndOptions:(item)=>ajax(`/examLibItem`,item,'PUT'),
    createExamLibItemAndOptions:(item)=>ajax(`/examLibItem`,item,'POST'),
    deleteExamLibItemById:(id)=>ajax(`/examLibItem`,{id:id},'DELETE'),
    getExamPublishById:(id)=>ajax(`/examPublish`,{id:id}),
    getExamPublishesByClassId:(classId)=>ajax(`/examPublish/class`,{classId:classId}),
    getExamPublishesWithSubmitByClassId:(classId)=>ajax(`/examPublish/submit`,{classId:classId}),
    publishExam:(publish)=>ajax(`/examPublish`,publish,'POST'),
    updateExamPublishById:(publish)=>ajax(`/examPublish`,publish,'PUT'),
    getExamSubmitById:(id)=>ajax(`/examSubmit`,{id:id}),
    getExamSubmitsByPublishId:(examPublishId)=>ajax(`/examSubmit/publish`,{examPublishId:examPublishId}),
    getExamUserSubmitWithItems:(examPublishId,userId)=>ajax(`/examSubmit/user`,{examPublishId:examPublishId,userId:userId}),
    submitExamItem:(item)=>ajax(`/examSubmit/item`,item,'POST'),
    startExam:(submit)=>ajax(`/examSubmit/start`,submit,'POST'),
    finishExam:(submit)=>ajax(`/examSubmit/finish`,submit,'PUT'),
    updateExamSubmitItemsScore:(submit)=>ajax(`/examSubmit/score`,submit,'PUT'),
    getRegisterCode:(email)=>ajax(`/register/code`,{email:email}),
}