import { combineReducers } from 'redux'
import {GET_ADMIN, GET_USER} from "./action-types";

function user(state={realName:"",avatar:""},action) {
   switch (action.type) {
      case GET_USER:
         return action.data;
      default:
         return state;
   }
}
function admin(state={realName:"",avatar:""},action) {
   switch (action.type) {
      case GET_ADMIN:
         return action.data;
      default:
         return state;
   }
}
export default combineReducers({user,admin})
