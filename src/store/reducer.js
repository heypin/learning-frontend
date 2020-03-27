import { combineReducers } from 'redux'
import {GET_STUDENT} from "./action-types";

function student(state={realName:"",avatar:""},action) {
   switch (action.type) {
      case GET_STUDENT:
         return action.data;
      default:
         return state;
   }
}
export default combineReducers({student})
