import { makeSchema } from "nexus";
import { join } from "path";
import { coursesTypes } from "./graphql";

export const schema: any = makeSchema({
  types: [coursesTypes],
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"), // 2
    schema: join(__dirname, "..", "schema.graphql"), // 3
  },
  contextType: {
    module: join(__dirname, "./context.ts"),
    export: "Context",
  },
});
