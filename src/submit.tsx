import React, {FC, useState} from 'react'
import axios from "axios";
import {backEndUrl} from "./index";

type FlagSubmitProps = {
    login: boolean
    addSolved: ()=>void
}
export const FlagSubmit: FC<FlagSubmitProps> = ({addSolved, login}) => {
    const [flag, setFlag] = useState("")


    function submitFlag() {
        axios.post(backEndUrl + '/submit/', {
            flag: flag
        }, {withCredentials:true})
            .then(()=>{
                setFlag("")
                addSolved()
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
        </>
    }
    else {
        return <></>
    }
}