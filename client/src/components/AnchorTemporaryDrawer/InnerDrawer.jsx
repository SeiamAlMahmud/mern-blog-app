import React from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { GiNewspaper } from "react-icons/gi";
import { FaPenFancy } from "react-icons/fa";
import './InnerDrawer.css';
import { useNavigate } from "react-router-dom";
import { useBlogContext } from '../../context/ContextContainer';

const InnerDrawer = ({ closeDrawer }) => {
  const { api, setToken, token } = useBlogContext();
  const navigate = useNavigate();

  const categoryList = [
    { name: "Bangladesh" },
    { name: "Politics" },
    { name: "International" },
    { name: "Sports" },
    { name: "Entertainment" },
    { name: "Health" },
    { name: "Religion" },
    { name: "Health Tips" },
    { name: "Medical News" },
  ];

  const logout = async () => {
    try {
      const response = await api.get("/api/logout");
      if (response.data.success) {
        setToken(false);
        closeDrawer();  // Close the drawer after logging out
        navigate("/login");
      } else {
        setToken(true);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    closeDrawer();  // Close the drawer after navigation
  };

  return (
    <div className="inner-drawer-container">
      {/* First section for account */}
      {token ? (
        <div className="account-section">
          <Button
            variant="outlined"
            className="account-button"
            onClick={() => handleNavigate("/newPost")}
          >
            Create Post
          </Button>
          <Button
            variant="outlined"
            className="account-button"
            onClick={() => handleNavigate("/myAccount")}
          >
            My Account
          </Button>
        </div>
      ) : (
        <div className="account-section">
          <Button
            variant="outlined"
            className="account-button"
            onClick={() => handleNavigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            className="account-button"
            onClick={() => handleNavigate("/register")}
          >
            Register
          </Button>
        </div>
      )}
      <Divider />

      {/* Second section for categories with scrolling */}
      <div className="category-section">
        <List>
          {categoryList.map((text, index) => (
            <ListItem key={index} disablePadding onClick={() => handleNavigate(`/category/${text?.name}`)}>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? (
                    <i style={{ fontSize: "27px" }}>
                      <GiNewspaper />
                    </i>
                  ) : (
                    <i style={{ fontSize: "27px" }}>
                      <FaPenFancy />
                    </i>
                  )}
                </ListItemIcon>
                <ListItemText primary={text.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
      <Divider />

      {/* Third section for logout */}
      {token && (
        <div className="logout-section">
          <Button
            variant="contained"
            color="error"
            className="logout-button"
            onClick={logout}
          >
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default InnerDrawer;
