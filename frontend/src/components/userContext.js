import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    addresses: []
  });

  const updateUser = (updatedUserData) => {
    if (updatedUserData.addresses) {
      if (typeof updatedUserData.addresses === 'string') {
        updatedUserData.addresses = JSON.parse(updatedUserData.addresses);
      }
      updatedUserData.addresses = Array.isArray(updatedUserData.addresses) ? updatedUserData.addresses : [updatedUserData.addresses];
    }

    setUserData({
      ...userData,
      ...updatedUserData
    });

    Object.keys(updatedUserData).forEach(key => {
      sessionStorage.setItem(key, updatedUserData[key]);
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
