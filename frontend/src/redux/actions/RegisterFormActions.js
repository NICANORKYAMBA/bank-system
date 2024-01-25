export const SET_USER_DATA = 'SET_USER_DATA';
export const UPDATE_FORM_DATA = 'UPDATE_FORM_DATA';
export const SET_FORM_ERROR = 'SET_FORM_ERROR';
export const SET_FORM_ERRORS = 'SET_FORM_ERRORS';
export const CLEAR_FORM_ERRORS = 'CLEAR_FORM_ERRORS';
export const SET_IS_SUBMITTING = 'SET_IS_SUBMITTING';
export const SET_SNACKBAR_MESSAGE = 'SET_SNACKBAR_MESSAGE';
export const CLEAR_SNACKBAR_MESSAGE = 'CLEAR_SNACKBAR_MESSAGE';
export const SET_OPEN_SNACKBAR = 'SET_OPEN_SNACKBAR';
export const CLEAR_FORM_DATA = 'CLEAR_FORM_DATA';
export const RESET_FORM = 'RESET_FORM';
export const SET_ALL_FORM_DATA = 'SET_ALL_FORM_DATA';
export const TOGGLE_SHOW_PASSWORD = 'TOGGLE_SHOW_PASSWORD';
export const TOGGLE_SHOW_CONFIRM_PASSWORD = 'TOGGLE_SHOW_CONFIRM_PASSWORD';
export const SET_PASSWORD_STRENGTH = 'SET_PASSWORD_STRENGTH';
export const SET_CONFIRM_PASSWORD = 'SET_CONFIRM_PASSWORD';
export const SET_ADMIN = 'SET_ADMIN';
export const SET_TERMS_ACCEPTED = 'SET_TERMS_ACCEPTED';
export const SET_PASSWORD = 'SET_PASSWORD';
export const TOGGLE_OPEN_SNACKBAR = 'TOGGLE_OPEN_SNACKBAR';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_IS_ADMIN = 'SET_IS_ADMIN';

export const setUserData = (value) => ({
  type: SET_USER_DATA,
  payload: value
});

export const updateFormData = (key, value) => ({
  type: UPDATE_FORM_DATA,
  payload: { key, value }
});

export const clearFormData = () => ({
  type: CLEAR_FORM_DATA
});

export const setFormError = (key, value) => ({
  type: SET_FORM_ERROR,
  payload: { key, value }
});

export const setFormErrors = (errors) => ({
  type: SET_FORM_ERRORS,
  payload: errors
});

export const clearFormErrors = () => ({
  type: CLEAR_FORM_ERRORS
});

export const resetForm = () => ({
  type: RESET_FORM
});

export const setAllFormData = (value) => ({
  type: SET_ALL_FORM_DATA,
  payload: value
});

export const setIsSubmitting = (value) => ({
  type: SET_IS_SUBMITTING,
  payload: value
});

export const setSnackbarMessage = (value) => ({
  type: SET_SNACKBAR_MESSAGE,
  payload: value
});

export const clearSnackbarMessage = () => ({
  type: CLEAR_SNACKBAR_MESSAGE
});

export const setOpenSnackbar = (value) => ({
  type: SET_OPEN_SNACKBAR,
  payload: value
});

export const toggleShowPassword = () => ({
  type: TOGGLE_SHOW_PASSWORD
});

export const toggleShowConfirmPassword = () => ({
  type: TOGGLE_SHOW_CONFIRM_PASSWORD
});

export const setConfirmPassword = (value) => ({
  type: SET_CONFIRM_PASSWORD,
  payload: value
});

export const setPasswordStrength = (value) => ({
  type: SET_PASSWORD_STRENGTH,
  payload: value
});

export const toggleOpenSnackbar = () => ({
  type: TOGGLE_OPEN_SNACKBAR
});

export const setTermsAccepted = (value) => ({
  type: SET_TERMS_ACCEPTED,
  payload: value
});

export const setErrorMessage = (value) => ({
  type: SET_ERROR_MESSAGE,
  payload: value
});

export const setIsAdmin = (value) => ({
  type: SET_IS_ADMIN,
  payload: value
});
