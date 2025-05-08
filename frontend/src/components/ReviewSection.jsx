import { Alert, Button, Textarea, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Review from "./Review";

function ReviewSection({ hotelId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [review, setReview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/gethotelreviews/${hotelId}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getReviews();
  }, [hotelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (review.length > 2000) return;

    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: review,
          hotelId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReview("");
        setReviewError(null);
        setReviews([data, ...reviews]);
      }
    } catch (error) {
      setReviewError(error.message);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const res = await fetch(`/api/reviews/likereview/${reviewId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(
          reviews.map((review) =>
            review._id === reviewId
              ? {
                  ...review,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : review
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (review, editedContent) => {
    setReviews(
      reviews.map((r) =>
        r._id === review._id ? { ...r, content: editedContent } : r
      )
    );
  };

  const handleDelete = async (reviewId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const res = await fetch(`/api/reviews/deletereview/${reviewToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            src={currentUser.profilePicture}
            alt={currentUser.username}
            className="w-5 h-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          <p>Sign in to leave a review</p>
          <Link to={"/login"} className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Write your review..."
            rows="7"
            maxLength="2000"
            onChange={(e) => setReview(e.target.value)}
            value={review}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {2000 - review.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {reviewError && (
            <Alert color="failure" className="mt-5">
              {reviewError}
            </Alert>
          )}
        </form>
      )}
      {reviews.length === 0 ? (
        <p className="text-sm my-5">No reviews yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Reviews</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              {reviews.length}
            </div>
          </div>
          {reviews.map((review) => (
            <Review
              key={review._id}
              review={review}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(reviewId) => {
                setShowModal(true);
                setReviewToDelete(reviewId);
              }}
            />
          ))}
        </>
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
            <HiOutlineExclamationCircle className=" h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-5">
              Are you sure you want to delete this review?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(reviewToDelete)}
              >
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
}

export default ReviewSection;
