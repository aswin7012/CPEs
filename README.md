
# Project Setup Instructions

This project involves converting data using a Jupyter Notebook, setting up MongoDB (via cloud or Docker), running a Node.js backend, and launching a frontend development server.

---

## 1. Convert Gzipped Files to JSON

Navigate to the Jupyter Notebook and run each cell to perform the conversion.

**Steps:**
```bash
# Open the notebook
jupyter notebook script_gziptojson.ipynb
```

In the notebook:
- Run each cell sequentially.
- Ensure your `.gz` files are placed correctly as expected in the notebook.

Output: You will get `.json` files for further processing or uploading to MongoDB.

---

## 2. Set Up MongoDB Connection

You can either use MongoDB Atlas or Docker to run MongoDB locally.

### Option A: MongoDB Atlas (Cloud)
- Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
- Create a free cluster.
- Create a user and password.
- Whitelist your IP.
- Get the connection string, it will look like:
```bash
mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority
```

### Option B: Run MongoDB Locally with Docker
```bash
docker run -d -p 27017:27017 --name mongo-container mongo
```

MongoDB will be available at:
```bash
mongodb://localhost:27017
```

---

## 3. Run the Backend Server

Navigate to the backend folder and start the Node.js server.

```bash
cd backend
node index.js
```

Ensure the backend connects to MongoDB using the connection string set in your `.env` or directly in the code.

Example `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/mydb
PORT=3001
```

---

## 4. Run the Frontend App

Navigate to the frontend project folder and start the development server.

```bash
cd fe
npm install      # Only once to install dependencies
npm run dev
```

The frontend app will be available at:  
📍 [http://localhost:3000](http://localhost:3000)

---

