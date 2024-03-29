import React, { FC } from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { Layout, TasksTable, ToolBar, CircularLoader } from '../../components';
import { useTasks, useTask } from '../../hooks';
import { useStyles } from './styles';

const Tasks: FC = () => {
  const classes = useStyles();
  const { data, isLoading, error, filters, reloadTasks } = useTasks();
  const { remove } = useTask('new');

  return (
    <Layout>
      <Box className={classes.root}>
        <Container className={classes.container}>
          <ToolBar filters={filters} getFilters={reloadTasks} />
          {error && <Typography>Ups algo salio mal</Typography>}
          {isLoading && <CircularLoader />}
          {data && !isLoading && (
            <TasksTable
              data={data}
              reloadTasks={reloadTasks}
              removeTask={remove}
            />
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default Tasks;
