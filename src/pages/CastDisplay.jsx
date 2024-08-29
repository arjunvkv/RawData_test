import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const CastDisplay = () => {
  const [imageData, setImageData] = useState(null);
  const socket = useRef(null);
  const [image, setImage] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const drawingCanvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:8080");

    socket.current.on("castImage", async (data) => {
      try {
        if (
          data.src &&
          data.x !== undefined &&
          data.y !== undefined &&
          data.width !== undefined &&
          data.height !== undefined &&
          data.rotation !== undefined
        ) {
          setImageData(data);
        }
      } catch (e) {
        console.error("Error parsing castImage event:", e);
      }
    });

    socket.current.on("draw", (drawingData) => {
      if (ctxRef.current) {
        const ctx = ctxRef.current;
        ctx.beginPath();
        ctx.moveTo(drawingData.prevX, drawingData.prevY);
        ctx.lineTo(drawingData.x, drawingData.y);
        ctx.strokeStyle = drawingData.color || "black";
        ctx.lineWidth = drawingData.lineWidth || 3;
        ctx.stroke();
      }
    });

    socket.current.on("clearDrawings", () => {
      if (ctxRef.current) {
        const ctx = ctxRef.current;
        ctx.clearRect(
          0,
          0,
          drawingCanvasRef.current.width,
          drawingCanvasRef.current.height
        );
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (imageData) {
      const img = new Image();
      img.src = imageData.src;
      img.onload = () => {
        setImage(img);
      };
    }
  }, [imageData]);

  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      canvas.width = windowSize.width;
      canvas.height = windowSize.height;
      const ctx = canvas.getContext("2d");
      ctxRef.current = ctx;
    }
  }, [windowSize]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      {image && imageData && (
        <img
          src={image.src}
          alt="Casting"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            position: "relative",
            top: 0,
            left: 0,
          }}
        />
      )}
      <canvas
        ref={drawingCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default CastDisplay;
