import React, { useEffect, useMemo, useRef, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./mainPage.css";
import ListTitle from "./listTitle/listTitle";
import RoomList from "./roomList/roomList.js";
import { api } from "./../../api";
import InvitePage from "../invitePage/invitePage";
import ContactsPage from "../contactsPage/contactsPage";
import SearchPage from "../searchPage/searchPage";

const MainPage = ({ rooms, goToRoom, onMenuClick }) => {
    const [closeModalms, setCloseModalms] = useState("");
    const [roomList, setRoomList] = useState(rooms);
    const [myUserData, setMyUserData] = useState({});

    const [showInvite, setShowInvite] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        setRoomList(rooms);
        initUserData();
    }, [rooms]);

    const initUserData = async () => {
        const res = await api.getUserData();
        setMyUserData(res);
    };

    const handleMenu = (type) => {
        if (type === "create") {
            setShowInvite(true);
        } else if (type === "search") {
            setShowSearch(true);
        } else {
            onMenuClick(type);
        }
    };

    const openContacs = () => {
        setShowContacts(true);
    };

    return (
        <Styled styles={styles}>
            <div
                className="chat_widget_main_page"
                onClick={() => {
                    setCloseModalms(new Date().getTime());
                }}
            >
                <ListTitle closeModalms={closeModalms} menuClick={handleMenu} openContacs={openContacs} />
                <RoomList rooms={roomList} myUserData={myUserData} enterRoom={(roomId) => goToRoom(roomId)} />
                {showInvite && <InvitePage onBack={() => setShowInvite(false)} />}
                {showContacts && (
                    <ContactsPage onOpenRoom={(roomId) => goToRoom(roomId)} onBack={() => setShowContacts(false)} />
                )}
                {showSearch && (
                    <SearchPage onOpenRoom={(roomId) => goToRoom(roomId)} onBack={() => setShowSearch(false)} />
                )}
            </div>
        </Styled>
    );
};

export default MainPage;
