"use client";

import { useState, useEffect, useRef } from "react";
import { split } from "sentence-splitter";
import TextEditor from "@/components/TextEditor";
import MarkdownViewer from "@/components/MarkdownViewer";
import ChatInterface from "@/components/ChatInterface";
import { defaultInputText, MARKDOWN_SECTIONS } from "@/constants";
import { usePlayerStore } from "@/store/usePlayerStore";
import { PlayerState } from "@/store/usePlayerStore";

export default function Home() {
  const {
    isCompleted,
    setIsCompleted,
    setSentences,
    highlightIndex,
    setHighlightIndex,
  } = usePlayerStore();
  const [inputText, setInputText] = useState(defaultInputText);
  const [markdownText, setMarkdownText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newSentences = split(inputText)
      .filter((node) => node.type === "Sentence")
      .map((node) => node.raw);
    setSentences(newSentences);
  }, [inputText, setSentences]);

  const sentences = usePlayerStore((state) => state.sentences);

  const handlePlayPause = () => {
    if (isCompleted) {
      setHighlightIndex(-1);
      setIsCompleted(false);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setHighlightIndex((prev) => {
          if (prev < sentences.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            setIsCompleted(true);
            return sentences.length - 1;
          }
        });
      }, 2000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, sentences.length, setHighlightIndex, setIsCompleted]);

  useEffect(() => {
    if (highlightIndex >= 0) {
      const updatedMarkdown = MARKDOWN_SECTIONS.slice(
        0,
        highlightIndex + 1
      ).join("\n\n");
      setMarkdownText(updatedMarkdown);
    } else {
      setMarkdownText("");
    }
  }, [highlightIndex]);

  const handleReset = () => {
    if (highlightIndex > 0) {
      setHighlightIndex((prev) => prev - 1);
    } else if (highlightIndex === 0) {
      setHighlightIndex(-1);
    }
    setIsPlaying(false);
  };

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <div
        className={`
        flex flex-1 transition-[max-width] duration-300 ease-in-out
        ${
          usePlayerStore((state: PlayerState) => state.isChatOpen)
            ? "max-w-[calc(100%-400px)]"
            : "max-w-full"
        }
      `}
      >
        <div className="flex-1 h-full p-4 max-w-[50%]">
          <TextEditor
            value={inputText}
            onChange={setInputText}
            highlightIndex={highlightIndex}
            sentences={sentences}
          />
        </div>
        <MarkdownViewer
          content={markdownText}
          isPlaying={isPlaying}
          isCompleted={isCompleted}
          highlightIndex={highlightIndex}
          onPlayPause={handlePlayPause}
          isChatOpen={usePlayerStore((state) => state.isChatOpen)}
          onToggleChat={usePlayerStore((state) => state.toggleChat)}
          onReset={handleReset}
        />
      </div>
      <ChatInterface />
    </div>
  );
}
