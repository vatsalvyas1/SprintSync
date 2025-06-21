import React, { useState, useRef, useEffect } from "react";
import RetroSpectives from "./RetroSpectives";
import { ChevronDown } from "lucide-react";

const SprintManageRetroSpectives = () => {
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setShowMain(false);
                setActiveCategory(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dropdownData = {
        Audit: ["Audit-1", "Audit-2", "Audit-3", "Audit-4"],
        Survey: ["Survey-1", "Survey-2", "Survey-3", "Survey-4"],
        SubraSource: [
            "SubraSource-1",
            "SubraSource-2",
            "SubraSource-3",
            "SubraSource-4",
        ],
        MedConnection: [
            "MedConnection-1",
            "MedConnection-2",
            "MedConnection-3",
            "MedConnection-4",
        ],
    };

    const [showMain, setShowMain] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setActiveCategory((prev) => (prev === category ? null : category));
    };

    const [sprintChangeId, setSprintChangeId] = useState("Audit-1");

    return (
        <section className="my-5 sm:mx-2 md:ml-67">
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
                        {sprintChangeId}
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
                                            {dropdownData[category].map(
                                                (item) => (
                                                    <li
                                                        key={item}
                                                        data-value={item}
                                                        className="cursor-pointer px-4 py-1 hover:bg-blue-100"
                                                        onClick={(e) => {
                                                            setSprintChangeId(
                                                                e.target.dataset
                                                                    .value
                                                            );
                                                            setShowMain(false);
                                                        }}
                                                    >
                                                        {item}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <RetroSpectives sprintId={sprintChangeId} />
        </section>
    );
};

export default SprintManageRetroSpectives;
