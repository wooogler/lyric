import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ControlBar } from "./markdown/ControlBar";
import { SettingsModal } from "./markdown/SettingsModal";

interface MarkdownViewerProps {
  content: string;
  isPlaying: boolean;
  isCompleted: boolean;
  onPlayPause: () => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  onReset: () => void;
}

export default function MarkdownViewer({
  content,
  isPlaying,
  isCompleted,
  onPlayPause,
  isChatOpen,
  onToggleChat,
  onReset,
}: MarkdownViewerProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const markdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (markdownRef.current) {
      const { scrollHeight, clientHeight } = markdownRef.current;
      if (scrollHeight > clientHeight) {
        markdownRef.current.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [content]);

  return (
    <div className="flex-1 h-full flex flex-col bg-white border-l relative">
      <div
        ref={markdownRef}
        className="flex-1 overflow-auto p-12 prose prose-slate max-w-none"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
      <ControlBar
        isPlaying={isPlaying}
        isCompleted={isCompleted}
        isChatOpen={isChatOpen}
        onPlayPause={onPlayPause}
        onReset={onReset}
        onToggleChat={onToggleChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
