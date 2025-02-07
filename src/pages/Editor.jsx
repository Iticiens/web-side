import Editor from '@monaco-editor/react';

export const CodeEditor = ()=>{
  return(
      <Editor theme='vs-dark' height="70vh" defaultLanguage="c" defaultValue="// Copy your garbage code and make it beautiful here !!!"   />
  )
}