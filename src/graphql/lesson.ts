import { objectType, extendType, nonNull } from "nexus";

export const Lesson = objectType({
  name: "Lesson",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("description");
    t.string("video");
  },
});

// Crud Actions
export const GetSingleLesson = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("GetSingleLesson", {
      type: "Lesson",
      args: {
        id: nonNull("String"),
      },
      async resolve(_, { id }, { db }) {
        console.log(id);
        const lesson = await db.lessons.findUnique({
          where: {
            id: id,
          },
        });

        return {
          id: lesson?.id,
          title: lesson?.title,
          description: lesson?.description,
          video: lesson?.video,
        };
      },
    });
  },
});
