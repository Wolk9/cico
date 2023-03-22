import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { signOutUser } from "../components/helpers";

const Navigation = (props) => {
  const { isAuthenticated } = props;
  const [visible, setVisible] = useState(false);

  const items = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      url: "/",
    },
    {
      label: "Admin",
      icon: "pi pi-fw pi-info",
      url: "/admin",
    },
    {
      label: "User",
      icon: "pi pi-fw pi-person",
      url: "/user",
    },
  ];

  const end = (
    <div>
      {!isAuthenticated && (
        <Button size="small" onClick={signOutUser}>
          Sign Out
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <Menubar model={items} end={end} className={"p-menubar-mobile-display"} />
    </div>
  );
};

export default Navigation;
