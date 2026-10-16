// Vercel serverless entry point. `pnpm vercel-build` compiles the app to dist/
// (resolving the @app/* path aliases), and every request is routed here.
module.exports = require("../dist/app").default;
