import React from "react";
import { Typography } from "@material-ui/core";
// Local
import { Navigation } from "../../lib";
import { EditTodoForm } from "./components/EditTodoForm";

function _TodoEditPage({
  pageRoute: {
    params: { id },
  },
}) {
  id = parseInt(id);
  return (
    <>
      <Typography variant="h3" style={{ marginBottom: 32 }}>
        {id === 0 ? "Create Todo Item" : "Edit Todo Item"}
      </Typography>
      <EditTodoForm
        id={id}
        onCancel={Navigation.goBack}
        onComplete={Navigation.goBack}
      />
    </>
  );
}

export const TodoEditPage = React.memo(_TodoEditPage);
