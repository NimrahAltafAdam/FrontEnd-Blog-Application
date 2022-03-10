import { UploadIcon } from "@heroicons/react/outline";
import styled from "styled-components";
import Dropzone  from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uploadProfilePhotoAction } from "../../../redux/slices/Users/usersSlices";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

//form schema
const formSchema = Yup.object({
  image: Yup.string().required("Image is required")
}); 


//Css for dropzone

const Container = styled.div`
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
padding: 20px;
border-width: 2px;
border-radius: 2px;
border-style: dashed;
background-color: #fafafa;
color: #bdbdbd;
outline: none;
transition: border 0.24s ease-in-out;
`;

export default function UploadProfilePhoto({
  computedMatch: {
    params: { id },
  },
}) {

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues : {
      image: ""
    },
    onSubmit: values => {
      const data = {
        image: values?.image
      };
      dispatch(uploadProfilePhotoAction(data))
    },
    validationSchema: formSchema,
  });

  const data = useSelector(state => state?.users);
  const {isUploaded, loading, appErr, serverErr, photoUploaded, userAuth} = data;

  //redirect
  //if(photoUploaded) return <Redirect to = {`/profile/${userAuth?._id}`} />
  if(isUploaded) return <Redirect to={`/profile/${id}`} />;
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          Upload profile photo
        </h2>
        {/* Displya err here */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {appErr || serverErr ? (
  <h2 className="text-center text-red-500">
    {serverErr} {appErr}
  </h2>
) : null}
            {/* Image container here thus Dropzone */}
            <div className="text-red-500">
              {formik.touched.image && formik.errors.image}
            </div>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF minimum size 400kb uploaded only 1 image
            </p>

            {/*Image Component*/}
            <label
                  htmlFor="password"
                  className="block text-sm font-medium mt-3 mb-1 text-gray-700"
                >
                  Select an Image to Upload
                </label>
                <Container className = "container bg-gray-600">
                <Dropzone
                onBlur = {formik.handleBlur('image')}
                accept = "image/jpeg, image/png"
                onDrop = {acceptedFiles => {
                  formik.setFieldValue("image", acceptedFiles[0]);
                }} 
                
                 >
                {({getRootProps, getInputProps}) => (
                    <div className = "container">
                      <div
                      {...getRootProps({
                        className: "dropzone",
                        onDrop: event => event.stopPropagation(),
                      })}
                      >
                      <input {...getInputProps()} />
                      <p className = "text-gray-300 text-lg cursor-pointer hover:text-gray-500">
                        Click here to select image
                      </p>
                      </div> 
                    </div>
                  )
                }
                </Dropzone>
                </Container>

            <div>
              {loading ? 
                <button
                disabled
                className="inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-500"
              >
                <UploadIcon
                  className="-ml-1 mr-2 h-5  text-gray-400"
                  aria-hidden="true"
                />
                <span>Uploading...</span>
              </button> :
              <button
                type="submit"
                className="inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <UploadIcon
                  className="-ml-1 mr-2 h-5  text-gray-400"
                  aria-hidden="true"
                />
                <span>Upload Photo</span>
              </button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}