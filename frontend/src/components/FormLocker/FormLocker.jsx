import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import AddForm from "../User/AddForm";

function FormLocker() {
    const [isOpen, setIsOpen] = useState(false);
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchForms = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/v1/form/");
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setForms(data);
        } catch (err) {
            console.error("Failed to fetch forms", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const handleFormAdded = () => {
        fetchForms(); // refresh list
        setIsOpen(false); // close modal
    };

    const totalForms = forms.length;

    if (loading) return <div className="min-h-screen bg-gray-50 p-6">Loading...</div>;
    if (error) return <div className="min-h-screen bg-gray-50 p-6">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Form Locker
                    </h1>
                    <p className="text-gray-600">
                        Prevent multiple devs working on the same form
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        ➕ Add New Form
                    </button>
                </div>
            </div>

            {/* Modal */}
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <div className="flex min-h-screen items-center justify-center backdrop-blur-xs">
                    <Dialog.Panel className="w-full max-w-md rounded-4xl bg-white shadow-md">
  <AddForm onFormAdded={handleFormAdded} onCancel={() => setIsOpen(false)} />
</Dialog.Panel>

                </div>
            </Dialog>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                    <div className="mb-2 text-2xl font-bold text-green-600">
                        {totalForms}
                    </div>
                    <div className="text-sm text-gray-600">
                        Available
                    </div>
                </div>
            </div>

            {/* Form Cards */}
            <div className="mt-8 grid gap-4">
                {forms.map((form) => (
                    <div
                        key={form._id}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {form.formName}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    {form.description}
                                </p>
                                {form.notes && (
                                    <p className="mt-1 text-sm italic text-gray-400">
                                        {form.notes}
                                    </p>
                                )}
                            </div>
                            <button className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700">
                                Check Out
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FormLocker;