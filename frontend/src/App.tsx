import React from 'react';
import './App.css';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';

function App() {
  return (
    <div className="App">
      <h1>Document Manager</h1>
      <DocumentUpload />
      <DocumentList />
    </div>
  );
}

export default App;
