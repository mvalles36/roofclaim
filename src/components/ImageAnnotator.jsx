import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ImageAnnotator = ({ image, onSave, labels, onLabelAssign }) => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (image.annotations) {
      setAnnotations(image.annotations);
    }
  }, [image]);

  useEffect(() => {
    const img = new window.Image();
    img.src = image.url;
    img.onload = () => {
      imageRef.current = img;
    };
  }, [image.url]);

  const handleSave = () => {
    onSave(annotations);
  };

  const handleLabelAssign = (labelId) => {
    setSelectedLabel(labelId);
    onLabelAssign(image.id, labelId);
  };

  return (
    <div>
      <Stage width={800} height={600}>
        <Layer>
          {imageRef.current && (
            <Image
              image={imageRef.current}
              width={800}
              height={600}
            />
          )}
          {annotations.map((ann, i) => (
            <React.Fragment key={i}>
              <Rect
                x={ann.x * 800}
                y={ann.y * 600}
                width={ann.width * 800}
                height={ann.height * 600}
                stroke="red"
              />
              <Text
                x={ann.x * 800}
                y={(ann.y * 600) - 20}
                text={ann.class}
                fill="red"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
      <div className="mt-4">
        <Select onValueChange={handleLabelAssign} value={selectedLabel}>
          <SelectTrigger>
            <SelectValue placeholder="Assign a label" />
          </SelectTrigger>
          <SelectContent>
            {labels.map((label) => (
              <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSave} className="mt-4">Save Annotations</Button>
    </div>
  );
};

export default ImageAnnotator;
