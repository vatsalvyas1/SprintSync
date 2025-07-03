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
                    <div className="mb-1 w-full text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md p-2 border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}
                {imagePreview && (
                    <div className="relative mb-2 h-32 w-32 group">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full rounded-lg border-2 border-purple-200 dark:border-purple-700 object-cover shadow-md"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                            aria-label="Remove image"
                        >
                            <XIcon size={14} />
                        </button>
                    </div>
                )}
                <div className="relative flex w-full items-end bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 dark:focus-within:ring-purple-400">
                    {/* Image upload button on the left */}
                    <label className="flex items-center justify-center p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-l-lg transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={loading}
                        />
                        <ImageIcon
                            size={20}
                            className={`transition-colors ${
                                image 
                                    ? "text-purple-600 dark:text-purple-400" 
                                    : "text-slate-400 hover:text-purple-500 dark:text-slate-500 dark:hover:text-purple-400"
                            }`}
                        />
                    </label>
                    
                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe the feature or application to test..."
                        className="max-h-[200px] min-h-[56px] flex-1 resize-none bg-transparent p-4 py-3 text-slate-900 placeholder-slate-500 transition-all focus:outline-none dark:text-white dark:placeholder-slate-400"
                        disabled={loading}
                    />
                    
                    {/* Send button on the right */}
                    <div className="p-3">
                        <button
                            type="submit"
                            disabled={(!input.trim() && !image) || loading}
                            className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                                (input.trim() || image) && !loading
                                    ? "bg-purple-500 text-white hover:bg-purple-600 dark:hover:bg-purple-400"
                                    : "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                            }`}
                            aria-label="Send message"
                        >
                            <Send size={18} className={loading ? "animate-pulse" : ""} />
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default MessageInput;