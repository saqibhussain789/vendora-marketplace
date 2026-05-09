export const initialAuthState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  isSubmitting: false,
  error: null,
};

export default function authReducer(state, action) {
  switch (action.type) {
    case "AUTH_CHECK_START":
      return {
        ...state,
        authChecked: false,
      };

    case "AUTH_CHECK_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        authChecked: true,
        error: null,
      };

    case "AUTH_CHECK_FAIL":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authChecked: true,
        error: null,
      };

    case "SUBMIT_START":
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };

    case "AUTH_SUCCESS":
    case "USER_UPDATE_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        authChecked: true,
        isSubmitting: false,
        error: null,
      };

    case "AUTH_FAIL":
      return {
        ...state,
        isSubmitting: false,
        error: action.payload,
      };

    case "LOGOUT_SUCCESS":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authChecked: true,
        isSubmitting: false,
        error: null,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}