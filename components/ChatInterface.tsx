import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isChatOpen: boolean;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isChatOpen,
}: ChatInterfaceProps) {
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
        onSendMessage(trimmedValue);
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
        h-screen flex flex-col bg-white border-l
        transition-all duration-300 ease-in-out
        ${isChatOpen ? "w-[400px] opacity-100" : "w-0 opacity-0"}
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
                    ? "w-[70%] rounded-lg p-3 bg-gray-100 text-gray-900"
                    : "w-full text-gray-900"
                }
              >
                {message.text}
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
