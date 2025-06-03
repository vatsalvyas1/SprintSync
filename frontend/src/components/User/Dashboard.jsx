import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import NavBar from "./Navbar";

const Dashboard = () => {
    const [user, setUser] = useState();
    const [userid, setUserId] = useState();

    useEffect(() => {
        const getUser = async () => {
            const getCurrentUser = await api.get("/current-user");
            console.log(getCurrentUser)
            console.log(getCurrentUser.data.data.email);
            setUser(getCurrentUser.data.data.email);
            setUserId(getCurrentUser.data.data._id);
        };

        getUser();

    }, []);

    return (
        <section>
            <NavBar userName={user} userid={userid}/>
            <div className="md:ml-64 border">
                Hi, {user}
            </div>
        </section>
    );
};

export default Dashboard;
