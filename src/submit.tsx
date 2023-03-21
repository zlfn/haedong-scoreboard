import React, {FC, useState} from 'react'
import axios from "axios";
import {backEndUrl, ModalProps} from "./index";
import Modal from "react-modal";

type FlagSubmitProps = {
    login: boolean
    addSolved: ()=>void
}
export const FlagSubmit: FC<FlagSubmitProps> = ({addSolved, login}) => {
    const [flag, setFlag] = useState("")
    const [submitModalOpened, setSubmitModalOpened] = useState(false)
    const [submitMessage, setSubmitMessage] = useState("")


    function submitFlag() {
        if(flag === 'haedong') {
            window.location.href = "http://zlfn.space:12345"
            return
        }
        axios.post(backEndUrl + '/submit/', {
            flag: flag
        }, {withCredentials:true})
            .then(response =>{
                const res = response.data
                if(res.success) {
                    setFlag("")
                    setSubmitMessage(res.message)
                    setSubmitModalOpened(true)
                    addSolved()
                }
            })
    }

    function flagChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFlag(e.target.value)
    }

    function flagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if(e.key==='Enter') {
            submitFlag()
        }
    }

    if(login) {
        return <>
            <input value={flag} onKeyDown={flagKeyDown} onChange={flagChange} type="text" name="text" id="input" placeholder="Wanna type something?"/>
            <button onClick={submitFlag} id="submit">Enter...</button>
                <Modal
                    isOpen={submitModalOpened}
                    overlayClassName="Modal_Overlay"
                    onRequestClose={() => setSubmitModalOpened(false)}
                    className="Modal_Content">
                    <SubmitModal
                        message = {submitMessage}
                        closeModal={() => setSubmitModalOpened(false)}
                    />
                </Modal>
            </>
    }
    else {
        return <></>
    }
}

interface SubmitModalProps extends ModalProps {
    message: string
}

const SubmitModal: React.FC<SubmitModalProps> = ({message, closeModal}) => {
    return (
        <>
            <div className="submitmodal">
                <h1>Problem Pwned :</h1>
                <p className='submitmodal_msg'>{message}</p>
                <button className="submitmodal_btn modal-btn" onClick={closeModal}>Close</button>
            </div>
        </>
    )
}
