import {GET_STUDENT} from './action-types'
import request from  '../api';
export const getStudent = (token)=>{
  return async (dispatch)=>{
      const result = await request.getStudentByToken(token);
      dispatch({type:GET_STUDENT,data:result});
  }
};