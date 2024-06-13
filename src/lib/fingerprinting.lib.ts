import md5 from "md5";
import Axios from "axios";

/**
 * Generates a browser fingerprint by collecting various browser and device information.
 * @returns A promise that resolves to the generated fingerprint as a string.
 */
export const generateBrowserFingerprint = async (): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ReferenceError("Arbitrary ts check");

  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText("shady as shit...", 2, 15);
  const canvasHash = canvas.toDataURL();

  const fingerprintData = {
    canvasHash,
    threads: navigator.hardwareConcurrency,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    doNotTrack: navigator.doNotTrack ? 1 : 0,
    geo: navigator.geolocation ? 1 : 0,
    cookies: navigator.cookieEnabled ? 1 : 0,
    localStorage: window.localStorage ? 1 : 0,
    sessionStorage: window.sessionStorage ? 1 : 0,
    indexedDB: window.indexedDB ? 1 : 0,
    hardwareConcurrency: navigator.hardwareConcurrency,
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints ? 1 : 0,
    ip: "", // optional
  };

  // Layer in ip if need be, obvs swap this to just call some internal api instead
  // https://api.ipify.org?format=json
  // const { data } = await Axios.get<{ ip: string }>("https://api.ipify.org", {
  //   params: {
  //     format: "json",
  //   },
  // });
  // fingerprintData.ip = data.ip;

  const fingerprint = hashFingerprintData(fingerprintData);

  return md5(fingerprint.toString()); // let's be fancy
};

/**
 * Calculates the hash value of the fingerprint data.
 *
 * @param data - The fingerprint data object.
 * @returns The hash value of the fingerprint data.
 */
export const hashFingerprintData = (data: object) => {
  const dataString = JSON.stringify(data);
  let hash = 0,
    i,
    chr;
  for (i = 0; i < dataString.length; i++) {
    chr = dataString.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
