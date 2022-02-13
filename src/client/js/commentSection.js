import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComments = document.querySelector(".video__comments ul");

const deleteCommentLive = async (event) => {
  const commentId = String(event.target.parentElement.dataset.id);
  const response = await fetch(`/api/videos/${commentId}/delete-comment`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    const deleteOne = document.querySelector(`li[data-id="${commentId}"]`);
    deleteOne.remove();
    await response.json();
  }
};

const addComment = (text, id) => {
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const a = document.createElement("a");
  a.innerText = "❌";
  a.addEventListener("click", deleteCommentLive);
  //a.href = `/api/videos/${id}/delete-comment`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(a);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
