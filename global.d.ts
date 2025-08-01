declare module "@prisma/nextjs-monorepo-workaround-plugin" {
  import type { Compiler } from "webpack";
  export class PrismaPlugin {
    constructor(): void;
    apply(compiler: Compiler): void;
  }
}
