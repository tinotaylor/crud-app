import { useState } from "react";
import Redirect from "../hooks/Redirect";

function admin() {
  const [user, setUser] = useState(false);
  return (
    <div>
      {!user && <Redirect to="/" />}
      <h1>THIS IS THE ADMIN PAGE</h1>
    </div>
  );
}

export default admin;
