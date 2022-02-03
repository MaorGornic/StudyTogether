/* eslint-disable default-param-last */
import { Auth } from '../actions';

const initialState = {
  loading: false,
  error: null,
  authToken: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Auth.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case Auth.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case Auth.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case Auth.REGISTRATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case Auth.REGISTRATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case Auth.REGISTRATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};