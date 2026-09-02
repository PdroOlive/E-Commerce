import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './src/routes/routes.js';


dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || 'http://localhost';

app.use(express.json());
app.use("/api/products", router);

app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "Test route is working!" });
})


app.listen(port, () => {
  console.log(`Server is running at ${baseUrl}:${port}`);
});