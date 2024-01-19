import {Link} from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Header = () => {
  const {isLoggedIn} = useAppContext();
  return (
    <div className="bg-blue-800 py-6">
     <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bond tacking-right">
            <Link to="/"> Holiday.Com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn?(<>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/my-hotels">My Hotels</Link>
          <button>Sign out</button>
          </>
          ):(
            <Link to="/sign-in" className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"> SignIn</Link>
          )}
            
        </span>
        
    </div>   
        
    </div>
  )
}

export default Header