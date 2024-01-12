const express = require('express')
const cors = require('cors');
const multer = require('multer');
const path = require('path')
const PORT = 5000
const connectToMongo = require('./db')
const dotenv = require('dotenv');
dotenv.config();

connectToMongo()
const app = express()
app.use(cors());
app.use(express.json())

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
// console.log(process.env.API_KEY)




// for receving and saving pdfs from frontend using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where uploaded files will be stored
    const uploadDir = path.join(__dirname, 'uploads');

    // fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use the original filename for the stored file
    cb(null, file.originalname);
  }
})

const upload = multer({ storage: storage })

app.get('/', (req, res) => {
  res.send("Hello world")
})

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file)
  res.send("Received at backend")
})

app.post('/response', async(req, res) => {
  try {
    
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model =  genAI.getGenerativeModel({ model: "gemini-pro"});
    
      const prompt = req.body.query;
      // console.log(req.body)
    
      const result = await model.generateContent(prompt);
      // console.log(result)
      const response =  await result.response;
      const text = response.text();
      // console.log(text)
      res.json({response: text, sender: 'bot'})
  } catch (error) {
    console.log(error.message);
    res.send("Cannot generate output")
  }
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/chats', require('./routes/chats'))


app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`)
})
