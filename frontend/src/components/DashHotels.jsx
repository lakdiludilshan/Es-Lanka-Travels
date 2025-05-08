import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashHotels = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [hotels, setHotels] = useState([]);
  const [visibleHotels, setVisibleHotels] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hotelIdToDelete, setHotelIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/hotels/all");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch hotels");

        const hotelList = Array.isArray(data.hotels) ? data.hotels : [];
        setHotels(hotelList);
        setVisibleHotels(hotelList.slice(0, 5));
        setShowMore(hotelList.length > 5);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleDeleteHotel = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/hotels/delete/${hotelIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setHotels((prev) => prev.filter((h) => h._id !== hotelIdToDelete));
        setVisibleHotels((prev) =>
          prev.filter((h) => h._id !== hotelIdToDelete)
        );
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (err) {
      console.error("Error deleting hotel:", err.message);
    }
  };

  const handleShowMore = () => {
    setVisibleHotels(hotels);
    setShowMore(false);
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar">
      {loading ? (
        <p>Loading hotels...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : visibleHotels.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Hotel Name</Table.HeadCell>
              <Table.HeadCell>Location</Table.HeadCell>
              <Table.HeadCell>Contact</Table.HeadCell>
              {currentUser?.isAdmin && (
                <>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                </>
              )}
            </Table.Head>
            <Table.Body className="divide-y">
              {visibleHotels.map((hotel) => (
                <Table.Row
                  key={hotel._id}
                  className="bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                >
                  <Table.Cell>
                    {new Date(hotel.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/hotel/${hotel._id}`}>
                      <img
                        src={hotel.imageUrls?.[0]}
                        alt={hotel.name}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/hotel/${hotel._id}`}
                      className="text-gray-900 dark:text-white"
                    >
                      {hotel.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{hotel.location}</Table.Cell>
                  <Table.Cell>
                    {hotel.contactInfo?.phone ||
                      hotel.contactInfo?.email ||
                      hotel.contactInfo?.website ||
                      "N/A"}
                  </Table.Cell>
                  {currentUser?.isAdmin && (
                    <>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setHotelIdToDelete(hotel._id);
                          }}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          to={`/update-hotel/${hotel._id}`}
                          className="text-teal-500 hover:underline"
                        >
                          Edit
                        </Link>
                      </Table.Cell>
                    </>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-4"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No hotels found</p>
      )}

      <Button
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-4 mx-auto w-full"
        size="lg"
      >
        <Link to="/create-hotel" className="text-white">
          Add Hotel
        </Link>
      </Button>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-5">
              Are you sure you want to delete this hotel?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteHotel}>
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

export default DashHotels;
