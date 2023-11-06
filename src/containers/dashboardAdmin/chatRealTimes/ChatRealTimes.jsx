import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    Box,
    Unstable_Grid2 as Grid,
    useTheme,
    Button,
    Paper,
    TextField,
    Stack,
    Divider,
    CardHeader,
    Avatar,
    IconButton,
    Typography,
    Badge,
    Tooltip,
    Drawer,
    InputBase,
    Skeleton,
} from '@mui/material';
import { Send, Search } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSpring, animated } from '@react-spring/web';

import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import _, { debounce } from 'lodash';

import io from 'socket.io-client';

import chatImage from 'assets/image/chat.png';
import LoadingOverlay from 'components/common/LoadingOverlay';
import FlexBetween from 'components/common/FlexBetween';

import useAxiosPrivate from 'hooks/useAxiosPrivate';

import {
    createContentChatService,
    getAllMemberChatByAdminIdService,
    getAllContentChatService,
    getAllUsersSearchService,
    getMemberChatByCustomerIdService,
} from 'services/chatRealTimesService';

import { updateSelectedChat, updateNotifications, updateChats } from 'store/slice/chatSlice';
import { LANGUAGES } from 'utils';

const ENDPOINT = process.env.REACT_APP_URL;
var socket, selectedChatCompare;

