import { z } from "zod";

export type FieldErrors<T> = {
    [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    //console.log("Incoming data to action:", data);
    const validationResult = schema.safeParse(data);
    console.log("Validation result:", validationResult);
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.flatten());
      return {
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    console.log("Validation passed, calling handler...");
    //console.log(validationResult.data);
    return handler(validationResult.data);
  };
};
