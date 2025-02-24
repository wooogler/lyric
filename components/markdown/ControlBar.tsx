import {
  FaPlay,
  FaPause,
  FaComments,
  FaBackward,
  FaUndo,
  FaCog,
} from "react-icons/fa";
import { IconButton } from "./IconButton";

interface ControlBarProps {
  isPlaying: boolean;
  isCompleted: boolean;
  isChatOpen: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onToggleChat: () => void;
  onOpenSettings: () => void;
}

export function ControlBar({
  isPlaying,
  isCompleted,
  isChatOpen,
  onPlayPause,
  onReset,
  onToggleChat,
  onOpenSettings,
}: ControlBarProps) {
  const PlayIcon = isCompleted ? FaUndo : isPlaying ? FaPause : FaPlay;

  return (
    <div className="sticky bottom-0 z-10 bg-white border-t h-[70px] flex items-center px-4">
      <IconButton
        icon={FaCog}
        onClick={onOpenSettings}
        title="Settings"
        className="absolute left-4"
        disabled={isPlaying}
      />
      <div className="flex gap-4 justify-center flex-1">
        <IconButton
          icon={FaBackward}
          onClick={onReset}
          title="Back to the previous sentence"
          disabled={isPlaying}
        />
        <IconButton
          icon={PlayIcon}
          onClick={onPlayPause}
          title={isCompleted ? "Restart" : isPlaying ? "Pause" : "Play"}
          variant="primary"
        />
        <IconButton
          icon={FaComments}
          onClick={onToggleChat}
          title={isChatOpen ? "Close chat" : "Open chat"}
          size={20}
          disabled={isPlaying}
        />
      </div>
    </div>
  );
}
