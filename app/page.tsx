"use client";

import { useState, useEffect, useRef } from "react";
import { split } from "sentence-splitter";
import TextEditor from "@/components/TextEditor";
import MarkdownViewer from "@/components/MarkdownViewer";
import ChatInterface from "@/components/ChatInterface";
import { defaultInputText, MARKDOWN_SECTIONS } from "@/constants";
import { Message } from "@/types";

export default function Home() {
  const [inputText, setInputText] = useState(defaultInputText);
  const [markdownText, setMarkdownText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "", isUser: false },
    { id: 2, text: "CHOIR 프로젝트에 대해 알고 싶어요.", isUser: true },
    {
      id: 3,
      text: "CHOIR는 조직의 지식 관리를 위한 챗봇 시스템입니다.",
      isUser: false,
    },
  ]);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const sentences = split(inputText)
    .filter((node) => node.type === "Sentence")
    .map((node) => node.raw);

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
  }, [isPlaying, sentences.length]);

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

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: messages.length + 1,
      text: message,
      isUser: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

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
        ${isChatOpen ? "max-w-[calc(100%-400px)]" : "max-w-full"}
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
          onPlayPause={handlePlayPause}
          isChatOpen={isChatOpen}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onReset={handleReset}
        />
      </div>
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isChatOpen={isChatOpen}
      />
    </div>
  );
}
