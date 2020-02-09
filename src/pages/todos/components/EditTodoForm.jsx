import React from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core";
// Local
import { useInputCheck, useInputValue, useOnMount } from "../../../lib";
import { connectView, TodoActions } from "../../../state";
import { useMobile } from "../../../themes";
// import { useStyles } from "./EditTodoForm.styles";

function _EditTodoForm({
  actions: { getItemById, saveItem },
  id,
  onCancel,
  onComplete,
}) {
  // const classes = useStyles();
  const isMobile = useMobile();

  const [title, onChangeTitle, setTitle] = useInputValue();
  const [done, onChangeDone, setDone] = useInputCheck();
  const [errFields, setErrFields] = React.useState({});

  const onSubmitForm = React.useCallback(
    e => {
      if (e && e.preventDefault) e.preventDefault();
      if (title.length < 1) {
        setErrFields(fields => ({
          ...fields,
          title: "Please enter some text.",
        }));
        return;
      }
      saveItem({
        id,
        title,
        done,
      });
      onComplete();
    },
    [id, title, done, onComplete, saveItem],
  );

  useOnMount(() => {
    async function loadItem() {
      const { item } = await getItemById(id);
      setTitle(item.title);
      setDone(item.done);
    }
    if (id > 0) {
      loadItem();
    }
  });

  return (
    <form onSubmit={onSubmitForm}>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            autoFocus={!isMobile}
            label="Title"
            value={title}
            onChange={onChangeTitle}
            inputProps={{
              maxLength: 255,
            }}
            error={!!errFields.title}
            helperText={errFields.title}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 32, textAlign: "center" }}>
          <FormControlLabel
            control={
              <Checkbox checked={done} onChange={onChangeDone} value="done" />
            }
            label="Done"
          />
        </Grid>
        <Grid item xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 32,
            }}
          >
            <Button variant="contained" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              OK
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
}

export const EditTodoForm = connectView(_EditTodoForm, [TodoActions]);
