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

export const CreateLesson = extendType({
  type: "Mutation",
  definition(t) {
    t.field("CreateLesson", {
      type: "Lesson",
      args: {
        title: nonNull("String"),
        description: nonNull("String"),
        video: "String",
        sectionsId: "String",
      },
      async resolve(_, { title, description, video, sectionsId }, { db }) {
        console.log(sectionsId);
        const newLesson = await db.lessons.create({
          data: {
            title,
            description,
            video,
            sectionsId,
          },
        });
        return newLesson;
      },
    });
  },
});
