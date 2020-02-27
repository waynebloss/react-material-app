import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
import Pages from "../../pages";
import {
  PrefActions,
  PrefSelectors,
  TodoActions,
  TodoSelectors,
  useDispatch,
  useSelector,
} from "../../state";
import { useMobile } from "../../themes";
import { EditTodoForm } from "./components/EditTodoForm";
// import { useStyles } from "./TodoListPage.styles";

function _TodoItem({ actions: { editItemId }, item: { id, title, done } }) {
  const dialogEdit = useSelector(PrefSelectors.dialogEdit);
  const dispatch = useDispatch();

  const onClickDone = React.useCallback(() => {
    dispatch(TodoActions.toggleItemDone(id));
  }, [id, dispatch]);

  const onClickEditItem = React.useCallback(
    e => {
      if (dialogEdit) {
        editItemId(id);
        return;
      }
      Navigation.go(Pages.todo.edit.path.replace(":id", id));
    },
    [dialogEdit, editItemId, id],
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
  pageRoute: {
    query: { title: titleFromQueryString = "" },
  },
}) {
  // const classes = useStyles();
  const isMobile = useMobile();

  const dialogEdit = useSelector(PrefSelectors.dialogEdit);
  const items = useSelector(TodoSelectors.items);
  const dispatch = useDispatch();
  const toggleDialogEdit = React.useCallback(() => {
    dispatch(PrefActions.toggleDialogEdit());
  }, [dispatch]);

  /** Item id being edited.
   * @type {[number|null,(id:number|null)=>void]} */
  const [editingItemId, editItemId] = React.useState(null);

  /** Title to find; delayed 1 second so we don't search on every keystroke. */
  const [titleFromInput, titleDelayed, onChangeTitle] = useInputDebounced(
    titleFromQueryString,
  );

  const doSearch = React.useCallback(
    (title = titleFromQueryString) => {
      dispatch(TodoActions.searchItems({ title }));
    },
    [dispatch, titleFromQueryString],
  );

  const onCancelEditingItem = React.useCallback(() => {
    editItemId(null);
  }, []);

  const onClickAddItem = React.useCallback(() => {
    if (dialogEdit) {
      editItemId(0);
      return;
    }
    Navigation.go(Pages.todo.edit.path.replace(":id", 0));
  }, [dialogEdit]);

  /** After editing item, close dialog. */
  const onItemUpdated = React.useCallback(() => {
    editItemId(null);
  }, []);

  // Whenever titleDelayed changes, change the URL and do the search.
  React.useEffect(() => {
    if (titleDelayed !== titleFromQueryString) {
      Navigation.redirect(
        Pages.todo.list.path +
          (titleDelayed ? "?title=" + encodeURIComponent(titleDelayed) : ""),
      );
      doSearch(titleDelayed);
    }
  }, [titleDelayed, titleFromQueryString, doSearch]);

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
          <FormControlLabel
            control={
              <Checkbox
                checked={dialogEdit}
                onChange={toggleDialogEdit}
                value="dialogEdit"
              />
            }
            label="Use dialog editor."
          />
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
                {items.map(item => (
                  <TodoItem
                    key={item.id}
                    actions={{ editItemId }}
                    dialogEdit={dialogEdit}
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

export const TodoListPage = React.memo(_TodoListPage);
