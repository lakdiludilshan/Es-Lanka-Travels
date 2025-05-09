import React, { useState } from "react";
import { Select, TextInput, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getStorage } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CreatePlace = () => {
    const { placeId } = useParams();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    imageUrl: "",
    coordinates: { lat: "", lng: "" },
    budget: { adult: "", child: "" },
  });
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("No file selected");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, imageUrl: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/places/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/place/${placeId}`); 
      }
    } catch (error) {
      setPublishError("Failed to add place");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Add New Place</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Place Name"
            required
            id="name"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Location"
            required
            id="location"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            <option value="Cultural">Cultural</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Beach">Beach</option>
            <option value="Hiking">Hiking</option>
            <option value="Historical">Historical</option>
            
            {/* Add other categories as needed */}
          </Select>
          <TextInput
            type="text"
            placeholder="Latitude"
            required
            id="latitude"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                coordinates: { ...formData.coordinates, lat: e.target.value },
              })
            }
          />
          <TextInput
            type="text"
            placeholder="Longitude"
            required
            id="longitude"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                coordinates: { ...formData.coordinates, lng: e.target.value },
              })
            }
          />
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <textarea
          placeholder="Description"
          id="description"
          className="mb-4 p-2 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 rounded-md w-full"
          rows="4"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <div className="flex gap-4 sm:flex-row justify-between">
          <div className="flex-1">
            <label htmlFor="adult" className="block text-sm font-medium">
              Adult Price
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
              <span className="text-gray-600 dark:text-gray-400 px-2">$</span>
              <TextInput
                type="number"
                placeholder="Adult Price"
                required
                id="adult"
                className="flex-1 p-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: { ...formData.budget, adult: e.target.value },
                  })
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="child" className="block text-sm font-medium">
              Child Price
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
              <span className="text-gray-600 dark:text-gray-400 px-2">$</span>
              <TextInput
                type="number"
                placeholder="Child Price"
                required
                id="child"
                className="flex-1 p-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: { ...formData.budget, child: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <Button
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          type="submit"
          size="lg"
        >
          Add Place
        </Button>
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePlace;
