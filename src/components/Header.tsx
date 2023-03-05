import { AiOutlineSearch } from "react-icons/ai";
import { NavLink } from "react-router-dom";

export default function Header({ handleSubmit, handleChange, search }: 
{handleSubmit: any, handleChange: any, search: string}) {
  let activeStyle = {
    borderBottom: '2px solid white'
  };

  return (
    <div className='Header'>
        <h1 className='header-title flex-box'>Weather App</h1>
        <nav className='navbar flex-box'>
          <ul className='nav-links'>
            <li>
              <NavLink
                to="/"
                style={({ isActive }) => isActive ? activeStyle : undefined}
              >
                Home
              </NavLink>
            </li>
            <li>
            <NavLink
                to="/about"
                style={({ isActive }) => isActive ? activeStyle : undefined}
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
        <form className='flex-box' onSubmit={e => handleSubmit(e)}>
          <input placeholder='Search' value={search} onChange={handleChange} />
          <button type="submit" title="Search">
            <AiOutlineSearch />
          </button>
        </form>
      </div>
  );
}