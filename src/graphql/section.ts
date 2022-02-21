import { extendType, objectType } from "nexus";

export const Section = objectType({
  name: "Section",
  definition(t) {
    t.nonNull.string("id");
    t.string("title");
    t.string("description");
    t.nonNull.list.field("lessons", {
      type: "Lesson",
      async resolve({ id }, __, { db }) {
        const lesson = await db.lessons.findMany({
          where: {
            sectionsId: id,
          },
        });

        return lesson;
      },
    });
  },
});
