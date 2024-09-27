import React from 'react';

const ImageAnnotatorComponent = ({ image, annotations, onSave, labels, onLabelAssign }) => {
  const handleLabelAssign = (labelId) => {
    onLabelAssign(image.id, labelId);
  };

  return (
    <div className="relative">
      <img src={image.url} alt="Annotated Damage" className="w-full h-auto" />
      {annotations.map((annotation, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: annotation.y,
            left: annotation.x,
            width: annotation.width,
            height: annotation.height,
            border: '2px solid red',
            borderRadius: '2px',
          }}
          className="bg-red-500 opacity-50"
        >
          <span className="absolute text-white text-xs">{annotation.class}</span>
        </div>
      ))}
      <div className="absolute bottom-0 left-0 flex space-x-2 p-2">
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => handleLabelAssign(label.id)}
            className="p-2 bg-blue-500 text-white rounded"
          >
            {label.name}
          </button>
        ))}
      </div>
      <button onClick={() => onSave(annotations)} className="absolute top-0 right-0 m-2 p-2 bg-green-500 text-white rounded">
        Save Annotations
      </button>
    </div>
  );
};

export default ImageAnnotatorComponent;
