import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (!window._myReactAppLoaded) {
    window._myReactAppLoaded = true;
// The listener listens on the browser level , when browser loads an HTML page from layout.ftl . it loads DOM  up
    document.addEventListener("DOMContentLoaded", () => {
        const rootElement = document.getElementById('root');
        if (!rootElement) {
            console.error(" NO SUCH ELEMENT in DOM!");
            return;
        }

        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    });
}