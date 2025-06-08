import React, { useContext, useEffect, useState } from "react";
import api from "../utils/axios";
import NavBar from "./Navbar";
import { UserContext } from "./UserProvider";

const Dashboard = () => {
    const [userInfoGlobal, setUserInfoGlobal] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const loggedInUser = localStorage.getItem("loggedInUser");
                if (loggedInUser) {
                    const userInfo = JSON.parse(loggedInUser);
                    setUserInfoGlobal(userInfo);
                } else {
                    console.error("No user info found in localStorage");
                }
            }
            catch (error) {
                console.error("Error fetching user info:", error);
            }
        }

        fetchUserInfo();
    }, []);

    if (!userInfoGlobal)
        return <section className="mx-auto">Unauthorised User</section>;

    return (
        <section>

            <div className="md:ml-64">
                Hi, {userInfoGlobal.email}
            </div>
        </section>
    );
};

export default Dashboard;
