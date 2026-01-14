import jwt, { Secret, SignOptions } from "jsonwebtoken";

class TokenUtils {
  private readonly jwtSecret: Secret = process.env.JWT_SECRET || "SECRET";
  /**
   * TOKEN GENERATES HERE
   * @param payload
   * @returns
   */
  public generateToken = (
    payload: object,
    time: SignOptions["expiresIn"] = "15m"
  ): string => {
    const options: SignOptions = {
      expiresIn: time,
    };

    const token = jwt.sign(payload, this.jwtSecret, options);
    return token;
  };

  /**
   * VERIFY THE TOKEN
   * @param token
   * @returns
   */
  public verifyToken = (token: string): any => {
    // Verify the JWT token
    const decoded = jwt.verify(token, this.jwtSecret);
    return decoded;
  };
}

export default TokenUtils;
