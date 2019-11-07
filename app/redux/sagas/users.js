import { put, call, takeLatest } from 'redux-saga/effects';
import { getPermissions, createPermission, deletePermission } from 'api/Api';
import {
  GET_PERMISSIONS_REQUEST,
  GET_PERMISSIONS_SUCCESS,
  GET_PERMISSIONS_FAILED,
  CREATE_PERMISSIONS_REQUEST,
  CREATE_PERMISSIONS_SUCCESS,
  CREATE_PERMISSIONS_FAILED,
  DELETE_PERMISSIONS_REQUEST,
  DELETE_PERMISSIONS_SUCCESS,
  DELETE_PERMISSIONS_FAILED,
} from 'constants/actionTypes';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.
/* eslint-disable no-use-before-define */
export default function* watchAuthListener() {
  yield takeLatest(GET_PERMISSIONS_REQUEST, getPermissionsRequestSaga);
  yield takeLatest(CREATE_PERMISSIONS_REQUEST, createPermissionsRequestSaga);
  yield takeLatest(DELETE_PERMISSIONS_REQUEST, deletePermissionsRequestSaga);
}

export function* getPermissionsRequestSaga({ payload }) {
  try {
    const res = yield call(getPermissions, payload);
    yield [put({ type: GET_PERMISSIONS_SUCCESS, res })];
  } catch (error) {
    yield put({ type: GET_PERMISSIONS_FAILED, error });
  }
}

export function* createPermissionsRequestSaga({ payload }) {
  try {
    const res = yield call(createPermission, payload);
    yield [put({ type: CREATE_PERMISSIONS_SUCCESS, res })];
  } catch (error) {
    yield put({ type: CREATE_PERMISSIONS_FAILED, error });
  }
}

export function* deletePermissionsRequestSaga({ payload }) {
  try {
    const res = yield call(deletePermission, payload);
    yield [put({ type: DELETE_PERMISSIONS_SUCCESS, res })];
  } catch (error) {
    yield put({ type: DELETE_PERMISSIONS_FAILED, error });
  }
}
