import {
  SET_USER_DATA,
  UPDATE_FORM_DATA,
  SET_AUTH_TOKEN,
  SET_FORM_ERROR,
  SET_FORM_ERRORS,
  CLEAR_FORM_ERRORS,
  SET_IS_SUBMITTING,
  SET_SNACKBAR_MESSAGE,
  CLEAR_SNACKBAR_MESSAGE,
  SET_OPEN_SNACKBAR,
  RESET_FORM,
  TOGGLE_SHOW_PASSWORD,
  TOGGLE_SHOW_CONFIRM_PASSWORD,
  SET_PASSWORD_STRENGTH,
  SET_CONFIRM_PASSWORD,
  CLEAR_FORM_DATA,
  TOGGLE_OPEN_SNACKBAR,
  SET_ERROR_MESSAGE
} from '../actions/LoginFormActions';

const initialState = {
  userData: {},
  authToken: '',
  formData: {},
  formErrors: {},
  isSubmitting: false,
  snackbarMessage: '',
  openSnackbar: false,
  passwordStrength: '',
  confirmPassword: '',
  errorMessage: '',
  showPassword: false,
  showConfirmPassword: false
};

const loginFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      };
    case UPDATE_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.key]: action.payload.value
        }
      };
    case SET_AUTH_TOKEN:
      return {
        ...state,
        authToken: action.payload
      };
    case CLEAR_FORM_DATA:
      return {
        ...state,
        formData: {}
      };
    case SET_FORM_ERROR:
      return {
        ...state,
        formErrors: {
          ...state.formErrors,
          [action.payload.key]: action.payload.value
        }
      };
    case SET_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case CLEAR_FORM_ERRORS:
      return {
        ...state,
        formErrors: {}
      };
    case SET_IS_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };
    case SET_SNACKBAR_MESSAGE:
      return {
        ...state,
        snackbarMessage: action.payload
      };
    case CLEAR_SNACKBAR_MESSAGE:
      return {
        ...state,
        snackbarMessage: ''
      };
    case SET_OPEN_SNACKBAR:
      return {
        ...state,
        openSnackbar: action.payload
      };
    case RESET_FORM:
      return {
        ...state,
        formData: {},
        formErrors: {},
        isSubmitting: false,
        snackbarMessage: '',
        openSnackbar: false,
        passwordStrength: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false
      };
    case TOGGLE_SHOW_PASSWORD:
      return {
        ...state,
        showPassword: !state.showPassword
      };
    case TOGGLE_SHOW_CONFIRM_PASSWORD:
      return {
        ...state,
        showConfirmPassword: !state.showConfirmPassword
      };
    case SET_PASSWORD_STRENGTH:
      return {
        ...state,
        passwordStrength: action.payload
      };
    case SET_CONFIRM_PASSWORD:
      return {
        ...state,
        confirmPassword: action.payload
      };
    case TOGGLE_OPEN_SNACKBAR:
      return {
        ...state,
        openSnackbar: !state.openSnackbar
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload
      };
    case 'RESET_SHOW_PASSWORD':
      return {
        ...state,
        showPassword: false
      };

    case 'RESET_SHOW_CONFIRM_PASSWORD':
      return {
        ...state,
        showConfirmPassword: false
      };
    default:
      return state;
  }
};

export default loginFormReducer;
