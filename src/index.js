import React from 'react';
import ReactDOM from 'react-dom';

import { resizeSubject$ } from './utils/subjects';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';

const resize = () => {
  resizeSubject$.next({ width: window.innerWidth, height: window.innerHeight });
};

window.addEventListener('resize', resize);
resize();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
