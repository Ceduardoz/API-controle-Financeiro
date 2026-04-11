import { z } from "zod";

const colorSchema = z
  .string()
  .regex(
    /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
    "A cor deve estar em formato HEX, ex: #FF5733",
  );

export default colorSchema;
