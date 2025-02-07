import { Link, useLocation } from 'react-router-dom';
import "./styles/Sidebar.css";
import { Divider, Tooltip } from 'antd';
import Logo from "../assets/logo.png";

import { DashboardOutlined, AppstoreOutlined, TruckOutlined } from "@ant-design/icons";
import { User } from 'lucide-react';

const items = [
  { title: "Overview", icon: <DashboardOutlined />, path: "/dashboard" },
  { title: "Packages", icon: <AppstoreOutlined />, path: "/packages" },
  { title: "Drivers", icon: <User />, path: "/drivers" },
  { title: "Vehicles", icon: <TruckOutlined />, path: "/vehicles" },
  { title: "Shipements", icon: <TruckOutlined />, path: "/shipements" },
  { title: "Orders", icon: <TruckOutlined />, path: "/orders" },
];

export const Sidebar = () => {
  const location = useLocation(); // Get current route

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={Logo} width="100" alt="Logo" />
      </div>
      <Divider variant='dashed' type="horizontal" style={{ background: "#999999",margin:0 }} />
      <div className="sidebar-items">
        {items.map((item, index) => (
          <SidebarItem 
            key={index} 
            title={item.title} 
            Icon={item.icon} 
            path={item.path} 
            isActive={location.pathname === item.path} 
          />
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({ title, Icon, path, isActive }) => {
  return (
    <Tooltip title={title} placement="bottom">
      <Link to={path} className={`sidebar-item ${isActive ? 'active' : ''}`}>
        <span className="sidebar-icon">{Icon}</span>
        <p className='sidebar-title'>{title}</p>
      </Link>
    </Tooltip>
  );
};
