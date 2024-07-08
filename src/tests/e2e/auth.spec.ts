import request from "supertest";
import { app } from "../../main";
import { PrismaClient } from "@prisma/client";

describe("Auth (e2e)", () => {
  beforeAll(async () => {
    const prisma = new PrismaClient();
    await prisma.user.deleteMany();
    await prisma.organisation.deleteMany();
  });

  const registerPayload = {
    firstName: "John",
    lastName: "Doe",
    email: "example@gmail.com",
    password: "password",
    phone: "08012345678",
  };

  describe("POST /api/auth/register", () => {
    let defaultOrg;
    let accessToken;
    let resgisterResp;

    it("it should register user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Registration successful");
      expect(response.body.data).toBeDefined();

      resgisterResp = response.body.data;
      accessToken = response.body.data.accessToken;
    });

    it("it should check that response contains expected user details and access token", async () => {
      expect(resgisterResp.user).toBeDefined();
      expect(resgisterResp.accessToken).toBeDefined();
      expect(resgisterResp.user.email).toBe(registerPayload.email);
      expect(resgisterResp.user.firstName).toBe(registerPayload.firstName);
      expect(resgisterResp.user.lastName).toBe(registerPayload.lastName);
      expect(resgisterResp.user.phone).toBe(registerPayload.phone);
    });

    it("it should verify that a default organisation was created for the user", async () => {
      const response = await request(app)
        .get("/api/organisations")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBe(1);

      defaultOrg = response.body.data[0];
    });

    it("it should verify the default organisation name is correct", async () => {
      expect(defaultOrg.name).toBe(
        `${registerPayload.firstName}'s Organisation`
      );
    });

    describe("it should fail if required field are missing", () => {
      it("it should fail if firstName is missing", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({ ...registerPayload, firstName: undefined });

        expect(response.status).toBe(422);
        expect(response.body.status).toBe("error");
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0]).toMatchObject({
          field: "firstName",
          message: '"firstName" is required',
        });
      });

      it("it should fail if lastName is missing", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({ ...registerPayload, lastName: undefined });

        expect(response.status).toBe(422);
        expect(response.body.status).toBe("error");
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0]).toMatchObject({
          field: "lastName",
          message: '"lastName" is required',
        });
      });

      it("it should fail if email is missing", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({ ...registerPayload, email: undefined });

        expect(response.status).toBe(422);
        expect(response.body.status).toBe("error");
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0]).toMatchObject({
          field: "email",
          message: '"email" is required',
        });
      });

      it("it should fail if password is missing", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({ ...registerPayload, password: undefined });

        expect(response.status).toBe(422);
        expect(response.body.status).toBe("error");
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0]).toMatchObject({
          field: "password",
          message: '"password" is required',
        });
      });

      it("it should fail if phone is missing", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({ ...registerPayload, phone: undefined });

        expect(response.status).toBe(422);
        expect(response.body.status).toBe("error");
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0]).toMatchObject({
          field: "phone",
          message: '"phone" is required',
        });
      });
    });

    it("it should fail if email already exists", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe(
        "Registration unsuccessful, email already exists"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    let loginResp;

    it("it should login user successfully", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: registerPayload.email,
        password: registerPayload.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data).toBeDefined();

      loginResp = response.body.data;
    });

    it("it should check that response contains expected user details and access token", async () => {
      expect(loginResp.user).toBeDefined();
      expect(loginResp.accessToken).toBeDefined();
      expect(loginResp.user.email).toBe(registerPayload.email);
      expect(loginResp.user.firstName).toBe(registerPayload.firstName);
      expect(loginResp.user.lastName).toBe(registerPayload.lastName);
      expect(loginResp.user.phone).toBe(registerPayload.phone);
    });

    describe("it should fail with wrong credentials", () => {
      it("it should fail if email is incorrect", async () => {
        const response = await request(app).post("/api/auth/login").send({
          email: "xx@gmail.com",
          password: registerPayload.password,
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe(
          "Authentication failed, email not found"
        );
      });

      it("it should fail if password is incorrect", async () => {
        const response = await request(app).post("/api/auth/login").send({
          email: registerPayload.email,
          password: "xx",
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe(
          "Authentication failed, Password is incorrect"
        );
      });
    });
  });
});
