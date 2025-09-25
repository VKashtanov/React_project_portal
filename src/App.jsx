import './App.css';
import { useEffect, useState } from "react";

function App() {
    const [userState, setUserState] = useState(null);
    const [isSessionValid, setIsSessionValid] = useState(null);

    const validateSession = async (userId) => {
        const jwt = localStorage.getItem('liferay_jwt');
        if (!jwt) {
            console.error('JWT not found — user is not authenticated');
            setIsSessionValid(false);
            return false;
        }
        try {
            console.log("Send validation to Spring Boot USER with userId:", userId);

            const response = await fetch('https://localhost:8101/api/v1/validator/validate-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify({ userId: userId })
            });
            if (!response.ok) {
                throw new Error(`Spring Boot gave back an error: ${response.status}`);
            }
            const result = await response.json();
            console.log("Got response from Spring Boot:", result);

            setIsSessionValid(result.isValid);
            return result.isValid;

        } catch (error) {
            console.error('Session validation error:', error);
            setIsSessionValid(false);
            return false;
        }
    };

    const fetchJwt = async () => {
//1. JSession cookie, Liferay ot its side match that cookie provided here and get userID
        try {
            console.log("IN REACT: Requesting Liferay for JWT...");
            const response = await fetch('http://localhost:8080/o/get-jwt', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Error during getting JWT: ${response.status}`);
            }
            const data = await response.json();
            localStorage.setItem('liferay_jwt', data.jwt);
            console.log('JWT is gotten and saved:', data.jwt);
        } catch (error) {
            console.error('Error during getting JWT:', error);
        }
    };


    useEffect(() => {
        fetchJwt();
    }, []);


//2. When Liferay find userId , it provides object to be rendered / need to update page to render all date , because of Inner Liferay Settings
    useEffect(() => {
        const userData = window.TEST_USER_DATA;
        if (userData && userData.userId !== "20130") { // не гость
            setUserState(userData);
            console.log("USER IS SET:", userData);
        } else {
            console.log("USER IS NOT SET");
        }
    }, []);


//3. When we get userState(obj) we validate session on every change of userState
    useEffect(() => {
        console.log("UserState = "+ userState + "___");
        console.log(userState)
        if (userState && userState.userId) {
            validateSession(userState.userId);
        }
    }, [userState]);


    if (!userState) {
        return <div>User is not authorized.</div>;
    }

    if (isSessionValid === null) {
        return <div>Checking session...</div>;
    }


    if (!isSessionValid) {
        return <div>Session is nod valid.</div>;
    }


    return (
        <div style={{ padding: '20px' }}>
            <h1>!_REACT_HEADER_!</h1>
            <h8>AppJSX Loaded here</h8>
            <h1>👋 Hello user, {userState.firstName} {userState.lastName}!</h1>
            <p><strong>User name:</strong> {userState.screenName}</p>
            <p><strong>Email:</strong> {userState.emailAddress}</p>
            <p><strong>ID:</strong> {userState.userId}</p>
            <p style={{ color: 'green' ,size: 20}}><strong>_______SESSION IS VALID_________</strong></p>
        </div>
    );
}

export default App;