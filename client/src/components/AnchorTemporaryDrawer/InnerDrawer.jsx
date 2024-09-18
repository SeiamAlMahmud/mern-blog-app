import React from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { GiNewspaper } from "react-icons/gi";
import { FaPenFancy } from "react-icons/fa";
import './InnerDrawer.css';
import { useNavigate } from "react-router-dom"
import { useBlogContext } from '../../context/ContextContainer';

const InnerDrawer = () => {
    const {api,setToken, token} = useBlogContext()
        const navigate = useNavigate()
    const categoryList = [
        {
            name: "Bangladesh"
        },
        {
            name: "Politics"
        },
        {
            name: "International"
        },
        {
            name: "sports"
        },
        {
            name: "Entertainment"
        },
        {
            name: "Health"
        },
        {
            name: "Religion"
        },
        {
            name: "Health Tips"
        },
        {
            name: "Medical News"
        },
    ]

    const logout = async () => {

        try {
            const response = await api.get("/api/logout")
            // console.log(response.data)
            if (response.data.success) {
                console.log(response.data?.message)
                setToken(false)
            } else {
                setToken(true)
            }

        } catch (error) {
            console.log(error.message, "getToken Error")
        }

    }


    return (
        <div className="inner-drawer-container">
            {/* First section for account */}
           {token ? <div className="account-section">
               <Button variant="outlined" className="account-button"
                onClick={()=> navigate("/newPost")}>
                    Create Post
                </Button>
                <Button variant="outlined" className="account-button">
                    My Account
                </Button>
            </div>
            :  <div className="account-section">
            <Button variant="outlined" className="account-button"
             onClick={()=> navigate("/login")}>
                 Login
             </Button>
             <Button  onClick={()=> navigate("/register")} variant="outlined" className="account-button">
                 Register
             </Button>
         </div>
            }
            <Divider />

            {/* Second section for categories with scrolling */}
            <div className="category-section">
                <List>
                    {categoryList.map((text, index) => (
                        <ListItem key={index} disablePadding onClick={()=> navigate(`/category/${text?.name}`)}>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ?
                                        <i style={{ fontSize: "27px" }}
                                        ><GiNewspaper /> </i>
                                        : <i style={{ fontSize: "27px" }}><FaPenFancy /> </i>
                                    }
                                </ListItemIcon>
                                <ListItemText primary={text?.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>
            <Divider />

            {/* Third section for logout */}
           {token && <div className="logout-section">
                <Button 
                variant="contained" 
                color="error" 
                className="logout-button"
                onClick={logout}>
                    Log Out
                </Button>
            </div>}
        </div>
    );
};

export default InnerDrawer;
