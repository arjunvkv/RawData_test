// src/App.js
import React, { useState } from "react";
import Canvas from "../components/Canvas";
import ImagePicker from "../components/ImagePicker";
import InstructionModal from "../components/InstructionModal";
import img1 from "../assets/images/img1.jpg";
import img2 from "../assets/images/img2.jpg";
import img3 from "../assets/images/img3.jpg";
import img4 from "../assets/images/img4.jpg";
import img5 from "../assets/images/img5.jpg";

const images = [
  { src: img1, id: "img1" },
  { src: img2, id: "img2" },
  { src: img3, id: "img3" },
  { src: img4, id: "img4" },
  { src: img5, id: "img5" },
];

const CanvasBoard = () => {
  const [isModalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "20%",
          padding: "10px",
          borderRight: "1px solid #ccc",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <h2 className="w-full text-center capitalize font-bold">
          Image Folder
        </h2>
        {images.map((image) => (
          <ImagePicker key={image.id} src={image.src} id={image.id} />
        ))}
      </div>
      <div style={{ width: "80%", height: "100%" }}>
        <Canvas />
      </div>
      {isModalVisible && <InstructionModal onClose={closeModal} />}
    </div>
  );
};

export default CanvasBoard;
