import { create } from "zustand";
import axios from "axios";

const authStore = create((set) => ({
  loggedIn: null,

  loginForm: {
    email: "",
    password: "",
  },

  updateLoginForm: (e) => {
    const { name, value } = e.target;

    set((state) => {
      return {
        loginForm: {
          ...state.loginForm,
          [name]: value,
        },
      };
    });
  },

  login: async () => {
    const { loginForm } = authStore.getState();

    const res = await axios.post("/api/users/login", loginForm, {
      withCredentials: true,
    });
    console.log(res);

    set({loggedIn: true});
  },

  checkAuth: async () => {
    try {
      await axios.get("/api/users/checkauth", {
        withCredentials: true,
      });
      set({loggedIn: true});
    } catch (error) {
      set({loggedIn: false});
      console.log(error);
    }
   
  }
}));

export default authStore;
