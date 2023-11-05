import { axiosPublic } from 'config/axios';

export const createRoomService = (axiosPrivate, data) => {
    return axiosPrivate.post(`/rooms/createRoom`, data);
};
export const updateRoomService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`/rooms/updateRoom/${id}`, data);
};
export const updateRoomStatusService = (axiosPrivate, id, data) => {
    return axiosPrivate.put(`rooms/updateRoomStatus/${id}`, data);
};
export const deleteRoomService = (axiosPrivate, id) => {
    return axiosPrivate.delete(`/rooms/deleteRoom/${id}`);
};

export const getAllRoomsService = () => {
    return axiosPublic.get('/rooms/getAllRooms');
};

export const getRoomService = (axiosPrivate, id) => {
    return axiosPrivate.get(`/rooms/getRoom/${id}`);
};

export const getAllRoomsByRoomTypeKeyService = roomTypeKey => {
    return axiosPublic.get(`/rooms/getAllRoomsByRoomTypeKey/${roomTypeKey}`);
};
export const getAllRoomsAvailableByRoomTypeKeyService = (roomTypeKey, checkIn, checkOut) => {
    return axiosPublic.get(
        `/rooms/getAllRoomsAvailableByRoomTypeKey/?roomTypeKey=${roomTypeKey}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
};
export const checkRoomAvailableService = (axiosPrivate, id, checkIn, checkOut) => {
    return axiosPrivate.get(`/rooms/checkRoomAvailable/?roomId=${id}&checkIn=${checkIn}&checkOut=${checkOut}`);
};
