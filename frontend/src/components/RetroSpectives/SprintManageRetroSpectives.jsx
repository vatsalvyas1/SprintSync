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
    const [selectedProject, setSelectedProject] = useState(null);
    const [sprintId, setSprintId] = useState(null);
    const [sprintModal, setSprintModal] = useState(false);
    const [sprintData, setSprintData] = useState([]);
    const [newSprintData, setNewSprintData] = useState({
        sprintName: "",
        projectName: "Audit",
        createdBy: "",
    });
    const [addSprintDisabled, setAddSprintDisabled] = useState(false);
    const [activeSprintName, setActiveSprintName] = useState("");

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
                
            } catch (error) {
                console.error("Error fetching sprints", error);
            } 
        };

        fetchUserInfo();
        fetchSprints();
    }, []);

    const projectData = {
        Audit: {
            name: "Audit",
            svg: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1751313879/audit_u1ijxn.svg"
        },
        Survey: {
            name: "Survey",
            svg: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1751313879/survey_czxocx.svg"
        },
        SubroSource: {
            name: "SubroSource",
            svg: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1751313879/subrosource_gzurvy.svg"
        },
        MedConnection: {
            name: "MedConnection",
            svg: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1751313879/medconnection_t9bdx0.svg"
        },
    };

    const handleProjectSelect = (projectName) => {
        setSelectedProject(projectName);
        setSprintId(null);
        setActiveSprintName("");
    };

    const handleSprintSelect = (sprint) => {
        setSprintId(sprint._id);
        setActiveSprintName(sprint.sprintName);
    };

    const openSprintModal = () => {
        setSprintModal(true);
    };

    const closeSprintModal = () => {
        setNewSprintData({
            sprintName: "",
            projectName: "Audit",
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
            closeSprintModal();
        } catch (error) {
            setAddSprintDisabled(() => false);
        }
    };

    const handleBackToProjects = () => {
        setSelectedProject(null);
        setSprintId(null);
        setActiveSprintName("");
    };

    return (
        <section className="my-5 px-4 sm:mx-2 md:ml-67">
            {/* Header */}
            <div className="mx-auto flex items-center justify-between mb-6">
                <div>
                    <div className="mb-1 text-xl font-bold text-gray-900 md:mb-2 lg:text-2xl">
                        Sprint Retro Board
                    </div>
                    <div className="hidden text-sm text-gray-600 sm:block">
                        Collect and track retrospective feedback
                    </div>
                </div>
                
                {/* Add Sprint Button - Always visible */}
                <button
                    onClick={openSprintModal}
                    className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Sprint
                </button>
            </div>

            {/* Project Selection Cards */}
            {!selectedProject && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto mt-8">
                    {Object.entries(projectData).map(([key, project]) => (
                        <div
                            key={key}
                            onClick={() => handleProjectSelect(key)}
                            className="bg-white rounded-xl border border-gray-200 p-8 cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all duration-200 text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <img 
                                    src={project.svg} 
                                    alt={project.name}
                                    className="w-36 h-36 object-contain"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {project.name}
                            </h3>
                            <p className="text-base text-gray-600">
                                {sprintData.filter(sprint => sprint.projectName === key).length} sprints
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Sprint Selection for Selected Project */}
            {selectedProject && !sprintId && (
                <div className="mt-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={handleBackToProjects}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to Projects
                        </button>
                        <div className="flex items-center gap-3">
                            <img 
                                src={projectData[selectedProject].svg} 
                                alt={selectedProject}
                                className="w-8 h-8 object-contain"
                            />
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedProject} Sprints
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sprintData
                            .filter(sprint => sprint.projectName === selectedProject)
                            .map((sprint) => (
                                <div
                                    key={sprint._id}
                                    onClick={() => handleSprintSelect(sprint)}
                                    className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                                >
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {sprint.sprintName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Created by: {sprint.createdBy}
                                    </p>
                                </div>
                            ))}
                    </div>

                    {sprintData.filter(sprint => sprint.projectName === selectedProject).length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No sprints found for {selectedProject}</p>
                            <p className="text-gray-400 text-sm mt-2">Click "Add Sprint" to create your first sprint</p>
                        </div>
                    )}
                </div>
            )}

            {/* Active Sprint Display */}
            {sprintId && (
                <div className="mt-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => {
                                setSprintId(null);
                                setActiveSprintName("");
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to {selectedProject} Sprints
                        </button>
                        <div className="flex items-center gap-3">
                            <img 
                                src={projectData[selectedProject].svg} 
                                alt={selectedProject}
                                className="w-8 h-8 object-contain"
                            />
                            <h2 className="text-xl font-bold text-gray-900">
                                {activeSprintName}
                            </h2>
                        </div>
                    </div>
                    <RetroSpectives sprintId={sprintId} />
                </div>
            )}

            {/* Add sprint Modal */}
            {sprintModal && (
                <div
                    className="fixed inset-0 z-40 overflow-y-auto "
                    aria-modal="true"
                >
                    <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                            onClick={closeSprintModal}
                        ></div>

                        <div className="relative mx-auto w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all z-10">
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
                                        <option>SubroSource</option>
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
                                        className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
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