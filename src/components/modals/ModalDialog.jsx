import React from "react";
import {
  AppBar,
  Container,
  Dialog,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
// Local
import { CloseIcon } from "../icons";
import { SlideUpTransition } from "../transitions";
import { useStyles } from "./ModalDialog.styles";

/**
 * Displays a modal dialog.
 *
 * @typedef {object} ModalDialogProps
 * @property {React.ReactNode} children
 * @property {boolean} [fullScreen] True to make a full screen dialog.
 * @property {() => void} onClose Callback to request the dialog be closed.
 * @property {boolean} open True if the dialog should be visible.
 * @property {React.ReactNode} title Title of the app bar.
 *
 * @param {ModalDialogProps & import("@material-ui/core").DialogProps} props
 */
function _ModalDialog(props) {
  const {
    children,
    fullScreen,
    onClose,
    open,
    title: titleProp,
    ...dialogProps
  } = props;

  const classes = useStyles();

  const [title, setTitle] = React.useState("");
  const child = React.useMemo(() => {
    // Get the only child after cloning it to add props.
    return React.cloneElement(React.Children.only(children), {
      onChangeTitle: setTitle,
    });
  }, [children, setTitle]);
  const { title: childTitleProp, maxWidth = "sm" } = child.props;

  React.useEffect(() => {
    // Set the default title if dialog opens, closes or if title props change.
    if (!open) {
      setTitle("");
    } else {
      setTitle(childTitleProp || titleProp);
    }
  }, [childTitleProp, titleProp, setTitle, open]);

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideUpTransition}
      {...dialogProps}
    >
      <Hidden smUp>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </Hidden>
      <Container maxWidth={maxWidth}>
        <Hidden xsDown>
          <div className={classes.titlebarLg}>
            <Typography variant="h4">{title}</Typography>
            <IconButton
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              style={{ alignSelf: "flex-end", marginRight: -24 }}
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          </div>
        </Hidden>
        <div className={classes.content}>{child}</div>
      </Container>
    </Dialog>
  );
}

export const ModalDialog = React.memo(_ModalDialog);
