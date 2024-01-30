export const UPDATE_FORM_DATA = 'UPDATE_FORM_DATA';
export const VALIDATE_FORM = 'VALIDATE_FORM';
export const SET_ERRORS = 'SET_ERRORS';
export const SUBMIT_FORM = 'SUBMIT_FORM';
export const SET_LOADING = 'SET_LOADING';
export const SET_SNACKBAR_STATE = 'SET_SNACKBAR_STATE';
export const RESET_FORM = 'RESET_FORM';

export const updateFormData = (name, value) => ({
  type: UPDATE_FORM_DATA,
  payload: { name, value }
});

export const validateForm = () => ({
  type: VALIDATE_FORM
});

export const setErrors = (errors) => ({
  type: SET_ERRORS,
  payload: errors
});

export const submitForm = (formData) => ({
  type: SUBMIT_FORM,
  payload: formData
});

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});

export const setSnackbarState = (isOpen, message = '', severity = 'success') => ({
  type: SET_SNACKBAR_STATE,
  payload: { isOpen, message, severity }
});

export const resetForm = () => ({
  type: RESET_FORM
});
