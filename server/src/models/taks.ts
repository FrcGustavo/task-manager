import { DataTypes, Model } from 'sequelize';
import { setupDatabase } from '../lib/sequelize';
import { db as DBConfig } from '../config';

const sequelize = setupDatabase(DBConfig);

const Task = sequelize.define(
  'Task',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export default Task;
