import React, {useEffect} from "react";
import Select from "react-select";
import {useSelector, useDispatch} from "react-redux";
import {fetchCategoriesAction} from "../../redux/slices/category/categorySlice";




const CategoryDropDown = (props) => {
  console.log(props);
  //dispatch action
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  //select categories
  const category = useSelector(state => state?.category);
  const {categoryList, loading, appErr, serverErr} = category;

  const allCategories = categoryList?.map(category => {
    return {
      label: category?.title,
      value: category?._id,
    };
  });
  //Now we need a method we will use to make sure that the option that is selected is returned to the form in some manner

  //handleChange 
  const handleChange = (value) => {
    props.onChange('category', value);
  };

  //handleBlur
  const handleBlur = () => {
    props.onBlur('category', true);
  };
  return (
      <div style = {{margin: '1rem 0'}}>
        {loading ? (
          <h3 className = "text-base text-green-600">Product Category List are loading please wait...</h3>
         ) : (
         <Select 
          onChange = {handleChange} 
          onBlur = {handleBlur} 
          id = "category"  
          options = {allCategories}
          value = {props?.value?.label}
         />
         )
        }
        {/*Display Err */} 
        {props?.error && <div style = {{color: 'red', marginTop: '0.5rem'}}>{props?.error}</div>} 
      </div>
  )
};

export default CategoryDropDown;