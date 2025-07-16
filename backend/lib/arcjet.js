import arcjet from "@arcjet/node";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: [],
  rules: [] // leave empty for now
});
