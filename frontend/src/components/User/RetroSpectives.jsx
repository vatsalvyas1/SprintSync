import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../constant.js";
import { Check, ChevronUp, Lightbulb, Plus, X } from "lucide-react";

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
        console.log("Not even Fetching")
        onsole.log("BACKEND URL BEING USED:", backendUrl); // ✅ Add this line here

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
            // const feedbacks = await api.get("/get-all-feedbacks");
            const res = await fetch(`${backendUrl}/api/v1/retrospectives/get-all-feedbacks`, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to create form");

            const feedbacks = await res.json();
            console.log("First: ",feedbacks)

            storedUser = JSON.parse(storedUser);

            feedbacks?.data?.forEach((element) => {
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
            setAllCommentCount(() => allComments?.data?.data?.length);

            allComments?.data?.data?.forEach((element) => {
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

    const getTotalFeedback = () => {
        return (
            feedbackData.wellItems.length +
            feedbackData.poorItems.length +
            feedbackData.suggestions.length
        );
    };

    {
        /* Template For All Feedback Cards */
    }
    const FeedbackCard = ({ item, bgColor, borderColor }) => (
        <div
            className={`${bgColor} ${borderColor} rounded-lg p-3 transition-shadow hover:shadow-sm`}
        >
            <div className="mb-3 flex items-start justify-between">
                <div className="max-w-full text-sm font-medium break-normal text-gray-900">
                    {item.message}
                </div>
                <div className="no-wrap flex items-center">
                    <button onClick={() => handleUpvote}>
                        <ChevronUp size={20} className="text-gray-600" />
                    </button>
                    <div className="text-xs text-gray-600">&nbsp;0</div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <img
                        className="h-5 w-5 rounded-full"
                        src={item.avatar}
                        alt="User"
                        draggable="false"
                    />
                    <span className="text-xs text-gray-500">
                        <span className="whitespace-nowrap">{item.author}</span>{" "}
                        • <span className="whitespace-nowrap">{item.time}</span>
                    </span>
                </div>
                <button
                    onClick={() => openCommentModal(item)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                >
                    {item.commentCount} comments
                </button>
            </div>
        </div>
    );

    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [newFeedback, setNewFeedback] = useState({
        category: "What Went Well",
        message: "",
        anonymous: false,
    });
    const [feedbackModal, setFeedbackModal] = useState(false);

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

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!newFeedback.message.trim()) return;

        const feedback = {
            message: newFeedback.message,
            author: newFeedback.anonymous ? "Anonymous" : `${userInfo.name}`,
            time: "Just Now",
            avatar: userInfo.avatar,
            commentCount: 0,
        };

        try {
            const res = await api.post("/add-feedback", {
                author: newFeedback.anonymous ? "Anonymous" : userInfo.name,
                category: newFeedback.category,
                message: newFeedback.message,
                avatar: userInfo.avatar,
            });
            feedback._id = res.data.data._id;
            feedback.category = res.data.data.category;
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
        } catch (error) {
            console.log(error);
        }

        closeFeedbackModal();
    };

    const [newComment, setNewComment] = useState("");
    const [commentModal, setCommentModal] = useState(false);

    const openCommentModal = async (feedback) => {
        setSelectedFeedback({
            feedbackId: feedback._id,
            author: feedback.author,
            avatar: feedback.avatar,
            time: feedback.time,
            message: feedback.message,
            category: feedback.category,
        });
        setCommentModal(true);
    };

    const closeCommentModal = () => {
        setCommentModal(false);
        setSelectedFeedback(null);
        setNewComment("");
    };

    const getTotalComments = () => {
        return allCommentCount;
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        const comment = {
            author: userInfo.name,
            message: newComment,
            time: "Just Now",
            feedback: selectedFeedback.feedbackId,
            avatar: userInfo.avatar,
        };

        try {
            await api.post("/add-feedback-comment", {
                feedbackId: selectedFeedback.feedbackId,
                author: userInfo.name,
                message: newComment,
                avatar: userInfo.avatar,
            });
            setAllCommentCount((prev) => prev + 1);
            setComments((prev) => [...prev, comment]);
            setNewComment("");
        } catch (error) {
            console.log(error);
        }

        const updatedComments = [...comments, comment];
        const matchingComments = updatedComments.filter(
            (comment) => comment.feedback === selectedFeedback.feedbackId
        );
        try {
            await api.post("/add-feedback-commentCount", {
                feedbackId: selectedFeedback.feedbackId,
                commentCount: matchingComments.length,
            });
        } catch (error) {
            console.log(error);
        }

        setFeedbackData((prev) => {
            let updatedCategory;

            if (selectedFeedback.category === "What Went Well") {
                updatedCategory = {
                    ...prev,
                    wellItems: prev.wellItems.map((item) =>
                        item._id === selectedFeedback.feedbackId
                            ? { ...item, commentCount: matchingComments.length }
                            : item
                    ),
                };
            } else if (selectedFeedback.category === "What Didn't Go Well") {
                updatedCategory = {
                    ...prev,
                    poorItems: prev.poorItems.map((item) =>
                        item._id === selectedFeedback.feedbackId
                            ? { ...item, commentCount: matchingComments.length }
                            : item
                    ),
                };
            } else {
                updatedCategory = {
                    ...prev,
                    suggestions: prev.suggestions.map((item) =>
                        item._id === selectedFeedback.feedbackId
                            ? { ...item, commentCount: matchingComments.length }
                            : item
                    ),
                };
            }
            return updatedCategory;
        });
    };

    const handleUpvote = () => {};

    if (userInfo == null || comments == undefined)
        return <section> Loading </section>;

    return (
        <section className="mx-5 mt-10 mb-5 md:mr-5 md:ml-70">
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
                            <Plus size={20} className="mr-2" />
                            Add Feedback
                        </button>
                    </div>
                </div>
            </div>

            {/* Container For All Cards */}
            <div className="scrollbar-hide mb-6 grid h-[500px] grid-cols-1 gap-4 overflow-y-auto rounded-lg pb-5 md:mb-8 md:grid-cols-1 md:gap-6 lg:grid-cols-3 lg:overflow-hidden">
                {/* What Went Well Card */}
                <div className="scrollbar-hide h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between md:mb-6">
                        <div className="flex items-center justify-evenly whitespace-nowrap">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-100 md:h-8 md:w-8">
                                <Check size={20} className="text-green-800" />
                            </div>
                            <div className="px-2 text-base font-semibold text-gray-900 md:text-lg lg:text-base xl:text-lg">
                                What Went Well
                            </div>
                        </div>
                        <div className="ml-auto inline-flex items-center rounded-full border bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 md:px-2 md:py-1">
                            {feedbackData.wellItems.length} items
                        </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        {feedbackData.wellItems.map((item) => (
                            <FeedbackCard
                                key={item._id}
                                item={item}
                                bgColor="bg-green-50"
                                borderColor="border-green-200"
                            >
                                {" "}
                            </FeedbackCard>
                        ))}
                    </div>
                </div>
                {/* What Didn't Go Well Card */}
                <div className="scrollbar-hide h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between md:mb-6">
                        <div className="flex items-center justify-evenly whitespace-nowrap">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-100 md:h-8 md:w-8">
                                <X size={20} className="text-red-800" />
                            </div>
                            <h2 className="px-2 text-base font-semibold text-gray-900 md:text-lg lg:text-base xl:text-lg">
                                What Didn't Go Well
                            </h2>
                        </div>
                        <span className="ml-auto inline-flex items-center rounded-full border bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 md:px-2 md:py-1">
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
                {/* Suggestions Card */}
                <div className="scrollbar-hide h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between md:mb-6">
                        <div className="flex items-center justify-evenly whitespace-nowrap">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 md:h-8 md:w-8">
                                <Lightbulb
                                    size={20}
                                    className="text-blue-800"
                                />
                            </div>
                            <h2 className="px-2 text-base font-semibold text-gray-900 md:text-lg lg:text-base xl:text-lg">
                                Suggestions
                            </h2>
                        </div>
                        <span className="ml-auto inline-flex items-center rounded-full border bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 md:px-2 md:py-1">
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
            <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:grid-cols-3 md:gap-20">
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6">
                    <div className="mb-1 text-xl font-bold text-green-600 md:mb-2 md:text-2xl">
                        {getTotalFeedback()}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Feedbacks
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
                    <div className="mb-1 text-xl font-bold text-purple-600 md:mb-2 md:text-2xl"></div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Upvotes
                    </div>
                </div>
            </div>

            {/* Feedback Themes */}
            {console.log("User: ", userInfo)}
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
                                    <X size={25} className="text-grey-500" />
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
                                        autoFocus
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
                                        <X
                                            size={25}
                                            className="text-grey-500"
                                        />
                                    </button>
                                </div>

                                {/* Original Feedback */}
                                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 md:mb-6 md:p-4">
                                    <p className="mb-1 truncate text-sm text-gray-900 md:mb-2">
                                        {selectedFeedback.message}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <img
                                            className="h-4 w-4 rounded-full md:h-5 md:w-5"
                                            src={selectedFeedback.avatar}
                                            alt="User"
                                            draggable="false"
                                        />
                                        <span className="text-xs text-gray-500">
                                            {selectedFeedback.author} •{" "}
                                            {selectedFeedback.time}
                                        </span>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="mb-4 max-h-64 space-y-3 overflow-y-auto md:mb-6 md:max-h-96 md:space-y-4">
                                    {comments
                                        .filter(
                                            (comment) =>
                                                comment.feedback ===
                                                selectedFeedback.feedbackId
                                        )
                                        .map((comment) => (
                                            <div
                                                key={comment._id}
                                                className="flex items-start space-x-2 md:space-x-3"
                                            >
                                                <img
                                                    className="h-6 w-6 rounded-full md:h-8 md:w-8"
                                                    src={comment.avatar}
                                                    alt="User"
                                                    draggable="false"
                                                />
                                                <div className="flex-1">
                                                    <div className="rounded-lg bg-gray-100 p-2 md:p-3">
                                                        <p className="text-xs break-normal text-gray-900 md:text-sm">
                                                            {comment.message}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {comment.author} •{" "}
                                                        {comment.time}
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
                                            src={userInfo.avatar}
                                            alt="Current user"
                                            draggable="false"
                                        />
                                        <div className="flex-1">
                                            <textarea
                                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-3 md:py-2 md:text-sm"
                                                rows="2"
                                                autoFocus
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
