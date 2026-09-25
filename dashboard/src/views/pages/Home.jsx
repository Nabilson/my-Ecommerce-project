import React, {useState} from 'react'; 
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

const Home = () => {
   
   const {role} = useSelector(state => state.auth)
   if (role === 'seller') return <Navigate to='/seller/dashboard' replace />
    else if(role === 'admin') return <Navigate to='admin/dashboard' replace />

   

    return (
        <div className='px-2 lg:px-7 pt-5'>            

            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                
                  

            </div>          
        </div>


    );
};

export default Home;
