import { PlusCircleIcon, BookOpenIcon, TrashIcon } from "@heroicons/react/solid";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategoryAction, updateCategoriesAction, deleteCategoriesAction} from "../../redux/slices/category/categorySlice";
import {useFormik} from "formik";
import * as Yup from "yup";
import { useEffect } from "react";

//Form Schema
const formSchema = Yup.object({
  title: Yup.string().required("Title is required"),
})

const UpdateCategory = ({match : {params :{id}}}) => {
  const dispatch = useDispatch();

  //fect single category -put fetch actions in useEffect 
  useEffect(() => {
    dispatch(fetchCategoryAction(id));
  }, [dispatch])

  //get data from store
  const store = useSelector(state => state?.category);
  const {category, loading, serverErr, appErr} = store
  //console.log(category);

  //formil
  const formik = useFormik({
    enableReinitialize : true,// this step is important for formik to render the title otherwise formik will render the form before the title is rendered from the store
    initialValues: {
      title: category?.title
    },
    onSubmit : values => {
      //build up the data for update-in order to update the data we need both the values i.e. title in this case and id of the category so we need to combine the data in this scenario
      //dispatch the action
      dispatch(updateCategoriesAction({title: values.title, id}));
    },
    validationSchema : formSchema,
  });

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <BookOpenIcon className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update Category
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-indigo-600 hover:text-indigo-500">
              These are the categories user will select when creating a post
            </p>
            {/* Display Error*/ }
            {serverErr || appErr ? <h2 className = "text-red-500">{serverErr}-{appErr}</h2>: null}
          </p>
        </div>
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit = {formik.handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Name
              </label>
              {/* Title */}
              <input
              value = {formik.values.title}
                    onChange = {formik.handleChange('title')}
                    onBlur = {formik.handleBlur("title")}
                type="text"
                autoComplete="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center focus:z-10 sm:text-sm"
                placeholder="New Category"
              />
              <div className="text-red-400 mb-2">
                {/* err msg */}
                {formik.touched.title && formik.errors.title}
              </div>
            </div>
          </div>

          <div>
            <div>
              {/* Update */}
              {loading ? (
                <button
                disabled
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <PlusCircleIcon
                    className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Loading...
              </button>
              ) : (
                <>
                <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <PlusCircleIcon
                    className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Update Category
              </button>

              <button
              onClick = {() => dispatch(deleteCategoriesAction(id))}
                type="submit"
                className="group mt-2 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <TrashIcon
                    className="h-5 w-5 text-red-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Delete Category
              </button>
                </>
                
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
