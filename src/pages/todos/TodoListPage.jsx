import React from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  //Typography
} from "@material-ui/core";
// Local
import {
  CheckCircleOutlineIcon,
  RadioButtonUncheckedIcon,
} from "../../components";
import { useOnMount } from "../../lib";
import { connectView, uiLoading, todoItems, TodoActions } from "../../state";
import { useMobile } from "../../themes";
// import { useStyles } from "./TodoListPage.styles";

function _TodoListPage({
  actions: { searchItems },
  todoItems,
  // uiLoading
}) {
  // const classes = useStyles();
  const isMobile = useMobile();

  useOnMount(() => {
    searchItems();
  });

  return (
    <Grid container spacing={isMobile ? 0 : 3}>
      <Grid item xs={12}>
        TODO: Toolbar with search box.
      </Grid>
      <Grid item xs={12}>
        <Box boxShadow={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Done</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todoItems.map(item => (
                <TableRow>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {item.done ? (
                      <CheckCircleOutlineIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Grid>
    </Grid>
  );
}

export const TodoListPage = connectView(
  _TodoListPage,
  state => {
    return {
      ...todoItems(state),
      ...uiLoading(state),
    };
  },
  [TodoActions],
);
