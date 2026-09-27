import React, {Suspense} from 'react'; 
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({route, children}) => {
   
   const{role, userInfo} = useSelector(state=> state.auth)

    if(role){
        if(route.role){
            if(userInfo){
                if(userInfo.role === route.role){
                    if(route.status){
                        if(route.status === userInfo.status){
                        return <Suspense fallback={null} >{children}</Suspense>
                    }else{

                        if(userInfo.status === 'pending'){
                                return <Navigate to='/seller/account-pending' replace />                           
                            }else {
                                return <Navigate to='/seller/account-deactive' replace />
                            }
                        }
                    }else{
                       if(route.visibility){
                            if(route.visibility.some(r=> r === userInfo.status)){
                                 return <Suspense fallback={null} >{children}</Suspense>
                            }else{
                                //return <Navigate to='/seller/account-pending' replace />
                                return <Navigate to='/seller/dashboard/products' replace />
                            }
                       }else{
                            return <Suspense fallback={null} >{children}</Suspense>
                       }
                    }
            }else{
             return <Navigate to='/unauthorized' replace />
        }
    }
        }else{
            if(role.ability=='seller'){
                return <Suspense fallback={null} >{children}</Suspense>
            }
        }



    }else{
        const loginPath = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login'
        return <Navigate to={loginPath} replace/>
    }
};

export default ProtectRoute;
