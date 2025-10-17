export const initialState = {
  user: null,
  isAccountVerified: false,
  loading: false,
  error: null,
  successMessage: null,
  authChecked: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_SUCCESS":
      return { ...state, successMessage: action.payload, loading: false };

    case "LOGIN_SUCCESS":
      return { 
        ...state, 
        user: action.payload, 
        isAccountVerified: action.payload?.isAccountVerified ?? state.isAccountVerified,
        error: null, 
        loading: false, 
        authChecked: true 
      };

    case "LOGOUT":
      return { ...initialState, user: null, authChecked: true };

    case "ACCOUNT_VERIFIED":
      return { ...state, isAccountVerified: action.payload };

    case "SET_AUTH_CHECKED":
      return { ...state, authChecked: action.payload };
      
    default:
      return state;
  }
};
export { authReducer as reducer };