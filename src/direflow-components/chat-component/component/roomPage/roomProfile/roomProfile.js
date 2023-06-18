import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./roomProfile.css";
import { api } from "../../../api";
import { roomTitleBackIcon } from "../../../imgs/index";
import { AvatarComp } from "../../avatarComp/avatarComp";
import { calculateRoomName, showToast } from "../../../utils/index";

const RoomProfile = ({ room = {}, backClick }) => {
    const [showSetting, setShowSetting] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [joinedMembers, setJoinedMembers] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        const members = room.getJoinedMembers();
        console.log("members:", members);
        const tmpName = calculateRoomName(room, true);
        setRoomName(tmpName);
        setEditName(tmpName);
        setJoinedMembers(members);
    }, []);

    const handleBackClick = () => {
        showSetting ? setShowSetting(false) : backClick();
    };

    const handleSettingLeave = async () => {
        await api.leave(room.roomId);
        backClick("leaved");
    };

    const handleDeleteRoom = async () => {
        await api.deleteRoom(room.roomId);
        backClick("leaved");
    };

    const handleSaveName = async () => {
        if (!editName) {
            showToast({
                type: "info",
                msg: "the input name is null",
            });
            return;
        }
        if (!room || !room.roomId) {
            showToast({
                type: "error",
                msg: "room info check fail",
            });
            return;
        }
        api._client.setRoomName(room.roomId, editName, () => {
            showToast({
                type: "success",
                msg: "Operation successful",
            });
			setRoomName(editName);
			setShowEdit(true);
        });
    };

    const handleCancelName = async () => {
        setEditName(roomName);
        setShowEdit(false);
    };

    return (
        <Styled styles={styles}>
            <div className="room_profile">
                {/* title */}
                <div className="room_profile_title">
                    <div className="title_back" onClick={() => handleBackClick()}>
                        <img src={roomTitleBackIcon} />
                    </div>
                    {showEdit ? (
                        <div className="room_setting_input_box">
                            <input
                                className="room_setting_input"
                                defaultValue={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <button onClick={handleSaveName}>Save</button>
                            <button onClick={handleCancelName}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <span className="title_back_setting">{roomName}</span>
                            <span onClick={() => setShowEdit(true)}>Edit</span>
                        </div>
                    )}
                </div>

                <div className="room_profile_wrap">
                    {/* members */}
                    <div className="room_members">
                        {joinedMembers.map((member) => {
                            return (
                                <div className="room_members_item" key={member.userId}>
                                    <div className="room_members_item_avatar">
                                        <AvatarComp url={member?.user?.avatarUrl} />
                                    </div>
                                    <div className="room_members_item_desc">
                                        <p className="room_members_item_desc_name">{member.name}</p>
                                        <p className="room_members_item_desc_addr">{member.userId}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* btns */}
                    <div className="info_room_btns">
                        <span className="btn" onClick={() => backClick("invite")}>
                            Invite
                        </span>
                        <span className="btn" onClick={handleSettingLeave}>
                            Leave
                        </span>
                        <span className="btn" onClick={handleDeleteRoom}>
                            Delete
                        </span>
                    </div>
                </div>
            </div>
        </Styled>
    );
};

export default RoomProfile;
