import { Op } from 'sequelize';
import groupBy from '../../../utils/groupBy';

export type UpdateTaskProps = {
  title?: string;
  description?: string;
  timer?: number;
  tag?: string;
  started?: string;
  finished?: string;
};

export type CreateTaskProps = {
  title: string;
  description: string;
  timer: string;
  tag: string;
};

export type QueryFilter = {
  startDate?: string;
  endDate?: string;
  timer?: string;
  order?: string;
};

export interface TasksServiceSchema {
  findAll: (queryFilter: QueryFilter) => void;
  create: (data: CreateTaskProps) => void;
  findOne: (uid: string) => void;
  update: (uid: string, data: UpdateTaskProps) => void;
  destroy: (uid: string) => void;
  findToChart: () => void;
}

export class TasksService implements TasksServiceSchema {
  constructor(private _model: any) {}

  async findAll({ startDate, endDate, timer, order }: QueryFilter) {
    const todayEndDate = Date.now();
    const todayStartDate = todayEndDate - 5 * 24 * 60 * 60000;

    let emptyStartDate = new Date(todayStartDate).toISOString();
    let emptyEndDate = new Date(todayEndDate).toISOString();
    let emptyOrder = 'DESC';
    let emptyTimerStart = 0;
    let emptyTimerEnd = 120;

    if (startDate && endDate && order) {
      emptyStartDate = new Date(startDate).toISOString();
      emptyEndDate = new Date(endDate).toISOString();
      emptyOrder = order;
    }

    if (timer && timer === '30') {
      emptyTimerStart = 0;
      emptyTimerEnd = 30;
    } else if (timer && timer === '45') {
      emptyTimerStart = 30;
      emptyTimerEnd = 45;
    } else if (timer && timer === '60') {
      emptyTimerStart = 45;
      emptyTimerEnd = 60;
    }

    return await this._model.findAll({
      where: {
        createdAt: {
          [Op.between]: [emptyStartDate, emptyEndDate],
        },
        timer: {
          [Op.between]: [emptyTimerStart, emptyTimerEnd],
        },
      },
      order: [['id', emptyOrder]],
    });
  }

  async create({ title, description, timer, tag }: CreateTaskProps) {
    if (!title || !description || !timer || !tag) {
      throw new Error('To create a task is necesary all fields');
    }

    const createdTask = await this._model.create({
      title,
      description,
      timer,
      tag,
    });
    return createdTask;
  }

  async findOne(uid: string) {
    const findedTask = await this._model.findByPk(uid);
    return findedTask;
  }

  async update(
    uid: string,
    { title, description, timer, tag, started, finished }: UpdateTaskProps
  ) {
    await this._model.update(
      {
        title,
        description,
        timer,
        tag: started ? 'completed' : 'to do',
        started: Number(started),
        finished: Number(finished),
      },
      {
        where: {
          id: uid,
        },
      }
    );
  }

  async destroy(uid: string) {
    const findedTask = await this._model.findByPk(uid);
    await findedTask.destroy();
    return { uid };
  }

  async findToChart() {
    let listedTasks = await this._model.findAll({
      attributes: ['timer', 'createdAt'],
    });

    listedTasks = listedTasks.map(({ timer, createdAt }: any) => {
      const createdAtStr = new Date(createdAt);
      return {
        a: `${createdAtStr.getFullYear()}-${createdAtStr.getMonth()}-${createdAtStr.getDate()}`,
        b: timer,
      };
    });

    listedTasks = Object.values(groupBy(listedTasks, 'a')).map(
      (value: any) => ({
        a: new Date(value[0].a).getTime(),
        b: value.length,
      })
    );

    return listedTasks;
  }
}
