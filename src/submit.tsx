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
            <h1>맞았습니다!</h1>
            <p>{message}</p>
            <button onClick={closeModal}>Close</button>
        </>
    )
}
