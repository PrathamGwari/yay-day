import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import InviteForm from "../Components/InviteForm/InviteForm";
import ShareCalendar from "../Components/ShareCalendar/ShareCalendar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <InviteForm />,
      },
      {
        path: "/shareCalendar",
        element: <ShareCalendar />,
      },
    ],
  },
]);
