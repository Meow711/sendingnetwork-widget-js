import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./listTitle.css";
import {
  widgetTitleMore,
  widgetTitleMoreCreate,
  widgetTitleMoreSet,
  widgetTitleLogout
} from "../../../imgs/index";
import ContactIcon from "../../../imgs/contact.png";

const ListTitle = ({ closeModalms, menuClick, openContacs }) => {
  const [showSetBox, setShowSetBox] = useState(false);

  useEffect(() => {
    if (showSetBox) {
      setShowSetBox(false)
    }
  }, [closeModalms])

  const handleMenuClick = (type) => {
    setShowSetBox(false)
    menuClick(type)
  }

  return (
    <Styled styles={styles}>
      <div className="chat_widget_title">
        <div onClick={openContacs} className="chat_widget_title_contact">
          <img src={ContactIcon} />
        </div>
        <div className="chat_widget_title_text">Chat</div>
        <div className="chat_widget_title_set" onClick={(e) => {
          e.stopPropagation();
          setShowSetBox(!showSetBox);
        }}>
          <img src={widgetTitleMoreCreate} />
        </div>
        {showSetBox && (
          <div className="chat_widget_title_setBox" onClick={(e) => { e.stopPropagation() }}>
            <div className="chat_widget_title_setBox_item" onClick={() => handleMenuClick('create')}>
              {/* <img src={widgetTitleMoreCreate} /> */}
              <span>New Chat</span>
            </div>
            <div className="chat_widget_title_setBox_item" onClick={() => handleMenuClick('search')}>
              {/* <img src={widgetTitleMoreCreate} /> */}
              <span>Add Contact</span>
            </div>
            {/* <div className="chat_widget_title_setBox_item" onClick={() => handleMenuClick('set')}>
              <img src={widgetTitleMoreSet} />
              <span>Settings</span>
            </div> */}
            {/* <div className="chat_widget_title_setBox_item" onClick={() => handleMenuClick('logout')}>
              <img src={widgetTitleLogout} />
              <span>Logout</span>
            </div> */}
          </div>
        )}
			</div>
		</Styled>
  );
};

export default ListTitle;
