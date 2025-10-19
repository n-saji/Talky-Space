import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    name: "",
    email: "",
    avatar_file_path: "",
    avatar_url: "",
    phone_number: "",
  },
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar_file_path = action.payload.avatar_file_path;
      state.avatar_url = action.payload.avatar_url;
      state.phone_number = action.payload.phone_number;
    },
    clearUser(state) {
      state.id = null;
      state.name = "";
      state.email = "";
      state.phone_number = "";
      state.avatar_file_path = "";
      state.avatar_url = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
