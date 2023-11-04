import { NavLink } from "react-router-dom";
import { links } from "../utils/Links";
import { useDashboardContext } from "../pages/DashboardLayout";

const NavLinks = ({ isBigSidebar }) => {
  const { user, toggleSideBar } = useDashboardContext();
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, icon, path } = link;
        const { role } = user;
        if (path === "admin" && role !== "admin") return;

        return (
          <NavLink
            to={path}
            key={text}
            className="nav-link"
            onClick={isBigSidebar ? null : toggleSideBar}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
