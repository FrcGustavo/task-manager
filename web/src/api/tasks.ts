import { instance } from './';

type GetTasks = () => Promise<Array<Task>>;
export const getTasks: GetTasks = async () => {
  const { data } = await instance.get('/tasks');
  return data.body;
};

type GetTask = (uid: number | string) => Promise<Task>;
export const getTask: GetTask = async (uid) => {
  if (uid === 'new') {
    return {
      id: null,
      title: '',
      description: '',
      timer: '',
      tag: 'to do',
    };
  }
  const { data } = await instance.get(`/tasks/${uid}`);
  return data.body;
};

type SaveTask = (task: Task) => Promise<Task>;
export const saveTask: SaveTask = async (task) => {
  if (task.id) {
    return updateTask(task.id, task);
  } else {
    return createTask(task);
  }
};

type UpdateTask = (id: number | string, task: Task) => Promise<Task>;
const updateTask: UpdateTask = async (id, task) => {
  await instance.patch(`/tasks/${id}`, task);
  return task;
};

type CreateTask = (task: Task) => Promise<Task>;
const createTask: CreateTask = async (task: Task) => {
  const res = await instance.post<{ body: Task }>('/tasks', task);
  return res.data.body;
};
