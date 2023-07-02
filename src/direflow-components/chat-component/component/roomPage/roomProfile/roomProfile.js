import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./roomProfile.css";
import { api } from "../../../api";
import { roomTitleBackIcon } from "../../../imgs/index";
import { AvatarComp } from "../../avatarComp/avatarComp";
import { calculateRoomName, formatUsers, showToast } from "../../../utils/index";
import EditIcon from "../../../imgs/edit.png";

const RoomProfile = ({ room = {}, backClick }) => {
    const [roomName, setRoomName] = useState("");
    const [joinedMembers, setJoinedMembers] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editName, setEditName] = useState("");

    const handleMembers = async () => {
        const members = room.getJoinedMembers();
        const formatMembers = members.map((member) => { 
            const wallet = member.userId.split(":")[1];
            return {
                ...member.user,
                wallet_address: wallet,
            }
        })
        const newMembers = await formatUsers(formatMembers)
        const tmpName = calculateRoomName(room, true);
        console.log("members:", newMembers);

        setRoomName(tmpName);
        setEditName(tmpName);
        setJoinedMembers(newMembers);
    }

    useEffect(() => {
        handleMembers()
    }, []);

    const handleBackClick = () => {
        backClick('room', roomName);
    };

    const handleSettingLeave = async () => {
        await api.leave(room.roomId, () => {
            backClick("leaved");
        });
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
        await api._client.setRoomName(room.roomId, editName, () => {
            showToast({
                type: "success",
                msg: "Operation successful",
            });
            setRoomName(editName);
            setShowEdit(false);
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
                            <div className="btn btn-title btn-title-save" onClick={handleSaveName}>Save</div>
                            <div className="btn btn-title btn-title-cancel" onClick={handleCancelName}>Cancel</div>
                        </div>
                    ) : (
                        <div className="title_back_setting_box">
                            <span className="title_back_setting">{roomName}</span>
                            <span onClick={() => setShowEdit(true)} className="btn-edit">
                                <img src={EditIcon } alt="" />
                            </span>
                        </div>
                    )}
                </div>

                <div className="room_profile_wrap">
                    {/* members */}
                    <div className="room_members">
                        {joinedMembers.map((member) => {
                            return (
                                <div className="room_members_item" key={member.wallet_address}>
                                    <div className="room_members_item_avatar">
                                        <AvatarComp url={member.avatarUrl} />
                                    </div>
                                    <div className="room_members_item_desc">
                                        <p className="room_members_item_desc_name">{member.displayname}</p>
                                        <p className="room_members_item_desc_addr">{member.wallet_address}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* btns */}
                    <div className="info_room_btns">
                        <span className="btn btn-invite" onClick={() => backClick("invite")}>
                            Invite
                        </span>
                        <span className="btn btn-leave" onClick={handleSettingLeave}>
                            Leave
                        </span>
                        <span className="btn btn-delete" onClick={handleDeleteRoom}>
                            Delete
                        </span>
                    </div>
                </div>
            </div>
        </Styled>
    );
};

export default RoomProfile;
