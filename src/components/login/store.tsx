import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // 假设你已经创建了 rootReducer

// 创建中间件数组，包括 thunk 中间件
const middleware = [thunk];

// 创建 Redux store
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
