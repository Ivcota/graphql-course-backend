import { objectType, extendType } from "nexus";

export const Lesson = objectType({
  name: "Lesson",
  definition(t) {
    t.nonNull.string("id");
    t.string("title");
    t.string("description");
    t.string("video");
  },
});
