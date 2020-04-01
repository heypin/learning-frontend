import {GET_ADMIN, GET_USER} from './action-types'
import request from  '../api';
export const getUser = ()=>{
  return async (dispatch)=>{
      const result = await request.getUserByToken();
      dispatch({type:GET_USER,data:result});
  }
};
export const getAdmin = ()=>{
    return async (dispatch)=>{
        const result = await request.getAdminByToken();
        dispatch({type:GET_ADMIN,data:result});
    }
};