import {
  UPDATE_FORM_DATA,
  SET_ERRORS,
  SET_LOADING,
  SET_SNACKBAR_STATE,
  RESET_FORM
} from '../actions/CreateAccountFormActions';

const initialState = {
  formData: {
    name: '',
    balance: '',
    accountType: '',
    currency: '',
    status: '',
    interestRate: '',
    overdraftLimit: '',
    lastTransactionDate: ''
  },
  errors: {},
  loading: false,
  snackbar: {
    isOpen: false,
    message: '',
    severity: 'success'
  }
};

const createAccountFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value
        }
      };
    case SET_ERRORS:
      return {
        ...state,
        errors: action.payload
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_SNACKBAR_STATE:
      return {
        ...state,
        snackbar: {
          isOpen: action.payload.isOpen,
          message: action.payload.message,
          severity: action.payload.severity
        }
      };
    case RESET_FORM:
      return initialState;
    default:
      return state;
  }
};

export default createAccountFormReducer;
