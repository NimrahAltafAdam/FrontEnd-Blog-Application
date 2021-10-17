import React from 'react';
import { useSelector } from 'react-redux';
import PublicNavbar from './Public/PublicNavbar';
import PrivateNavbar from './Private/PrivateNavbar'
import AdminNavbar from './Admin/AdminNavbar';




const Navbar = () => {
  //get user from store
  const state = useSelector(state => state);
  console.log(state)
  const {userAuth} = state;
  const isAdmin = userAuth?.isAdmin;
  console.log(isAdmin);
  return (
    <>
    {isAdmin ? <AdminNavbar /> : userAuth ? <PrivateNavbar /> : <PublicNavbar />}
      
    </>
  )
}

export default Navbar;
