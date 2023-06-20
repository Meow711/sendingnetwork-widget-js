import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./memberProfile.css";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { api } from "../../../api";
import { roomTitleBackIcon, copyIcon } from "../../../imgs/index";
import { formatUsers, showToast, formatTextLength } from "../../../utils/index";
import { AvatarComp } from "../../avatarComp/avatarComp";

const MemberProfile = ({ memberId, onBack, go2DMroom }) => {
  const [walletAddr, setWalletAddr] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    getProfileInfo();
  }, [memberId]);

  const getProfileInfo = async () => {
    const userData = await api._client.getProfileInfo(memberId);
    const [newUser] = await formatUsers([userData]);
    setWalletAddr(newUser.wallet_address);
    setAvatarUrl(newUser.avatar_url);
    setDisplayname(newUser.displayname);
  };

  const add2contact = () => {
    api.addContact(memberId);
  }

  const removeContact = () => {
    api.removeContact(memberId);
  }

  return (
    <Styled styles={styles}>
      <div className="memberProfile">
        {/* title */}
        <div className="memberProfile_room_title">
          <div className="memberProfile_room_title_left" onClick={() => onBack()}>
            <img src={roomTitleBackIcon} />
          </div>
          <div className="room_title_center">{formatTextLength(displayname, 30, 15)}</div>
        </div>
        <div className="memberProfile_content">
            {/* avatar */}
            <div className="memberProfile_user_avatar">
              <AvatarComp url={avatarUrl} />
            </div>

            {/* userName */}
            <p className="memberProfile_alias-label">Display Name</p>
            <div className="memberProfile_alias-text">{displayname}</div>

            {/* userInfo */}
            <p className="memberProfile_alias-label">Wallet Address</p>
            <div className="memberProfile_userinfo-box-item">
              <p>{walletAddr}</p>
              <CopyToClipboard text={walletAddr} onCopy={(text, result) => {
                if (result) {
                  showToast({
                    type: 'success',
                    msg: 'Copied successful',
                  })
                }
              }}>
                  <img src={copyIcon} />
              </CopyToClipboard>
              
            </div>
        </div>
        
        <div className="btn-group">
            <div className="btn-add" onClick={add2contact}>Add contact</div>
            <div className="btn-remove" onClick={removeContact}>Remove contact</div>
            <div className="btn-msg" onClick={go2DMroom}>message</div>
          </div>
      </div>
		</Styled>
  );
};

export default MemberProfile;
