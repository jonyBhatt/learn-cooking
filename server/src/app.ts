import express, { Request, Response, Express, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";

class App {
  private app: Express;
  private PORT: number;

  constructor() {
    dotenv.config();

    this.app = express();
    this.PORT = parseInt(process.env.PORT || "8000", 10);

    this.initializeMiddleWare();
    this.connectToDatabase();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleWare() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    if (process.env.NODE_ENV === "development") {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private connectToDatabase() {}

  private initializeRoutes() {}

  private initializeErrorHandling() {}

  /**
   * start
   */
  public start() {
    const server = this.app.listen(this.PORT, () => {
      console.log(`
        🚀 Server is running
        - Port: ${this.PORT}
        - Environment: ${process.env.NODE_ENV || "development"}
        - Timestamp: ${new Date().toISOString()}
      `);
    });

    process.on("SIGTERM", () => {
      console.log(`SIGTERM received. Shutting down gracefully`);
      server.close(() => {
        console.log("Process terminated");
        process.exit(0);
      });
    });
  }
}

export default App;
