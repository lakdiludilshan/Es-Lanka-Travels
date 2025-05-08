import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashReview = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/getreviews`);
        const data = await res.json();
        if (res.ok) {
          setReviews(data.reviews);
          if (data.reviews.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchReviews();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = reviews.length;
    try {
      const res = await fetch(
        `/api/reviews/getreviews?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => [...prev, ...data.reviews]);
        if (data.reviews.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteReview = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/reviews/deletereview/${reviewIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) =>
          prev.filter((review) => review._id !== reviewIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar">
      {currentUser.isAdmin && reviews.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Review Content</Table.HeadCell>
              <Table.HeadCell>Rating</Table.HeadCell>
              <Table.HeadCell>Hotel</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {reviews.map((review) => (
              <Table.Body key={review._id} className="divide-y">
                <Table.Row className="bg-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(review.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{review.content}</Table.Cell>
                  <Table.Cell>{review.rating}</Table.Cell>
                  <Table.Cell>
                    {review.hotelId?.name || review.hotelId}
                  </Table.Cell>
                  <Table.Cell>
                    {review.userId?.username || review.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setReviewIdToDelete(review._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No reviews available</p>
      )}
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
              Are you sure you want to delete this review?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteReview}>
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

export default DashReview;
