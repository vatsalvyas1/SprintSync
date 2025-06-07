import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";
import api from "../utils/axios";

const RetroSpectives = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        wellItems: [],
        poorItems: [],
        suggestions: [],
    });
    const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchUserInfo = () => {
            const storedUser = localStorage.getItem("loggedInUser");
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
            console.log(allComments.data.data)
            setComments(allComments.data.data);
            console.log(comments)
        };
        fetchComments();
        fetchFeedbacks();
        fetchUserInfo();
    }, []);
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [commentModal, setCommentModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [anonymousMode, setAnonymousMode] = useState(false);

    const [newFeedback, setNewFeedback] = useState({
        category: "What Went Well",
        message: "",
        anonymous: false,
    });

    
    const [newComment, setNewComment] = useState("");

    const openFeedbackModal = () => {
        setFeedbackModal(true);
    };
    const closeFeedbackModal = () => {
        setFeedbackModal(false);
        setNewFeedback({
            category: "What Went Well",
            message: "",
            anonymous: false,
        });
    };

    const openCommentModal = (feedbackId) => {
        setSelectedFeedback(feedbackId);
        setCommentModal(true);
    };
    const closeCommentModal = () => {
        setCommentModal(false);
        setSelectedFeedback(null);
        setNewComment("");
    };

    const voteFeedback = (feedbackId) => {
        setFeedbackData((prev) => {
            const updateVotes = (items) =>
                items.map((item) =>
                    item.id === feedbackId
                        ? { ...item, votes: item.votes + 1 }
                        : item
                );

            return {
                wellItems: updateVotes(prev.wellItems),
                poorItems: updateVotes(prev.poorItems),
                suggestions: updateVotes(prev.suggestions),
            };
        });
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!newFeedback.message.trim()) return;

        const feedback = {
            message: newFeedback.message,
            votes: 0,
            author: newFeedback.anonymous ? "Anonymous" : `${userInfo.name}`,
            time: "Just Now",
            avatar: "https://avatar.iran.liara.run/public/45",
            comments: 0,
        };

        try {
            const res = await api.post("/add-feedback", {
                author: newFeedback.anonymous ? "Anonymous" : userInfo.name,
                category: newFeedback.category,
                message: newFeedback.message,
            });
            setFeedbackData((prev) => {
                const categoryKey =
                    newFeedback.category === "What Went Well"
                        ? "wellItems"
                        : newFeedback.category === "What Didn't Go Well"
                          ? "poorItems"
                          : "suggestions";

                return {
                    ...prev,
                    [categoryKey]: [...prev[categoryKey], feedback],
                };
            });
        } catch (error) {}

        closeFeedbackModal();
    };

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

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const comment = {
            author: userInfo.name,
            message: newComment,
            time: "Just Now",
            // avatar: "https://avatar.iran.liara.run/public/45",
        };

        try {
            console.log(typeof selectedFeedback);
            const res = await api.post("/add-feedback-comment", {
                feedbackId: selectedFeedback,
                author: userInfo.name,
                message: newComment,
            });
            console.log(res);
            setComments((prev) => [...prev, comment]);
            setNewComment("");
        } catch (error) {}
    };

    const getTotalFeedback = () => {
        return (
            feedbackData.wellItems.length +
            feedbackData.poorItems.length +
            feedbackData.suggestions.length
        );
    };

    const getTotalVotes = () => {
        const allItems = [
            ...feedbackData.wellItems,
            ...feedbackData.poorItems,
            ...feedbackData.suggestions,
        ];
        return allItems.reduce((sum, item) => sum + item.votes, 0);
    };

    const getTotalComments = () => {
        const allItems = [
            ...feedbackData.wellItems,
            ...feedbackData.poorItems,
            ...feedbackData.suggestions,
        ];
        return allItems.reduce((sum, item) => sum + item.comments, 0);
    };

    const FeedbackCard = ({ item, bgColor, borderColor }) => (
        <div
            className={`${bgColor} ${borderColor} rounded-lg p-4 transition-shadow hover:shadow-sm`}
        >
            <div className="mb-3 flex items-start justify-between">
                <p className="text-sm font-medium text-gray-900">
                    {item.message}
                </p>
                <div className="ml-2 flex items-center space-x-1">
                    <button
                        onClick={() => voteFeedback(item.id)}
                        className="text-gray-400 transition-colors hover:text-blue-600"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 15l7-7 7 7"
                            ></path>
                        </svg>
                    </button>
                    <span className="text-xs font-medium text-gray-600">
                        {item.votes}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <img
                        className="h-5 w-5 rounded-full"
                        src={item.avatar}
                        alt="User"
                    />
                    <span className="text-xs text-gray-500">
                        {item.author} • {item.time}
                    </span>
                </div>
                <button
                    onClick={() => openCommentModal(item._id)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                >
                    {item.comments} comments
                </button>
            </div>
        </div>
    );

    return (
        <section className="min-h-screen bg-gray-50 p-4 md:ml-64 md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="mb-1 text-2xl font-bold text-gray-900 md:mb-2 md:text-3xl">
                        Sprint Retro Board
                    </h1>
                    <p className="text-sm text-gray-600 md:text-base">
                        Collect and track retrospective feedback
                    </p>
                </div>
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={openFeedbackModal}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 md:px-4 md:py-2"
                        >
                            <svg
                                className="mr-1 h-4 w-4 md:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                            </svg>
                            Add Feedback
                        </button>
                        {/* <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 md:px-4 md:py-2">
                            <svg
                                className="mr-1 h-4 w-4 md:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                            </svg>
                            Export
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:gap-6 lg:grid-cols-3">
                {/* What Went Well Column */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <div className="mb-4 flex items-center justify-between md:mb-6">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-100 md:h-8 md:w-8">
                                <svg
                                    className="h-3 w-3 text-green-600 md:h-4 md:w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 md:text-lg">
                                What Went Well
                            </h2>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 md:px-2 md:py-1">
                            {feedbackData.wellItems.length} items
                        </span>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        {feedbackData.wellItems.map((item) => (
                            <FeedbackCard
                                key={item._id}
                                item={item}
                                bgColor="bg-green-50"
                                borderColor="border-green-200"
                            />
                        ))}
                    </div>
                </div>

                {/* What Didn't Go Well Column */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <div className="mb-4 flex items-center justify-between md:mb-6">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-100 md:h-8 md:w-8">
                                <svg
                                    className="h-3 w-3 text-red-600 md:h-4 md:w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 md:text-lg">
                                What Didn't Go Well
                            </h2>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 md:px-2 md:py-1">
                            {feedbackData.poorItems.length} items
                        </span>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        {feedbackData.poorItems.map((item) => (
                            <FeedbackCard
                                key={item._id}
                                item={item}
                                bgColor="bg-red-50"
                                borderColor="border-red-200"
                            />
                        ))}
                    </div>
                </div>

                {/* Suggestions Column */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <div className="mb-4 flex items-center justify-between md:mb-6">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 md:h-8 md:w-8">
                                <svg
                                    className="h-3 w-3 text-blue-600 md:h-4 md:w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 md:text-lg">
                                Suggestions
                            </h2>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 md:px-2 md:py-1">
                            {feedbackData.suggestions.length} items
                        </span>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        {feedbackData.suggestions.map((item) => (
                            <FeedbackCard
                                key={item._id}
                                item={item}
                                bgColor="bg-blue-50"
                                borderColor="border-blue-200"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:grid-cols-4 md:gap-6">
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6">
                    <div className="mb-1 text-xl font-bold text-green-600 md:mb-2 md:text-2xl">
                        {getTotalFeedback()}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Total Feedback
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6">
                    <div className="mb-1 text-xl font-bold text-blue-600 md:mb-2 md:text-2xl">
                        {getTotalVotes()}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Total Votes
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6">
                    <div className="mb-1 text-xl font-bold text-purple-600 md:mb-2 md:text-2xl">
                        {getTotalComments()}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Comments
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6">
                    <div className="mb-1 text-xl font-bold text-orange-600 md:mb-2 md:text-2xl">
                        85%
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Participation
                    </div>
                </div>
            </div>

            {/* Word Cloud Visualization */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
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

            {/* Add Feedback Modal */}
            {feedbackModal && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
                    aria-modal="true"
                >
                    <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
                        <div
                            className="bg-opacity-75 fixed bg-gray-500 transition-opacity"
                            onClick={closeFeedbackModal}
                        ></div>

                        <div className="relative mx-auto w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Add Feedback
                                </h3>
                                <button
                                    onClick={closeFeedbackModal}
                                    className="text-gray-400 transition-colors hover:text-gray-600"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={newFeedback.category}
                                        onChange={(e) =>
                                            setNewFeedback((prev) => ({
                                                ...prev,
                                                category: e.target.value,
                                            }))
                                        }
                                    >
                                        <option>What Went Well</option>
                                        <option>What Didn't Go Well</option>
                                        <option>Suggestions</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Feedback
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        rows="4"
                                        placeholder="Share your thoughts about this sprint..."
                                        value={newFeedback.text}
                                        onChange={(e) =>
                                            setNewFeedback((prev) => ({
                                                ...prev,
                                                message: e.target.value,
                                            }))
                                        }
                                    ></textarea>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        name="anonymousFeedback"
                                        id="anonymousFeedback"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={newFeedback.anonymous}
                                        onChange={(e) =>
                                            setNewFeedback((prev) => ({
                                                ...prev,
                                                anonymous: e.target.checked,
                                            }))
                                        }
                                    />
                                    <label
                                        htmlFor="anonymousFeedback"
                                        className="ml-2 text-sm text-gray-700"
                                    >
                                        Submit anonymously
                                    </label>
                                </div>

                                <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6">
                                    <button
                                        type="button"
                                        onClick={closeFeedbackModal}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmitFeedback}
                                        className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                    >
                                        Add Feedback
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Modal */}
            {commentModal && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
                    aria-modal="true"
                >
                    <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
                        <div
                            className="bg-opacity-75 fixed bg-gray-500 transition-opacity"
                            onClick={closeCommentModal}
                        ></div>

                        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
                            <div className="p-4 md:p-6">
                                <div className="mb-4 flex items-center justify-between md:mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Comments & Reactions
                                    </h3>
                                    <button
                                        onClick={closeCommentModal}
                                        className="text-gray-400 transition-colors hover:text-gray-600"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>

                                {/* Original Feedback */}
                                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 md:mb-6 md:p-4">
                                    <p className="mb-1 text-sm text-gray-900 md:mb-2">
                                        Great collaboration between frontend and
                                        backend teams during API integration
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <img
                                            className="h-4 w-4 rounded-full md:h-5 md:w-5"
                                            src="https://avatar.iran.liara.run/public/12"
                                            alt="User"
                                        />
                                        <span className="text-xs text-gray-500">
                                            Alex Johnson • 2h ago
                                        </span>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="mb-4 max-h-64 space-y-3 overflow-y-auto md:mb-6 md:max-h-96 md:space-y-4">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment._id}
                                            className="flex items-start space-x-2 md:space-x-3"
                                        >
                                            <img
                                                className="h-6 w-6 rounded-full md:h-8 md:w-8"
                                                src={comment.avatar}
                                                alt="User"
                                            />
                                            <div className="flex-1">
                                                <div className="rounded-lg bg-gray-100 p-2 md:p-3">
                                                    <p className="text-xs text-gray-900 md:text-sm">
                                                        {comment.message}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {comment.author} •{" "}
                                                    {feedbackTimeAgo(comment.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Comment */}
                                <div className="border-t border-gray-200 pt-3 md:pt-4">
                                    <div className="flex items-start space-x-2 md:space-x-3">
                                        <img
                                            className="h-6 w-6 rounded-full md:h-8 md:w-8"
                                            src="https://avatar.iran.liara.run/public/45"
                                            alt="Current user"
                                        />
                                        <div className="flex-1">
                                            <textarea
                                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-3 md:py-2 md:text-sm"
                                                rows="2"
                                                placeholder="Add a comment..."
                                                value={newComment}
                                                onChange={(e) =>
                                                    setNewComment(
                                                        e.target.value
                                                    )
                                                }
                                            ></textarea>
                                            <div className="mt-1 flex items-center justify-end md:mt-2">
                                                <button
                                                    onClick={handleAddComment}
                                                    disabled={
                                                        !newComment.trim()
                                                    }
                                                    className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-3 md:py-1.5 md:text-sm"
                                                >
                                                    Comment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RetroSpectives;
