import React, { Fragment } from "react";
// import loader from "./img/loader.gif";

function Spinner(props) {
  return (
    <Fragment>
      <img
        src="../img/loader.gif"
        style={{ width: "200px", margin: "auto", display: "block" }}
        alt="Loading..."
      />
    </Fragment>
  );
}

export default Spinner;
