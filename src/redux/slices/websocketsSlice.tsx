import { createSlice } from "@reduxjs/toolkit";

export interface Message {
  user_id: string;
  receiver_id: string;
  content: string;
  chatroom_id: string;
  source: string;
  created_at: string;
  id: string;
}

const websocketSlice = createSlice({
  name: "websocket",
  initialState: {
    socket: null,
    connected: false,
    messages: [] as Message[],
  },
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
    },
    setConnected(state, action) {
      state.connected = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { setSocket, setConnected, addMessage, clearMessages } =
  websocketSlice.actions;
export default websocketSlice.reducer;
