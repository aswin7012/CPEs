# CPE Search App

A full-stack app for searching and filtering CPE data with React (frontend) and Node.js/Express (backend).  
Handles large datasets using MongoDB and Python-based data processing.

---

## Project Setup

### 1. Clone the Repository

```sh
git clone https://github.com/Aezakmi7012/bored2.0.git
cd bored2.0
```

### 2. Install Dependencies

#### Frontend

```sh
cd frontend
npm install
```

#### Backend

```sh
cd ../backend
npm install
```

---

### 3. Set Up MongoDB (with Docker)

Because the dataset is large, use Docker for MongoDB:

```sh
docker run -d -p 27017:27017 --name mongodb mongo
```

- This will start a local MongoDB instance on port 27017.

---

### 4. Prepare the Data

#### a. Convert Data

- Use the provided Jupyter notebooks in `backend/` to process the data:
  - `script_gziptojson.ipynb`: Converts the `.gz` file to XML, then to JSON.
  - `seed.ipynb`: Seeds the MongoDB database with the processed JSON.

> **Note:** These scripts are in Python because Node.js cannot handle strings larger than 512MB.

#### b. Update MongoDB Connection String (if needed)

- Default is `mongodb://localhost:27017/dbtest` in `backend/index.js`.
- Change if your MongoDB runs elsewhere.

---

### 5. Start the Servers

#### Backend

```sh
cd backend
node index.js
```

#### Frontend

```sh
cd ../frontend
npm run dev
```

---

## 📝 Notes

- The backend runs on [http://localhost:3000](http://localhost:3000)
- The frontend runs on [http://localhost:5173](http://localhost:5173) (default Vite port)
- Make sure MongoDB is running and seeded before starting the backend.

---

