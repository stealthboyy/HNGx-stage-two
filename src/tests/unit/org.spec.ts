import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { app } from "../../main";

describe("Organisation", () => {
  beforeAll(async () => {
    const prisma = new PrismaClient();
    await prisma.user.deleteMany();
    await prisma.organisation.deleteMany();
  });

  it("it should ensure users can't see data from organisations they don’t have access to", async () => {
    // Create two users
    const payload1 = {
      firstName: "John",
      lastName: "Doe",
      email: "example1@gmail.com",
      password: "password",
      phone: "08012345678",
    };

    const payload2 = {
      firstName: "Jane",
      lastName: "Doe",
      email: "example2@gmail.com",
      password: "password",
      phone: "08012345678",
    };

    const regRes1 = await request(app)
      .post("/api/auth/register")
      .send(payload1);

    const regRes2 = await request(app)
      .post("/api/auth/register")
      .send(payload2);

    // Get organisations
    const getOrgRes1 = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${regRes1.body.data.accessToken}`);

    const getOrgRes2 = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${regRes2.body.data.accessToken}`);

    // get org by id 1
    const getOrgByIdRes1 = await request(app)
      .get(`/api/organisations/${getOrgRes2.body.data[0].orgId}`)
      .set("Authorization", `Bearer ${regRes1.body.data.accessToken}`);

    expect(getOrgByIdRes1.status).toBe(404);

    // get org by id 2
    const getOrgByIdRes2 = await request(app)
      .get(`/api/organisations/${getOrgRes1.body.data[0].orgId}`)
      .set("Authorization", `Bearer ${regRes2.body.data.accessToken}`);

    expect(getOrgByIdRes2.status).toBe(404);
  });
});
