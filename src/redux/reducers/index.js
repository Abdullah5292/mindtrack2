// third-party
import { combineReducers } from "redux";
import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer } from "redux-persist";

// project import
import user from "./user";

// ==============================|| COMBINE REDUCERS ||============================== //

const persistConfig = {
  key: "root",
  storage: storageSession,
  timeout: 500
};


const reducers = persistReducer(persistConfig, combineReducers({ user }));
export default reducers;
