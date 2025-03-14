import { Alert, Button, Textarea, Modal } from "flowbite-react"; // Removed TextInput as it's not used
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function FeedbackSection({ placeId }) { // Change `postId` to `placeId`
  const { currentUser } = useSelector((state) => state.user);
  const [feedback, setFeedback] = useState(""); // Change `comment` to `feedback`
  const [showModal, setShowModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null); // Change `commentToDelete` to `feedbackToDelete`
  const [feedbackError, setFeedbackError] = useState(null); // Change `commentError` to `feedbackError`
  const [feedbacks, setFeedbacks] = useState([]); // Change `comments` to `feedbacks`
  const navigate = useNavigate();

  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        const res = await fetch(`/api/feedbacks/getplacefeedbacks/${placeId}`); // Change API endpoint
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data);
          console.log(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getFeedbacks();
  }, [placeId]); // Change `postId` to `placeId`

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback.length > 500) { // Increase character limit for feedback
      return;
    }
    try {
      const res = await fetch("/api/feedbacks/create", { // Change API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: feedback, // Change `comment` to `feedback`
          placeId, // Change `postId` to `placeId`
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("");
        setFeedbackError(null);
        setFeedbacks([data, ...feedbacks]); // Change `comments` to `feedbacks`
      }
    } catch (error) {
      setFeedbackError(error.message);
    }
  };

  const handleDelete = async (feedbackId) => { // Change `commentId` to `feedbackId`
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const res = await fetch(
        `/api/feedbacks/deletefeedback/${feedbackToDelete}`, // Change API endpoint
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackId)); // Change `comments` to `feedbacks`
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
          <p>Sign in to leave feedback</p> {/* Changed text */}
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
            placeholder="Write your feedback..."
            rows="5" // Increased rows for feedback
            maxLength="500" // Increased max length
            onChange={(e) => setFeedback(e.target.value)} // Change `setComment` to `setFeedback`
            value={feedback} // Change `comment` to `feedback`
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {500 - feedback.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {feedbackError && (
            <Alert color="failure" className="mt-5">
              {feedbackError} {/* Change `commentError` to `feedbackError` */}
            </Alert>
          )}
        </form>
      )}
      {feedbacks.length === 0 ? ( // Change `comments` to `feedbacks`
        <p className="text-sm my-5">No feedback yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Feedback</p> {/* Changed text */}
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              {feedbacks.length}
            </div>
          </div>
          {feedbacks.map((feedback) => ( // Change `comment` to `feedback`
            <div
              key={feedback._id}
              className="border p-3 rounded-md my-2 bg-gray-50"
            >
              <p className="text-sm text-gray-600">{feedback.content}</p>
              <div className="flex justify-end mt-2">
                {currentUser?._id === feedback.userId && (
                  <Button
                    color="failure"
                    size="xs"
                    onClick={() => {
                      setShowModal(true);
                      setFeedbackToDelete(feedback._id); // Change `commentToDelete` to `feedbackToDelete`
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
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
              Are you sure you want to delete this feedback? {/* Changed text */}
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(feedbackToDelete)} // Change `commentToDelete` to `feedbackToDelete`
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

export default FeedbackSection;
