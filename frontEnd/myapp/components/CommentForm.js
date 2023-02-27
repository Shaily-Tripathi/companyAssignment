import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ currentUser, postId, addComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentTextChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      alert('Please log in to add a comment.');
      return;
    }

    try {
      const response = await axios.post(
        `/api/posts/${postId}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      addComment(response.data);
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="commentText">Add a comment</label>
        <textarea
          id="commentText"
          className="form-control"
          value={commentText}
          onChange={handleCommentTextChange}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default CommentForm;
