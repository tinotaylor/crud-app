import { useRouter } from "next/router";
import { useEffect } from "react";

function Redirect({ to, time }) {
  //STORE ROUTER useRouter IN A VARIABLE AND PUSH THE ROUTE AFTER 3 SECONDS
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push(to);
    }, time || 3000 );
  }, [to]);

  return null;
}

export default Redirect;
