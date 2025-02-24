import { useState, useRef, useEffect } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function ChatInterface() {
  const { messages, isChatOpen, addMessage } = usePlayerStore();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 56), 264); // 2줄(56px) ~ 11줄(264px)
    textarea.style.height = `${newHeight}px`;
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        addMessage({
          id: Date.now(),
          text: trimmedValue,
          isUser: true,
        });
        setInputValue("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "56px";
        }
      }
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  return (
    <div
      className={`
        w-[400px] h-screen bg-white border-l transition-[max-width] duration-300 ease-in-out overflow-hidden
        ${isChatOpen ? "max-w-[400px]" : "max-w-0"}
      `}
    >
      <div
        className={`
          flex flex-col h-full relative
          transition-[opacity,transform] duration-300
          ${isChatOpen ? "translate-x-0" : "translate-x-full"}
          ${!isChatOpen && "hidden"}
        `}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start w-full"
              }`}
            >
              <div
                className={
                  message.isUser
                    ? "max-w-[70%] rounded-lg p-3 bg-gray-100 text-gray-900 break-words"
                    : message.text.startsWith(">")
                    ? "w-full pl-4 border-l-4 border-gray-300 text-gray-600 mb-2"
                    : "w-full text-gray-900"
                }
              >
                {message.text.startsWith(">")
                  ? message.text.slice(2)
                  : message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="sticky bottom-0">
          <div className="p-4 pt-0 bg-white/80 backdrop-blur-sm">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Type your message here... "
              className="w-full rounded-lg border px-3 py-2 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text min-h-[56px] max-h-[264px] shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
