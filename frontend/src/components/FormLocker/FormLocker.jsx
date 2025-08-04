import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import AddForm from "../User/AddForm";
import { backendUrl } from "../../constant";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

function FormLocker() {
    const [isOpen, setIsOpen] = useState(false);
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const { speak, announce } = useAccessibility();

    // Helper function to format date and time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        const dateToCheck = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        const diffTime = today.getTime() - dateToCheck.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let dateLabel;
        if (diffDays === 0) {
            dateLabel = "Today";
        } else if (diffDays === 1) {
            dateLabel = "Yesterday";
        } else if (diffDays < 7) {
            dateLabel = `${diffDays} days ago`;
        } else {
            dateLabel = date.toLocaleDateString();
        }

        const timeLabel = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        return `${dateLabel} at ${timeLabel}`;
    };

    const fetchForms = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/v1/form/`);
            const data = await res.json();
            setForms(data);
        } catch (err) {
            setError("Failed to fetch forms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
        const interval = setInterval(fetchForms, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleFormAdded = () => {
        fetchForms();
        setIsOpen(false);
    };

    const totalForms = forms.length;
    const lockedFormsCount = forms.filter((form) => form.isLocked).length;
    const availableFormsCount = forms.filter((form) => !form.isLocked).length;

    const handleCheckOut = async (formId) => {
        try {
            await fetch(`${backendUrl}/api/v1/form/${formId}/lock`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUser._id }),
            });
            fetchForms();
        } catch (err) {
            alert("Failed to lock the form.");
        }
    };

    const handleCheckIn = async (formId) => {
        try {
            await fetch(`${backendUrl}/api/v1/form/${formId}/unlock`, {
                method: "PATCH",
            });
            fetchForms();
        } catch (err) {
            alert("Failed to unlock the form.");
        }
    };

    // Accessibility handlers
    const handleSectionFocus = (sectionName) => {
        speak(`${sectionName} section`);
    };

    const handleButtonFocus = (buttonName) => {
        speak(`${buttonName} button`);
    };

    const handleFormFocus = (form) => {
        const status = form.isLocked
            ? form.lockedBy?._id === loggedInUser._id
                ? "checked out by you"
                : `locked by ${form.lockedBy?.name}`
            : "available";
        speak(`Form: ${form.formName}, status: ${status}`);
    };

    const handleStatFocus = (statName, value) => {
        speak(`${statName}: ${value}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="block min-h-screen bg-gray-50 p-6 md:ml-64">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1
                        className="mb-2 text-3xl font-bold text-gray-900"
                        onFocus={() => handleSectionFocus("Header")}
                    >
                        Form Locker
                    </h1>
                    <p className="text-gray-600">
                        Prevent multiple devs working on same form
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">
                            Real-time updates
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        onFocus={() => handleButtonFocus("Add New Form")}
                    >
                        <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            ></path>
                        </svg>
                        Add New Form
                    </button>
                </div>
            </div>

            {/* Modal */}
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-xs">
                        <AddForm
                            onFormAdded={handleFormAdded}
                            onCancel={() => setIsOpen(false)}
                        />
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Status Overview Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div
                    className="rounded-lg border border-gray-200 bg-white p-6 text-center"
                    onFocus={() => handleSectionFocus("Status Overview")}
                >
                    <div
                        className="mb-2 text-2xl font-bold text-red-600"
                        onFocus={() =>
                            handleStatFocus(
                                "Currently Locked",
                                lockedFormsCount
                            )
                        }
                    >
                        {lockedFormsCount}
                    </div>
                    <div className="text-sm text-gray-600">
                        Currently Locked
                    </div>
                </div>
                <div
                    className="rounded-lg border border-gray-200 bg-white p-6 text-center"
                    onFocus={() => handleSectionFocus("Status Overview")}
                >
                    <div
                        className="mb-2 text-2xl font-bold text-green-600"
                        onFocus={() =>
                            handleStatFocus("Available", availableFormsCount)
                        }
                    >
                        {availableFormsCount}
                    </div>
                    <div className="text-sm text-gray-600">Available</div>
                </div>
                <div
                    className="rounded-lg border border-gray-200 bg-white p-6 text-center"
                    onFocus={() => handleSectionFocus("Status Overview")}
                >
                    <div
                        className="mb-2 text-2xl font-bold text-blue-600"
                        onFocus={() =>
                            handleStatFocus("Total Forms", totalForms)
                        }
                    >
                        {totalForms}
                    </div>
                    <div className="text-sm text-gray-600">Total Forms</div>
                </div>
            </div>

            {/* Form List */}
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <h2
                            className="text-lg font-semibold text-gray-900"
                            onFocus={() => handleSectionFocus("Form List")}
                        >
                            Form Status Dashboard
                        </h2>
                        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search forms..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-64"
                                />
                                <svg
                                    className="absolute top-2.5 left-3 h-4 w-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    ></path>
                                </svg>
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-auto"
                            >
                                <option value="All">All Forms</option>
                                <option value="Available">Available</option>
                                <option value="Locked">Locked</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {forms
                        .filter((form) => {
                            const matchesSearch = form.formName
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase());

                            const matchesFilter =
                                filterStatus === "All"
                                    ? true
                                    : filterStatus === "Locked"
                                      ? form.isLocked
                                      : !form.isLocked;

                            return matchesSearch && matchesFilter;
                        })
                        .map((form) => {
                            const isLockedByMe =
                                form.lockedBy?._id === loggedInUser._id;
                            const isLocked = form.isLocked;

                            // Updated logic
                            const checkOutDisabled = isLocked; // disabled for *everyone* if locked
                            const checkInDisabled = !isLockedByMe; // only user who locked can check in

                            return (
                                <div
                                    key={form._id}
                                    className={`p-4 transition-colors hover:bg-gray-50 sm:p-6 ${isLockedByMe ? "bg-blue-50" : ""}`}
                                    onFocus={() => handleFormFocus(form)}
                                >
                                    {/* Mobile Layout */}
                                    <div className="block sm:hidden">
                                        <div className="mb-3 flex items-center space-x-3">
                                            <div
                                                className={`h-3 w-3 flex-shrink-0 rounded-full ${
                                                    isLockedByMe
                                                        ? "bg-blue-500"
                                                        : isLocked
                                                          ? "bg-red-500"
                                                          : "bg-green-500"
                                                }`}
                                            ></div>
                                            <h3 className="min-w-0 flex-1 text-lg font-medium text-gray-900">
                                                {form.formName}
                                            </h3>
                                        </div>

                                        <div className="mb-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    isLockedByMe
                                                        ? "bg-blue-100 text-blue-800"
                                                        : isLocked
                                                          ? "bg-red-100 text-red-800"
                                                          : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {isLockedByMe
                                                    ? "🔵 Checked out by you"
                                                    : isLocked
                                                      ? "🔴 Locked"
                                                      : "🟢 Available"}
                                            </span>
                                        </div>

                                        <div className="mb-4 space-y-2">
                                            {form.description && (
                                                <div className="text-sm text-gray-600">
                                                    {form.description}
                                                </div>
                                            )}
                                            {form.isLocked && (
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-600">
                                                        Checked out by{" "}
                                                        {form.lockedBy?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {formatDateTime(
                                                            form.lockedAt
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {form.notes && (
                                                <div className="text-sm text-gray-400 italic">
                                                    {form.notes}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                            <button
                                                className={`inline-flex w-full items-center justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors ${
                                                    checkOutDisabled
                                                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                                disabled={checkOutDisabled}
                                                onClick={() =>
                                                    handleCheckOut(form._id)
                                                }
                                                onFocus={() =>
                                                    handleButtonFocus(
                                                        "Check Out"
                                                    )
                                                }
                                            >
                                                <svg
                                                    className="mr-1 h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                    ></path>
                                                </svg>
                                                Check Out
                                            </button>

                                            {isLockedByMe && (
                                                <button
                                                    className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                                    onClick={() =>
                                                        handleCheckIn(form._id)
                                                    }
                                                    onFocus={() =>
                                                        handleButtonFocus(
                                                            "Check In"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        className="mr-1 h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                                        ></path>
                                                    </svg>
                                                    Check In
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden items-center justify-between sm:flex">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className={`h-3 w-3 rounded-full ${
                                                    isLockedByMe
                                                        ? "bg-blue-500"
                                                        : isLocked
                                                          ? "bg-red-500"
                                                          : "bg-green-500"
                                                }`}
                                            ></div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {form.formName}
                                                    </h3>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                            isLockedByMe
                                                                ? "bg-blue-100 text-blue-800"
                                                                : isLocked
                                                                  ? "bg-red-100 text-red-800"
                                                                  : "bg-green-100 text-green-800"
                                                        }`}
                                                    >
                                                        {isLockedByMe
                                                            ? "🔵 Checked out by you"
                                                            : isLocked
                                                              ? "🔴 Locked"
                                                              : "🟢 Available"}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center space-x-4">
                                                    {form.description && (
                                                        <span className="text-sm text-gray-600">
                                                            {form.description}
                                                        </span>
                                                    )}
                                                    {form.isLocked && (
                                                        <>
                                                            <span className="text-sm text-gray-600">
                                                                Checked out by{" "}
                                                                {
                                                                    form
                                                                        .lockedBy
                                                                        ?.name
                                                                }
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {formatDateTime(
                                                                    form.lockedAt
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                    {form.notes && (
                                                        <span className="text-sm text-gray-400 italic">
                                                            {form.notes}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className={`inline-flex items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium transition-colors ${
                                                    checkOutDisabled
                                                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                                disabled={checkOutDisabled}
                                                onClick={() =>
                                                    handleCheckOut(form._id)
                                                }
                                                onFocus={() =>
                                                    handleButtonFocus(
                                                        "Check Out"
                                                    )
                                                }
                                            >
                                                <svg
                                                    className="mr-1 h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                    ></path>
                                                </svg>
                                                Check Out
                                            </button>

                                            {isLockedByMe && (
                                                <button
                                                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                                    onClick={() =>
                                                        handleCheckIn(form._id)
                                                    }
                                                    onFocus={() =>
                                                        handleButtonFocus(
                                                            "Check In"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        className="mr-1 h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                                        ></path>
                                                    </svg>
                                                    Check In
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default FormLocker;
