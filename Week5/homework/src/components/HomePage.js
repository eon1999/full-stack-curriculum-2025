import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import {getTasks, createTask, updateTask} from "../App";
//import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();

  // State to hold the list of tasks.
  const [taskList, setTaskList] = useState([]);


  // State for the task name being entered by the user.
  const [newTaskName, setNewTaskName] = useState("");

  const [load, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.

  // useEffect hook to run once when component is loaded
  useEffect(() => {
    // set load state to be true before fetching data
    setLoading(true);

    getTasks("user")
      .then(tasks => {
        // fetch is successful, update the task
        setTaskList(tasks);

        // loading is done
        setLoading(false);
      })

      .catch(err => {
        // If there's an error, set the error state, stop loading
        setError(err);
        setLoading(false);

      });
    }, []);

  function handleAddTask() {
    if (!newTaskName) {
      return;
    }

    // Create new task object
    const newTask = {
      task: newTaskName,
      finished: false,
      user: "user",
    }
    // call API to create new task
    createTask(newTask)
      .then(addedTask => {
        // Add new task from API
        setTaskList(prevTasks => [...prevTasks, addedTask]);
        // clear input field
        setNewTaskName("");
      })
      .catch(err => {
        setError(err);
      });
  }

  // Function to toggle the 'finished' status of a task.
  function toggleTaskCompletion(task) {

    // Create the updated task object with togged finish status
    const updatedTask = { ...task, finished: !task.finished };

    // update dat task
    updateTask(task.id, updatedTask)
      .then(returnedTask => {
        // update successful? update task in local list
        setTaskList(taskList.map((t) =>
        t.id === returnedTask.id ? returnedTask : t
        ));
      })
      .catch(err => {
        setError(err);
      });
  }

  // Function to compute a message indicating how many tasks are unfinished.
  function getUnfinishedTaskMessage() {
    const unfinishedTasks = taskList.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getUnfinishedTaskMessage()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={newTaskName}
                  placeholder="Type your task here"
                  onChange={(event) => setNewTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {taskList.map((task) => (
                <ListItem
                  key={task.name}
                  dense
                  onClick={() => toggleTaskCompletion(task)}
                >
                  <Checkbox
                    checked={task.finished}
                  />
                  <ListItemText primary={task.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}