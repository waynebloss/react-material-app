import React from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  //Typography
} from "@material-ui/core";
// Local
import {
  CheckCircleOutlineIcon,
  RadioButtonUncheckedIcon,
} from "../../components";
import { Navigation, useInputDebounced, useOnMount } from "../../lib";
import { connectView, uiLoading, todoItems, TodoActions } from "../../state";
import { useMobile } from "../../themes";
// import { useStyles } from "./TodoListPage.styles";

function _TodoListPage({
  actions: { searchItems },
  pageRoute: {
    query: { title: titleFromQueryString = "" },
  },
  todoItems,
  // uiLoading
}) {
  // const classes = useStyles();
  const isMobile = useMobile();

  const [titleFromInput, titleDelayed, onChangeTitle] = useInputDebounced(
    titleFromQueryString,
  );

  React.useEffect(() => {
    if (titleDelayed !== titleFromQueryString) {
      Navigation.redirect(
        "/todos" +
          (titleDelayed ? "?title=" + encodeURIComponent(titleDelayed) : ""),
      );
      searchItems({ title: titleDelayed });
    }
  }, [titleDelayed, titleFromQueryString, searchItems]);

  useOnMount(() => {
    searchItems({ title: titleFromQueryString });
  });

  return (
    <Grid container spacing={isMobile ? 0 : 3}>
      <Grid item xs={12}>
        <div style={{ display: "flex" }}>
          <TextField
            label="Search"
            value={titleFromInput}
            onChange={onChangeTitle}
          />
        </div>
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
                <TableRow key={item.id}>
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
