// 在reducer.ts文件中处理对应的action类型
import { SET_HOSPITAL_NAME } from './store';

const initialState = {
    hospitalName: '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_HOSPITAL_NAME:
            return {
                ...state,
                hospitalName: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;