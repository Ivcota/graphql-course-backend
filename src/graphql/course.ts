import { extendType, objectType } from "nexus";

export const Course = objectType({
  name: "Course",
  definition(t) {
    t.string("id");
    t.string("courseTitle");
    t.string("description");
    t.string("image");
    t.float("price");
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
