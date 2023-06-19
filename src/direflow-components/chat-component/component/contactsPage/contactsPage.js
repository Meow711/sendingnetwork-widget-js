import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./contactsPage.css";
import { api } from "./../../api";

import { AvatarComp } from "../avatarComp/avatarComp";
import MemberProfile from "../roomPage/memberProfile/memberProfile";

import { roomTitleBackIcon } from "../../imgs/index";

export default function ContactsPage({ onBack, onOpenRoom }) {
    const [list, setList] = useState([]);
    const [selectUser, setSelectUser] = useState();
    const [filterStr, setFilterStr] = useState("");
    const [filterList, setFilterList] = useState([]);

    const getUsers = async (wallets) => {
        const res = await window.seeDAOosApi.getUsers(wallets);
        const map = {};
        res.data.forEach((u) => {
            map[u.wallet] = u;
        });
        return map;
    };

    const getContacts = async () => {
        const res = await api.getContacts();
        const sourceList = res.people;
        if (process.env.NODE_ENV === "development") {
            setList(sourceList);
        } else {
            // get info from os
            const user_map = await getUsers(sourceList.map((p) => p.wallet_address));
            setList(
                sourceList.map((s) => {
                    const u = user_map[s.wallet_address.toLowerCase()];
                    return {
                        ...s,
                        avatar_url: u.avatar,
                        displayname: u.name,
                    };
                }),
            );
        }
    };

    useEffect(() => {
        api && getContacts();
    }, [api]);

    const go2DMroom = async () => {
        const newRoomId = await api.createDMRoom(selectUser);
        onOpenRoom(newRoomId);
    };

    const handleBackClick = () => {
        onBack();
    };

    useEffect(() => {
        if (!filterStr) {
            setFilterList(list);
        } else {
            const newList = list.filter(
                (p) => p.displayname.includes(filterStr) || p.wallet_address.toLowerCase().includes(filterStr),
            );
            setFilterList(newList);
        }
    }, [filterStr, list]);

    return (
        <Styled styles={styles}>
            <div className="contacts_page">
                <div className="left" onClick={onBack}></div>
                <div className="right">
                    {/* title */}
                    <div className="contacts_page_header">
                        <div className="title_back" onClick={handleBackClick}>
                            <img src={roomTitleBackIcon} />
                        </div>
                        <div className="title_search">
                            {/* search */}
                            <input
                                className="filter-box"
                                placeholder="Search"
                                value={filterStr}
                                onChange={(e) => setFilterStr(e.target.value)}
                            />
                        </div>
                    </div>
                    <ul>
                        {filterList.map((p, i) => (
                            <li key={i} className="contact-item" onClick={() => setSelectUser(p.contact_id)}>
                                <div className="contact-avatar">
                                    <AvatarComp url={p.avatar_url} />
                                </div>
                                <div>
                                    <p>{p.displayname}</p>
                                    <p>{p.wallet_address}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {selectUser && <MemberProfile memberId={selectUser} go2DMroom={go2DMroom} onBack={onBack} />}
            </div>
        </Styled>
    );
}
