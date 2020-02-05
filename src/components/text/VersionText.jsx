import React from "react";
// Local
import { REACT_APP_VERSION } from "../../config";

const aboutVersionText = `App Name v${REACT_APP_VERSION}`;

const style = {
  cursor: "pointer",
};

function onClickAboutVersion(e) {
  e.preventDefault();
  window.alert(aboutVersionText);
}

export const VersionText = React.memo(function _VersionText() {
  return (
    <span onClick={onClickAboutVersion} title={aboutVersionText} style={style}>
      App Name
    </span>
  );
});
