import { extendType, nonNull, objectType } from "nexus";

export const Course = objectType({
  name: "Course",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("courseTitle");
    t.string("description");
    t.string("image");
    t.float("price");
    t.nonNull.int("lessons", {
      async resolve({ id }, __, { db }) {
        const lessons = await db.sections.findMany({
          where: {
            coursesId: id,
          },
          select: {
            _count: true,
          },
        });
        const countArray = lessons.map((lesson) => {
          return lesson._count.lessons;
        });

        let count: number = 0;
        countArray.forEach((number) => {
          count = count + number;
        });

        return count;
      },
    });
    t.nonNull.list.field("sections", {
      type: "Section",
      async resolve({ id }, __, { db }) {
        return await db.sections.findMany({
          where: {
            coursesId: id,
          },
          orderBy: {
            sectionNumber: "asc",
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

export const GetSingleCourse = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("GetSingleCourse", {
      type: "Course",
      args: {
        id: nonNull("String"),
      },
      async resolve(_, { id }, { db }) {
        const course = await db.courses.findUnique({
          where: {
            id: id,
          },
        });

        return course as any;
      },
    });
  },
});
