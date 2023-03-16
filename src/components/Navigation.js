import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

const Navigation = () => {
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

  return (
    <div>
      <Menubar model={items} className={"p-menubar-mobile-display"} />
    </div>
  );
};

export default Navigation;
