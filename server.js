// Other imports and setup
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  createStudent, 
  readStudent, 
  updateStudent, 
  deleteStudent, 
  listStudents 
} from './index.js';
import { 
  createTeacher, 
  readTeacher, 
  updateTeacher, 
  deleteTeacher, 
  listTeachers 
} from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Student routes
app.post('/api/students', async (req,res) =>{
  const resonse = await createStudent(req.body)
   res.send(resonse)
});
app.get('/api/students/:id', async (req,res) => {
  const id = req.params.id;
  const response = await readStudent(id);
  res.send(response)
});
app.put('/api/students/:id', async (req,res) => {
  const student = req.body
  const response  = await updateStudent(student);
  res.send(response)
});
app.delete('/api/students/:id',async  (req,res) => {
  const id = req.params.id;
  const responce = await deleteStudent(id); 
  res.send(responce)
});
app.get('/api/students', async (req,res) => {
  const response  = await listStudents();
   res.send(response)
} );

// Teacher routes

app.post('/api/teachers', async (req, res) => {
  const response =await  createTeacher(req.body);
  res.send(response);
});

app.get('/api/teachers/:id',async (req, res) => {
  const id = req.params.id;
  const response = await readTeacher(id);
  res.send(response);
});

app.put('/api/teachers/:id',async (req, res) => {
  const teacher = req.body;
  const response = await updateTeacher(teacher);
  res.send(response);
});

app.delete('/api/teachers/:id', async (req, res) => {
  const id = req.params.id;
  const response = await deleteTeacher(id);
  res.send(response);
});

app.get('/api/teachers', async (req, res) => {
  const response = await listTeachers();
  res.send(response);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
