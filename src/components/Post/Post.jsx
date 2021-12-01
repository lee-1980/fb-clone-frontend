import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentPost, fetchUser, likePost } from "../../API";
import { setPosts, setSinglePost } from "../../features/postSlice";
import dp from "../../assets/dp.jpg";
import like from "../../assets/like.svg";
import likeOutlined from "../../assets/like-outlined.svg";
import { months } from "../../DATE";
import Input from "../Input/Input";
import { Link } from "react-router-dom";
import "./post.css";
import { hideModal, showModal } from "../../features/modalSlice";

const Post = ({ singlepost, post }) => {
   const [user, setUser] = useState({});
   const { token } = JSON.parse(Cookies.get("user"));
   const dispatch = useDispatch();

   const { id } = useSelector((state) => state.user);
   let { posts } = useSelector((state) => state.post);
   const isLiked = post?.likes?.includes(id);

   let createdAt = new Date(post.createdAt);
   createdAt = `${createdAt.getDate()} ${
      months[createdAt.getMonth()]
   } ${createdAt.getFullYear()}`;

   useEffect(() => {
      try {
         (async () => {
            const { createdBy } = post;
            const { user } = await fetchUser(createdBy, token);
            setUser(user);
         })();
      } catch (error) {
         dispatch(showModal(error.response?.data?.msg || "Something went wrong"));
         setTimeout(() => dispatch(hideModal()), 4000);
      }
   }, [post, token, dispatch]);

   const clickHandler = async () => {
      try {
         const data = await likePost(post._id, token, !isLiked);
         if (singlepost) {
            dispatch(setSinglePost(data.posts));
         } else {
            const index = posts.reduce((acc, post, i) => {
               if (post._id === data.posts._id) return i;
               return acc;
            }, -1);
            let slicedPosts = [...posts];
            slicedPosts.splice(index, 1, data.posts);
            dispatch(setPosts(slicedPosts));
         }
      } catch (error) {
         dispatch(showModal(error.response?.data?.msg || "Something went wrong"));
         setTimeout(() => dispatch(hideModal()), 4000);
      }
   };

   const commentHandler = async (comment) => {
      try {
         const data = await commentPost(post._id, comment, token);
         const index = posts.reduce((acc, post, i) => {
            if (post._id === data.posts._id) return i;
            return acc;
         }, -1);
         let slicedPosts = [...posts];
         slicedPosts.splice(index, 1, data.posts);
         dispatch(setPosts(slicedPosts));
      } catch (error) {
         dispatch(showModal(error.response?.data?.msg || "Something went wrong"));
         setTimeout(() => dispatch(hideModal()), 4000);
      }
   };

   return (
      <article className={singlepost ? "post halfborder" : "post"}>
         <header>
            <Link to={`/user/${post.createdBy}`}>
               <img
                  src={user.profileImage || dp}
                  alt="profileImage"
                  className="post__dp roundimage"
               />
            </Link>
            <div>
               <h3>{user.name}</h3>
               <p>{createdAt}</p>
            </div>
         </header>
         <Link to={`/post/${post._id}`}>
            <p>{post.caption}</p>
            {post.image?.src && (
               <img src={post.image?.src} alt="post_image" className="post__image" />
            )}
         </Link>
         <div className="post__footer">
            <div className="post__reactions">
               <img
                  src={isLiked ? like : likeOutlined}
                  alt="like"
                  onClick={clickHandler}
               />
               <p>{post.likes.length || ""}</p>
            </div>
            {singlepost || (
               <Input placeholder={"Write a comment"} handler={commentHandler} />
            )}
         </div>
      </article>
   );
};

export default Post;
