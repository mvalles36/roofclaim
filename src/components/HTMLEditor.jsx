import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button";

const HTMLEditor = ({ initialContent, onSave }) => {
  const [content, setContent] = React.useState(initialContent);

  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleSave = () => {
    onSave(content);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
      />
      <Button onClick={handleSave} className="mt-4">
        Save Changes
      </Button>
    </div>
  );
};

export default HTMLEditor;
