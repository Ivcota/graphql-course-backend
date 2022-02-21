import { extendType, objectType } from "nexus";

export const Course = objectType({
  name: "Course",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("courseTitle");
    t.string("description");
    t.string("image");
    t.float("price");
    t.nonNull.list.field("sections", {
      type: "Section",
      async resolve({ id }, __, { db }) {
        return await db.sections.findMany({
          where: {
            coursesId: id,
          },
        });
      },
    });
  },
});

export const GetCourses = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("GetCourses", {
      type: "Course",
      async resolve(_, __, ctx) {
        const courses = await ctx.db.courses.findMany();
        return courses;
      },
    });
  },
});
