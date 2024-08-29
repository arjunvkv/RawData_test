// Canvas.js
import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Stage, Layer } from "react-konva";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContextMenu from "./ContextMenu";
import ImageLayer from "./ImageLayer";
import DrawModal from "./DrawModal";
import { io } from "socket.io-client";

const Canvas = () => {
  const socket = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    id: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDraw, setImageToDraw] = useState(null);
  const addedImageSources = useRef(new Set());

  useEffect(() => {
    socket.current = io("http://localhost:8080");

    socket.current.on("imageData", (data) => {
      if (
        data.src &&
        data.x !== undefined &&
        data.y !== undefined &&
        data.width !== undefined &&
        data.height !== undefined &&
        data.rotation !== undefined &&
        data.drawing !== undefined
      ) {
        setImageData(data);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  const [, drop] = useDrop(() => ({
    accept: "IMAGE",
    drop: async (item) => {
      if (addedImageSources.current.has(item.src)) {
        toast.info("This image has already been added.");
        return;
      }

      const img = await loadImage(item.src);
      addImage(item, img);
      addedImageSources.current.add(item.src);
    },
  }));

  const addImage = (item, img) => {
    const aspectRatio = img.width / img.height;
    const defaultWidth = 200;
    const defaultHeight = defaultWidth / aspectRatio;

    setImages((prev) => [
      ...prev,
      {
        src: item.src,
        id: item.id,
        image: img,
        x: 50,
        y: 50,
        width: defaultWidth,
        height: defaultHeight,
        rotation: 0,
        zIndex: 0,
      },
    ]);
  };

  const handleContextMenuAction = (action, id) => {
    switch (action) {
      case "cast":
        handleCastImage(id);
        break;
      case "draw":
        handleDrawImage(id);
        break;
      default:
        break;
    }
  };

  const handleCastImage = (id) => {
    const imageToCast = images.find((img) => img.id === id);
    if (imageToCast) {
      const data = {
        src: imageToCast.src,
        width: imageToCast.width,
        height: imageToCast.height,
        x: imageToCast.x,
        y: imageToCast.y,
        rotation: imageToCast.rotation,
      };
      socket.current.emit("castImage", data);
    }
    setContextMenu({ visible: false, x: 0, y: 0, id: null });
  };

  const handleDrawImage = async (id) => {
    const imageToDraw = images.find((img) => img.id === id);
    if (imageToDraw) {
      const img = await loadImage(imageToDraw.src);
      const data = {
        src: imageToDraw.src,
        width: imageToDraw.width,
        height: imageToDraw.height,
        x: imageToDraw.x,
        y: imageToDraw.y,
        rotation: imageToDraw.rotation,
        drawing: true,
        type: "image",
        imageData: img.src,
      };
      socket.current.emit("castImage", data);

      setImageToDraw(imageToDraw);
      setIsModalOpen(true);
    }
    setContextMenu({ visible: false, x: 0, y: 0, id: null });
  };

  return (
    <div
      ref={drop}
      style={{ height: "100vh", width: "100vw", position: "relative" }}
      onClick={() => setContextMenu({ visible: false, x: 0, y: 0, id: null })}
    >
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <ImageLayer
            images={images}
            onSelectImage={setSelectedId}
            onContextMenu={setContextMenu}
            onImageTransform={(id, newAttrs) => {
              setImages((prev) =>
                prev.map((img) =>
                  img.id === id ? { ...img, ...newAttrs } : img
                )
              );
            }}
            socket={socket.current}
          />
        </Layer>
      </Stage>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={(action) => handleContextMenuAction(action, contextMenu.id)}
        />
      )}

      {imageToDraw && isModalOpen && (
        <DrawModal
          image={imageToDraw}
          onClose={() => setIsModalOpen(false)}
          socket={socket.current}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default Canvas;