const ChatRealTimes = () => {
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const theme = useTheme();
    const lgUp = useMediaQuery(theme => theme.breakpoints.up('lg'));
    const neutralLight = theme.palette.neutral.light;
    const primaryLight = theme.palette.primary.light;
    const primary = theme.palette.primary.main;

    const [fetchAgain, setFetchAgain] = useState(false);

    const [socketConnected, setSocketConnected] = useState(false);

    const language = useSelector(state => state.app.language);
    const [isLoading, setIsLoading] = useState(false);

    const { selectedChat = {}, notifications = [], chats = [] } = useSelector(state => state.chat);
    const id = useSelector(state => state.auth.userInfo?.id || '');
    const userInfo = useSelector(state => state.auth.userInfo || {});

    const [searchToggled, setSearchToggled] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const handleSearch = debounce(async event => {
        if (event.target.value) {
            try {
                setLoadingSearch(true);
                setSearchResult([]);
                const response = await getAllUsersSearchService(axiosPrivate, event.target.value);

                if (response?.data?.data) {
                    setSearchResult(response?.data?.data);
                    setLoadingSearch(false);
                } else {
                    setLoadingSearch(false);
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);
                }
                setLoadingSearch(false);
            } finally {
                setLoadingSearch(false);
            }
        }
    }, 500);

    const getAllMemberChat = async () => {
        try {
            setIsLoading(true);
            const response = await getAllMemberChatByAdminIdService(axiosPrivate, id);
            if (response?.data?.data) {
                dispatch(updateChats(response.data.data));
                setIsLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const getMemberChat = async customerId => {
        try {
            setIsLoading(true);
            const response = await getMemberChatByCustomerIdService(axiosPrivate, { adminId: id, customerId });
            if (response?.data?.data) {
                const chat = response?.data?.data;
                setSearchToggled(!searchToggled);
                if (!chats.find(c => c.id === chat.id)) dispatch(updateChats([chat, ...chats]));
                dispatch(updateSelectedChat(chat));
                setIsLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const getAllContentChat = async () => {
        try {
            if (!selectedChat?.id) return;
            setIsLoading(true);
            const response = await getAllContentChatService(axiosPrivate, selectedChat?.id);
            if (response?.data?.data) {
                setMessages(response.data.data);
                setIsLoading(false);
                socket.emit('join chat', selectedChat?.id);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const createContentChat = async event => {
        try {
            if (event.key !== 'Enter' || !newMessage) return;
            socket.emit('stop typing', selectedChat.id);

            setIsLoading(true);
            setNewMessage('');
            const response = await createContentChatService(axiosPrivate, {
                memberChatId: selectedChat?.id,
                senderId: id,
                message: newMessage,
            });
            if (response?.data?.data) {
                setIsLoading(false);
                socket.emit('new message', response.data.data);
                setMessages([...messages, response.data.data]);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllMemberChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', userInfo);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        getAllContentChat();

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on('message received', newMessageReceived => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare.id !== newMessageReceived.chat.id
            ) {
                if (!notifications.includes(newMessageReceived)) {
                    dispatch(updateNotifications([newMessageReceived, ...notifications]));
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const typingHandler = event => {
        setNewMessage(event.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat.id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat.id);
                setTyping(false);
            }
        }, timerLength);
    };

    const typingAnimation = useSpring({
        opacity: isTyping ? 1 : 0,
        transform: isTyping ? 'translateY(0px)' : 'translateY(20px)',
    });

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Grid container xs={12} lg={12} p={2} spacing={2}>
                <Grid xs={12} lg={12}>
                    <FlexBetween>
                        <Tooltip title="Search">
                            <IconButton onClick={() => setSearchToggled(!searchToggled)}>
                                <Search />
                            </IconButton>
                        </Tooltip>
                        <Avatar
                            alt="avatar-customer"
                            src={selectedChat?.customerInfoData?.avatarData?.url || ''}
                            sx={{ cursor: 'pointer' }}
                        />
                    </FlexBetween>
                </Grid>
                {lgUp && (
                    <Grid
                        lg={4}
                        sx={{
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 190px)',
                        }}
                    >
                        <Stack spacing={1}>
                            {!_.isEmpty(chats)
                                ? chats.map((chat, index) => (
                                      <Paper
                                          key={index}
                                          onClick={() => dispatch(updateSelectedChat(chat))}
                                          elevation={selectedChat?.id === chat.id ? 6 : 0}
                                          sx={{ cursor: 'pointer', transition: 'all linear 0.2s' }}
                                      >
                                          <CardHeader
                                              avatar={
                                                  <Badge badgeContent={4} color="primary">
                                                      <Avatar
                                                          aria-label="avatar"
                                                          src={chat?.customerInfoData?.avatarData?.url}
                                                      />
                                                  </Badge>
                                              }
                                              action={
                                                  <Typography variant="body2">
                                                      {chat?.contentChatData?.length > 0 &&
                                                          dayjs(
                                                              chat.contentChatData[chat.contentChatData.length - 1]
                                                                  .createdAt
                                                          ).format('DD/MM/YYYY')}
                                                  </Typography>
                                              }
                                              title={
                                                  LANGUAGES.VI === language
                                                      ? `${chat?.customerInfoData?.lastName} ${chat?.customerInfoData?.firstName}`
                                                      : `${chat?.customerInfoData?.firstName} ${chat?.customerInfoData?.lastName}`
                                              }
                                              subheader={
                                                  chat?.contentChatData?.length > 0 &&
                                                  chat.contentChatData[chat.contentChatData.length - 1]?.message
                                                      ?.length > 50
                                                      ? chat.contentChatData[
                                                            chat.contentChatData.length - 1
                                                        ]?.message.substring(0, 51) + '...'
                                                      : chat.contentChatData?.[chat.contentChatData.length - 1]?.message
                                              }
                                          />
                                          <Divider />
                                      </Paper>
                                  ))
                                : Array.from({ length: 6 }).map((_, index) => (
                                      <CardHeader
                                          key={index}
                                          avatar={
                                              <Skeleton animation={false} variant="circular" width={40} height={40} />
                                          }
                                          action={null}
                                          title={
                                              <Skeleton
                                                  animation={false}
                                                  height={10}
                                                  width="80%"
                                                  style={{ marginBottom: 6 }}
                                              />
                                          }
                                          subheader={<Skeleton animation={false} height={10} width="40%" />}
                                      />
                                  ))}
                        </Stack>
                    </Grid>
                )}
                <Grid
                    container
                    xs={12}
                    lg={8}
                    sx={{
                        alignItems: 'center',
                    }}
                >
                    <Grid
                        xs={12}
                        lg={12}
                        p={2}
                        sx={{
                            overflowY: 'auto',
                            height: 'calc(100vh - 250px)',
                        }}
                    >
                        {!_.isEmpty(messages) ? (
                            <Stack
                                spacing={2}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                {messages?.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: id === item?.senderId ? 'flex-end' : 'flex-start',
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                padding: 1,
                                                backgroundColor: id === item?.senderId ? primary : primaryLight,
                                                maxWidth: '80%',
                                            }}
                                        >
                                            <Typography align="justify" variant="body2">
                                                {item?.message}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <>
                                <Box width="100%" display="flex" justifyContent="center">
                                    <img
                                        alt="chat"
                                        src={chatImage}
                                        style={{
                                            display: 'inline-block',
                                            width: '55%',
                                        }}
                                    />
                                </Box>
                            </>
                        )}
                    </Grid>
                    {isTyping && (
                        <>
                            <Grid xs={12} lg={12}>
                                <animated.div style={typingAnimation}>Typing...</animated.div>
                            </Grid>
                        </>
                    )}

                    {!_.isEmpty(selectedChat) && (
                        <>
                            <Grid xs={11} lg={11}>
                                <TextField
                                    value={newMessage}
                                    onKeyDown={event => createContentChat(event)}
                                    onChange={event => typingHandler(event)}
                                    fullWidth
                                    variant="standard"
                                    label="Type a message"
                                />
                            </Grid>
                            <Grid xs={1} lg={1}>
                                <Button fullWidth variant="contained" color="info">
                                    <Send />
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
            <Drawer
                anchor="left"
                open={searchToggled}
                onClose={() => setSearchToggled(!searchToggled)}
                PaperProps={{
                    sx: {
                        width: 400,
                    },
                }}
                sx={{ zIndex: 10000 }}
            >
                <FlexBetween backgroundColor={neutralLight} gap="0.8rem" padding="0.1rem 1.3rem">
                    <InputBase placeholder="Search user..." onChange={event => handleSearch(event)} />
                    <IconButton>
                        <Search />
                    </IconButton>
                </FlexBetween>
                {loadingSearch ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <CardHeader
                            key={index}
                            avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                            action={null}
                            title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
                            subheader={<Skeleton animation="wave" height={10} width="40%" />}
                        />
                    ))
                ) : !_.isEmpty(searchResult) ? (
                    searchResult.map((user, index) => (
                        <CardHeader
                            key={index}
                            sx={{ cursor: 'pointer' }}
                            avatar={
                                <Badge badgeContent={4} color="primary">
                                    <Avatar aria-label="avatar" src={user?.avatarData?.url} />
                                </Badge>
                            }
                            action={
                                <Typography variant="body2">{dayjs(user?.birthday).format('DD/MM/YYYY')}</Typography>
                            }
                            title={
                                LANGUAGES.VI === language
                                    ? `${user?.lastName} ${user?.firstName}`
                                    : `${user?.firstName} ${user?.lastName}`
                            }
                            subheader={user?.email}
                            onClick={() => getMemberChat(user.id)}
                        />
                    ))
                ) : (
                    <Typography variant="body1" align="center" mt={2}>
                        <FormattedMessage id="dashboardAdmin.chatRealTimes.noFoundUser" />
                    </Typography>
                )}
            </Drawer>
        </>
    );
};
export default ChatRealTimes;
