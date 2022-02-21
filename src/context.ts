import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { db } from "./db";

export interface Context {
  db: PrismaClient;
}

// We can use data from the context in any resolver
export const context = async ({ req }: { req: Request }) => {
  return {
    db,
  };
};
