import { createContext, useContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userInfoGlobal, setUserInfoGlobal] = useState(null);

    return (
        <UserContext.Provider value={{ userInfoGlobal, setUserInfoGlobal }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
export { UserContext };
