import { objectType, extendType, nonNull } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.string("username");
    t.string("firstName");
    t.string("lastName");
    t.nonNull.string("email");
    t.string("password");
    t.nonNull.list.field("courses", {
      type: "Course",
      async resolve({ id }, __, { db }) {
        const courses = await db.courses.findMany({
          where: {
            users: {
              some: {
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
      description: "Get multiple users",
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
      description: "Get a single user",
    });
  },
});

// Mutations

export const SubmitEmailResponse = objectType({
  name: "SubmitEmailResponse",
  definition(t) {
    t.nonNull.int("code");
    t.nonNull.boolean("success");
    t.nonNull.string("message");
    t.field("user", {
      type: "User",
    });
  },
});

export const SubmitEmail = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("SubmitEmail", {
      type: "SubmitEmailResponse",
      args: {
        email: nonNull("String"),
      },
      async resolve(_, { email }, { db }) {
        try {
          const newUser = await db.users.create({
            data: {
              email: email.toLowerCase(),
            },
          });

          return {
            code: 200,
            message: "Email collected",
            success: true,
            user: newUser,
          };
        } catch (error) {
          return {
            code: 400,
            message: "User already created",
            success: false,
          };
        }
      },
    });
  },
});

export const CreateUserResponse = objectType({
  name: "CreateUserResponse",
  definition(t) {
    t.nonNull.int("code");
    t.nonNull.boolean("success");
    t.nonNull.string("message");
    t.field("user", {
      type: "User",
    });
  },
});

export const CreateUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("CreateUser", {
      type: "CreateUserResponse",
      args: {
        username: "String",
        firstName: "String",
        lastName: "String",
        password: "String",
        email: nonNull("String"),
      },
      async resolve(
        _,
        { username, firstName, lastName, password, email },
        { db }
      ) {
        const user = await db.users.create({
          data: {
            email,
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
          },
        });

        return {
          code: 201,
          message: "Success",
          success: true,
          user,
        };
      },
    });
  },
});

export const AddCourseToUserResponse = objectType({
  name: "AddCourseToUserResponse",
  definition(t) {
    t.nonNull.int("code");
    t.nonNull.boolean("success");
    t.nonNull.string("message");
    t.field("user", {
      type: "User",
    });
  },
});

export const AddCourseToUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("AddCourseToUser", {
      type: "AddCourseToUserResponse",
      args: {
        userId: nonNull("String"),
        courseId: nonNull("String"),
      },
      async resolve(_, { courseId, userId }, { db }) {
        try {
          const user = await db.users.update({
            where: {
              id: userId,
            },
            data: {
              courses: {
                connect: {
                  id: courseId,
                },
              },
            },
          });

          return {
            code: 200,
            success: true,
            message: "Course added",
            user: user,
          };
        } catch (error) {
          return {
            code: 400,
            success: false,
            message: JSON.stringify(error) as string,
          };
        }
      },
    });
  },
});
