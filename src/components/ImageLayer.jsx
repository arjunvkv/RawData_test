import React, { useRef, useState } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";

const ImageLayer = ({
  images,
  onSelectImage,
  onContextMenu,
  onImageTransform,
}) => {
  const [draggingImage, setDraggingImage] = useState(null);
  const imageRefs = useRef({});

  const sortedImages = images.slice().sort((a, b) => b.zIndex - a.zIndex);

  const handleSelect = (id) => {
    onSelectImage(id);
  };

  const handleDragStart = (image) => {
    setDraggingImage(image);
  };

  const handleDragEnd = (e) => {
    if (draggingImage) {
      const newAttrs = {
        x: e.target.x(),
        y: e.target.y(),
      };

      onImageTransform(draggingImage.id, newAttrs);
      setDraggingImage(null);
    }
  };

  return (
    <>
      {sortedImages.map((img) => (
        <div className="relative" key={img.id}>
          <KonvaImage
            image={img.image}
            x={img.x}
            y={img.y}
            width={img.width}
            height={img.height}
            rotation={img.rotation}
            draggable
            zIndex={img.zIndex}
            onClick={() => handleSelect(img.id)}
            onContextMenu={(e) => {
              e.evt.preventDefault();
              onContextMenu({
                visible: true,
                x: e.evt.clientX,
                y: e.evt.clientY,
                id: img.id,
              });
            }}
            onDragStart={() => handleDragStart(img)}
            onDragEnd={(e) => handleDragEnd(e)}
            onTransformEnd={(e) => {
              const node = e.target;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              const newAttrs = {
                x: node.x(),
                y: node.y(),
                width: node.width() * scaleX,
                height: node.height() * scaleY,
                rotation: node.rotation(),
              };
              onImageTransform(img.id, newAttrs);
              node.scaleX(1);
              node.scaleY(1);
            }}
            ref={(node) => {
              if (node) {
                imageRefs.current[img.id] = node;
              }
            }}
          />
          {imageRefs.current[img.id] && (
            <Transformer
              node={imageRefs.current[img.id]}
              keepRatio
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default ImageLayer;
