import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./roomList.css";
import RoomItem from "../roomItem/roomItem";
import { calculateRoomName } from "../../../utils/index";

const RoomList = ({ rooms, myUserData, enterRoom }) => {
  const [filterStr, setFilterStr] = useState("");
  const [list, setList] = useState([]);

  const handleJoinedRoomName = (room) => {
    const ship = room.getMyMembership();
    let result = "";
    if (ship === "join") {
        result = calculateRoomName(room);
    } else if (ship === "invite") {
        const { name, roomId } = room;
        result = name;
        if (/^@sdn_/.test(name)) {
            const inviterId = roomId.split("-")[1];
            result = inviterId || name;
        }
    }
    return result;
};

  useEffect(() => {
    const fRooms = rooms.filter(r => {
      const nameStr = handleJoinedRoomName(r).toLowerCase();
      const fltStr = String.prototype.toLowerCase.call(filterStr);
      return nameStr.indexOf(fltStr) !== -1;
    });

    const inviteRooms = fRooms.filter((room) => {
      return room.getMyMembership() === "invite";
    });
    const joinRooms = fRooms.filter((room) => {
      return room.getMyMembership() === "join";
    });
    setList([...inviteRooms, ...joinRooms])
  }, [rooms, filterStr]);

  return (
    <Styled styles={styles}>
      <div className="rooms">
        <input
          className="filter-box"
          placeholder="Search"
          value={filterStr}
          onChange={(e) => setFilterStr(e.target.value)}
        />
        <div className="rooms-list">
          {list.map((room) => {
            return <RoomItem key={room.roomId} room={room} enterRoom={enterRoom} myUserData={myUserData} />
          })}
        </div>
      </div>
    </Styled>
  );
};

export default RoomList;
