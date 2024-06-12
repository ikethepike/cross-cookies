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
  });

  return <div>Shared Tokens</div>;
};

export default SharedTokens;
