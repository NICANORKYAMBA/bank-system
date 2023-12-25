export const TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';
export const SHOW_LOGIN = 'SHOW_LOGIN';
export const HIDE_LOGIN = 'HIDE_LOGIN';
export const SHOW_REGISTER = 'SHOW_REGISTER';
export const HIDE_REGISTER = 'HIDE_REGISTER';


export const toggleDarkMode = () => {
    return {
        type: 'TOGGLE_DARK_MODE',
    };
};

export const showLogin = () => {
  return {
    type: 'SHOW_LOGIN',
  };
};

export const hideLogin = () => {
  return {
    type: 'HIDE_LOGIN',
  };
};

export const showRegister = () => {
  return {
    type: 'SHOW_REGISTER',
  };
};

export const hideRegister = () => {
  return {
    type: 'HIDE_REGISTER',
  };
};
