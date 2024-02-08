import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
// import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskStatus } from "../../interfaces";
import { customSessionStorage } from "..";

interface TaskState {

  dragginTaskId?: string;
  tasks: Record<string, Task>; // { [key: string]: Task }

  getTaskByStatus: ( status: TaskStatus ) => Task[];
  addTask: ( title: string, status: TaskStatus ) => void;

  setDragginTaskId: ( taskId: string ) => void;
  removeDragginTaskId: () => void;
  changeTaskStatus: ( taskId: string, status: TaskStatus ) => void;
  onTaskDrop: ( status: TaskStatus ) => void;

  totalTasks: () => number;
}

const storeApi: StateCreator<TaskState, [["zustand/devtools", never], ["zustand/immer", never]]> = ( set, get ) => ({
  dragginTaskId: undefined,
  tasks: {
    'ABC-1': { id: 'ABC-1', title: 'Task-1', status: 'open' },
    'ABC-2': { id: 'ABC-2', title: 'Task-2', status: 'in-progress' },
    'ABC-3': { id: 'ABC-3', title: 'Task-3', status: 'open' },
    'ABC-4': { id: 'ABC-4', title: 'Task-4', status: 'open' },
  },

  getTaskByStatus: ( status: TaskStatus ) => {
    const tasks = get().tasks;
    return Object.values( tasks ).filter( task => task.status === status );
  },

  addTask: ( title: string, status: TaskStatus ) => {
    const newTask = { id: uuidv4(), title, status };

    //? Con el middleware de immer.
    set( state => {
      state.tasks[newTask.id] = newTask;
    })

    //? Requiere npm install immer
    // set( produce( (state:TaskState) => {
    //   state.tasks[newTask.id] = newTask;
    // } ) );

    //? Forma nativa de Zustand
    // set( state => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]: newTask
    //   }
    // }));
  },

  setDragginTaskId: ( taskId: string ) => {
    set( { dragginTaskId: taskId } )
  },

  removeDragginTaskId: () => {
    set( { dragginTaskId: undefined } )
  },

  changeTaskStatus: ( taskId: string, status: TaskStatus ) => {
    // const task = get().tasks[taskId];
    // task.status = status;

    //? Con el middleware de immer.
    set( state => {
      state.tasks[taskId] = {
        ...state.tasks[taskId],
        status
      };
    })

    //? Forma nativa de Zustand.
    // set( (state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [taskId]: task
    //   }
    // }))
  },

  onTaskDrop: ( status: TaskStatus ) => {
    const taskId = get().dragginTaskId;
    if( !taskId ) return;

    get().changeTaskStatus( taskId, status );
    get().removeDragginTaskId();
  },

  totalTasks: () => {
    const tasks = get().tasks;
    return Object.values( tasks ).length;
  }

});


export const useTaskStore = create<TaskState>()(
  devtools(
    persist( 
      immer( storeApi ),
      { 
        name: 'task-store'
      },
    )
  )
);