import CodeMirror from "@uiw/react-codemirror";
import { EditorView, Decoration } from "@codemirror/view";
import { StateField } from "@codemirror/state";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  highlightIndex: number;
  sentences: string[];
}

export default function TextEditor({
  value,
  onChange,
  highlightIndex,
  sentences,
}: TextEditorProps) {
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

      let decorations: any[] = [];
      let pos = 0;
      sentences.forEach((sentence, index) => {
        if (index === highlightIndex) {
          const from = value.indexOf(sentence.trim(), pos);
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
    },
    ".cm-content": {
      width: "100%",
      maxWidth: "100%",
    },
  });

  const extensions = [theme, highlightField, EditorView.lineWrapping];

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
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
  );
}
