import React, { useState, useRef, useEffect } from "react";
import RetroSpectives from "./RetroSpectives";
import { ArrowLeft, ChevronDown, Plus, X } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../../constant";

const api = axios.create({
    baseURL: `${backendUrl}/api/v1/retrospectives/`,
    withCredentials: true,
});

const SprintManageRetroSpectives = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [sprintId, setSprintId] = useState(null);
    const [sprintModal, setSprintModal] = useState(false);
    const [sprintData, setSprintData] = useState([]);
    const [newSprintData, setNewSprintData] = useState({
        sprintName: "",
        projectName: "Audit",
        teamName: "Diva",
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

    const processData = {
        OSI: {
            name: "OSI",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384911/undraw_idea_hz8b_idy9d5.svg",
        },
        Trumbull: {
            name: "Trumbull",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384911/undraw_web-app_141a_v3f1ol.svg",
        },
    };

    const projectData = {
        Audit: {
            name: "Audit",
            svg: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1751313879/audit_u1ijxn.svg",
            processName: "OSI",
        },
        Survey: {
            name: "Survey",
            svg: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1751313879/survey_czxocx.svg",
            processName: "OSI",
        },
        SubroSource: {
            name: "SubroSource",
            svg: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1751313879/subrosource_gzurvy.svg",
            processName: "Trumbull",
        },
        MedConnection: {
            name: "MedConnection",
            svg: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1751313879/medconnection_t9bdx0.svg",
            processName: "Trumbull",
        },
    };

    const teamData = {
        Diva: {
            name: "Diva",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384911/undraw_terms_sx63_mwe40h.svg",
            projectName: "Audit",
        },
        Pandora: {
            name: "Pandora",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384911/undraw_screen-time_f7ev_nq4vuj.svg",
            projectName: "Audit",
        },
        X: {
            name: "X",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384910/undraw_online-banking_l9sn_bw4l2f.svg",
            projectName: "Survey",
        },
        Y: {
            name: "Y",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384910/undraw_financial-data_lbci_yxxjkj.svg",
            projectName: "Survey",
        },
        SFO: {
            name: "SFO",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751387171/undraw_live-collaboration_i8an_h4jco1.svg",
            projectName: "Survey",
        },
        Platform: {
            name: "Platform",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384909/undraw_launch-event_aur1_hlqpy2.svg",
            projectName: "SubroSource",
        },
        CS: {
            name: "CS",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384908/undraw_data-points_uc3j_ljgv46.svg",
            projectName: "SubroSource",
        },
        SP: {
            name: "SP",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384908/undraw_ideas_vn7a_ghq79x.svg",
            projectName: "SubroSource",
        },
        MCM: {
            name: "MCM",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384909/undraw_approved-wireframe_odf4_l55hjg.svg",
            projectName: "MedConnection",
        },
        RR: {
            name: "RR",
            svg: "https://res.cloudinary.com/dlpxhfhax/image/upload/v1751384909/undraw_document-analysis_3c0y_xdge8m.svg",
            projectName: "MedConnection",
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
            teamName: "Diva",
            createdBy: "",
        });
        setSprintModal(false);
    };

    const handleSubmitSprint = async () => {
        if (!newSprintData.sprintName.trim()) return;

        const sprint = {
            sprintName: newSprintData.sprintName,
            projectName: newSprintData.projectName,
            teamName: newSprintData.teamName,
            createdBy: userInfo.name,
        };
        try {
            setAddSprintDisabled(() => true);
            const res = await api.post("/add-sprint", {
                sprintName: newSprintData.sprintName,
                projectName: newSprintData.projectName,
                teamName: newSprintData.teamName,
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
        setSelectedTeam(null);
        setSprintId(null);
        setActiveSprintName("");
    };

    const handleBackToTeams = () => {
        setSelectedTeam(null);
        setSprintId(null);
        setActiveSprintName("");
    };

    const handleBackToProcess = () => {
        setSelectedProject(null);
        setSelectedProcess(null);
        setSprintId(null);
        setActiveSprintName("");
    };

    const handleBackToSprints = () => {
        setSprintId(null);
        setActiveSprintName("");
    };

    const handleProcessSelect = (processName) => {
        setSelectedProcess(processName);
        setSelectedProject("");
        setSprintId("");
        setActiveSprintName("");
    };

    const handleTeamSelect = (teamName) => {
        setSelectedTeam(teamName);
        setSprintId("");
    };

    return (
        <section className="my-5 px-4 sm:mx-2 md:ml-67">
            {/* Header */}
            <div className="mx-auto mb-6 flex items-center justify-between">
                <div>
                    <div className="mb-1 text-xl font-bold text-gray-900 md:mb-2 lg:text-2xl">
                        Sprint Retro Board [IPS]
                    </div>
                    <div className="hidden text-sm text-gray-600 sm:block">
                        Collect and track retrospective feedback
                    </div>
                </div>

                {/* Add Sprint Button - Always visible */}
                <button
                    onClick={openSprintModal}
                    className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Sprint
                </button>
            </div>

            {/* Process Selection Cards */}
            {!selectedProcess && (
                <div className="mx-auto mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                    {Object.entries(processData).map(([key, process]) => (
                        <div
                            key={key}
                            onClick={() => handleProcessSelect(key)}
                            className="cursor-pointer rounded-xl border-2 border-gray-200 bg-white text-center transition-all duration-200 hover:border-blue-300 hover:shadow-xl"
                        >
                            <div className="my-5">
                                <img
                                    src={process.svg}
                                    alt={process.name}
                                    draggable={false}
                                    className="mx-auto h-36 w-36"
                                />
                            </div>
                            <h3 className="mb-5 text-xl font-medium text-gray-900">
                                {process.name}
                            </h3>
                        </div>
                    ))}
                </div>
            )}

            {/* Project Selection Cards */}
            {selectedProcess && !selectedProject && (
                <div className="mt-6">
                    <div
                        onClick={handleBackToProcess}
                        className="relative flex w-full items-center justify-center border border-transparent font-medium text-blue-600"
                    >
                        <button className="absolute left-0 flex items-center px-2 py-1 transition-all duration-200 hover:rounded-full hover:bg-red-500 hover:text-blue-800 hover:text-white">
                            <ArrowLeft size={15} />
                            &nbsp;Back to Process
                        </button>

                        <div className="text-center font-medium text-black">
                            {selectedProcess}
                        </div>
                    </div>
                    <div className="mx-auto mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        {Object.entries(projectData)
                            .filter(
                                ([key, project]) =>
                                    project.processName === selectedProcess
                            )
                            .map(([key, project]) => (
                                <div
                                    key={key}
                                    onClick={() => handleProjectSelect(key)}
                                    className="cursor-pointer rounded-xl border border-gray-200 bg-white p-8 text-center transition-all duration-200 hover:border-blue-300 hover:shadow-xl"
                                >
                                    {" "}
                                    <div className="mb-6 flex justify-center">
                                        <img
                                            src={project.svg}
                                            alt={project.name}
                                            draggable={false}
                                            className="h-36 w-36 object-contain"
                                        />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                                        {project.name}
                                    </h3>
                                    <p className="text-base text-gray-600">
                                        {
                                            sprintData.filter(
                                                (sprint) =>
                                                    sprint.projectName === key
                                            ).length
                                        }{" "}
                                        sprints
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Team Selection */}
            {selectedProcess && selectedProject && !selectedTeam && (
                <div className="mt-6">
                    <div
                        
                        className="relative flex w-full items-center justify-center border border-transparent font-medium text-blue-600"
                    >
                        <button onClick={handleBackToProjects} className="absolute left-0 flex items-center px-2 py-1 transition-all duration-200 hover:rounded-full hover:bg-red-500 hover:text-blue-800 hover:text-white">
                            <ArrowLeft size={15} />
                            &nbsp;Back to Projects
                        </button>

                        <div className="text-center font-medium text-black">
                            {selectedProject}
                        </div>
                    </div>

                    <div className="mx-auto mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        {Object.entries(teamData)
                            .filter(
                                ([_, team]) =>
                                    team.projectName === selectedProject
                            )
                            .map(([key, team]) => (
                                <div
                                    key={key}
                                    onClick={() => handleTeamSelect(key)}
                                    className="cursor-pointer rounded-xl border border-gray-200 bg-white p-8 text-center transition-all duration-200 hover:border-blue-300 hover:shadow-xl"
                                >
                                    <div className="mb-6 flex justify-center">
                                        <img
                                            src={team.svg}
                                            alt={team.name}
                                            draggable={false}
                                            className="h-36 w-36 object-contain"
                                        />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                                        {team.name}
                                    </h3>
                                    <p className="text-base text-gray-600">
                                        {
                                            sprintData.filter(
                                                (sprint) =>
                                                    sprint.projectName ===
                                                        selectedProject &&
                                                    sprint.teamName === key
                                            ).length
                                        }{" "}
                                        sprints
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Sprint Selection for Selected Project */}
            {selectedProcess &&
                selectedProject &&
                selectedTeam &&
                !sprintId && (
                    <div className="mt-6">
                        <div
                            onClick={handleBackToTeams}
                            className="relative flex w-full items-center justify-center border border-transparent font-medium text-blue-600"
                        >
                            <button className="absolute left-0 flex items-center px-2 py-1 transition-all duration-200 hover:rounded-full hover:bg-red-500 hover:text-blue-800 hover:text-white">
                                <ArrowLeft size={15} />
                                &nbsp;Back to Teams
                            </button>

                            <div className="text-center font-medium text-black">
                                {selectedTeam}
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {sprintData
                                .filter(
                                    (sprint) =>
                                        sprint.projectName ===
                                            selectedProject &&
                                        sprint.teamName === selectedTeam
                                )
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((sprint) => (
                                    <div
                                        key={sprint._id}
                                        onClick={() =>
                                            handleSprintSelect(sprint)
                                        }
                                        className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                                    >
                                        <h3 className="mb-2 font-semibold text-gray-900">
                                            {sprint.sprintName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Created by: {sprint.createdBy}
                                        </p>
                                    </div>
                                ))}
                        </div>

                        {sprintData.filter(
                            (sprint) =>
                                sprint.projectName === selectedProject &&
                                sprint.teamName === selectedTeam
                        ).length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-lg text-gray-500">
                                    No sprints found for {selectedProject}
                                </p>
                                <p className="mt-2 text-sm text-gray-400">
                                    Click "Add Sprint" to create your first
                                    sprint
                                </p>
                            </div>
                        )}
                    </div>
                )}

            {/* Active Sprint Display */}
            {sprintId && (
                <div className="mt-6">
                    <div
                        onClick={handleBackToSprints}
                        className="relative flex w-full items-center justify-center border border-transparent font-medium text-blue-600"
                    >
                        <button className="absolute left-0 flex items-center px-2 py-1 transition-all duration-200 hover:rounded-full hover:bg-red-500 hover:text-blue-800 hover:text-white">
                            <ArrowLeft size={15} />
                            &nbsp;Back to Sprints
                        </button>

                        <div className="text-center font-medium text-black">
                            {activeSprintName}
                        </div>
                    </div>
                    <RetroSpectives sprintId={sprintId} />
                </div>
            )}

            {/* Add sprint Modal */}
            {sprintModal && (
                <div
                    className="fixed inset-0 z-40 overflow-y-auto"
                    aria-modal="true"
                > 
                    <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                            onClick={closeSprintModal}
                        ></div>

                        <div className="relative z-10 mx-auto w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all">
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
                                        Sprint Name
                                    </label>
                                    <textarea
                                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                        Category
                                    </label>
                                    <select
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={newSprintData.teamName}
                                        onChange={(e) =>
                                            setNewSprintData((prev) => ({
                                                ...prev,
                                                teamName: e.target.value,
                                            }))
                                        }
                                    >
                                        {Object.entries(teamData)
                                            .filter(
                                                ([_, team]) =>
                                                    team.projectName ===
                                                    newSprintData.projectName
                                            )
                                            .map(([key, _]) => (
                                                <option value={key}>
                                                    {key}
                                                </option>
                                            ))}
                                    </select>
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
