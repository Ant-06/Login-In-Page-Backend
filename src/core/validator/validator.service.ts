import "reflect-metadata";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

const VALIDATOR_METADATA_KEY = "app:validator:dto";

export function Validator(dto: ClassConstructor<object>): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      VALIDATOR_METADATA_KEY,
      dto,
      target,
      propertyKey,
    );
  };
}

export function getValidatorDto(
  target: object,
  propertyKey: string,
): ClassConstructor<object> | undefined {
  return Reflect.getMetadata(
    VALIDATOR_METADATA_KEY,
    target,
    propertyKey,
  ) as ClassConstructor<object> | undefined;
}

export async function validateDto(
  dto: ClassConstructor<object>,
  input: unknown,
): Promise<{
  instance: object;
  errors: Array<{ field: string; message: string }>;
}> {
  const safeInput =
    input && typeof input === "object" && !Array.isArray(input)
      ? input
      : {};

  const instance = plainToInstance(dto, safeInput);

  const validationErrors = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const errors = validationErrors.flatMap((error) => {
    const messages = Object.values(error.constraints ?? {});

    return messages.map((message) => ({
      field: error.property,
      message,
    }));
  });

  return { instance, errors };
}