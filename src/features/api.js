import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
