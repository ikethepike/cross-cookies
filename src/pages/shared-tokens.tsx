import { useEffect } from "react";
import Axios from "axios";
import { SharedSessionData } from "./api/shared-tokens";

const tokenAPI = Axios.create({
  validateStatus: (status) => status < 500,
});

const SharedTokens: React.FC<object> = () => {
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { data } = await tokenAPI.get<SharedSessionData>(
          `/api/shared-tokens?sessionId=brink&cartToken=commerce`
        );

        switch (data.type) {
          case "success":
            localStorage.setItem("sessionData", JSON.stringify(data));
            break;
          default:
            return console.warn(`[sharedtokens] Request error:`, data.message);
        }
      } catch (error) {
        console.error(`[sharedtokens] Server error:`, error);
      }
    };

    fetchTokens();

    window.addEventListener(
      "message",
      async (event) => {
        if (
          event.data === "requestAccess"
          // && event.origin === "https://nellyman.com" // Optional check
        ) {
          try {
            await document.requestStorageAccess();
            console.info("[shared-tokens-embed] Storage access granted.");
          } catch (error) {
            console.info("[shared-tokens-embed] Storage access denied.");
          }
        }
      },
      false
    );

    return () => {
      window.removeEventListener("message", () => {});
    };
  });

  return <div data-target="shared-tokens-embed" />;
};

export default SharedTokens;
