import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, X as XIcon } from "lucide-react";
import { useChat } from "./ChatContext";

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

const MessageInput = () => {
    const [input, setInput] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState("");
    const { sendMessage, loading } = useChat();
    const textareaRef = useRef(null);

    // Auto-resize the textarea as content grows
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            const newHeight = Math.min(textarea.scrollHeight, 200);
            textarea.style.height = `${newHeight}px`;
        }
    }, [input]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed.");
            setImage(null);
            setImagePreview(null);
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setError("Image must be less than 1MB.");
            setImage(null);
            setImagePreview(null);
            return;
        }
        setError("");
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !image) || loading) return;
        if (
            image &&
            (image.size > MAX_IMAGE_SIZE || !image.type.startsWith("image/"))
        ) {
            setError("Invalid image.");
            return;
        }
        try {
            await sendMessage(input, image);
            setInput("");
            setImage(null);
            setImagePreview(null);
            setError("");
        } catch (error) {
            setError("Error sending message.");
            console.error("Error sending message:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative flex flex-col items-end gap-2">
                {error && (
                    <div className="mb-1 w-full text-sm text-red-500">
                        {error}
                    </div>
                )}
                {imagePreview && (
                    <div className="relative mb-2 h-32 w-32">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full rounded border object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="bg-opacity-80 absolute top-1 right-1 rounded-full bg-white p-1 hover:bg-red-100"
                            aria-label="Remove image"
                        >
                            <XIcon size={16} />
                        </button>
                    </div>
                )}
                <div className="relative flex w-full items-end">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe the feature or application to test..."
                        className="max-h-[200px] min-h-[56px] flex-1 resize-none rounded-lg border border-slate-200 bg-white p-4 pr-12 text-slate-900 placeholder-slate-500 transition-all focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:ring-purple-400"
                        disabled={loading}
                    />
                    <label className="absolute right-12 bottom-3 cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={loading}
                        />
                        <ImageIcon
                            size={20}
                            className="text-purple-500 hover:text-purple-700"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={(!input.trim() && !image) || loading}
                        className={`absolute right-3 bottom-3 rounded-md p-2 transition-colors ${
                            (input.trim() || image) && !loading
                                ? "bg-purple-500 text-white hover:bg-purple-600 dark:hover:bg-purple-400"
                                : "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                        }`}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default MessageInput;
