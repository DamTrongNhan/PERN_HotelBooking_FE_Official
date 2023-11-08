import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);
const now = dayjs();

export const getPartnerInfo = (id = '', selectedChat = {}) => {
    let partnerInfo = {};

    if (selectedChat?.userId1 === id) {
        partnerInfo = selectedChat?.user2InfoData || {};
    } else if (selectedChat?.userId2 === id) {
        partnerInfo = selectedChat?.user1InfoData || {};
    }
    return partnerInfo;
};

export const getTimeAgo = dateFromDatabase => {
    const diff = now.diff(dateFromDatabase);
    const timeAgo = dayjs.duration(diff).humanize();
    return timeAgo;
};
