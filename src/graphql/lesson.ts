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

// Mutations

export const CreateLessonResponse = objectType({
  name: "CreateLessonResponse",
  definition(t) {
    t.nonNull.int("code");
    t.nonNull.boolean("success");
    t.nonNull.string("message");
    t.field("lesson", {
      type: "Lesson",
    });
  },
});

export const CreateLesson = extendType({
  type: "Mutation",
  definition(t) {
    t.field("CreateLesson", {
      type: "CreateLessonResponse",
      args: {
        title: nonNull("String"),
        description: nonNull("String"),
        video: "String",
        sectionsId: "String",
      },
      async resolve(_, { title, description, video, sectionsId }, { db }) {
        try {
          const newLesson = await db.lessons.create({
            data: {
              title,
              description,
              video,
              sectionsId,
            },
          });
          return {
            code: 201,
            message: "Lesson created",
            success: true,
            lesson: newLesson,
          };
        } catch (error) {
          return {
            code: 400,
            message: error as string,
            success: false,
          };
        }
      },
    });
  },
});
