import React, { useRef, useState } from 'react';
import { Stage, Layer, Image, Rect } from 'react-konva';

const ImageAnnotator = ({ imageUrl, onAnnotationComplete }) => {
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setStartPoint(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const pos = e.target.getStage().getPointerPosition();
    setAnnotations([
      ...annotations,
      {
        x: startPoint.x,
        y: startPoint.y,
        width: pos.x - startPoint.x,
        height: pos.y - startPoint.y,
      },
    ]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (annotations.length > 0) {
      const lastAnnotation = annotations[annotations.length - 1];
      onAnnotationComplete(lastAnnotation);
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.width(),
        height: imageRef.current.height(),
      });
    }
  };

  return (
    <Stage
      width={imageDimensions.width}
      height={imageDimensions.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        <Image
          ref={imageRef}
          src={imageUrl}
          onLoad={handleImageLoad}
        />
        {annotations.map((annotation, i) => (
          <Rect
            key={i}
            x={annotation.x}
            y={annotation.y}
            width={annotation.width}
            height={annotation.height}
            stroke="red"
            strokeWidth={2}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default ImageAnnotator;
