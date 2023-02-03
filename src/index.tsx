import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import './resources/index.css';
import "./resources/modal.css"
import {Login} from './login';

export const backEndUrl = "https://hd.hegelty.space";
export const App: React.FC = () => {
    const [loggedIn, setLogin] = useState(false)
    const [token, setToken] = useState("")
    function login(token:string):void {
        setLogin(true)
        setToken(token)
    }

    return(
        <>
            <div className="top">
                <img src="/logo.png" alt="Logo" id="logo"/>
                <Login
                    loggedIn={loggedIn}
                    setToken={login}
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