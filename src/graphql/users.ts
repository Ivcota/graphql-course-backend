import { objectType, extendType, nonNull } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("username");
    t.nonNull.string("firstName");
    t.string("lastName");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.list.field("courses", {
      type: "Course",
      async resolve({ id }, __, { db }) {
        const courses = await db.courses.findMany({
          where: {
            users: {
              every: {
                id: {
                  equals: id,
                },
              },
            },
          },
        });

        return courses;
      },
    });
  },
});

export const GetAllUsers = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("GetAllUsers", {
      type: "User",
      async resolve(_, __, { db }) {
        const users = await db.users.findMany();
        return users;
      },
    });
  },
});

export const GetSingleUser = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("GetSingleUser", {
      type: "User",
      args: {
        id: nonNull("String"),
      },
      async resolve(_, { id }, { db }) {
        const user = await db.users.findUnique({
          where: {
            id,
          },
        });
        return {
          id: user?.id as string,
          username: user?.username as string,
          email: user?.email as string,
          password: user?.password as string,
          firstName: user?.firstName as string,
          lastName: user?.lastName,
        };
      },
    });
  },
});
