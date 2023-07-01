import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./roomTitle.css";
import { roomTitleBackIcon, roomTitleMoreIcon } from "../../../imgs/index";

const RoomTitle = ({ roomName, onBack, setClick }) => {
  return (
    <Styled styles={styles}>
      <div className="roomPage_room_title">
				<div className="room_title_left" onClick={() => onBack()}>
					<img src={roomTitleBackIcon} />
				</div>
				<div className="room_title_center">{roomName}</div>
				<div className="room_title_right" onClick={() => setClick()}>
					<img src={roomTitleMoreIcon} />
				</div>
			</div>
		</Styled>
  );
};

export default RoomTitle;
