import React, { useRef, useEffect } from 'react';

const ImageAnnotatorComponent = ({ imageUrl, annotations }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      drawAnnotations(ctx, annotations, image.width, image.height);
    };
  }, [imageUrl, annotations]);

  const drawAnnotations = (ctx, annotations, width, height) => {
    annotations.forEach(annotation => {
      const { x, y, width: boxWidth, height: boxHeight } = annotation;
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(x * width, y * height, boxWidth * width, boxHeight * height);
      ctx.fillStyle = 'red';
      ctx.font = '12px Arial';
      ctx.fillText(annotation.class, x * width, (y * height) - 5);
    });
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
};

export default ImageAnnotatorComponent;