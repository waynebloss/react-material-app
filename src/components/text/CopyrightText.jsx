import React from "react";

const year = new Date().getFullYear();

export const CopyrightText = React.memo(function _CopyrightText() {
  return (
    <>
      {`© ${year} Company Name, Inc.`}
      <br />
      {`All Rights Reserved.`}
    </>
  );
});
