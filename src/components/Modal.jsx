import React from "react";

const Modal = ({ win, retryClicked, newLevelClicked }) => {
  return (
    <>
      {win ? (
        <button onClick={newLevelClicked}>go to new level</button>
      ) : (
        <button onClick={retryClicked}>retry</button>
      )}
    </>
  );
};

export default Modal;
