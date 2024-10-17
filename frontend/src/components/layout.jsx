import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Import your existing Navbar component

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* This will render the content for the current route */}
      </main>
    </>
  );
}

export default Layout;
