import {lazy} from "react";
const Home = lazy(()=> import ("../../views/pages/Home"));
const Login = lazy(()=> import ("../../views/auth/Login"));
const Register = lazy(()=> import ("../../views/auth/Register"));
const AdminLogin = lazy(()=> import ("../../views/auth/AdminLogin"));
const Unauthorized = lazy(()=> import ("../../views/Unauthorized"));
const Pending = lazy(()=> import ("../../views/Pending"));
const Deactive = lazy(()=> import ("../../views/Deactive"));

//import Register from "../../views/auth/Register";

const publicRoutes = [
	{
		path: '/',
		element : <Home/>,
	},
	{
		path : '/login',	
		element : <Login />,
	},
	{
		path : '/register',	
		element : <Register />,	
	},
	{
		path : '/admin/login',	
		element : <AdminLogin />,	
	},
	{
         path : '/unauthorized',
         element : <Unauthorized/>
    },
	// {
    //      path: '/seller/account-pending',
    //      element : <Pending/>,
    //      ability : 'seller' 
    //  },
    //  {
    //      path: '/seller/account-deactive',
    //      element : <Deactive/>,
    //      ability : 'seller' 
    //  }
]

export default publicRoutes