"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView, Decoration, DecorationSet, Range } from "@codemirror/view";
import { StateField, StateEffect, EditorState } from "@codemirror/state";
import { split } from "sentence-splitter";
import { FaPlay, FaPause } from "react-icons/fa";

const defaultInputText = `Modern organizations frequently rely on chat-based platforms (e.g., Slack, Microsoft Teams, and Discord) for day-to-day communication and decision-making. As conversations evolve, organizational knowledge can get buried, prompting repeated searches and discussions. While maintaining shared documents, such as Wiki articles for the organization, offers a partial solution, it requires manual and timely efforts to keep it up to date, and it may not effectively preserve the social and contextual aspect of prior discussions. Moreover, reaching a consensus on document updates with relevant stakeholders can be time-consuming and complex. To address these challenges, we introduce CHOIR (Chat-based Helper for Organizational Intelligence Repository), a chatbot that integrates seamlessly with chat platforms. CHOIR automatically identifies and proposes edits to related documents, initiates discussions with relevant team members, and preserves contextual revision histories. By embedding knowledge management directly into chat environments and leveraging LLMs, CHOIR simplifies manual updates and supports consensus-driven editing based on maintained context with revision histories. We plan to design, deploy, and evaluate CHOIR in the context of maintaining an organizational memory for a research lab. We describe the chatbot's motivation, design, and early implementation to show how CHOIR streamlines collaborative document management.`;

const MARKDOWN_SECTIONS = [
  `# Modern organizations and communication platforms

Modern organizations frequently rely on chat-based platforms (e.g., Slack, Microsoft Teams, and Discord) for day-to-day communication and decision-making.`,

  `# Knowledge management challenges

As conversations evolve, organizational knowledge can get buried, prompting repeated searches and discussions.`,

  `# Current solutions and limitations

While maintaining shared documents, such as Wiki articles for the organization, offers a partial solution, it requires manual and timely efforts to keep it up to date, and it may not effectively preserve the social and contextual aspect of prior discussions.`,

  `# Consensus challenges

Moreover, reaching a consensus on document updates with relevant stakeholders can be time-consuming and complex.`,

  `# Introducing CHOIR

To address these challenges, we introduce CHOIR (Chat-based Helper for Organizational Intelligence Repository), a chatbot that integrates seamlessly with chat platforms.`,

  `# CHOIR's core features

CHOIR automatically identifies and proposes edits to related documents, initiates discussions with relevant team members, and preserves contextual revision histories.`,

  `# CHOIR's approach

By embedding knowledge management directly into chat environments and leveraging LLMs, CHOIR simplifies manual updates and supports consensus-driven editing based on maintained context with revision histories.`,

  `# Future plans

We plan to design, deploy, and evaluate CHOIR in the context of maintaining an organizational memory for a research lab.`,

  `# Conclusion

We describe the chatbot's motivation, design, and early implementation to show how CHOIR streamlines collaborative document management.`,
];

export default function Home() {
  const [inputText, setInputText] = useState(defaultInputText);
  const [markdownText, setMarkdownText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const markdownRef = useRef<HTMLDivElement>(null);

  // sentence-splitter를 사용한 문장 분리
  const sentences = split(inputText)
    .filter((node) => node.type === "Sentence")
    .map((node) => node.raw);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setHighlightIndex((prev) => {
          if (prev < sentences.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return -1;
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

      // 스크롤을 맨 아래로 이동
      setTimeout(() => {
        markdownRef.current?.scrollTo({
          top: markdownRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } else {
      setMarkdownText("");
    }
  }, [highlightIndex]);

  // 하이라이트 효과를 위한 데코레이션 설정
  const highlightMark = Decoration.mark({
    attributes: {
      style: "background-color: #fef08a; transition: background-color 0.3s",
    },
  });

  const highlightField = StateField.define({
    create() {
      return Decoration.none;
    },
    update(highlights, tr) {
      if (highlightIndex === -1) return Decoration.none;

      let decorations: Range<Decoration>[] = [];
      let pos = 0;
      sentences.forEach((sentence, index) => {
        if (index === highlightIndex) {
          const from = inputText.indexOf(sentence.trim(), pos);
          const to = from + sentence.trim().length;
          if (from !== -1) {
            decorations.push(highlightMark.range(from, to));
          }
        }
        pos += sentence.length;
      });

      return Decoration.set(decorations);
    },
    provide: (f) => EditorView.decorations.from(f),
  });

  const theme = EditorView.theme({
    "&": {
      height: "100%",
      fontSize: "15px",
      lineHeight: "1.6",
      maxWidth: "100%",
    },
    ".cm-line": {
      padding: "0 6px",
      // whiteSpace: "pre-wrap",
      // wordBreak: "break-word",
    },
    ".cm-content": {
      width: "100%",
      maxWidth: "100%",
    },
  });

  const extensions = [theme, highlightField, EditorView.lineWrapping];

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <div className="flex-1 h-full p-4 max-w-[50%]">
        <CodeMirror
          value={inputText}
          onChange={setInputText}
          extensions={extensions}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
          }}
          className="h-full rounded-lg overflow-hidden"
        />
      </div>
      <div className="flex-1 h-full flex flex-col bg-white border-l relative">
        <div
          ref={markdownRef}
          className="flex-1 overflow-auto p-12 prose prose-slate max-w-none"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownText}
          </ReactMarkdown>
        </div>
        <div className="sticky bottom-0 z-10 bg-white border-t flex justify-center py-4">
          <button
            onClick={handlePlayPause}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
