import React, { useEffect, useState, useMemo } from "react";
import { Styled } from "direflow-component";
import styles from "./searchPage.css";
import {
	roomTitleBackIcon,
	morePagePersonIcon,
	inviteSelectedIcon,
	inviteUnselectIcon,
	dialogLoadingIcon
} from "../../imgs/index"
import { api } from "../../api";
import { formatTextLength, formatUsers } from "../../utils/index";
import InputDialogComp from "../inputDialogComp/inputDialogComp";
import MemberProfile from "../roomPage/memberProfile/memberProfile";
import Web3 from "web3";
import { AvatarComp } from "../avatarComp/avatarComp";

const SwarchPage = ({ roomId, onBack, onOpenRoom }) => {
	const [filterStr, setFilterStr] = useState("");
	const [searchList, setSearchList] = useState([]);
	const [selectList, setSelectList] = useState([]);
	const [showDialog, setShowDialog] = useState(false);
	const [dialogStatus, setDialogStatus] = useState('loading');
	const [dialogText, setDialogText] = useState("");

	const [selectUser, setSelectUser] = useState();

	const [contacts, setcontacts] = useState([]);

	const getcontacts = async () => { 
		const res = await api.getContacts();
        setcontacts(res.people);
	}

	useEffect(() => {
		getcontacts();
	}, [])

	const handleSearch = async () => {
		let tmpStr = filterStr.toLowerCase();
			if (/^0[x|X]./g.test(tmpStr)) {
				const tmpStrArr = tmpStr.match(/^0[x|X](.+)/);
				tmpStr = tmpStrArr[1] || tmpStr;
			}
		try {
			const resp = await api._client.searchUserDirectory({
				term: tmpStr,
				limit: 10
			})
			if (resp && resp.results && resp.results.length > 0) {
				const tmpArr = resp.results.map(item => {
					return {
						...item,
						wallet_address: `0x${item.user_id.split(':')[1]}`,
					}
				})
				const formatList = await formatUsers(tmpArr);
				setSearchList(formatList)
			} else if (resp && resp.results) {
				setSearchList([])
			}
		} catch (error) {
			console.error(error);
			setSearchList([])
		}
	}

	useEffect(() => {
		if (!filterStr || !Web3.utils.isAddress(filterStr)) {
			setSearchList([]);
		} else {
			handleSearch();
		}
	}, [filterStr])

	const handleBackClick = () => {
		setFilterStr("")
		setSelectList([])
		setSearchList([])
		onBack()
	}


	const handleSearchListClick = (user) => {
		setSelectUser(user.user_id);
		// const arr = JSON.parse(JSON.stringify(selectList));
		// const arrSearch = JSON.parse(JSON.stringify(searchList));
		// const index = arr.findIndex(v => v.user_id === user.user_id);
		// const indexSearch = arrSearch.findIndex(v => v.user_id === user.user_id);

		// if (index !== -1) {
		// 	arr.splice(index, 1)
		// } else {
		// 	arr.push({
		// 		...user,
		// 		isSelected: true
		// 	})
		// }
		// arrSearch.splice(indexSearch, 1, {
		// 	...user,
		// 	isSelected: !user.isSelected
		// });
		// setSelectList(arr);
		// setSearchList(arrSearch);
	}

	const go2DMroom = async () => {
		const newRoomId = await api.createDMRoom(selectUser);
		onOpenRoom(newRoomId);
	}

	const isContact = useMemo(() => {
        return !!contacts.find(l => l.contact_id === selectUser);
    }, [selectUser, contacts])
	
  return (
    <Styled styles={styles}>
		<div className="search_page">
			<div className="left" onClick={onBack}></div>
			<div className="right">
				{/* title */}
				<div className="search_page_title">
					<div className="title_back" onClick={handleBackClick}>
						<img src={roomTitleBackIcon} />
					</div>
					<div className="title_text">search user</div>
				</div>

				{/* search */}
				<input
					className="filter-box"
					placeholder="Search"
					value={filterStr}
					onChange={(e) => setFilterStr(e.target.value)}
				/>

				{/* list */}
				<div className="list-wrap">
					{
						(searchList).map(item => {
							return (
								<div className="members_item" key={item.user_id} onClick={() => {
									handleSearchListClick(item)
								}}>
									<div className="members_item_avatar">
										<AvatarComp url={item.avatar_url} />
									</div>
									<div className="members_item_desc">
										<p className="members_item_desc_name">{formatTextLength(item.display_name, 13, 5)}</p>
										<p className="members_item_desc_addr">{item.wallet_address}</p>
									</div>
								</div>
							)
						})
					}
				</div>

				{/* dialog */}
				{showDialog && (
				<div className="search_page_dialog">
					<div className="search_page_dialog_content">
					<div className="info">
										{dialogStatus === 'loading' && (
											<div className="search_page_dialog_loading">
												<img src={dialogLoadingIcon} />
												<span>Processing...</span>
											</div>
										)}
										{dialogStatus === 'success' && (<p className="info-desc">{dialogText}</p>)}
					</div>
									{dialogStatus === 'success' && (<div className="btns" onClick={handleBackClick}>Ok</div>)}
					</div>
				</div>
				)}
				{selectUser && <MemberProfile memberId={selectUser} go2DMroom={go2DMroom} onBack={onBack} isContact={isContact} />}
			</div>
		</div>
	</Styled>
  );
};

export default SwarchPage;
