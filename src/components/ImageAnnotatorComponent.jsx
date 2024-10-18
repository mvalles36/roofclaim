import React from 'react';

const ImageAnnotatorComponent = ({ image, annotations }) => {
  return (
    <div className="relative">
      <img src={image} alt="Uploaded image" className="max-w-full h-auto" />
      {annotations.map((annotation, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${annotation.x * 100}%`,
            top: `${annotation.y * 100}%`,
            width: `${annotation.width * 100}%`,
            height: `${annotation.height * 100}%`,
            border: '2px solid red',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default ImageAnnotatorComponent;