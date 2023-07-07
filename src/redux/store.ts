import { configureStore } from '@reduxjs/toolkit';
import appBarReducer from './features/layout-slice'
import loginReducer from './features/login-slice'
import rehabReducer, {rehabApi} from './features/rehab/rehab-slice'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {setupListeners} from "@reduxjs/toolkit/query";

// action types
const WS_CONNECT = 'WS_CONNECT';
const WS_DISCONNECT = 'WS_DISCONNECT';
const WS_MESSAGE = 'WS_MESSAGE';

interface WSConnectAction {
  type: typeof WS_CONNECT;
  host: string;
}

interface WSDisconnectAction {
  type: typeof WS_DISCONNECT;
}

interface WSMessageAction {
  type: typeof WS_MESSAGE;
  message: any;  // Replace `any` with the type of your WebSocket message
}

type WSAction = WSConnectAction | WSDisconnectAction | WSMessageAction;

// action creators
const wsConnect = (host: string): WSConnectAction => ({ type: WS_CONNECT, host });
const wsDisconnect = (): WSDisconnectAction => ({ type: WS_DISCONNECT });
const wsMessage = (message: any): WSMessageAction => ({ type: WS_MESSAGE, message });  // Replace `any` with the type of your WebSocket message

// middleware
const createWebSocketMiddleware = () => {
  let socket: WebSocket | null = null;

  return (store: { dispatch: (arg0: WSAction) => void }) => (next: (arg0: any) => void) => (action: WSAction) => {
    switch (action.type) {
      case WS_CONNECT:
        if (socket !== null) {
          socket.close();
        }

        // Connect to the WebSocket
        socket = new WebSocket(action.host);

        // WebSocket handlers
        socket.onopen = () => console.log('WebSocket opened');
        socket.onclose = () => console.log('WebSocket closed');
        socket.onerror = (event: Event) => console.log('WebSocket error', event);
        socket.onmessage = (event: MessageEvent) => {
          // Parse the message received from the WebSocket and dispatch a new action
          const message = JSON.parse(event.data);
          store.dispatch(wsMessage(message));
        };

        break;
      case WS_DISCONNECT:
        if (socket !== null) {
          socket.close();
          socket = null;
        }

        break;
      case WS_MESSAGE:
        console.log('WebSocket message received:', action.message);
        break;
      default: // do nothing
    }

    return next(action);
  };
};

const store = configureStore({
  reducer: {
    appBar: appBarReducer,
    login: loginReducer,
    rehab: rehabReducer,
    [rehabApi.reducerPath]: rehabApi.reducer,
  },
  middleware:(getDefaultMiddleware) => {
    return getDefaultMiddleware()
        .concat(rehabApi.middleware)
        .concat(createWebSocketMiddleware())
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store;

// store.dispatch(wsConnect('ws://192.168.2.101:56567/api/v1/train/ws'));
// store.dispatch(wsConnect('ws://192.168.2.101:56567/api/v1/equipment/ws'));
setupListeners(store.dispatch)
