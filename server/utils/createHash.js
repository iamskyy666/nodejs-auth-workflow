import crypto from "crypto";

function hashString(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

export default hashString;
