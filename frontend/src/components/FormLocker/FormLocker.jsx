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
            speak('Checking out form');
            await fetch(`${backendUrl}/api/v1/form/${formId}/lock`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUser._id }),
            });
            fetchForms();
            announce('Form checked out successfully');
        } catch (err) {
            alert("Failed to lock the form.");
            announce('Failed to check out form');
        }
    };

    const handleCheckIn = async (formId) => {
        try {
            speak('Checking in form');
            await fetch(`${backendUrl}/api/v1/form/${formId}/unlock`, {
                method: "PATCH",
            });
            fetchForms();
            announce('Form checked in successfully');
        } catch (err) {
            alert("Failed to unlock the form.");
            announce('Failed to check in form');
        }
    };

    // Announce form count changes
    useEffect(() => {
        if (!loading && forms.length > 0) {
            const lockedCount = forms.filter((form) => form.isLocked).length;
            const availableCount = forms.filter((form) => !form.isLocked).length;
            announce(`Form status updated: ${lockedCount} locked, ${availableCount} available, ${forms.length} total forms`);
        }
    }, [forms, loading, announce]);

    // Accessibility handlers
    const handleSectionFocus = (sectionName) => {
        speak(`${sectionName} section`);
    };

    const handleButtonFocus = (buttonName) => {
        speak(`${buttonName} button`);
    };

    const handleFormFocus = (form) => {
        const status = form.isLocked 
            ? (form.lockedBy?._id === loggedInUser._id ? "checked out by you" : `locked by ${form.lockedBy?.name}`)
            : "available";
        speak(`Form: ${form.formName}, status: ${status}`);
    };

    const handleStatFocus = (statName, value) => {
        speak(`${statName}: ${value}`);
    };

    if (loading) return (
        <div 
            className="min-h-screen bg-gray-50 p-6 block md:ml-64 flex items-center justify-center"
            role="status"
            aria-label="Loading forms"
            tabIndex={0}
            onFocus={() => speak('Loading forms')}
        >
            <div className="text-lg text-gray-800">Loading...</div>
        </div>
    );
    
    if (error) return (
        <div 
            className="min-h-screen bg-gray-50 p-6 block md:ml-64 flex items-center justify-center"
            role="alert"
            aria-label="Error loading forms"
            tabIndex={0}
            onFocus={() => speak('Error loading forms')}
        >
            <div className="text-lg text-red-800">{error}</div>
        </div>
    );

    return (
        <main 
            className="min-h-screen bg-gray-50 p-6 block md:ml-64"
            role="main"
            aria-label="Form Locker Dashboard"
        >
            {/* Header */}
            <header 
                className="flex items-center justify-between mb-8"
                role="banner"
                tabIndex={0}
                onFocus={() => handleSectionFocus('Form Locker Header')}
            >
                <div>
                    <h1 
                        className="text-3xl font-bold text-black mb-2" 
                        tabIndex={0}
                        onFocus={() => speak('Form Locker dashboard')}
                    >
                        Form Locker
                    </h1>
                    <p 
                        className="text-gray-800"
                        tabIndex={0}
                        onFocus={() => speak('Prevent multiple developers working on same form')}
                        role="text"
                    >
                        Prevent multiple devs working on same form
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div 
                        className="flex items-center space-x-2"
                        tabIndex={0}
                        onFocus={() => speak('Real-time updates active')}
                        role="status"
                        aria-label="Real-time updates status"
                    >
                        <div className="w-3 h-3 bg-green-500 rounded-full" aria-hidden="true"></div>
                        <span className="text-sm text-gray-800">Real-time updates</span>
                    </div>
                    <button
                        onClick={() => {
                            setIsOpen(true);
                            speak('Opening add new form dialog');
                            announce('Add new form dialog opened');
                        }}
                        onFocus={() => handleButtonFocus('Add New Form')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsOpen(true);
                                speak('Opening add new form dialog');
                                announce('Add new form dialog opened');
                            }
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors"
                        aria-label="Add new form"
                        tabIndex={0}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        Add New Form
                    </button>
                </div>
            </header>

            {/* Modal */}
            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    speak('Add form dialog closed');
                }}
                className="relative z-50"
                aria-labelledby="add-form-title"
                aria-describedby="add-form-description"
            >
                <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-xs">
                        <AddForm
                            onFormAdded={() => {
                                fetchForms();
                                setIsOpen(false);
                                announce('New form added successfully');
                            }}
                            onCancel={() => {
                                setIsOpen(false);
                                speak('Add form dialog cancelled');
                            }}
                        />
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Status Overview Cards */}
            <section 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                role="region"
                aria-label="Form status overview"
                tabIndex={0}
                onFocus={() => handleSectionFocus('Form Status Overview')}
            >
                <div 
                    className="bg-white rounded-lg border border-gray-200 p-6 text-center" 
                    tabIndex={0}
                    onFocus={() => handleStatFocus('Currently Locked Forms', lockedFormsCount)}
                    role="status"
                    aria-label={`${lockedFormsCount} forms currently locked`}
                >
                    <div className="text-2xl font-bold text-red-700 mb-2">
                        {lockedFormsCount}
                    </div>
                    <div className="text-sm text-gray-800">Currently Locked</div>
                </div>
                <div 
                    className="bg-white rounded-lg border border-gray-200 p-6 text-center" 
                    tabIndex={0}
                    onFocus={() => handleStatFocus('Available Forms', availableFormsCount)}
                    role="status"
                    aria-label={`${availableFormsCount} forms available`}
                >
                    <div className="text-2xl font-bold text-green-700 mb-2">
                        {availableFormsCount}
                    </div>
                    <div className="text-sm text-gray-800">Available</div>
                </div>
                <div 
                    className="bg-white rounded-lg border border-gray-200 p-6 text-center" 
                    tabIndex={0}
                    onFocus={() => handleStatFocus('Total Forms', totalForms)}
                    role="status"
                    aria-label={`${totalForms} total forms`}
                >
                    <div className="text-2xl font-bold text-blue-700 mb-2">
                        {totalForms}
                    </div>
                    <div className="text-sm text-gray-800">Total Forms</div>
                </div>
            </section>

            {/* Form List */}
            <section 
                className="bg-white rounded-lg border border-gray-200"
                role="region"
                aria-label="Form list and controls"
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <h2 
                            className="text-lg font-semibold text-black" 
                            tabIndex={0}
                            onFocus={() => speak('Form Status Dashboard section')}
                            role="heading"
                            aria-level="2"
                        >
                            Form Status Dashboard
                        </h2>
                        <div 
                            className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3"
                            role="search"
                            aria-label="Form search and filter controls"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search forms..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value) {
                                            announce(`Searching for: ${e.target.value}`);
                                        }
                                    }}
                                    onFocus={() => speak('Search forms input')}
                                    className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    aria-label="Search forms by name"
                                />
                                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    speak(`Filter changed to: ${e.target.value}`);
                                    announce(`Showing ${e.target.value} forms`);
                                }}
                                onFocus={() => speak('Filter forms by status')}
                                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                aria-label="Filter forms by status"
                            >
                                <option value="All">All Forms</option>
                                <option value="Available">Available</option>
                                <option value="Locked">Locked</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div 
                    className="divide-y divide-gray-200"
                    role="list"
                    aria-label="Forms list"
                    aria-live="polite"
                    aria-relevant="additions removals"
                >
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
                                    className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${isLockedByMe ? 'bg-blue-50' : ''}`}
                                    role="listitem"
                                    tabIndex={0}
                                    onFocus={() => handleFormFocus(form)}
                                    aria-label={`Form: ${form.formName}, ${isLockedByMe ? 'checked out by you' : isLocked ? `locked by ${form.lockedBy?.name}` : 'available'}`}
                                >
                                    {/* Mobile Layout */}
                                    <div className="block sm:hidden">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div 
                                                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                                    isLockedByMe 
                                                        ? 'bg-blue-500' 
                                                        : isLocked 
                                                            ? 'bg-red-500' 
                                                            : 'bg-green-500'
                                                }`}
                                                aria-hidden="true"
                                            ></div>
                                            <h3 
                                                className="text-lg font-medium text-black flex-1 min-w-0"
                                                role="heading"
                                                aria-level="3"
                                            >
                                                {form.formName}
                                            </h3>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <span 
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                                                    isLockedByMe
                                                        ? 'bg-blue-200 text-blue-900'
                                                        : isLocked
                                                            ? 'bg-red-200 text-red-900'
                                                            : 'bg-green-200 text-green-900'
                                                }`}
                                                role="status"
                                                aria-label={`Status: ${isLockedByMe ? 'Checked out by you' : isLocked ? 'Locked' : 'Available'}`}
                                            >
                                                {isLockedByMe 
                                                    ? '🔵 Checked out by you' 
                                                    : isLocked 
                                                        ? '🔴 Locked' 
                                                        : '🟢 Available'
                                                }
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {form.description && (
                                                <div 
                                                    className="text-sm text-gray-800"
                                                    tabIndex={0}
                                                    onFocus={() => speak(`Description: ${form.description}`)}
                                                    role="text"
                                                >
                                                    {form.description}
                                                </div>
                                            )}
                                            {form.isLocked && (
                                                <div className="space-y-1">
                                                    <div 
                                                        className="text-sm text-gray-800"
                                                        tabIndex={0}
                                                        onFocus={() => speak(`Checked out by ${form.lockedBy?.name}`)}
                                                        role="text"
                                                    >
                                                        Checked out by {form.lockedBy?.name}
                                                    </div>
                                                    <div 
                                                        className="text-sm text-gray-700"
                                                        tabIndex={0}
                                                        onFocus={() => speak(`Locked at: ${formatDateTime(form.lockedAt)}`)}
                                                        role="text"
                                                    >
                                                        {formatDateTime(form.lockedAt)}
                                                    </div>
                                                </div>
                                            )}
                                            {form.notes && (
                                                <div 
                                                    className="text-sm text-gray-700 italic"
                                                    tabIndex={0}
                                                    onFocus={() => speak(`Notes: ${form.notes}`)}
                                                    role="text"
                                                >
                                                    {form.notes}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                            <button
                                                className={`inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium transition-colors w-full ${
                                                    checkOutDisabled
                                                        ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                                                        : "text-white bg-blue-600 hover:bg-blue-700"
                                                }`}
                                                disabled={checkOutDisabled}
                                                onClick={() => handleCheckOut(form._id)}
                                                onFocus={() => handleButtonFocus(`Check Out ${form.formName}`)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        if (!checkOutDisabled) {
                                                            handleCheckOut(form._id);
                                                        }
                                                    }
                                                }}
                                                aria-label={`Check out ${form.formName} form${checkOutDisabled ? ' (disabled - form is locked)' : ''}`}
                                                tabIndex={0}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                                </svg>
                                                Check Out
                                            </button>

                                            {isLockedByMe && (
                                                <button
                                                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors w-full"
                                                    onClick={() => handleCheckIn(form._id)}
                                                    onFocus={() => handleButtonFocus(`Check In ${form.formName}`)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            handleCheckIn(form._id);
                                                        }
                                                    }}
                                                    aria-label={`Check in ${form.formName} form`}
                                                    tabIndex={0}
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                                                    </svg>
                                                    Check In
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden sm:flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div 
                                                className={`w-3 h-3 rounded-full ${
                                                    isLockedByMe 
                                                        ? 'bg-blue-500' 
                                                        : isLocked 
                                                            ? 'bg-red-500' 
                                                            : 'bg-green-500'
                                                }`}
                                                aria-hidden="true"
                                            ></div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 
                                                        className="text-lg font-medium text-black"
                                                        role="heading"
                                                        aria-level="3"
                                                    >
                                                        {form.formName}
                                                    </h3>
                                                    <span 
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                                                            isLockedByMe
                                                                ? 'bg-blue-200 text-blue-900'
                                                                : isLocked
                                                                    ? 'bg-red-200 text-red-900'
                                                                    : 'bg-green-200 text-green-900'
                                                        }`}
                                                        role="status"
                                                        aria-label={`Status: ${isLockedByMe ? 'Checked out by you' : isLocked ? 'Locked' : 'Available'}`}
                                                    >
                                                        {isLockedByMe 
                                                            ? '🔵 Checked out by you' 
                                                            : isLocked 
                                                                ? '🔴 Locked' 
                                                                : '🟢 Available'
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    {form.description && (
                                                        <span 
                                                            className="text-sm text-gray-800"
                                                            tabIndex={0}
                                                            onFocus={() => speak(`Description: ${form.description}`)}
                                                            role="text"
                                                        >
                                                            {form.description}
                                                        </span>
                                                    )}
                                                    {form.isLocked && (
                                                        <>
                                                            <span 
                                                                className="text-sm text-gray-800"
                                                                tabIndex={0}
                                                                onFocus={() => speak(`Checked out by ${form.lockedBy?.name}`)}
                                                                role="text"
                                                            >
                                                                Checked out by {form.lockedBy?.name}
                                                            </span>
                                                            <span 
                                                                className="text-sm text-gray-700"
                                                                tabIndex={0}
                                                                onFocus={() => speak(`Locked at: ${formatDateTime(form.lockedAt)}`)}
                                                                role="text"
                                                            >
                                                                {formatDateTime(form.lockedAt)}
                                                            </span>
                                                        </>
                                                    )}
                                                    {form.notes && (
                                                        <span 
                                                            className="text-sm text-gray-700 italic"
                                                            tabIndex={0}
                                                            onFocus={() => speak(`Notes: ${form.notes}`)}
                                                            role="text"
                                                        >
                                                            {form.notes}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className={`inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium transition-colors ${
                                                    checkOutDisabled
                                                        ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                                                        : "text-white bg-blue-600 hover:bg-blue-700"
                                                }`}
                                                disabled={checkOutDisabled}
                                                onClick={() => handleCheckOut(form._id)}
                                                onFocus={() => handleButtonFocus(`Check Out ${form.formName}`)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        if (!checkOutDisabled) {
                                                            handleCheckOut(form._id);
                                                        }
                                                    }
                                                }}
                                                aria-label={`Check out ${form.formName} form${checkOutDisabled ? ' (disabled - form is locked)' : ''}`}
                                                tabIndex={0}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                                </svg>
                                                Check Out
                                            </button>

                                            {isLockedByMe && (
                                                <button
                                                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                                                    onClick={() => handleCheckIn(form._id)}
                                                    onFocus={() => handleButtonFocus(`Check In ${form.formName}`)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            handleCheckIn(form._id);
                                                        }
                                                    }}
                                                    aria-label={`Check in ${form.formName} form`}
                                                    tabIndex={0}
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
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
                </section>
            </main>
        );

}

export default FormLocker;
