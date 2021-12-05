import React, { useState } from "react";
import { sendIcon, fileIcon } from "../../assets";
import { useDispatch } from "react-redux";
import { hideModal, showModal } from "../../features/modalSlice";
import { createPost } from "../../API";
import Cookies from "js-cookie";
import { pushPost } from "../../features/postSlice";
import useFetch from "../../hooks/useFetch";
import "./createpost.css";

const CreatePost = () => {
   // local states
   const [image, setImage] = useState(null);
   const [preview, setPreview] = useState(null);
   const [caption, setCaption] = useState("");
   const { token } = JSON.parse(Cookies.get("user"));

   const dispatch = useDispatch();
   const customFetch = useFetch();

   const loadImage = (e) => {
      const input = e.target;
      var reader = new FileReader();
      reader.onload = function (e) {
         setPreview(e.target.result);
      };
      input.files[0] && reader.readAsDataURL(input.files[0]);
      setImage(input.files[0]);
   };

   const submitHandler = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);
      dispatch(showModal("Hold on, I swear It wont't take so long"));
      const data = await customFetch(createPost, formData, token);
      if (data) {
         dispatch(pushPost(data.post));
         dispatch(showModal("Post Created"));
         setImage(null);
         setPreview(null);
         setCaption("");
         setTimeout(() => dispatch(hideModal()), 4000);
      }
   };

   return (
      <article className="createpost">
         <form onSubmit={submitHandler}>
            <textarea
               placeholder="What's on your mind?"
               value={caption}
               onChange={(e) => setCaption(e.target.value)}
            />
            {preview && (
               <img src={preview} alt="uploaded file" className="uploaded-image" />
            )}
            <div className="btns">
               <label htmlFor="image">
                  <div>
                     <img src={fileIcon} alt="upload" />
                  </div>
               </label>
               <input
                  type="file"
                  id="image"
                  accept="image/png, image/jpeg"
                  onChange={loadImage}
               />
               <button type="submit">
                  <img src={sendIcon} alt="send" />
               </button>
            </div>
         </form>
      </article>
   );
};

export default CreatePost;
