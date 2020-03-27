import ajax from "./ajax";
export default {
    userLogin:(user)=> ajax(`/login`,user,'POST'),
    getStudentByToken:(token)=>ajax(`/student/`),
}