import React from "react";
import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { duration } from "@material-ui/core/styles/transitions";
// Local
import {
  MenuIcon,
  HomeIcon,
  HistoryIcon,
  SaveAltIcon,
  DescriptionIcon,
  PowerSettingsIcon,
  CopyrightText,
  VersionText,
} from "../components";
import { REACT_APP_COMPANY_SITE_URL } from "../config";
import { iOS } from "../device";
import { Navigation } from "../lib";
import Pages from "../pages";
import { AuthSelectors, useSelector } from "../state";
import companyLogo from "../assets/img/company-logo_300x.png";
import { useStyles } from "./MainMenu.styles";

function getItems() {
  const menuItems = [
    {
      text: "Home",
      icon: HomeIcon,
      url: Pages.main.home.path,
      urlActiveIf: {
        exact: true,
      },
    },
    {
      text: "Todos",
      icon: HistoryIcon,
      url: Pages.todo.list.path,
    },
    {
      text: "Page 2",
      icon: SaveAltIcon,
      url: "/page-2",
    },
    {
      text: "Page 3",
      icon: DescriptionIcon,
      url: "/page-3",
    },
    {
      text: "Logout",
      icon: PowerSettingsIcon,
      onClick() {
        if (!window.confirm("Are you sure you want to log out?")) {
          return;
        }
        Navigation.go("/auth/logout");
      },
    },
  ];

  const viewProfileItem = {
    url: "/profile",
  };

  return {
    menuItems,
    viewProfileItem,
  };
}

function _MainMenu() {
  const avatarInfo = useSelector(AuthSelectors.avatarInfo);
  const userFullName = useSelector(AuthSelectors.userFullName);
  const classes = useStyles();
  // #region State
  /**
   * - We use `setCurrentPath` only to cause a re-render, not reading it.
   */
  // #endregion
  const { menuItems, viewProfileItem } = React.useMemo(getItems);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [, setCurrentPath] = React.useState(null);
  // #region Callbacks, Effects
  /**
   * - The `routeChanged` callback is created only once on component mount.
   * Not on every render. See https://reactjs.org/docs/hooks-reference.html#usecallback
   *
   * - The `Navigation.onRouteChanged` handler is only created on component
   * mount or if `routeChanged` is recreated (which only happens on mount).
   * Likewise, the retuned `remove` function is only called  React when the
   * component is unmounted or if `routeChanged` is recreated.
   * See https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect
   * See https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect
   */
  // #endregion
  const routeChanged = React.useCallback(() => {
    setCurrentPath(Navigation.location.pathname);
  }, []);
  React.useEffect(() => {
    const remove = Navigation.onRouteChanged(routeChanged);
    return remove;
  }, [routeChanged]);
  // #region Input handlers
  /**
   * - These should come last because they will use things defined above.
   */
  // #endregion
  const onToggleMenu = React.useCallback(() => {
    setMobileOpen(value => !value);
  }, [setMobileOpen]);
  const onCloseMenu = React.useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);
  const onOpenMenu = React.useCallback(() => {
    setMobileOpen(true);
  }, [setMobileOpen]);

  function onMenuItemClick(item) {
    if (!item.onClick) {
      item.onClick = () => {
        if (iOS) {
          // Prevent swipe back navigation from showing an open menu.
          Navigation.delayed(item.url, duration.leavingScreen + 50);
        } else {
          Navigation.go(item.url);
        }
        setMobileOpen(false);
      };
    }
    return item.onClick;
  }

  const menuContent = (
    <div className={classes.menuRoot}>
      <Avatar
        className={classes.avatar}
        style={{
          color: avatarInfo.textColor,
          backgroundColor: avatarInfo.bgColor,
        }}
      >
        {avatarInfo.text}
      </Avatar>
      <Typography variant="h6" className={classes.userName}>
        {userFullName}
      </Typography>
      <List style={{ padding: 0 }}>
        <ListItem button onClick={onMenuItemClick(viewProfileItem)}>
          <ListItemText
            primary={
              <Typography className={classes.viewProfileText} variant="body2">
                View profile
              </Typography>
            }
          />
        </ListItem>
      </List>
      <Divider />
      <List className={classes.menuList}>
        {menuItems.map(item => {
          const { text, icon: Icon, url } = item;
          /**
           * `Navigation.isActive` can only be read reliably since we're
           * re-rendering when `setCurrentPath` is called in `routeChanged`,
           * the `Navigation.onRouteChanged` event handler...
           */
          const isActive = Navigation.isActive(url, item.urlActiveIf);
          return (
            <ListItem
              key={text}
              button
              className={
                isActive ? classes.menuListItemActive : classes.menuListItem
              }
              onClick={onMenuItemClick(item)}
            >
              <ListItemIcon className={classes.menuListItemIcon}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <>
      <Hidden mdUp>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open menu"
              edge="start"
              onClick={onToggleMenu}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.companyLogoShape}>
              <img src={companyLogo} alt="Company logo" height="32" />
            </div>
          </Toolbar>
        </AppBar>
      </Hidden>
      <nav className={classes.drawer} aria-label="Main menu">
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={onCloseMenu}
            onOpen={onOpenMenu}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
          >
            {menuContent}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {menuContent}
            <div className={classes.companyLogoBox}>
              <Link
                color="inherit"
                href={REACT_APP_COMPANY_SITE_URL}
                target="blank"
                rel="noreferrer noopener"
              >
                <img src={companyLogo} alt="Company logo" />
              </Link>
              <Typography
                variant="caption"
                display="block"
                align="center"
                style={{ color: "grey", marginLeft: -10, marginRight: -10 }}
              >
                <VersionText /> <CopyrightText />
              </Typography>
            </div>
          </Drawer>
        </Hidden>
      </nav>
    </>
  );
}

export const MainMenu = React.memo(_MainMenu);
