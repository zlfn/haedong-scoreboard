import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import './resources/index.css';
import {Login} from './login';

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

export const App: React.FC = () => {
    const [modal, setmodal] = useState(true);
    return(
        <>
            <div className="top">
                <img src="https://via.placeholder.com/320" alt="Logo" id="logo"/>
                <Login loggedIn={false}/>
            </div>
                <Modal isOpen={modal} style={ModalStyle as ReactModal.Styles}>
                    <h3>처음 로그인 하셨군요! 이름과 학번을 알려주시겠어요?</h3>
                    이름<br/>
                    <input type="text"/><br/>
                    학번<br/>
                    <input type="text"/><br/>
                    <br/><br/><br/>
                    <button>확인</button>
                    <span>              </span>
                    <button onClick={()=>setmodal(false)}>로그인 취소</button>
                </Modal>
                <Temp/>
        </>
    )
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

const ModalStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    content: {
        position: 'absolute',
        zIndex:101,
        top: '30%',
        left: '30%',
        right: '30%',
        bottom: '30%',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '10px',
        outline: 'none',
        padding: '20px'
    }
}