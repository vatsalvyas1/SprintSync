import React, { useState, useRef, useEffect } from "react";
import RetroSpectives from "./RetroSpectives";
import { ChevronDown, Plus, X } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../../constant";

const api = axios.create({
    baseURL: `${backendUrl}/api/v1/retrospectives/`,
    withCredentials: true,
});

const SprintManageRetroSpectives = () => {
    const [userInfo, setUserInfo] = useState(null);
    const dropdownRef = useRef(null);
    const [showMain, setShowMain] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [sprintId, setSprintId] = useState(null);
    const [sprintModal, setSprintModal] = useState(false);
    const [sprintData, setSprintData] = useState([]);
    const [newSprintData, setNewSprintData] = useState({
        sprintName: "",
        projectName: "Audit",
        createdBy: "",
    });
    const [addSprintDisabled, setAddSprintDisabled] = useState(false);
    const [activeSprintName, setActiveSprintName] = useState("Sprint");
    const [isLoading, setIsLoading] = useState(true);

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

        const fetchSprints = async () => {
            try {
                const res = await api.get("/get-all-sprint");
                const sprints = res?.data?.data || [];
                setSprintData(sprints);
                if (sprints.length > 0) {
                    setSprintId(sprints[0]._id);
                    setActiveSprintName(sprints[0].sprintName);
                }
            } catch (error) {
                console.error("Error fetching sprints", error);
            } finally {
                setIsLoading(false);
            }
        };

        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setShowMain(false);
                setActiveCategory(null);
            }
        };

        fetchUserInfo();
        fetchSprints();

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dropdownData = {
        Audit: [],
        Survey: [],
        SubroSource: [],
        MedConnection: [],
    };

    const handleCategoryClick = (category) => {
        setActiveCategory((prev) => (prev === category ? null : category));
    };

    const openSprintModal = () => {
        setSprintModal(true);
    };

    const closeSprintModal = () => {
        setNewSprintData({
            sprintName: "",
            projectName: "",
            createdBy: "",
        });
        setSprintModal(false);
    };

    const handleSubmitSprint = async () => {
        if (!newSprintData.sprintName.trim()) return;

        const sprint = {
            sprintName: newSprintData.sprintName,
            projectName: newSprintData.projectName,
            createdBy: userInfo.name,
        };
        try {
            setAddSprintDisabled(() => true);
            const res = await api.post("/add-sprint", {
                sprintName: newSprintData.sprintName,
                projectName: newSprintData.projectName,
                createdBy: userInfo.name,
            });
            sprint._id = res.data.data._id;
            setSprintData((prev) => [...prev, sprint]);
            setAddSprintDisabled(() => false);
            closeSprintModal(true);
        } catch (error) {}
    };

    // if (isLoading) {
    //     return <section>Loading...</section>;
    // }

    // if (!sprintData || sprintData.length === 0) {
    //     return <section>No Sprint Present</section>;
    // }

    return (
        <section className="my-5 px-4 sm:mx-2 md:ml-67">
            {/* Header */}
            <div className="mx-auto flex items-center justify-between">
                <div>
                    <div className="mb-1 text-xl font-bold text-gray-900 md:mb-2 lg:text-2xl">
                        Sprint Retro Board
                    </div>
                    <div className="hidden text-sm text-gray-600 sm:block">
                        Collect and track retrospective feedback
                    </div>
                </div>
                {/*Dropdown*/}
                <div ref={dropdownRef}>
                    <button
                        onClick={() => setShowMain(!showMain)}
                        className="mx-auto w-[110px] rounded-xl border-1 bg-white py-2 text-xs font-medium whitespace-nowrap text-gray-600 hover:text-blue-700 sm:w-[200px] sm:text-base"
                    >
                        {activeSprintName}
                    </button>
                    {showMain && (
                        <ul className="absolute z-10 mt-2 -ml-25 w-52 rounded border border-gray-200 bg-white text-xs shadow-lg sm:-ml-2 sm:text-base">
                            {Object.keys(dropdownData).map((category) => (
                                <li key={category}>
                                    <button
                                        onClick={() =>
                                            handleCategoryClick(category)
                                        }
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                    >
                                        <span className="flex items-center justify-between">
                                            {category}{" "}
                                            <ChevronDown
                                                size={15}
                                                className="text-gray-600"
                                            />
                                        </span>
                                    </button>
                                    {activeCategory === category && (
                                        <ul className="custom-scrollbar m-2 h-[100px] overflow-y-auto rounded border-gray-300 bg-gray-50 p-1 text-xs shadow-inner sm:text-base">
                                            {sprintData
                                                .filter(
                                                    (item) =>
                                                        item.projectName ===
                                                        activeCategory
                                                )
                                                .map((item) => (
                                                    <li
                                                        key={item._id}
                                                        data-value={item._id}
                                                        title={`Created By - ${item.createdBy}`}
                                                        className={`cursor-pointer px-4 py-1 ${sprintId === item._id ? "rounded-full bg-blue-600 py-2 text-white" : "bg-gray-50 text-black hover:bg-blue-100"}`}
                                                        onClick={() => {
                                                            setSprintId(
                                                                item._id
                                                            );
                                                            setActiveSprintName(
                                                                item.sprintName
                                                            );
                                                            setShowMain(false);
                                                        }}
                                                    >
                                                        {item.sprintName}
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                            <button
                                onClick={openSprintModal}
                                className="my-1 flex w-full cursor-pointer items-center justify-between rounded-full bg-blue-600 px-4 py-2 text-left text-white hover:border-2 hover:border-blue-600 hover:bg-white hover:font-medium hover:text-blue-600"
                            >
                                Add Sprint
                                <Plus
                                    size={15}
                                    // className="text-white"
                                />
                            </button>
                        </ul>
                    )}
                </div>
            </div>
            <RetroSpectives sprintId={sprintId} />
            {/* Add sprint Modal */}
            {sprintModal && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
                    aria-modal="true"
                >
                    <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
                        <div
                            className="bg-opacity-75 fixed bg-gray-500 transition-opacity"
                            onClick={closeSprintModal}
                        ></div>

                        <div className="relative mx-auto w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Add Sprint
                                </h3>
                                <button
                                    onClick={closeSprintModal}
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
                                        value={newSprintData.projectName}
                                        onChange={(e) =>
                                            setNewSprintData((prev) => ({
                                                ...prev,
                                                projectName: e.target.value,
                                            }))
                                        }
                                    >
                                        <option>Audit</option>
                                        <option>Survey</option>
                                        <option>SubraSource</option>
                                        <option>MedConnection</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Sprint Name
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        rows="1"
                                        autoFocus
                                        placeholder="Enter Sprint (e.g., SPRINT-25)"
                                        value={newSprintData.sprintName}
                                        onChange={(e) =>
                                            setNewSprintData((prev) => ({
                                                ...prev,
                                                sprintName: e.target.value,
                                            }))
                                        }
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6">
                                    <button
                                        type="button"
                                        onClick={closeSprintModal}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmitSprint}
                                        disabled={addSprintDisabled}
                                        className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                    >
                                        Add Sprint
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SprintManageRetroSpectives;
