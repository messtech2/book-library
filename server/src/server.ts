import app from './app.js';
import connectDb from './db.js';

  
const PORT = process.env.PORT || 4000;

await connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});