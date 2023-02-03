import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './resources/index.css';
import "./resources/modal.css"
import "./resources/custom.css"
import {Login} from './login';
import Cookies from 'universal-cookie';
import axios from "axios";

export const backEndUrl = "https://hd.hegelty.space";
export const App: React.FC = () => {
    const [loggedIn, setLogin] = useState(false)
    const [userName, setUserName] = useState("")

    return(
        <>
            <div className="top">
                <img src="/logo.png" alt="Logo" id="logo"/>
                <Login
                    loggedIn={loggedIn}
                    userName={userName}
                    setLoggedIn={setLogin}
                    setUserName={setUserName}
                />
            </div>
            <Temp/>
        </>
    )
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App/>);


//모양 만들기용 임시 컴포넌트. 개발하면서 조각조각 쪼갤거임.
const Temp: React.FC = () => {
    return (
        <>
            <div className="middle">
                <table>
                    <thead>
                    <tr>
                        <th className="pin"></th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                        <th>Col Header</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <th>Row Header</th>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                        <td>Cell Data</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="flag">
                <input type="text" name="text" id="input" placeholder="Wanna type something?"/>
                <input type="submit" name="submit" id="submit" value="Enter.."/>
            </div>
        </>
    )
}