import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Navbar";

const Dashboard = () => {
    const [userInfoGlobal, setUserInfoGlobal] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const loggedInUser = localStorage.getItem("loggedInUser");
                if (loggedInUser) {
                    const userInfo = JSON.parse(loggedInUser);
                    setUserInfoGlobal(userInfo);
                } else {
                    navigate("/login");
                    window.location.reload();
                }
            } catch (error) {
                navigate("/login");
                window.location.reload();
            }
        };

        fetchUserInfo();
    }, [navigate]);

    if (!userInfoGlobal) return null;

    return (
        <section>
            <div className="md:ml-64">
                Hi, {userInfoGlobal.email}
            </div>
        </section>
    );
};

export default Dashboard;
