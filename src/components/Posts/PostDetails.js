import React from "react";
import { Link } from "react-router-dom";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { deletePostAction, fetchPostDetailsAction } from "../../redux/slices/posts/postSlice";
import {useDispatch, useSelector} from "react-redux";
import { useEffect } from "react";
import DateFormatter from "../../utils/DateFormatter";
import LoadingComponent from "../../utils/LoadingComponent";
import { Redirect } from "react-router-dom";



const PostDetails = ({
  match: {
    params: {id},
  },
  })  => {
    console.log(id);
    const dispatch = useDispatch();
  
    //fect single category -put fetch actions in useEffect 
    useEffect(() => {
      dispatch(fetchPostDetailsAction(id));
    }, [id, dispatch]);

    //select post details from store
    const post = useSelector(state => state?.post)
    const {postDetails, loading, appErr, serverErr, isDeleted} = post;
    //console.log("ID1 ",postDetails?.user?._id);

    //Get login user
    const user = useSelector(state => state.users);
    
    const {
      userAuth: { _id },
    } = user;
    //console.log("ID2",_id);

    const isCreatedBy = postDetails?.user?._id === _id;  
    console.log(isCreatedBy);

    //redirect
  if(isDeleted) return <Redirect to = "/posts" />;


  return (
    <>
      {loading ? <div className="h-screen">
        <LoadingComponent />
      </div>  : appErr || serverErr ? <h1 className="h-screen text-red-400 text-xl">{serverErr} {appErr}</h1> : 
      <section class="py-20 2xl:py-40 bg-gray-800 overflow-hidden">
        <div class="container px-4 mx-auto">
          {/* Post Image */}
          <img
            class="mb-24 w-full h-96 object-cover"
            src={postDetails?.image}
            alt=""
          />
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="mt-7 mb-14 text-6xl 2xl:text-7xl text-white font-bold font-heading">
              {postDetails?.title}
            </h2>

            {/* User */}
            <div class="inline-flex pt-14 mb-14 items-center border-t border-gray-500">
              <img
                class="mr-8 w-20 lg:w-24 h-20 lg:h-24 rounded-full"
                src={postDetails?.user?.profilePhoto}
                alt=""
              />
              <div class="text-left">
                <h4 class="mb-1 text-2xl font-bold text-gray-50">
                  <span class="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-orange-600">
                  {postDetails?.user?.firstName} {postDetails?.user?.lastName} 
                  </span>
                </h4>
                <p class="text-gray-500">
                  <DateFormatter date={postDetails?.createdAt} />
                </p>
              </div>
            </div>
            {/* Post description */}
            <div class="max-w-xl mx-auto">
              <p class="mb-6 text-left  text-xl text-gray-200">
                {postDetails?.description}
                {/* Show delete and update btn if it was created by the user */}
                {isCreatedBy ? 
                  <p class="flex">
                  <Link to = {`/update-post/${postDetails?._id}`} class="p-3">
                    <PencilAltIcon class="h-8 mt-3 text-yellow-300" />
                  </Link>
                  <button
                  onClick = {() => dispatch(deletePostAction(id))}
                   class="ml-3">
                    <TrashIcon class="h-8 mt-3 text-red-600" />
                  </button>
                </p> : null
                }
              </p>
            </div>
          </div>
        </div>
        {/* Add comment Form component here */}

        <div className="flex justify-center  items-center">
          {/* <CommentsList comments={post?.comments} postId={post?._id} /> */}
          CommentsList
        </div>
      </section>}
    </>
  );
};

export default PostDetails;
