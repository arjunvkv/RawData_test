import React from "react";

const ContextMenu = ({ x, y, onAction }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y - 100,
        left: x - 300,
        backgroundColor: "white",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        borderRadius: "4px",
        zIndex: 1000,
      }}
    >
      <button
        style={{ display: "block", marginBottom: "5px" }}
        onClick={() => onAction("cast")}
      >
        Cast
      </button>
      <button style={{ display: "block" }} onClick={() => onAction("draw")}>
        Draw
      </button>
    </div>
  );
};

export default ContextMenu;
