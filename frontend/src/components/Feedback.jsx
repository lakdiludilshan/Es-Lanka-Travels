import React, { useState, useEffect } from "react";
import moment from "moment";
import { Button, Textarea } from "flowbite-react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function Feedback({ feedback, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(feedback.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/${feedback.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [feedback]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(feedback.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/feedbacks/editfeedback/${feedback._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(feedback, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(feedback.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{feedback.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button>
                <FaThumbsUp
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser &&
                    feedback.likes.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                  type="button"
                  onClick={() => onLike(feedback._id)}
                />
              </button>
              <p className="text-gray-400">
                {feedback.numberOfLikes > 0 &&
                  feedback.numberOfLikes +
                    " " +
                    (feedback.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === feedback.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-500"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => onDelete(feedback._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Feedback;
