import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPlaces = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [places, setPlaces] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [placeIdToDelete, setPlaceIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all places
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/places/all"); // Fetch all places
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch places");

        setPlaces(Array.isArray(data.places) ? data.places : []);
        setShowMore(data.places?.length >= 9);
      } catch (error) {
        console.error("Error fetching places:", error);
        setError(error.message);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Handle Delete Place
  const handleDeletePlace = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/places/delete/${placeIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setPlaces((prev) => prev.filter((place) => place._id !== placeIdToDelete));
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (error) {
      console.error("Error deleting place:", error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar">
      {loading ? (
        <p>Loading places...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : places.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Place Image</Table.HeadCell>
              <Table.HeadCell>Place Name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              {currentUser?.isAdmin && (
                <>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                </>
              )}
            </Table.Head>
            {places.map((place) => (
              <Table.Body key={place._id} className="divide-y">
                <Table.Row className="bg-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(place.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/place/${place._id}`}>
                      <img src={place.imageUrl} alt={place.name} className="w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/place/${place._id}`}>
                      {place.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{place.category}</Table.Cell>
                  {currentUser?.isAdmin && (
                    <>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setPlaceIdToDelete(place._id);
                          }}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link className="text-teal-500 hover:underline cursor-pointer" to={`/update-place/${place._id}`}>
                          Edit
                        </Link>
                      </Table.Cell>
                    </>
                  )}
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>No places found</p>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-5">
              Are you sure you want to delete this place?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePlace}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)} outline>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPlaces;
