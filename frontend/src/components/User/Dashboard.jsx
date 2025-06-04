import React, { useContext, useEffect, useState } from "react";
import api from "../utils/axios";
import NavBar from "./Navbar";
import { UserContext } from "./UserProvider";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const { userInfoGlobal, setUserInfoGlobal } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const getCurrentUser = await api.get("/current-user");
                console.log("API Response:", getCurrentUser);

                const userData = getCurrentUser?.data?.data;

                if (userData?.email) {
                    setUser(userData.email);
                    setUserInfoGlobal(userData);
                } else {
                    console.error("Email not found in response:", getCurrentUser?.data);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    if (loading) return <section className="mx-auto">Loading...</section>;

    if (!userInfoGlobal)
        return <section className="text-center text-red-500 mt-10">User not logged in or failed to fetch user data.</section>;

    return (
        <section>
            <NavBar />
            <div className="md:ml-64 p-6">
                <h1 className="text-2xl font-bold">Hi, {userInfoGlobal.email}</h1>
            </div>
        </section>
    );
};

export default Dashboard;