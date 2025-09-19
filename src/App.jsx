import './App.css';
import {useEffect, useState} from "react";

function App() {
    const [userState, setUserState] = useState(null);

    const validateSession = async (userId) => {
        const response = await fetch('https://localhost:8101/api/v1/validator/validate-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({userId})
        });

        return await response.json();
    };

    useEffect(() => {
        // that global variable is needed here to persist data
        const userData = window.TEST_USER_DATA;

        if (userData && userData.userId !== "20130") { // is the default Liferay GUEST USER ID = 20130, to distinguish
            setUserState(userData);
        } else {
            console.log("IT IS guest user data");
        }
    }, []);

    if (!userState) return <div>User is not authorized or there is a problem with data retrieving.</div>;


    validateSession(userState.userId).then((user) => {
        console.log("Was send to SPRING" + user)
    })


    return (

        <div style={{padding: '20px'}}>
            <h1>!_REACT_HEADER_!</h1>
            <h8>AppJSX Loaded here</h8>

            <h1>👋 Hello user, {userState.firstName} {userState.lastName}!</h1>
            <p><strong>User name:</strong> {userState.screenName}</p>
            <p><strong>Email:</strong> {userState.emailAddress}</p>
            <p><strong>ID:</strong> {userState.userId}</p>
        </div>
    );
}

export default App;