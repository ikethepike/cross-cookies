"use client";
import Axios from "axios";
import styles from "./page.module.css";
import { useEffect } from "react";
import { SharedSessionData } from "@/pages/api/shared-tokens";

const tokenAPI = Axios.create({
  validateStatus: (status) => status < 500,
});

export default function Home() {
  useEffect(() => {
    // let's create our iframe
    const iframe = document.createElement("iframe");
    iframe.src = "https://cross-cookies.fly.dev/shared-tokens";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.postMessage(
        "requestAccess",
        "https://cross-cookies.fly.dev/"
      );
    };

    const fetchTokens = async () => {
      try {
        const { data } = await tokenAPI.get<SharedSessionData>(
          `/api/shared-tokens?sessionId=brink&cartToken=commerce`
        );

        switch (data.type) {
          case "success":
            localStorage.setItem(
              "sessionData",
              JSON.stringify({ ...data, type: undefined })
            );
            break;
          default:
            return console.warn(`[sharedtokens] Request error:`, data.message);
        }
      } catch (error) {
        console.error(`[sharedtokens] Server error:`, error);
      }
    };

    fetchTokens();
  }, []);

  return (
    <main className={styles.main}>
      <h1>Cross domain options</h1>
      <p>Quick and dirty cross domain cookies + localStorage</p>
    </main>
  );
}
