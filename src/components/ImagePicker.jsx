import React from "react";
import { useDrag } from "react-dnd";

const ImagePicker = ({ src, id }) => {
  const [, drag] = useDrag(() => ({
    type: "IMAGE",
    item: { src, id },
  }));

  return (
    <div ref={drag} style={{ padding: "10px" }}>
      <img src={src} alt={id} />
    </div>
  );
};

export default ImagePicker;
