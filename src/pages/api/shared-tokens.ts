import type { NextApiRequest, NextApiResponse } from "next";

type BaseResponseData<Type extends "success" | "error"> = {
  type: Type;
};

type SharedSessionDataSuccess = BaseResponseData<"success"> & {
  sessionId: string;
  cartToken: string;
  source: "nelly" | "nellyman" | "localhost" | "unknown";
};

type SharedSessionDataError = BaseResponseData<"error"> & {
  message: string;
};

export type SharedSessionData =
  | SharedSessionDataSuccess
  | SharedSessionDataError;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SharedSessionData>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ type: "error", message: "Method Not Allowed" });
  }

  // Check if cookie set with sessionData
  // TODO! Set expiry
  if (!!req.cookies.sessionData) {
    return res.status(200).json({
      type: "error",
      message: "Session data already set",
    });
  }

  const { sessionId, cartToken } = req.query;
  const missingParams = [];

  for (const [key, value] of Object.entries({ sessionId, cartToken })) {
    if (!value) missingParams.push(key);
    else if (typeof value !== "string") {
      return res.status(400).json({
        type: "error",
        message: `Invalid query parameter format: ${key}`,
      });
    }
  }

  if (!!missingParams.length) {
    return res.status(400).json({
      type: "error",
      message: `Missing query parameters: ${missingParams.join(", ")}`,
    });
  }

  let source: SharedSessionDataSuccess["source"] = "unknown";

  // remove www. and https:// from host
  const host = `${req.headers.host}`.replace(/(www\.|https:\/\/)/g, "");

  console.log({ host });

  switch (true) {
    case host.startsWith("nellyman"):
      source = "nellyman";
      break;
    case host.startsWith("nelly"):
      source = "nelly";
      break;
    case host.startsWith("localhost"):
      source = "localhost";
      break;
    default:
      source = "unknown";
      break;
  }

  // Set as JSON stringified cookie of both sessionId and cartToken
  res.setHeader(
    "Set-Cookie",
    `sessionData=${JSON.stringify({
      sessionId,
      cartToken,
      source,
    })}; Path=/; HttpOnly`
  );

  res.status(201).json({
    type: "success",
    source,
    sessionId: sessionId as string,
    cartToken: cartToken as string,
  });
}
