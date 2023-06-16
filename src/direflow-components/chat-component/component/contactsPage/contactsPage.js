import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./contactsPage.css";
import { api } from "./../../api";

import { AvatarComp } from "../avatarComp/avatarComp";
import MemberProfile from "../roomPage/memberProfile/memberProfile";

export default function ContactsPage({onBack, onOpenRoom }) {

    const [list, setList] = useState([]);
	const [selectUser, setSelectUser] = useState();

    const getContacts = async () => {
        const res = await api.getContacts()
        setList(res.people);
    }

    useEffect(() => {
        api && getContacts();
    }, [api])

    const go2DMroom = async () => {
		const newRoomId = await api.createDMRoom(selectUser);
		onOpenRoom(newRoomId);
    }
    
    return <Styled styles={styles}>
        <div className="contacts_page" >
            <div className="left">
                <ul>
                {
                    list.map((p, i) => (
                        <li key={i} className="contact-item" onClick={()=>setSelectUser(p.contact_id)}>
                            <div className="contact-avatar" >
                                <AvatarComp url={p.avatar_url} />
                            </div>
                            <div>
                                <p>{p.displayname}</p>
                                <p>{p.contact_id.slice(0, 10)}...</p>
                            </div>
                        </li>
                    ))
                }
                </ul>
            </div>
            <div className="right" onClick={onBack}></div>
            {selectUser && <MemberProfile memberId={selectUser} go2DMroom={go2DMroom} onBack={onBack} />}
        </div>
    </Styled>
 }