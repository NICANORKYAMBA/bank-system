import {
  SET_USER_DATA,
  UPDATE_FORM_DATA,
  SET_FORM_ERROR,
  SET_FORM_ERRORS,
  CLEAR_FORM_ERRORS,
  SET_IS_SUBMITTING,
  SET_SNACKBAR_MESSAGE,
  CLEAR_SNACKBAR_MESSAGE,
  SET_OPEN_SNACKBAR,
  CLEAR_FORM_DATA,
  RESET_FORM,
  SET_ALL_FORM_DATA,
  TOGGLE_SHOW_PASSWORD,
  TOGGLE_SHOW_CONFIRM_PASSWORD,
  SET_PASSWORD_STRENGTH,
  SET_CONFIRM_PASSWORD,
  SET_ADMIN,
  SET_TERMS_ACCEPTED,
  SET_PASSWORD,
  TOGGLE_OPEN_SNACKBAR,
  SET_ERROR_MESSAGE,
  SET_IS_ADMIN
} from '../actions/RegisterFormActions';

const initialState = {
  user: null,
  formData: {},
  formErrors: {},
  isSubmitting: false,
  snackbarMessage: '',
  showPassword: false,
  showConfirmPassword: false
};

const registerFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload
      };
    case UPDATE_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.key]: action.payload.value
        }
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
    case CLEAR_FORM_DATA:
      return {
        ...state,
        formData: {},
        formErrors: {}
      };
    case RESET_FORM:
      return initialState;
    case SET_ALL_FORM_DATA:
      return {
        ...state,
        formData: action.payload
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
    case SET_ADMIN:
      return {
        ...state,
        isAdmin: action.payload
      };
    case SET_TERMS_ACCEPTED:
      return {
        ...state,
        termsAccepted: action.payload
      };
    case SET_PASSWORD:
      return {
        ...state,
        password: action.payload
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
    case SET_IS_ADMIN:
      return {
        ...state,
        isAdmin: action.payload
      };
    default:
      return state;
  }
};

export default registerFormReducer;
