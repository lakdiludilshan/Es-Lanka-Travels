import React, { useState, useEffect } from "react";
import {
  TextInput,
  FileInput,
  Button,
  Alert,
  Textarea,
  Select,
} from "flowbite-react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const UpdateHotel = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    category: "",
    imageUrls: [],
    amenities: [],
    contactInfo: {
      phone: "",
      email: "",
      website: "",
    },
    pricing: {
      normal: "",
      deluxe: "",
    },
  });

  useEffect(() => {
    if (!hotelId) return;
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}`);
        if (!res.ok) throw new Error("Failed to fetch hotel details");
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
      }
    };
    fetchHotel();
  }, [hotelId]);

  const handleUploadImages = async () => {
    try {
      if (files.length === 0) {
        setImageUploadError("No files selected");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      let uploadedUrls = [];

      for (let file of files) {
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
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
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedUrls.push(downloadURL);
              resolve();
            }
          );
        });
      }

      setImageUploadProgress(null);
      setImageUploadError(null);
      setFormData({ ...formData, imageUrls: uploadedUrls });
    } catch (error) {
      console.error(error);
      setImageUploadError("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        name,
        location,
        description,
        category,
        imageUrls,
        pricing: { normal, deluxe },
      } = formData;

      if (
        !name ||
        !location ||
        !description ||
        !category ||
        imageUrls.length === 0 ||
        !normal ||
        !deluxe
      ) {
        setUpdateError("All required fields must be filled.");
        return;
      }

      const normalPrice = parseFloat(normal);
      const deluxePrice = parseFloat(deluxe);

      if (isNaN(normalPrice) || isNaN(deluxePrice)) {
        setUpdateError("Room prices must be valid numbers.");
        return;
      }

      const validatedData = {
        ...formData,
        pricing: { normal: normalPrice, deluxe: deluxePrice },
      };

      const res = await fetch(`/api/hotels/edit/${hotelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const data = await res.json();
      if (!res.ok) {
        setUpdateError(data.message || "Failed to update hotel.");
        return;
      }

      setUpdateError(null);
      alert("Hotel updated successfully!");
      navigate(`/hotels/${hotelId}`);
    } catch (err) {
      console.error(err);
      setUpdateError("Failed to update hotel.");
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Hotel</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Hotel Name"
            required
            className="flex-1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            required
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            <option value="Luxury">Luxury</option>
            <option value="Budget">Budget</option>
            <option value="Boutique">Boutique</option>
            <option value="Resort">Resort</option>
          </Select>
        </div>

        <TextInput
          type="text"
          placeholder="Location"
          required
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />

        <Textarea
          placeholder="Description"
          required
          rows={5}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            accept="image/*"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
          />
          <Button
            type="button"
            size="sm"
            outline
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            onClick={handleUploadImages}
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
              "Upload Images"
            )}
          </Button>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {formData.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {formData.imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`preview-${idx}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        )}

        <div className="flex gap-4 sm:flex-row justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium">
              Normal Room Price
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="px-2">$</span>
              <TextInput
                type="number"
                required
                value={formData.pricing.normal}
                className="flex-1 p-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricing: { ...formData.pricing, normal: e.target.value },
                  })
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">
              Deluxe Room Price
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="px-2">$</span>
              <TextInput
                type="number"
                required
                value={formData.pricing.deluxe}
                className="flex-1 p-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricing: { ...formData.pricing, deluxe: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Amenities Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h3 className="font-medium">Amenities</h3>
            {[
              "Free Wi-Fi",
              "Swimming Pool",
              "Fitness Center",
              "Room Service",
              "Parking",
              "Spa",
              "Restaurant",
            ].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={item}
                  checked={formData.amenities.includes(item)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      amenities: e.target.checked
                        ? [...prev.amenities, value]
                        : prev.amenities.filter((a) => a !== value),
                    }));
                  }}
                />
                {item}
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">More Amenities</h3>
            {[
              "Bar",
              "Airport Shuttle",
              "Pet-Friendly",
              "Conference Rooms",
              "Laundry Service",
              "24/7 Front Desk",
              "Business Center",
            ].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={item}
                  checked={formData.amenities.includes(item)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      amenities: e.target.checked
                        ? [...prev.amenities, value]
                        : prev.amenities.filter((a) => a !== value),
                    }));
                  }}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput
            type="text"
            placeholder="Phone"
            value={formData.contactInfo.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  phone: e.target.value,
                },
              })
            }
          />
          <TextInput
            type="email"
            placeholder="Email"
            value={formData.contactInfo.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  email: e.target.value,
                },
              })
            }
          />
          <TextInput
            type="text"
            placeholder="Website"
            value={formData.contactInfo.website}
            onChange={(e) =>
              setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  website: e.target.value,
                },
              })
            }
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        >
          Update Hotel
        </Button>

        {updateError && <Alert color="failure">{updateError}</Alert>}
      </form>
    </div>
  );
};

export default UpdateHotel;
