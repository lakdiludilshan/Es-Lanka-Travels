import { Alert, Button, Textarea, Modal } from "flowbite-react"; 
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Feedback from "./Feedback";

function FeedbackSection({ placeId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null); 
  const [feedbackError, setFeedbackError] = useState(null); 
  const [feedbacks, setFeedbacks] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        const res = await fetch(`/api/feedbacks/getplacefeedbacks/${placeId}`); 
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getFeedbacks();
  }, [placeId]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback.length > 2000) {
      return;
    }
    try {
      const res = await fetch("/api/feedbacks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: feedback, 
          placeId, 
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("");
        setFeedbackError(null);
        setFeedbacks([data, ...feedbacks]); 
      }
    } catch (error) {
      setFeedbackError(error.message);
    }
  };

  const handleLike = async (feedbackId) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const res = await fetch(`/api/feedbacks/likefeedback/${feedbackId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(
          feedbacks.map((feedback) =>
            feedback._id === feedbackId
              ? {
                  ...feedback,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : feedback
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const handleEdit = async (feedback, editedContent) => {
    setFeedbacks(
      feedbacks.map((f) =>
        f._id === feedback._id ? { ...f, content: editedContent } : f
      )
    );
  };

  const handleDelete = async (feedbackId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const res = await fetch(
        `/api/feedbacks/deletefeedback/${feedbackToDelete}`, 
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setFeedbacks(
          feedbacks.filter((feedback) => feedback._id !== feedbackId)
        ); 
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
          <p>Sign in to leave feedback</p> 
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
            rows="7" 
            maxLength="2000" 
            onChange={(e) => setFeedback(e.target.value)} 
            value={feedback} 
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {2000 - feedback.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {feedbackError && (
            <Alert color="failure" className="mt-5">
              {feedbackError} 
            </Alert>
          )}
        </form>
      )}
      {feedbacks.length === 0 ? ( 
        <p className="text-sm my-5">No feedback yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Feedback</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              {feedbacks.length}
            </div>
          </div>
          {feedbacks.map((feedback) => (
            <Feedback
              key={feedback._id}
              feedback={feedback}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(feedbackId) => {
                setShowModal(true);
                setFeedbackToDelete(feedbackId);
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
              Are you sure you want to delete this feedback?{" "}
              {/* Changed text */}
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(feedbackToDelete)}
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
