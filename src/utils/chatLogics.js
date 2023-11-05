import { notification } from 'antd';

export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (i < messages.length - 1 && messages[i + 1].sender.id === m.sender.id && messages[i].sender.id !== userId)
        return 33;
    else if (
        (i < messages.length - 1 && messages[i + 1].sender.id !== m.sender.id && messages[i].sender.id !== userId) ||
        (i === messages.length - 1 && messages[i].sender.id !== userId)
    )
        return 0;
    else return 'auto';
};

export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender.id !== m.sender.id || messages[i + 1].sender.id === undefined) &&
        messages[i].sender.id !== userId
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender.id !== userId &&
        messages[messages.length - 1].sender.id
    );
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender.id === m.sender.id;
};

export const getSender = (loggedUser, users) => {
    return users[0]?.id === loggedUser?.id ? users[1].firstName : users[0].firstName;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0].id === loggedUser.id ? users[1] : users[0];
};

export const getAvatarCustomer = (memberChatId, chats) => {
    const chat = chats?.find(chat => chat.memberChatId === memberChatId);
    return chat?.customerInfoData?.avatarData?.url;
};

export const getSenderName = (roleKey = '', notification = {}) => {
    const map = {
        R1: notification?.chat?.customerInfoData?.firstName,
        R2: notification?.chat?.adminInfoData?.firstName,
    };
    return map[roleKey] || '';
};
