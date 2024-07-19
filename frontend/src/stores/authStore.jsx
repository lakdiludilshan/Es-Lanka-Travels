import { create } from "zustand";
import axios from "axios";

const authStore = create((set) => ({
  loggedIn: null,

  loginForm: {
    email: "",
    password: "",
  },

  signupForm: {
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

  updateSignupForm: (e) => {
    const { name, value } = e.target;

    set((state) => {
      return {
        signupForm: {
          ...state.signupForm,
          [name]: value,
        },
      };
    });
  },

  login: async () => {
    const { loginForm } = authStore.getState();

    const res = await axios.post("/api/users/login", loginForm);
    console.log(res);

    set({loggedIn: true,
      //clear forms after click button
      loginForm: {
        email: "",
        password: "",
      },
    });
  },

  signup: async () => {
    const { signupForm } = authStore.getState();

    const res = await axios.post("/api/users/signup", signupForm)

    console.log(res);
    set({
      signupForm: {
        email: "",
        password: "",
      },
    })
  },

  logout: async () => {
  await axios.get("/api/users/logout")

    set({loggedIn: false});
  },

  checkAuth: async () => {
    try {
      await axios.get("/api/users/checkauth");
      set({loggedIn: true});
    } catch (error) {
      set({loggedIn: false});
      console.log(error);
    }
   
  }
}));

export default authStore;
