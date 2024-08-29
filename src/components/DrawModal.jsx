import React, { useRef, useState, useEffect } from "react";

const DrawModal = ({ image, onClose, socket }) => {
  const backgroundCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const drawingContextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("draw", ({ x, y, prevX, prevY }) => {
        draw(x, y, prevX, prevY, false);
      });
    }
    return () => {
      if (socket) socket.off("draw");
    };
  }, [socket]);

  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const backgroundContext = backgroundCanvas.getContext("2d");
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    if (image.src) {
      const img = new Image();
      img.src = image.src;
      img.onload = () => {
        const imgAspectRatio = img.width / img.height;
        const canvasAspectRatio =
          backgroundCanvas.width / backgroundCanvas.height;

        let drawWidth, drawHeight;

        if (imgAspectRatio > canvasAspectRatio) {
          drawWidth = backgroundCanvas.width;
          drawHeight = backgroundCanvas.width / imgAspectRatio;
        } else {
          drawHeight = backgroundCanvas.height;
          drawWidth = backgroundCanvas.height * imgAspectRatio;
        }

        const offsetX = (backgroundCanvas.width - drawWidth) / 2;
        const offsetY = (backgroundCanvas.height - drawHeight) / 2;

        backgroundContext.drawImage(
          img,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight
        );
      };
    }
  }, [image]);

  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current;
    const drawingContext = drawingCanvas.getContext("2d");
    drawingCanvas.width = window.innerWidth;
    drawingCanvas.height = window.innerHeight;
    drawingContext.lineCap = "round";
    drawingContext.strokeStyle = "black";
    drawingContext.lineWidth = 5;
    drawingContextRef.current = drawingContext;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    drawingContextRef.current.beginPath();
    drawingContextRef.current.moveTo(offsetX, offsetY);
  };

  const draw = (x, y, prevX, prevY, shouldBroadcast = true) => {
    if (!isDrawing) return;

    drawingContextRef.current.lineTo(x, y);
    drawingContextRef.current.stroke();

    if (shouldBroadcast && socket) {
      socket.emit("draw", { x, y, prevX, prevY });
    }
  };

  const finishDrawing = () => {
    drawingContextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearDrawings = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const drawingContext = drawingCanvas.getContext("2d");
    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    if (socket) {
      socket.emit("clearDrawings");
    }
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const prevX = event.nativeEvent.movementX;
    const prevY = event.nativeEvent.movementY;
    draw(offsetX, offsetY, offsetX - prevX, offsetY - prevY);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      style={{ overflow: "hidden" }}
    >
      <div className="relative w-full h-full">
        <canvas
          ref={backgroundCanvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />
        <canvas
          ref={drawingCanvasRef}
          className="absolute inset-0 w-full h-full"
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={handleMouseMove}
          onMouseLeave={finishDrawing}
          style={{ zIndex: 1 }}
        />
        <div className="absolute z-50 top-4 right-4 flex flex-col gap-2">
          <button
            onClick={clearDrawings}
            className="bg-black text-white p-2 rounded-full shadow hover:bg-white hover:text-black"
          >
            🗑️ Clear Drawings
          </button>
          <button
            onClick={() => {
              clearDrawings();
              onClose();
            }}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
          >
            ✖️ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawModal;
