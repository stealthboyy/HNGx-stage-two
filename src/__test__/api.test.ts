import request from "supertest";
import { app } from "../app.main";
import { PrismaClient } from "@prisma/client";

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    const prisma = new PrismaClient();
    await prisma.user.deleteMany();
  });

  it("it should create a user and return user basic information", async () => {
    const payload = {
      name: "Test User",
      email: "example@gmail.com",
      phone: "08012345678",
      password: "password",
    };

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Account created successfully");
    expect(response.body.data).toBeDefined();
  });

  it("it should login a user and return user basic information", async () => {
    const payload = {
      emailOrPhone: "example@gmail.com",
      password: "password",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.data).toBeDefined();

    process.env.TEST_JWT_TOKEN = response.body.data.token;
  });
});

describe("User Endpoints", () => {
  it("it should fetch a user profile information", async () => {
    const response = await request(app)
      .get("/api/v1/user/profile")
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User profile retrieved successfully");
    expect(response.body.data).toBeDefined();
  });

  it("it should get a user by email or phone", async () => {
    const payload = {
      emailOrPhone: "08012345678",
    };
    const response = await request(app)
      .get("/api/v1/user/get-user-by-email-or-phone")
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`)
      .query(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User retrieved successfully");
    expect(response.body.data).toBeDefined();
  });

  let busticketId = "";
  it("it should create a bus ticket for the user", async () => {
    const payload = {
      amount: 5000,
    };
    const response = await request(app)
      .post("/api/v1/user/ticket")
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Bus ticket created successfully");
    expect(response.body.data).toBeDefined();

    busticketId = response.body.data.id;
  });

  it("it should get a user bus ticket by id", async () => {
    const response = await request(app)
      .get(`/api/v1/user/ticket/${busticketId}`)
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Bus ticket retrieved successfully");
    expect(response.body.data).toBeDefined();
  });

  it("it should get all user bus tickets", async () => {
    const response = await request(app)
      .get(`/api/v1/user/ticket/all`)
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Bus tickets retrieved successfully");
    expect(response.body.data).toBeDefined();
  });

  it("it should fetch a user wallet details", async () => {
    const response = await request(app)
      .get("/api/v1/user/wallet/details")
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Wallet details retrieved successfully");
    expect(response.body.data).toBeDefined();
  });

  it("it should fetch a user wallet balance", async () => {
    const response = await request(app)
      .get("/api/v1/user/wallet/balance")
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Wallet balance retrieved successfully");
    expect(response.body.data).toBeDefined();
  });
});

describe("Transaction Endpoints", () => {
  afterAll(async () => {
    const prisma = new PrismaClient();
    await prisma.user.deleteMany();
  });

  it("it should fund a user wallet", async () => {
    const payload = {
      amount: 20000,
    };
    const response = await request(app)
      .post("/api/v1/transaction/fund-wallet")
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Wallet funded successfully");
    expect(response.body.data).toBeDefined();
  });

  let busticketId = "";
  it("it should pay for a user bus ticket", async () => {
    const payload = {
      amount: 5000,
    };
    const ticketRes = await request(app)
      .post("/api/v1/user/ticket")
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`)
      .send(payload);

    busticketId = ticketRes.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/transaction/pay-for-bus-ticket/${busticketId}`)
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Ticket paid for successfully");
    expect(response.body.data).toBeDefined();
  });

  let otherUserId = "";
  it("it should send credit to another user", async () => {
    const recipientUser = {
      name: "Test User 2",
      email: "example2@gmail.com",
      phone: "08012345679",
      password: "password",
    };

    const createResponse = await request(app)
      .post("/api/v1/auth/signup")
      .send(recipientUser);

    otherUserId = createResponse.body.data.id;

    const payload = {
      amount: 5000,
      emailPhoneOrId: otherUserId,
    };

    const response = await request(app)
      .post(`/api/v1/transaction/send-credit`)
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Credit transfer successful");
    expect(response.body.data).toBeDefined();
  });

  let transactionId = "";
  it("it should get all user transactions", async () => {
    const response = await request(app)
      .get("/api/v1/transaction/all")
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Transactions retrieved successfully");
    expect(response.body.data).toBeDefined();

    transactionId = response.body.data.allTrx[0].id;
  });

  it("it should get a user transaction by id", async () => {
    const response = await request(app)
      .get(`/api/v1/transaction/${transactionId}`)
      .set("Authorization", `Bearer ${process.env.TEST_JWT_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Transaction retrieved successfully");
    expect(response.body.data).toBeDefined();
  });
});
