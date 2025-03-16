import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashFeedback = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [feedbackIdToDelete, setFeedbackIdToDelete] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`/api/feedbacks/getfeedbacks`);
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data.feedbacks);
          if (data.feedbacks.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchFeedbacks();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = feedbacks.length;
    try {
      const res = await fetch(
        `/api/feedbacks/getfeedbacks?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setFeedbacks((prev) => [...prev, ...data.feedbacks]);
        if (data.feedbacks.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteFeedback = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/feedbacks/deletefeedback/${feedbackIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setFeedbacks((prev) =>
          prev.filter((feedback) => feedback._id !== feedbackIdToDelete)
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
      {currentUser.isAdmin && feedbacks.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Feedback Content</Table.HeadCell>
              <Table.HeadCell>No. of Likes</Table.HeadCell>
              <Table.HeadCell>Place Name</Table.HeadCell>
              <Table.HeadCell>User Name</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {feedbacks.map((feedback) => (
              <Table.Body key={feedback._id} className="divide-y">
                <Table.Row className="bg-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(feedback.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{feedback.content}</Table.Cell>
                  <Table.Cell>{feedback.numberOfLikes}</Table.Cell>
                  <Table.Cell>{feedback.placeId}</Table.Cell>
                  <Table.Cell>{feedback.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setFeedbackIdToDelete(feedback._id);
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
        <p>No feedback available</p>
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
              Are you sure you want to delete this feedback?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteFeedback}>
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

export default DashFeedback;
