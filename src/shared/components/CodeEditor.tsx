import { useEffect, useRef } from 'react';
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
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

type LanguageSupportFunction = () => Extension;

const languageMap: Record<string, LanguageSupportFunction> = {
  javascript: javascript,
  python: python,
  java: java,
  cpp: cpp,
  'c++': cpp,
  html: html,
  css: css,
  json: json,
};

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  className = '',
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const langSupport = languageMap[language.toLowerCase()] || javascript;

    const extensions: Extension[] = [
      lineNumbers(),
      highlightSpecialChars(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      langSupport(),
    ];

    if (!readOnly) {
      extensions.push(
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
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
        ]),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
          }
        })
      );
    } else {
      extensions.push(EditorState.readOnly.of(true));
    }

    extensions.push(
      EditorView.theme({
        '&': {
          fontSize: '14px',
          fontFamily: "'Courier New', Courier, monospace",
        },
        '.cm-content': {
          padding: '12px',
          minHeight: '300px',
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
      })
    );

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, readOnly]);

  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      const currentContent = viewRef.current.state.doc.toString();
      if (value !== currentContent) {
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
  }, [value]);

  return (
    <div className={className}>
      <div ref={editorRef} />
    </div>
  );
}
