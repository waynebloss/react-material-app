import React from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
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
  AddIcon,
  CheckCircleOutlineIcon,
  ModalDialog,
  RadioButtonUncheckedIcon,
} from "../../components";
import { Navigation, useInputDebounced, useOnMount } from "../../lib";
import { connectView, uiLoading, todoItems, TodoActions } from "../../state";
import { useMobile } from "../../themes";
import { EditTodoForm } from "./components/EditTodoForm";
// import { useStyles } from "./TodoListPage.styles";

function _TodoItem({
  actions: { editItemId, toggleItemDone },
  item: { id, title, done },
}) {
  const onClickDone = React.useCallback(() => {
    toggleItemDone(id);
  }, [id, toggleItemDone]);

  const onClickEditItem = React.useCallback(
    e => {
      editItemId(id);
    },
    [editItemId, id],
  );

  const editCellProps = {
    style: {
      cursor: "pointer",
    },
    onClick: onClickEditItem,
  };

  return (
    <TableRow key={id}>
      <TableCell {...editCellProps}>{id}</TableCell>
      <TableCell {...editCellProps}>{title}</TableCell>
      <TableCell>
        <IconButton data-id={id} onClick={onClickDone}>
          {done ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
const TodoItem = React.memo(_TodoItem);

function _TodoListPage({
  actions: { searchItems, toggleItemDone },
  pageRoute: {
    query: { title: titleFromQueryString = "" },
  },
  todoItems,
  // uiLoading
}) {
  // const classes = useStyles();
  const isMobile = useMobile();

  /** Item id being edited.
   * @type {[number|null,(id:number|null)=>void]} */
  const [editingItemId, editItemId] = React.useState(null);

  /** Title to find; delayed 1 second so we don't search on every keystroke. */
  const [titleFromInput, titleDelayed, onChangeTitle] = useInputDebounced(
    titleFromQueryString,
  );

  const doSearch = React.useCallback(
    (title = titleFromQueryString) => {
      searchItems({ title });
    },
    [searchItems, titleFromQueryString],
  );

  const onCancelEditingItem = React.useCallback(() => {
    editItemId(null);
  }, []);

  const onClickAddItem = React.useCallback(() => {
    editItemId(0);
  }, []);

  /** After editing item, close dialog. */
  const onItemUpdated = React.useCallback(() => {
    editItemId(null);
  }, []);

  // Whenever titleDelayed changes, change the URL and do the search.
  React.useEffect(() => {
    if (titleDelayed !== titleFromQueryString) {
      Navigation.redirect(
        "/todos" +
          (titleDelayed ? "?title=" + encodeURIComponent(titleDelayed) : ""),
      );
      doSearch(titleDelayed);
    }
  }, [titleDelayed, titleFromQueryString, doSearch, searchItems]);

  useOnMount(() => {
    doSearch();
  });

  return (
    <>
      <Grid container spacing={isMobile ? 0 : 3}>
        <Grid item xs={12}>
          <div style={{ display: "flex" }}>
            <TextField
              label="Search title"
              value={titleFromInput}
              onChange={onChangeTitle}
            />
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          <div style={{ display: "inline-block" }}>Click to edit an item.</div>
          <Button color="primary" onClick={onClickAddItem}>
            <AddIcon /> Add Item
          </Button>
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
                  <TodoItem
                    key={item.id}
                    actions={{ editItemId, toggleItemDone }}
                    item={item}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
      <ModalDialog open={editingItemId !== null} onClose={onCancelEditingItem}>
        <EditTodoForm
          id={editingItemId}
          onCancel={onCancelEditingItem}
          onComplete={onItemUpdated}
          title={editingItemId === 0 ? "Create Todo Item" : "Edit Todo Item"}
        />
      </ModalDialog>
    </>
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
