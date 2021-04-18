import React, { useState, useEffect } from "react";
import Todos from "./Todos";
import axios from "axios";

export default function Sidebar() {
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    id: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "jwt-token":
          setAccessToken(message.value);
          getUserDetails(message.value);
          break;
      }
    });
    tsvscode.postMessage({ type: "get-jwt-token", value: undefined });
  }, []);

  const getUserDetails = (token: string) => {
    axios
      .get(`${apiBaseURL}user/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: any) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.log(err);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (accessToken === "") {
    return (
      <button
        onClick={() => {
          tsvscode.postMessage({ type: "authenticate", value: undefined });
        }}
      >
        Login
      </button>
    );
  }
  return (
    <div>
      <p>
        Hello, <i style={{ color: "#207ADA" }}>@{user.username}!</i>
      </p>
      <Todos accessToken={accessToken}></Todos>
      <button
        onClick={() => {
          setAccessToken("");
          tsvscode.postMessage({
            type: "logout",
            value: undefined,
          });
        }}
      >
        Logout
      </button>
    </div>
  );
}