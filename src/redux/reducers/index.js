// third-party
import { combineReducers } from "@reduxjs/toolkit";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer } from "redux-persist";

// project import
import user from "./user";
import settings from "./settings";

// ==============================|| COMBINE REDUCERS ||============================== //

const persistConfig = {
  key: "root",
  storage: storageSession,
  timeout: 500,
};

const reducers = persistReducer(persistConfig, combineReducers({ user, settings }));
export default reducers;
