import { createContext } from "react";
import io from "socket.io-client";
import url from "../baseUrl.js";

export const socket = io.connect(url);
export const SocketContext = createContext();