export const getUserData = (state) => state.user.userData;

export const getUserId = (state) => state.user &&
    state.user.userData ? state.user.userData.userId : null;

export const getUserFirstName = (state) => state.user.userData?.firstName;

export const getUserLastName = (state) => state.user.userData?.lastName;

export const getUserAddress = (state) => state.user.userData?.addresses;

export const getUserAccountsData = (state) => state.user.userAccountsData;

export const getSelectedAccountId = (state) => state.user.selectedAccountId;

export const getUserSelectedAccount = (state) => state.user.userSelectedAccount;

export const getUserTransactions = (state) => state.user.userTransactions;

export const getLoading = (state) => state.user.loading;

export const getError = (state) => state.user.error;

export const isLoggedIn = (state) => state.user.userData !== null;

export const isUserLoading = (state) => state.user.loading;

export const isUserError = (state) => state.user.error !== null;
