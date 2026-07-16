import UnauthenticatedError from "../errors/unauthenticated.js";
import Token from "../models/token.model.js";
import { attachCookiesToResp, isTokenValid } from "../utils/jwt.js";

async function authenticateUser(req, res, next) {
  const { refreshToken, accessToken } = req.signedCookies;

  // But, if the token is present..
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(accessToken);
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("🔴 Authentication Invalid!");
    }

    req.user = payload.user;
    attachCookiesToResp({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
  } catch (err) {
    console.log(err);
    throw new UnauthenticatedError("🔴 Authentication Invalid!");
  }
}

export default authenticateUser;
