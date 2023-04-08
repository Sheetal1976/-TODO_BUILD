import { fileURLToPath } from 'url';
import path, {dirname} from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();

const port = 8080;
import connection from './db.js';


app.use(cors());
app.use(bodyParser.json());
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
app.use(express.static(path.join(__dirname, './build')));

app.get(/^(?!\/).+/,(req,res)=>{
  res.sendFile(path.join(__dirname, '.build/index.html'));
})

//routes
app.get('/tasks', (req, res) => {
  const taskQuery = "SELECT * FROM todotaskmanager.tasks";
  connection.query(taskQuery, (err, resp) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching tasks");
    } else {
      res.send(resp);
    }
  });
});
    
app.post('/addTask', (req, res) => {
  const task = req.body.task;
  const addQuery = `INSERT INTO tasks (tasks) VALUES ('${task}');
  `;
  connection.query(addQuery, [task], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error adding task');
    } else {
      res.send('Task added');
    }
  });
});

    
    app.delete('/deleteTask/:taskid', (req,res)=>{
      const DELETE_Query= `DELETE FROM todotaskmanager.tasks WHERE taskid=${req.params.taskid}`;
      connection.query(DELETE_Query, (err) => {
        if (err) {
          console.error(err);
          res.status(404).send("Delete unsuccessful");
        } else {
          res.send("Task Deleted");
        }
      });
    });
    
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
    
  