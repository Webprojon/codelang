import { useEffect, useRef, useMemo } from 'react';
import {
  EditorView,
  lineNumbers,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import type { Extension } from '@codemirror/state';
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
} from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
  readOnly?: boolean;
}

type LanguageSupportFunction = () => Extension;

const getLanguageSupport = (languageName: string): LanguageSupportFunction => {
  const normalized = languageName.toLowerCase().trim();

  if (normalized.includes('javascript') || normalized === 'js') {
    return javascript;
  }
  if (normalized.includes('python')) {
    return python;
  }
  if (normalized.includes('java') && !normalized.includes('javascript')) {
    return java;
  }
  if (normalized.includes('c++') || normalized.includes('c/c++') || normalized === 'cpp') {
    return cpp;
  }

  return javascript;
};

export default function CodeEditor({
  value,
  onChange,
  language = 'JavaScript',
  className = '',
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  const editorKeymap = useMemo(
    () =>
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
      ]),
    []
  );

  const editorTheme = useMemo(
    () =>
      EditorView.theme({
        '&': {
          fontSize: '14px',
          fontFamily: "'Courier New', Courier, monospace",
        },
        '.cm-content': {
          padding: '2px 6px',
          minHeight: '240px',
        },
        '.cm-editor': {
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
        },
        '.cm-editor.cm-focused': {
          borderColor: '#1f5ebd',
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-scroller': {
          overflow: 'auto',
        },
        '.cm-gutters': {
          backgroundColor: '#f3f4f6',
          borderRight: 'none',
        },
        '.cm-lineNumbers': {
          padding: '0 4px',
        },
        '.cm-line': {
          padding: '0 4px',
        },
      }),
    []
  );

  const updateListener = useMemo(
    () =>
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString();
          onChangeRef.current(newValue);
        }
      }),
    []
  );

  const extensions = useMemo(() => {
    const langSupport = getLanguageSupport(language);

    const ext: Extension[] = [
      lineNumbers(),
      highlightSpecialChars(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      langSupport(),
    ];

    if (!readOnly) {
      ext.push(
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        editorKeymap,
        updateListener
      );
    } else {
      ext.push(EditorState.readOnly.of(true));
    }

    ext.push(editorTheme);

    return ext;
  }, [language, readOnly, editorKeymap, editorTheme, updateListener]);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [language, readOnly, extensions]);

  useEffect(() => {
    if (!viewRef.current) return;

    const currentContent = viewRef.current.state.doc.toString();
    if (value !== currentContent) {
      if (readOnly || !viewRef.current.hasFocus) {
        const transaction = viewRef.current.state.update({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: value,
          },
        });
        viewRef.current.dispatch(transaction);
      }
    }
  }, [value, readOnly]);

  return (
    <div className={className}>
      <div ref={editorRef} />
    </div>
  );
}
