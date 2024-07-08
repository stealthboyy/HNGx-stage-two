// write units test Ensure token expires at the correct time and correct user details is found in token.

import { JwtService } from "../../utils/jwt.util";

describe("JwtService", () => {
  const jwtService = new JwtService();
  const userId = "1234567890";

  it("it should ensure token expires at correct time", async () => {
    const expires = "1s";
    const token = await jwtService.signJWT(userId, expires);
    expect(token).toBeDefined();

    // Wait for token to expire
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const res = await jwtService.verifyJWT(token);
      expect(res).toBeUndefined();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("TokenExpiredError");
    }
  });

  it("it should ensure correct user details is found in token", async () => {
    const token = await jwtService.signJWT(userId);
    expect(token).toBeDefined();

    const payload = await jwtService.verifyJWT(token);
    expect(payload.userId).toBe(userId);
  });
});
