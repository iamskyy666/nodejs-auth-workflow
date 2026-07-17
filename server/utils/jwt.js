import jwt from "jsonwebtoken";

//! -------------------- SEND MULTIPLE-COOKIES 🍪🍪 ------------------------------

//! 🟠 Create JWT
const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

//! 🟠 Verify JWT
const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

//! 🟠 Attach JWT as multiple (2) HTTP-only cookies
const attachCookiesToResp = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } }); // 🍪 1
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } }); // 🍪 2

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExpiryDur = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
    // maxAge: 1000 * 60 * 15,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExpiryDur),
    // maxAge: 1000,
  });
};

//! -------------------- SEND SINGLE-COOKIE 🍪 ------------------------------

//! 🔵 Create single JWT
// const createSingleJWT = ({ payload }) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_LIFETIME,
//   });
// };

//! 🔵 Verify JWT
// const isTokenValid = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

//! 🔵 Attach JWT as an HTTP-only cookie
// const attachSingleCookieToResp = ({ res, user }) => {
//   const token = createJWT({ payload: user });

//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     signed: true,
//     expires: new Date(Date.now() + oneDay),
//   });

//   return token;
// };

export { createJWT, isTokenValid, attachCookiesToResp };
