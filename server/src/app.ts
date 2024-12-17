import express, { Request, Response, Express, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database";
import errorHandler from "./middleware/errorHandler";

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
        console.log(`${new Date().toUTCString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private async connectToDatabase() {
    try {
      await connectDB();
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      process.exit(1);
    }
  }

  private initializeRoutes() {
    this.app.get("/api/v1/", (req: Request, res: Response) => {
      res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      });
    });

    // Catch-all route for undefined endpoints
    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        message: "Endpoint not found",
        path: req.originalUrl,
      });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }

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
