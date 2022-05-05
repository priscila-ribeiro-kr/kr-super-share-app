import cors from "cors";
import { Objects } from "../utils/objects.utils.js";

class CorsInterceptor {
  static setup(app) {
    const allowedOrigins = ["https://kr-super-share-app.herokuapp.com", "http://localhost:3000"];
    app.use(
      cors({
        origin: function (origin, callback) {
          const originIsNotAllowed = allowedOrigins.every((allowedOrigin) =>
            Objects.isNotEqual(allowedOrigin, origin)
          );
          if (originIsNotAllowed) {
            const msg = `The CORS policy for this site does not allow access from the origin ${origin}.`;
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
      })
    );
  }
}

export { CorsInterceptor };
