import React, { useContext, useEffect, useState } from "react";
import api from "../utils/axios";
import NavBar from "./Navbar";
import { UserContext } from "./UserProvider";

const Dashboard = () => {
    const [user, setUser] = useState();
    const { userInfoGlobal, setUserInfoGlobal } = useContext(UserContext);

    useEffect(() => {
        const getUser = async () => {
            const getCurrentUser = await api.get("/current-user");
            setUser(getCurrentUser.data.data.email);
            setUserInfoGlobal(getCurrentUser.data.data);
        };

        getUser();
    }, []);

    if (!userInfoGlobal)
        return <section className="mx-auto">Loading.....</section>;

    return (
        <section>
            <NavBar />
            <div className="md:ml-64">
                {console.log(userInfoGlobal)}
                Hi, {userInfoGlobal.email}
            </div>
        </section>
    );
};

export default Dashboard;
