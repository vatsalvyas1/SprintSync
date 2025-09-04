import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../constant.js";
import {
    Check,
    CheckCircle,
    ChevronUp,
    CirclePlus,
    Lightbulb,
    Plus,
    ThumbsUp,
    X,
} from "lucide-react";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";
import SpinningWheel from "./SpinningWheel.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Helper function to reorder items in a list
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

// Helper function to move items between lists
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const api = axios.create({
    baseURL: `${backendUrl}/api/v1/retrospectives/`,
    withCredentials: true,
});

const RetroSpectives = ({ sprintId }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        wellItems: [],
        poorItems: [],
        suggestions: [],
    });
    const [comments, setComments] = useState([]);
    const [allCommentCount, setAllCommentCount] = useState(null);
    const [upvotes, setUpvotes] = useState();
    const [allUpvoteCount, setAllUpvoteCount] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [newFeedback, setNewFeedback] = useState({
        category: "What Went Well",
        message: "",
        anonymous: false,
        upvoteCount: 0,
        sprintId: sprintId,
    });

    const onDragEnd = async (result) => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        const sourceId = source.droppableId;
        const destId = destination.droppableId;

        // If in the same list, reorder
        if (sourceId === destId) {
            let items = [];
            if (sourceId === "well") items = [...feedbackData.wellItems];
            else if (sourceId === "poor") items = [...feedbackData.poorItems];
            else items = [...feedbackData.suggestions];

            const reorderedItems = reorder(
                items,
                source.index,
                destination.index
            );

            setFeedbackData((prev) => ({
                ...prev,
                [sourceId === "well"
                    ? "wellItems"
                    : sourceId === "poor"
                      ? "poorItems"
                      : "suggestions"]: reorderedItems,
            }));
        } else {
            // Moving between lists
            const sourceItems =
                sourceId === "well"
                    ? [...feedbackData.wellItems]
                    : sourceId === "poor"
                      ? [...feedbackData.poorItems]
                      : [...feedbackData.suggestions];

            const destItems =
                destId === "well"
                    ? [...feedbackData.wellItems]
                    : destId === "poor"
                      ? [...feedbackData.poorItems]
                      : [...feedbackData.suggestions];

            const result = move(sourceItems, destItems, source, destination);

            // Update state
            setFeedbackData((prev) => ({
                ...prev,
                [sourceId === "well"
                    ? "wellItems"
                    : sourceId === "poor"
                      ? "poorItems"
                      : "suggestions"]: result[sourceId],
                [destId === "well"
                    ? "wellItems"
                    : destId === "poor"
                      ? "poorItems"
                      : "suggestions"]: result[destId],
            }));

            // Update the category in the backend
            const movedItem =
                sourceId === "well"
                    ? feedbackData.wellItems[source.index]
                    : sourceId === "poor"
                      ? feedbackData.poorItems[source.index]
                      : feedbackData.suggestions[source.index];

            try {
                const category =
                    destId === "well"
                        ? "What Went Well"
                        : destId === "poor"
                          ? "What Didn't Go Well"
                          : "Suggestions";

                await api.patch(`/update-feedback/${movedItem._id}`, {
                    category,
                });
            } catch (error) {
                console.error("Error updating feedback category:", error);
                // Revert the UI if the API call fails
                setFeedbackData((prev) => ({
                    ...prev,
                    [sourceId === "well"
                        ? "wellItems"
                        : sourceId === "poor"
                          ? "poorItems"
                          : "suggestions"]: sourceItems,
                    [destId === "well"
                        ? "wellItems"
                        : destId === "poor"
                          ? "poorItems"
                          : "suggestions"]: destItems,
                }));
            }
        }
    };

    const [feedbackModal, setFeedbackModal] = useState(false);
    const [addFeedbackDisabled, setAddFeedbackDisabled] = useState(false);

    const [actionItemModal, setActionItemsModal] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentModal, setCommentModal] = useState(false);
    const [addCommentDisabled, setAddCommentDisabled] = useState(false);
    const [actionItems, setActionItems] = useState([]);
    const [allActionItemsCount, setAllActionItemsCount] = useState(null);

    useEffect(() => {
        if (!sprintId) return;

        let storedUserData = null;

        const fetchUserInfo = () => {
            const storedUserString = localStorage.getItem("loggedInUser");
            if (storedUserString) {
                storedUserData = JSON.parse(storedUserString); // Parse ONCE
                setUserInfo(storedUserData);
            } else {
                console.error("No user info found in localStorage");
            }
        };

        const fetchFeedbacks = async () => {
            try {
                let wellItems = [];
                let poorItems = [];
                let suggestions = [];

                const feedbacks = await api.post("/get-all-feedbacks", {
                    sprintId,
                });

                // NO JSON.parse here - storedUserData is already an object

                feedbacks?.data?.data?.forEach((element) => {
                    element.time = feedbackTimeAgo(element.createdAt);

                    if (element.category === "Suggestions") {
                        suggestions.push(element);
                    } else if (element.category === "What Didn't Go Well") {
                        poorItems.push(element);
                    } else {
                        wellItems.push(element);
                    }
                });

                setFeedbackData({
                    wellItems,
                    poorItems,
                    suggestions,
                });

                const totalCountRes = await api.post(
                    "/get-total-action-item-count",
                    {
                        sprintId,
                    }
                );
                setAllActionItemsCount(totalCountRes?.data?.data?.count || 0);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        };

        const fetchComments = async () => {
            try {
                const allComments = await api.post("/get-all-comments", {
                    sprintId,
                });
                setAllCommentCount(allComments?.data?.data?.length || 0);

                allComments?.data?.data?.forEach((element) => {
                    element.time = feedbackTimeAgo(element.createdAt);
                });
                setComments(allComments?.data?.data || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        const fetchUpvotes = async () => {
            try {
                const allUpvotes = await api.post("/get-all-upvotes", {
                    sprintId,
                });
                setAllUpvoteCount(allUpvotes?.data?.data?.length || 0);
                setUpvotes(allUpvotes?.data?.data || []);
            } catch (error) {
                console.error("Error fetching upvotes:", error);
            }
        };

        const fetchActionItems = async () => {
            try {
                const res = await api.post("/get-all-action-items", {
                    sprintId,
                });
                setActionItems(res.data?.data || []);
            } catch (error) {
                console.error("Error fetching action items:", error);
            }
        };

        // Initial data fetch
        const initializeData = async () => {
            fetchUserInfo();
            await Promise.all([
                fetchFeedbacks(),
                fetchComments(),
                fetchUpvotes(),
                fetchActionItems(),
            ]);
        };

        console.log("Setting up polling for sprint:", sprintId);
        initializeData();

        // Polling every 3 seconds
        const intervalId = setInterval(async () => {
            try {
                await Promise.all([
                    fetchFeedbacks(),
                    fetchComments(),
                    fetchUpvotes(),
                    fetchActionItems(),
                ]);
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000);

        return () => {
            console.log("Cleaning up polling interval");
            clearInterval(intervalId);
        };
    }, [sprintId]);

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

    const toggleActionItemsUpvote = async (feedbackId) => {
        try {
            await api.post("/add-action-items-upvote", {
                feedbackId: feedbackId,
                userId: userInfo._id,
            });
            setActionItems((prev) => {
                return prev.map((item) => {
                    if (item._id !== feedbackId) return item;

                    const isUpvoted =
                        item.actionItemMeta.upvotedByUserName.includes(
                            userInfo._id
                        );

                    const updatedVoters = isUpvoted
                        ? item.actionItemMeta.upvotedByUserName?.filter(
                              (id) => id != userInfo._id
                          )
                        : [
                              ...item.actionItemMeta.upvotedByUserName,
                              userInfo._id,
                          ];

                    return {
                        ...item,
                        actionItemMeta: {
                            ...item.actionItemMeta,
                            upvotedByUserName: updatedVoters,
                        },
                    };
                });
            });
        } catch (error) {
            console.log("Error in handling action items upvotes: ", error);
        }
    };

    {
        /* Template For All Feedback Cards */
    }
    const FeedbackCard = ({ item, bgColor, borderColor }) => {
        const isUpvotedByUser =
            upvotes?.some(
                (vote) =>
                    vote.user === userInfo?._id && vote.feedback === item._id
            ) ?? false;

        const isActionItem = item.actionItem === true;
        const isAddedByCurrentUser =
            item.actionItemMeta?.addedByUser === userInfo?._id;

        return (
            <div
                className={`${bgColor} ${borderColor} rounded-lg border-1 p-3 transition-shadow hover:shadow-sm`}
                onFocus={() => handleFeedbackCardFocus(item)}
                role="article"
            >
                <div className="mb-3 flex items-start justify-between">
                    <div
                        className="max-w-full text-sm font-medium break-normal text-gray-900"
                        onFocus={() =>
                            speak(`Feedback content: ${item.message}`)
                        }
                        role="text"
                    >
                        {item.message}
                    </div>
                    <div className="ml-1 flex items-center space-x-2">
                        {/* Action Item Toggle */}
                        {isActionItem ? (
                            isAddedByCurrentUser ? (
                                <button
                                    onClick={() => handleActionItem(item)}
                                    onFocus={() => handleActionItemFocus(item)}
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, "actionItem", item)
                                    }
                                    title="Remove Action Item"
                                >
                                    <CirclePlus
                                        size={18}
                                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                                        aria-hidden="true"
                                    />
                                </button>
                            ) : (
                                <div
                                    title={`Action Item by ${item.actionItemMeta?.addedByUserName}`}
                                    onFocus={() =>
                                        speak(
                                            `Action item marked by ${item.actionItemMeta?.addedByUserName}`
                                        )
                                    }
                                    role="status"
                                >
                                    <CheckCircle
                                        size={18}
                                        className="cursor-default text-green-600"
                                        aria-hidden="true"
                                    />
                                </div>
                            )
                        ) : (
                            <button
                                onClick={() => handleActionItem(item)}
                                onFocus={() => handleActionItemFocus(item)}
                                title="Mark as Action Item"
                            >
                                <CirclePlus
                                    size={18}
                                    className="cursor-pointer text-gray-800 hover:text-blue-700"
                                    aria-hidden="true"
                                />
                            </button>
                        )}

                        {/* Upvote Button */}
                        <div
                            className="no-wrap flex items-center"
                            title="Upvote"
                            role="button"
                        >
                            <button onClick={() => handleUpvote(item)}>
                                <ThumbsUp
                                    size={15}
                                    className={`cursor-pointer transition-colors ${
                                        isUpvotedByUser
                                            ? "text-blue-600"
                                            : "text-gray-400"
                                    } hover:text-blue-700`}
                                    aria-hidden="true"
                                />
                            </button>
                            <div className="ml-1 text-xs text-gray-600">
                                {item.upvoteCount}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: avatar, author, time, comments */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img
                            className="h-5 w-5 rounded-full"
                            src={item.avatar}
                            alt={`Avatar of ${item.author}`}
                            draggable="false"
                        />
                        <span
                            className="text-xs text-gray-500"
                            onFocus={() =>
                                speak(
                                    `Author: ${item.author}, posted ${item.time} ago`
                                )
                            }
                            role="text"
                        >
                            <span className="whitespace-nowrap">
                                {item.author}
                            </span>{" "}
                            •{" "}
                            <span className="whitespace-nowrap">
                                {item.time}
                            </span>
                        </span>
                    </div>
                    <button
                        onClick={() => openCommentModal(item)}
                        onFocus={() => handleCommentButtonFocus(item)}
                        onKeyDown={(e) => handleKeyDown(e, "comment", item)}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-700"
                    >
                        {item.commentCount} comments
                    </button>
                </div>
            </div>
        );
    };

    const openActionItemsModal = () => {
        setActionItemsModal(true);
        handleModalFocus("Action Items");
    };

    const closeActionItemsModal = () => {
        setActionItemsModal(false);
        speak("Action items modal closed");
    };

    const openFeedbackModal = () => {
        setFeedbackModal(true);
        handleModalFocus("Add Feedback");
    };

    const closeFeedbackModal = () => {
        setFeedbackModal(false);
        speak("Add feedback modal closed");
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
            upvoteCount: 0,
            sprintId: sprintId,
        };

        try {
            setAddFeedbackDisabled(() => true);
            const res = await api.post("/add-feedback", {
                sprintId: sprintId,
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
            setAddFeedbackDisabled(() => false);
        } catch (error) {
            console.log(error);
        }

        closeFeedbackModal();
    };

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
        handleModalFocus("Comments");
    };

    const closeCommentModal = () => {
        setCommentModal(false);
        setSelectedFeedback(null);
        setNewComment("");
        speak("Comments modal closed");
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
            setAddCommentDisabled(() => true);
            await api.post("/add-feedback-comment", {
                sprintId: sprintId,
                feedbackId: selectedFeedback.feedbackId,
                author: userInfo.name,
                message: newComment,
                avatar: userInfo.avatar,
            });
            setComments((prev) => [...prev, comment]);
            setNewComment("");
            setAddCommentDisabled(() => false);
        } catch (error) {
            console.log(error);
        }

        const totalCountRes = await api.post("/get-total-comment-count", {
            sprintId: sprintId,
        });
        const totalComments = totalCountRes?.data?.data?.count || 0;
        setAllCommentCount(totalComments);

        const updatedComments = [...comments, comment];
        const matchingComments = updatedComments.filter(
            (comment) => comment.feedback === selectedFeedback.feedbackId
        );

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

    const getTotalUpvotes = () => {
        return allUpvoteCount;
    };

    const handleUpvote = async (feedback) => {
        const upvote = {
            sprintId: sprintId,
            user: userInfo._id,
            feedback: feedback._id,
        };

        try {
            const res = await api.post("/add-feedback-upvote", {
                sprintId: sprintId,
                userId: userInfo._id,
                feedbackId: feedback._id,
            });

            setUpvotes((prev) => {
                let updatedUpvotes;
                if (res.data.message === false) {
                    updatedUpvotes = prev.filter(
                        (item) =>
                            !(
                                item.sprintId === upvote.sprintId &&
                                item.user === upvote.user &&
                                item.feedback === upvote.feedback
                            )
                    );
                } else {
                    updatedUpvotes = [...prev, upvote];
                }
                return updatedUpvotes;
            });

            const totalCountRes = await api.post("/get-total-upvote-count", {
                sprintId,
            });
            const totalUpvotes = totalCountRes?.data?.data?.count || 0;
            setAllUpvoteCount(totalUpvotes);

            setFeedbackData((prev) => {
                let updatedCategory;

                if (feedback.category === "What Went Well") {
                    updatedCategory = {
                        ...prev,
                        wellItems: prev.wellItems.map((item) =>
                            item._id === feedback._id
                                ? {
                                      ...item,
                                      upvoteCount: res.data.data.upvoteCount,
                                  }
                                : item
                        ),
                    };
                } else if (feedback.category === "What Didn't Go Well") {
                    updatedCategory = {
                        ...prev,
                        poorItems: prev.poorItems.map((item) =>
                            item._id === feedback._id
                                ? {
                                      ...item,
                                      upvoteCount: res.data.data.upvoteCount,
                                  }
                                : item
                        ),
                    };
                } else {
                    updatedCategory = {
                        ...prev,
                        suggestions: prev.suggestions.map((item) =>
                            item._id === feedback._id
                                ? {
                                      ...item,
                                      upvoteCount: res.data.data.upvoteCount,
                                  }
                                : item
                        ),
                    };
                }
                return updatedCategory;
            });
        } catch (error) {
            console.log(error);
        }

        {
            /* Updated FeedbackData ForUpvotes */
        }
    };

    const getTotalActionItems = () => {
        return allActionItemsCount;
    };

    const handleActionItem = async (feedback) => {
        try {
            const res = await api.patch("/add-action-item", {
                sprintId,
                feedbackId: feedback._id,
                userId: userInfo._id,
                userName: userInfo.name,
            });

            const newStatus = res.data?.data?.actionItem;
            const actionItemMeta = res.data?.data?.actionItemMeta;

            const actionItem = {
                sprintId,
                feedbackId: feedback._id,
                addedByUser: userInfo._id,
                addedByUserName: userInfo.name,
            };

            setActionItems((prev) =>
                newStatus
                    ? [...prev, feedback]
                    : prev.filter((item) => item._id !== feedback._id)
            );

            const totalCountRes = await api.post(
                "/get-total-action-item-count",
                {
                    sprintId,
                }
            );

            setAllActionItemsCount(totalCountRes?.data?.data?.count || 0);

            setFeedbackData((prev) => {
                const updateCategory = (items) =>
                    items.map((item) =>
                        item._id === feedback._id
                            ? {
                                  ...item,
                                  actionItem: newStatus,
                                  actionItemMeta: newStatus
                                      ? actionItemMeta
                                      : null,
                              }
                            : item
                    );

                if (feedback.category === "What Went Well") {
                    return {
                        ...prev,
                        wellItems: updateCategory(prev.wellItems),
                    };
                } else if (feedback.category === "What Didn't Go Well") {
                    return {
                        ...prev,
                        poorItems: updateCategory(prev.poorItems),
                    };
                } else {
                    return {
                        ...prev,
                        suggestions: updateCategory(prev.suggestions),
                    };
                }
            });

            const refreshedItems = await api.post("/get-all-action-items", {
                sprintId,
            });
            setActionItems(refreshedItems.data?.data || []);
        } catch (error) {
            console.error("Failed to toggle action item:", error);
        }
    };

    if (sprintId == null)
        return (
            <div className="mt-5 text-center font-medium" role="status">
                Select Sprint To View Its Retro Board
            </div>
        );

    if (userInfo == null || comments == undefined)
        return (
            <div className="mt-5 text-center font-medium" role="status">
                {" "}
                No Sprint Present
            </div>
        );

    return (
        <section
            className="p-4"
            role="main"
            onFocus={() => handleSectionFocus("Retrospectives Dashboard")}
        >
            <div className="mb-5">
                <SpinningWheel />
            </div>
            {/* Sub-Header */}

            <div className="mb-5 flex justify-between gap-2">
                <button
                    onClick={openFeedbackModal}
                    onFocus={() => handleButtonFocus("Add Feedback")}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 md:px-4 md:py-2"
                >
                    <Plus size={18} className="mr-2" aria-hidden="true" />
                    Add Feedback
                </button>
                <button
                    onClick={openActionItemsModal}
                    onFocus={() => handleButtonFocus("Show Action Items")}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 md:px-4 md:py-2"
                >
                    Show Action Items
                </button>
            </div>

            {/* Container For All Cards */}
            <div className="scrollbar-hide mb-6 grid h-[500px] grid-cols-1 gap-4 overflow-y-auto rounded-lg pb-5 md:mb-8 md:grid-cols-1 md:gap-6 lg:grid-cols-3 lg:overflow-hidden">
                {/* What Went Well Card */}
                <div
                    className="scrollbar-hide h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 md:p-6"
                    onFocus={() => handleCardFocus("wellItems")}
                    role="region"
                >
                    <div className="mb-4 flex flex-wrap items-center justify-between md:mb-6">
                        <div className="flex items-center justify-evenly whitespace-nowrap">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-100 md:h-8 md:w-8">
                                <Check
                                    size={18}
                                    className="text-green-800"
                                    aria-hidden="true"
                                />
                            </div>
                            <div
                                className="px-2 text-base font-semibold text-gray-900"
                                onFocus={() => speak("What Went Well section")}
                                role="heading"
                                aria-level="2"
                            >
                                What Went Well
                            </div>
                        </div>
                        <div
                            className="ml-auto inline-flex items-center rounded-full border bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 md:px-2 md:py-1"
                            onFocus={() =>
                                speak(
                                    `${feedbackData.wellItems.length} items in What Went Well`
                                )
                            }
                            role="status"
                        >
                            {feedbackData.wellItems.length} items
                        </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <div className="space-y-3 md:space-y-4">
                            {[...feedbackData.wellItems]
                                .sort((a, b) => b.upvoteCount - a.upvoteCount)
                                .map((item) => (
                                    <FeedbackCard
                                        key={item._id}
                                        item={item}
                                        bgColor="bg-green-50"
                                        borderColor="border-green-200"
                                    />
                                ))}
                        </div>
                    </div>
                </div>
                {/* What Didn't Go Well Card */}
                <div
                    className="scrollbar-hide h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 md:p-6"
                    onFocus={() => handleCardFocus("poorItems")}
                    role="region"
                >
                    <div className="mb-4 flex flex-wrap items-center justify-between md:mb-6">
                        <div className="flex items-center justify-evenly whitespace-nowrap">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-100 md:h-8 md:w-8">
                                <X
                                    size={18}
                                    className="text-red-800"
                                    aria-hidden="true"
                                />
                            </div>
                            <h2
                                className="px-2 text-base font-semibold text-gray-900"
                                onFocus={() =>
                                    speak("What Didn't Go Well section")
                                }
                                role="heading"
                                aria-level="2"
                            >
                                What Didn't Go Well
                            </h2>
                        </div>
                        <span
                            className="ml-auto inline-flex items-center rounded-full border bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 md:px-2 md:py-1"
                            onFocus={() =>
                                speak(
                                    `${feedbackData.poorItems.length} items in What Didn't Go Well`
                                )
                            }
                            role="status"
                        >
                            {feedbackData.poorItems.length} items
                        </span>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                        {[...feedbackData.poorItems]
                            .sort((a, b) => b.upvoteCount - a.upvoteCount)
                            .map((item) => (
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
                <div
                    className="scrollbar-hide h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 md:p-6"
                    onFocus={() => handleCardFocus("suggestions")}
                    role="region"
                >
                    <div className="mb-4 flex flex-wrap items-center justify-between md:mb-6">
                        <div className="flex items-center justify-evenly whitespace-nowrap">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 md:h-8 md:w-8">
                                <Lightbulb
                                    size={18}
                                    className="text-blue-800"
                                    aria-hidden="true"
                                />
                            </div>
                            <h2
                                className="px-2 text-base font-semibold text-gray-900"
                                onFocus={() => speak("Suggestions section")}
                                role="heading"
                                aria-level="2"
                            >
                                Suggestions
                            </h2>
                        </div>
                        <span
                            className="ml-auto inline-flex items-center rounded-full border bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 md:px-2 md:py-1"
                            onFocus={() =>
                                speak(
                                    `${feedbackData.suggestions.length} items in Suggestions`
                                )
                            }
                            role="status"
                        >
                            {feedbackData.suggestions.length} items
                        </span>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <div className="space-y-3 md:space-y-4">
                            {[...feedbackData.suggestions]
                                .sort((a, b) => b.upvoteCount - a.upvoteCount)
                                .map((item) => (
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
            </div>

            {/* Summary Statistics */}
            <div
                className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:gap-5 lg:grid-cols-4"
                role="region"
                onFocus={() =>
                    handleStatFocus(
                        "Summary statistics",
                        "Retrospective summary statistics"
                    )
                }
            >
                <div
                    className="px-auto rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6"
                    onFocus={() =>
                        handleStatFocus("Total Feedbacks", getTotalFeedback())
                    }
                    role="status"
                >
                    <div className="mb-1 text-xl font-bold text-green-600 md:mb-2 md:text-2xl">
                        {getTotalFeedback()}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Feedbacks
                    </div>
                </div>
                <div
                    className="px-auto rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6"
                    onFocus={() =>
                        handleStatFocus("Total Comments", getTotalComments())
                    }
                    role="status"
                >
                    <div className="mb-1 text-xl font-bold text-purple-600 md:mb-2 md:text-2xl">
                        {getTotalComments()}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Comments
                    </div>
                </div>
                <div
                    className="px-auto rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6"
                    onFocus={() =>
                        handleStatFocus("Total Upvotes", getTotalUpvotes())
                    }
                    role="status"
                >
                    <div className="mb-1 text-xl font-bold text-sky-600 md:mb-2 md:text-2xl">
                        {getTotalUpvotes()}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                        Upvotes
                    </div>
                </div>
                <div
                    className="px-auto rounded-lg border border-gray-200 bg-white p-3 text-center md:p-6"
                    onFocus={() =>
                        handleStatFocus(
                            "Total Action Items",
                            getTotalActionItems()
                        )
                    }
                    role="status"
                >
                    <div className="mb-1 text-xl font-bold text-pink-600 md:mb-2 md:text-2xl">
                        {getTotalActionItems()}
                    </div>
                    <div className="text-xs whitespace-nowrap text-gray-600 md:text-sm">
                        Action Items
                    </div>
                </div>
            </div>

            {/* Feedback Themes */}
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
                                        disabled={addFeedbackDisabled}
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

            {/* Show Action Items Modal */}
            {actionItemModal && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
                    aria-modal="true"
                >
                    <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
                        <div
                            className="bg-opacity-75 fixed bg-gray-500 transition-opacity"
                            onClick={closeActionItemsModal}
                        ></div>

                        <div className="relative mx-auto w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Action Items
                                </h3>
                                <button
                                    onClick={closeActionItemsModal}
                                    className="text-gray-400 transition-colors hover:text-gray-600"
                                >
                                    <X size={25} className="text-grey-500" />
                                </button>
                            </div>
                            <div className="custom-scrollbar max-h-[60vh] space-y-4 overflow-y-auto pr-2">
                                {[
                                    "What Went Well",
                                    "What Didn't Go Well",
                                    "Suggestions",
                                ].map((category) => {
                                    const items = actionItems
                                        .filter(
                                            (item) => item.category === category
                                        )
                                        .sort(
                                            (a, b) =>
                                                b.actionItemMeta
                                                    .upvotedByUserName.length -
                                                a.actionItemMeta
                                                    .upvotedByUserName.length
                                        );

                                    if (items.length === 0) return null;

                                    const bgColor =
                                        category === "What Went Well"
                                            ? "bg-green-50 border-green-200"
                                            : category === "What Didn't Go Well"
                                              ? "bg-red-50 border-red-200"
                                              : "bg-blue-50 border-blue-200";

                                    return (
                                        <div key={category} className="mb-4">
                                            <h4 className="mb-2 text-sm font-semibold text-gray-800">
                                                {category}
                                            </h4>
                                            <div className="space-y-3">
                                                {items.map((item) => {
                                                    const isUpvotedByUser =
                                                        item.actionItemMeta.upvotedByUserName.includes(
                                                            userInfo._id
                                                        );
                                                    return (
                                                        <div
                                                            key={item._id}
                                                            className={`${bgColor} rounded-md border p-3`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm text-gray-800">
                                                                    {
                                                                        item.message
                                                                    }
                                                                </p>
                                                                <div className="flex items-center">
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleActionItemsUpvote(
                                                                                item._id
                                                                            )
                                                                        }
                                                                    >
                                                                        <ThumbsUp
                                                                            size={
                                                                                15
                                                                            }
                                                                            className={`cursor-pointer transition-colors hover:text-blue-700 ${isUpvotedByUser ? "text-blue-600" : "text-gray-500"}`}
                                                                        />
                                                                    </button>
                                                                    <div className="ml-1 text-xs text-gray-600">
                                                                        {
                                                                            item
                                                                                .actionItemMeta
                                                                                .upvotedByUserName
                                                                                .length
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 text-xs text-gray-600">
                                                                By {item.author}
                                                                {item
                                                                    .actionItemMeta
                                                                    ?.addedByUserName && (
                                                                    <>
                                                                        {" "}
                                                                        • Added
                                                                        by{" "}
                                                                        <strong>
                                                                            {
                                                                                item
                                                                                    .actionItemMeta
                                                                                    .addedByUserName
                                                                            }
                                                                        </strong>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
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
                                                        !newComment.trim() ||
                                                        addCommentDisabled
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
