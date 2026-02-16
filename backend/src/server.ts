import "dotenv/config";
import app from "./app";
import connectDB from "./database/connection";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port http://localhost:${PORT}`);
})


