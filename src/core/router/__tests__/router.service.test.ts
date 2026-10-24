
import "reflect-metadata";

import express from "express";
import request from "supertest";
import { IsNotEmpty, IsString } from "class-validator";

import {
  createRouter,
  registerRoute,
  RouteInput,
} from "../router.service";

import { Validator } from "../../validator/validator.service";
import errorHandler from "../../../middleware/error.middleware";

class TestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

class TestController {
  @Validator(TestDto)
  static async success(input: RouteInput) {
    return {
      id: 123,
      name: input.body.name,
    };
  }

  static async fail(_input: RouteInput) {
    throw {
      status: 418,
      message: "Expected test error",
    };
  }
}

function createTestApp() {
  const app = express();
  const router = createRouter();

  app.use(express.json());

  registerRoute(
    router,
    "post",
    "/success",
    TestController,
    "success",
    {
      status: 200,
      message: "Test successful",
    },
  );

  registerRoute(
    router,
    "post",
    "/fail",
    TestController,
    "fail",
  );

  app.use(router);
  app.use(errorHandler);

  return app;
}

describe("Router service", () => {
  it("returns the standard response envelope on success", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/success")
      .send({ name: "Antal" });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      response: {
        status: "SUCCESS",
        message: "Test successful",
        code: 200,
        errors: [],
      },
      data: {
        id: 123,
        name: "Antal",
      },
    });
  });

  it("forwards controller errors to the error middleware", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/fail")
      .send({});

    expect(response.status).toBe(418);
    expect(response.body.response.status).toBe("ERROR");
    expect(response.body.response.message).toBe(
      "Expected test error",
    );
    expect(response.body.response.code).toBe(418);
  });

  it("returns validation errors for invalid DTO input", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/success")
      .send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body.response.status).toBe("ERROR");
    expect(response.body.response.message).toBe(
      "Validation failed",
    );

    expect(response.body.response.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "name",
          message: expect.any(String),
        }),
      ]),
    );
  });
});
