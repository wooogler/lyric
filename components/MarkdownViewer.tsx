import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaPlay, FaPause, FaComments, FaBackward } from "react-icons/fa";

interface MarkdownViewerProps {
  content: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  onReset: () => void;
}

export default function MarkdownViewer({
  content,
  isPlaying,
  onPlayPause,
  isChatOpen,
  onToggleChat,
  onReset,
}: MarkdownViewerProps) {
  const markdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 h-full flex flex-col bg-white border-l relative">
      <div
        ref={markdownRef}
        className="flex-1 overflow-auto p-12 prose prose-slate max-w-none"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
      <div className="sticky bottom-0 z-10 bg-white border-t h-[70px] flex items-center justify-center px-4">
        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="p-3 text-gray-600 hover:text-blue-600 transition-colors"
            title="Back to the previous sentence"
          >
            <FaBackward size={16} />
          </button>
          <button
            onClick={onPlayPause}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
          <button
            onClick={onToggleChat}
            className="p-3 text-gray-600 hover:text-blue-600 transition-colors"
            title={isChatOpen ? "Close chat" : "Open chat"}
          >
            <FaComments size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
