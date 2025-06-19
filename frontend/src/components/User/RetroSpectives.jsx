import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../constant";

const api = axios.create({
    baseURL: `${backendUrl}/api/v1/retrospectives/`,
    withCredentials: true,
});

const RetroSpectives = () => {

    const [userInfo, setUserInfo] = useState(null);
    const [comments, setComments] = useState([]);
    const [feedbackData, setFeedbackData] = useState({
        wellItems: [],
        poorItems: [],
        suggestions: [],
    });
    const [allCommentCount, setAllCommentCount] = useState(null);

    useEffect(() => {
        let storedUser;
        const fetchUserInfo = () => {
            storedUser = localStorage.getItem("loggedInUser");
            if (storedUser) {
                setUserInfo(JSON.parse(storedUser));
            } else {
                console.error("No user info found in localStorage");
            }
        };
        let wellItems = [];
        let poorItems = [];
        let suggestions = [];

        const fetchFeedbacks = async () => {
            const feedbacks = await api.get("/get-all-feedbacks");

            storedUser = JSON.parse(storedUser);

            feedbacks.data.data.forEach((element) => {
                if (element.category == "Suggestions") {
                    element.time = feedbackTimeAgo(element.createdAt);
                    suggestions.push(element);
                } else if (element.category == "What Didn't Go Well") {
                    element.time = feedbackTimeAgo(element.createdAt);
                    poorItems.push(element);
                } else {
                    element.time = feedbackTimeAgo(element.createdAt);
                    wellItems.push(element);
                }
            });
            setFeedbackData({
                wellItems,
                poorItems,
                suggestions,
            });
        };

        const fetchComments = async () => {
            const allComments = await api.get("/get-all-comments");
            setAllCommentCount(() => (allComments?.data.data.length));

            allComments.data.data.forEach((element) => {
                element.time = feedbackTimeAgo(element.createdAt);
            });
            setComments(allComments.data.data);
        };

        fetchComments();
        fetchFeedbacks();
        fetchUserInfo();
    }, []);

    const feedbackTimeAgo = (timeStamp) => {
        const now = new Date();
        const past = new Date(timeStamp);
        const diffInMSec = now - past;

        const diffInSec = Math.floor(diffInMSec / 1000);
        const diffInMin = Math.floor(diffInMSec / (1000 * 60));
        const diffInHr = Math.floor(diffInMSec / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMSec / (1000 * 60 * 60 * 24));

        if (diffInSec < 60) return `${diffInSec}s ago`;
        else if (diffInMin < 60) return `${diffInMin}m ago`;
        else if (diffInHr < 24) return `${diffInHr}h ago`;
        return `${diffInDays} days ago`;
    };

    if(userInfo == null) return <section> Loading </section>

    return (
        <section className="md:ml-64">
            {/* Feedback Themes */}
            {console.log("User: ",userInfo)}
            {console.log("Comments", comments)}
            {console.log("Feedback: ", feedbackData)}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md md:p-6">
                <h3 className="mb-4 text-base font-semibold text-gray-900 md:mb-6 md:text-lg">
                    Feedback Themes
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-2 py-4 md:gap-4 md:py-8">
                    <span className="text-lg font-bold text-blue-600 md:text-2xl">
                        Communication
                    </span>
                    <span className="text-base font-semibold text-green-600 md:text-xl">
                        Collaboration
                    </span>
                    <span className="text-sm font-medium text-purple-600 md:text-lg">
                        Testing
                    </span>
                    <span className="text-base font-semibold text-red-600 md:text-xl">
                        Migration
                    </span>
                    <span className="text-sm font-medium text-orange-600 md:text-base">
                        Planning
                    </span>
                    <span className="text-sm font-medium text-indigo-600 md:text-lg">
                        Requirements
                    </span>
                    <span className="text-sm font-medium text-pink-600 md:text-base">
                        Standup
                    </span>
                    <span className="text-base font-semibold text-teal-600 md:text-xl">
                        Knowledge
                    </span>
                    <span className="text-sm font-medium text-yellow-600 md:text-base">
                        Process
                    </span>
                    <span className="text-sm font-medium text-gray-600 md:text-lg">
                        Integration
                    </span>
                </div>
            </div>
        </section>
    );
};

export default RetroSpectives;
