import React from "react";
import { Select, TextInput, FileInput, Button } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select category</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            size="sm"
            outline
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write your post here..."
          value=""
          className="h-72 mb-12"
          required
        />
        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" type="submit" size="lg">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
