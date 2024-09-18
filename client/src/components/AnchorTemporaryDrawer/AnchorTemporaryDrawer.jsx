import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { GiHamburgerMenu } from "react-icons/gi";
import InnerDrawer from './InnerDrawer';
import './InnerDrawer.css';

export default function AnchorTemporaryDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });

  // Function to toggle the drawer
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const closeDrawer = () => {
    setState({ ...state, right: false });
  };

  return (
    <div>
      <React.Fragment>
        {/* Hamburger Icon to open drawer */}
        <i className='navbar_i' onClick={toggleDrawer('right', true)}>
          <GiHamburgerMenu />
        </i>

        {/* Drawer component */}
        <Drawer
          anchor="right"
          open={state.right}
          onClose={toggleDrawer('right', false)}
        >
          {/* Passing closeDrawer to InnerDrawer */}
          <InnerDrawer closeDrawer={closeDrawer} />
        </Drawer>
      </React.Fragment>
    </div>
  );
}
