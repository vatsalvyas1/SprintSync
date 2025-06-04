import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import AddForm from "../User/AddForm";

function FormLocker() {
    const [isOpen, setIsOpen] = useState(false);
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const fetchForms = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/v1/form/");
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
            await fetch(`http://localhost:8000/api/v1/form/${formId}/lock`, {
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
            await fetch(`http://localhost:8000/api/v1/form/${formId}/unlock`, {
                method: "PATCH",
            });
            fetchForms();
        } catch (err) {
            alert("Failed to unlock the form.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="ml-64 min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Form Locker</h1>
                    <p className="text-gray-600">
                        Prevent multiple devs working on the same form
                    </p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="border bg-white px-4 py-2 text-sm font-medium"
                >
                    ➕ Add New Form
                </button>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
    <div className="text-2xl font-bold text-red-600 mb-2">{lockedFormsCount}</div>
    <div className="text-sm text-gray-600">Currently Locked</div>
  </div>
  <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
    <div className="text-2xl font-bold text-green-600 mb-2">{totalForms}</div>
    <div className="text-sm text-gray-600">Total Forms</div> 
  </div>
  <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
    <div className="text-2xl font-bold text-orange-600 mb-2">{availableFormsCount}</div>
    <div className="text-sm text-gray-600">Form Available to Check Out</div>
  </div>
</div>


            {/* Form Cards */}
            <div className="mt-6 grid gap-4">
                {forms.map((form) => {
                    const isLockedByMe =
                        form.lockedBy?._id === loggedInUser._id;
                    const isLocked = form.isLocked;

                    // Updated logic
                    const checkOutDisabled = isLocked; // disabled for *everyone* if locked
                    const checkInDisabled = !isLockedByMe; // only user who locked can check in

                    return (
                        <div
                            key={form._id}
                            className="rounded-lg border bg-white p-6 shadow-sm hover:bg-gray-50"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {form.formName}
                                    </h3>
                                    <p className="text-gray-600">
                                        {form.description}
                                    </p>
                                    {form.notes && (
                                        <p className="text-gray-400 italic">
                                            {form.notes}
                                        </p>
                                    )}
                                    {form.isLocked && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Locked by: {form.lockedBy?.name} at{" "}
                                            {new Date(
                                                form.lockedAt
                                            ).toLocaleTimeString()}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        className={`rounded px-3 py-1 text-sm font-medium ${
                                            checkOutDisabled
                                                ? "cursor-not-allowed bg-gray-400 text-white"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                        disabled={checkOutDisabled}
                                        onClick={() => handleCheckOut(form._id)}
                                    >
                                        Check Out
                                    </button>

                                    <button
                                        className={`rounded px-3 py-1 text-sm font-medium ${
                                            isLockedByMe
                                                ? "bg-green-600 text-white hover:bg-green-700"
                                                : "cursor-not-allowed bg-gray-300 text-white"
                                        }`}
                                        disabled={checkInDisabled}
                                        onClick={() => handleCheckIn(form._id)}
                                    >
                                        Check In
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default FormLocker;
