import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import yellowVector from "../../assets/yellowVector.png";
import blueVector from "../../assets/blueVector.png";
import smGiftBox from "../../assets/smGiftBox.png";
import bigGiftBox from "../../assets/bigGiftBox.png";
import mdGiftBox from "../../assets/bigGiftBox.png";
import { differenceInMinutes, format, parseISO } from "date-fns";

const InviteForm = () => {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    location: "",
    description: "",
    image: null,
    date: null,
    time: null,
    duration: 0,
  });
  const [showImage, setShowImage] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const generateInviteText = async () => {
    // Split the date and time strings into their components
    const [year, month, day] = eventDetails.date.split("-").map(Number);
    const [hours, minutes] = eventDetails.time.split(":").map(Number);
    const durationHours = parseFloat(eventDetails.duration) + hours;
    const durationMinutes = minutes;
    // Create a Date object using UTC to ensure the correct format
    const startDateTimeUTC = new Date(
      Date.UTC(year, month - 1, day, hours, minutes)
    );
    const startDateTimeIST = new Date(year, month - 1, day, hours, minutes);
    const endDateTimeUTC = new Date(
      Date.UTC(year, month - 1, day, durationHours, durationMinutes)
    );
    console.log(startDateTimeIST);
    console.log(startDateTimeUTC);
    // Convert the Date object to the ISO 8601 format
    const startDateTimeISO = startDateTimeUTC.toISOString();
    const endDateTimeISO = endDateTimeUTC.toISOString();
    const startDateTime = startDateTimeISO.replace("Z", "");
    const endDateTime = endDateTimeISO.replace("Z", "");

    // .....................Get partyTime........................
    // Parse the ISO date strings into Date objects
    const startDate = parseISO(startDateTime);
    const endDate = parseISO(endDateTime);
    // Calculate the difference in minutes
    const diffInMinutes = differenceInMinutes(endDate, startDate);
    // Format the times into the desired format
    const formattedStart = format(startDate, "hh:mm aa");
    const formattedEnd = format(endDate, "hh:mm aa");
    const partyTime = `${formattedStart} - ${formattedEnd}`;

    // ..................Navigate with data......................
    const invite = {
      ...eventDetails,
      startDateTime,
      endDateTime,
      showImage,
      partyTime,
    };
    navigate("/shareCalendar", { state: invite });
  };

  // ............Readable and display image.......................
  useEffect(() => {
    if (eventDetails.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowImage(reader.result);
      };
      reader.readAsDataURL(eventDetails.image);
    }
  }, [eventDetails]);

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-10 md:mb-20 ms-10 md:ms-10 mt-20 ">
        <h1 className="text-[19.2px] md:text-[54px] font-bold text-[#0021C8]">
          Yay! Day
        </h1>
        <p className="text-[8px] md:text-[22px] md:font-light">
          🌼Send better invites for playdates & birthdays for calendar loving
          parents 🌼
        </p>
      </div>

      {/* Form */}
      <form
        className="w-9/12 md:w-6/12 lg:max-w-[863px] lg:w-full mx-auto"
        onSubmit={(event) => {
          event.preventDefault();
          generateInviteText();
        }}
      >
        {/* content input */}
        <div className="w-full lg:w-full grid grid-cols-1 lg:grid-cols-2 gap-[54px] mx-auto relative z-50">
          {/* left side */}
          <div className="flex flex-col gap-5 text-[16px] md:text-[24px]">
            {/* title */}
            <div className="relative rounded-[15px]">
              <input
                className="relative lg:max-w-[350px] w-full h-[60px] rounded-[15px] px-12  bg-[#613DC11F] focus:bg-transparent placeholder:text-[#613DC1] outline-dashed outline-1 outline-[#cab9b7] ring-inset focus:ring-4 focus:ring-[#613DC13D]"
                type="text"
                name="title"
                onChange={handleInputChange}
                required
                placeholder="Event Title"
              />
              <p className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="#613DC1" strokeLinecap="round">
                    <circle
                      cx={6}
                      cy={18}
                      r={3}
                      strokeLinejoin="round"
                    ></circle>
                    <path strokeLinejoin="round" d="M9 18V5"></path>
                    <path d="M21 3L9 5m12 2L9 9"></path>
                    <circle
                      cx={18}
                      cy={16}
                      r={3}
                      strokeLinejoin="round"
                    ></circle>
                    <path strokeLinejoin="round" d="M21 16V3"></path>
                  </g>
                </svg>
              </p>
            </div>
            {/* Date */}
            <div className="relative rounded-[15px]">
              <input
                className="relative lg:max-w-[350px] w-full h-[60px] rounded-[15px] px-12  bg-[#613DC11F] focus:bg-transparent placeholder:text-[#613DC1] outline-dashed outline-1 outline-[#cab9b7] ring-inset focus:ring-4 focus:ring-[#613DC13D]"
                type="date"
                name="date"
                onChange={handleInputChange}
                required
                placeholder="Date of the Party"
              />
              <p className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.4349 4.95498H16.4999V3.54498C16.4999 3.41237 16.4473 3.2852 16.3535 3.19143C16.2597 3.09766 16.1325 3.04498 15.9999 3.04498C15.8673 3.04498 15.7402 3.09766 15.6464 3.19143C15.5526 3.2852 15.4999 3.41237 15.4999 3.54498V4.95498H8.49994V3.54498C8.49994 3.41237 8.44726 3.2852 8.3535 3.19143C8.25973 3.09766 8.13255 3.04498 7.99994 3.04498C7.86733 3.04498 7.74016 3.09766 7.64639 3.19143C7.55262 3.2852 7.49994 3.41237 7.49994 3.54498V4.95498H5.56494C4.9019 4.95498 4.26602 5.21837 3.79717 5.68722C3.32833 6.15606 3.06494 6.79194 3.06494 7.45498V18.455C3.06494 19.118 3.32833 19.7539 3.79717 20.2227C4.26602 20.6916 4.9019 20.955 5.56494 20.955H18.4349C18.7632 20.955 19.0883 20.8903 19.3916 20.7647C19.695 20.639 19.9706 20.4549 20.2027 20.2227C20.4349 19.9906 20.619 19.715 20.7446 19.4117C20.8703 19.1084 20.9349 18.7833 20.9349 18.455V7.45498C20.9349 7.12668 20.8703 6.80159 20.7446 6.49827C20.619 6.19496 20.4349 5.91936 20.2027 5.68722C19.9706 5.45507 19.695 5.27092 19.3916 5.14528C19.0883 5.01965 18.7632 4.95498 18.4349 4.95498ZM19.9349 18.455C19.9349 18.8528 19.7769 19.2343 19.4956 19.5156C19.2143 19.7969 18.8328 19.955 18.4349 19.955H5.56494C5.16712 19.955 4.78559 19.7969 4.50428 19.5156C4.22298 19.2343 4.06494 18.8528 4.06494 18.455V10.035H19.9349V18.455ZM19.9349 9.03498H4.06494V7.45498C4.06494 7.05716 4.22298 6.67563 4.50428 6.39432C4.78559 6.11302 5.16712 5.95498 5.56494 5.95498H7.49994V6.54498C7.49994 6.67759 7.55262 6.80477 7.64639 6.89854C7.74016 6.9923 7.86733 7.04498 7.99994 7.04498C8.13255 7.04498 8.25973 6.9923 8.3535 6.89854C8.44726 6.80477 8.49994 6.67759 8.49994 6.54498V5.95498H15.4999V6.54498C15.4999 6.67759 15.5526 6.80477 15.6464 6.89854C15.7402 6.9923 15.8673 7.04498 15.9999 7.04498C16.1325 7.04498 16.2597 6.9923 16.3535 6.89854C16.4473 6.80477 16.4999 6.67759 16.4999 6.54498V5.95498H18.4399C18.8378 5.95498 19.2193 6.11302 19.5006 6.39432C19.7819 6.67563 19.9399 7.05716 19.9399 7.45498L19.9349 9.03498Z"
                    fill="#613DC1"
                  />
                  <path
                    d="M11.492 17.173V13.714C11.492 13.7007 11.4884 13.6876 11.4817 13.6761C11.475 13.6646 11.4653 13.6552 11.4537 13.6486C11.4421 13.6421 11.429 13.6388 11.4157 13.6391C11.4024 13.6393 11.3894 13.6431 11.378 13.65L10.74 14.042C10.7172 14.0561 10.6911 14.0638 10.6644 14.0644C10.6376 14.065 10.6112 14.0585 10.5878 14.0454C10.5644 14.0323 10.545 14.0133 10.5315 13.9902C10.518 13.9671 10.5109 13.9407 10.511 13.914V13.264C10.5109 13.212 10.5243 13.1609 10.5499 13.1157C10.5755 13.0705 10.6124 13.0327 10.657 13.006L11.421 12.549C11.4675 12.521 11.5207 12.5061 11.575 12.506H12.2C12.2394 12.506 12.2784 12.5137 12.3148 12.5288C12.3512 12.5439 12.3843 12.566 12.4121 12.5939C12.44 12.6217 12.4621 12.6548 12.4772 12.6912C12.4922 12.7276 12.5 12.7666 12.5 12.806V17.173C12.5 17.2124 12.4922 17.2514 12.4772 17.2878C12.4621 17.3242 12.44 17.3573 12.4121 17.3851C12.3843 17.413 12.3512 17.4351 12.3148 17.4501C12.2784 17.4652 12.2394 17.473 12.2 17.473H11.791C11.7116 17.4727 11.6355 17.441 11.5795 17.3848C11.5235 17.3285 11.492 17.2524 11.492 17.173Z"
                    fill="black"
                  />
                </svg>
              </p>
            </div>
            {/* Time */}
            <div className="relative rounded-[15px]">
              <input
                className="relative lg:max-w-[350px] w-full h-[60px] rounded-[15px] px-12  bg-[#613DC11F] focus:bg-transparent placeholder:text-[#613DC1] outline-dashed outline-1 outline-[#cab9b7] ring-inset focus:ring-4 focus:ring-[#613DC13D]"
                type="time"
                name="time"
                onChange={handleInputChange}
                required
                placeholder="Time of the Party"
              />
              <p className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9999 21.933C10.0353 21.933 8.11489 21.3505 6.48142 20.259C4.84795 19.1676 3.57481 17.6162 2.823 15.8012C2.0712 13.9862 1.87449 11.989 2.25776 10.0622C2.64103 8.13538 3.58705 6.36548 4.97621 4.97633C6.36536 3.58717 8.13525 2.64115 10.0621 2.25788C11.9889 1.87461 13.9861 2.07132 15.8011 2.82313C17.6161 3.57493 19.1674 4.84807 20.2589 6.48154C21.3503 8.11502 21.9329 10.0355 21.9329 12C21.93 14.6335 20.8825 17.1583 19.0204 19.0205C17.1582 20.8827 14.6334 21.9301 11.9999 21.933ZM11.9999 3.06702C10.2331 3.06702 8.50601 3.59093 7.03699 4.5725C5.56797 5.55407 4.423 6.94922 3.74688 8.58151C3.07077 10.2138 2.89386 12.0099 3.23854 13.7428C3.58323 15.4756 4.43401 17.0673 5.68331 18.3166C6.93262 19.5659 8.52432 20.4167 10.2572 20.7614C11.99 21.1061 13.7861 20.9292 15.4184 20.253C17.0507 19.5769 18.4458 18.432 19.4274 16.9629C20.409 15.4939 20.9329 13.7668 20.9329 12C20.9303 9.63165 19.9882 7.36105 18.3136 5.68636C16.6389 4.01167 14.3683 3.06967 11.9999 3.06702Z"
                    fill="#613DC1"
                  />
                  <path
                    d="M18.0001 12.5H12.0001C11.9366 12.5033 11.8731 12.4925 11.8143 12.4683C11.7555 12.4441 11.7029 12.4071 11.6601 12.36C11.6501 12.36 11.6501 12.35 11.6401 12.34C11.593 12.2972 11.556 12.2446 11.5318 12.1858C11.5076 12.127 11.4968 12.0635 11.5001 12V6C11.5001 5.86739 11.5528 5.74021 11.6465 5.64645C11.7403 5.55268 11.8675 5.5 12.0001 5.5C12.1327 5.5 12.2599 5.55268 12.3537 5.64645C12.4474 5.74021 12.5001 5.86739 12.5001 6V11.5H18.0001C18.1327 11.5 18.2599 11.5527 18.3537 11.6464C18.4474 11.7402 18.5001 11.8674 18.5001 12C18.5001 12.1326 18.4474 12.2598 18.3537 12.3536C18.2599 12.4473 18.1327 12.5 18.0001 12.5Z"
                    fill="#613DC1"
                  />
                </svg>
              </p>
            </div>
            {/*Duration*/}
            <div className="relative rounded-[15px]">
              <input
                className="relative lg:max-w-[350px] w-full h-[60px] rounded-[15px] px-12  bg-[#613DC11F] focus:bg-transparent placeholder:text-[#613DC1] outline-dashed outline-1 outline-[#cab9b7] ring-inset focus:ring-4 focus:ring-[#613DC13D]"
                type="number"
                name="duration"
                onChange={handleInputChange}
                required
                placeholder="Duration of the Party"
              />
              <p className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0001 21.942C10.0338 21.942 8.11158 21.3589 6.47663 20.2665C4.84168 19.174 3.56739 17.6213 2.8149 15.8046C2.06241 13.988 1.86553 11.989 2.24914 10.0604C2.63276 8.13184 3.57964 6.36035 4.97005 4.96993C6.36047 3.57952 8.13196 2.63263 10.0605 2.24902C11.9891 1.86541 13.9881 2.06229 15.8047 2.81478C17.6214 3.56726 19.1741 4.84156 20.2666 6.47651C21.359 8.11146 21.9421 10.0336 21.9421 12C21.9392 14.6359 20.8908 17.163 19.027 19.0268C17.1631 20.8907 14.636 21.9391 12.0001 21.942ZM12.0001 3.05799C10.2315 3.05799 8.50271 3.58243 7.0322 4.56499C5.5617 5.54755 4.41558 6.9441 3.73878 8.57803C3.06198 10.212 2.8849 12.0099 3.22993 13.7445C3.57496 15.4791 4.4266 17.0724 5.67716 18.3229C6.92772 19.5735 8.52103 20.4251 10.2556 20.7702C11.9902 21.1152 13.7881 20.9381 15.4221 20.2613C17.056 19.5845 18.4526 18.4384 19.4351 16.9679C20.4177 15.4974 20.9421 13.7685 20.9421 12C20.9395 9.62923 19.9965 7.35634 18.3201 5.67996C16.6438 4.00359 14.3709 3.06063 12.0001 3.05799Z"
                    fill="#613DC1"
                  />
                  <path
                    d="M16.693 13.744C16.3232 14.6877 15.6776 15.4979 14.8403 16.0691C14.003 16.6403 13.0131 16.9458 11.9995 16.9458C10.986 16.9458 9.996 16.6403 9.15873 16.0691C8.32147 15.4979 7.67581 14.6877 7.30602 13.744C7.05702 13.154 6.19502 13.663 6.44302 14.249C6.90224 15.3439 7.67465 16.2787 8.66329 16.9361C9.65193 17.5935 10.8127 17.9442 12 17.9442C13.1873 17.9442 14.3481 17.5935 15.3368 16.9361C16.3254 16.2787 17.0978 15.3439 17.557 14.249C17.804 13.663 16.943 13.149 16.693 13.744Z"
                    fill="#613DC1"
                  />
                  <path
                    d="M9 10.261C9.69036 10.261 10.25 9.70134 10.25 9.01099C10.25 8.32063 9.69036 7.76099 9 7.76099C8.30964 7.76099 7.75 8.32063 7.75 9.01099C7.75 9.70134 8.30964 10.261 9 10.261Z"
                    fill="#613DC1"
                  />
                  <path
                    d="M15 10.261C15.6904 10.261 16.25 9.70134 16.25 9.01099C16.25 8.32063 15.6904 7.76099 15 7.76099C14.3096 7.76099 13.75 8.32063 13.75 9.01099C13.75 9.70134 14.3096 10.261 15 10.261Z"
                    fill="#613DC1"
                  />
                </svg>
              </p>
            </div>
            {/* Location */}
            <div className="relative rounded-[15px]">
              <input
                className="relative lg:max-w-[350px] w-full h-[60px] rounded-[15px] px-12  bg-[#613DC11F] focus:bg-transparent placeholder:text-[#613DC1] outline-dashed outline-1 outline-[#cab9b7] ring-inset focus:ring-4 focus:ring-[#613DC13D]"
                type="text"
                name="location"
                onChange={handleInputChange}
                required
                placeholder="Venue of the Party"
              />
              <p className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.75 22.433C12.4813 22.4343 12.2161 22.3724 11.9757 22.2524C11.7353 22.1324 11.5265 21.9575 11.366 21.742L6.30503 15C5.46765 13.8191 4.97111 12.4307 4.86973 10.9866C4.76834 9.5425 5.06602 8.09833 5.7302 6.81203C6.39437 5.52573 7.39947 4.44684 8.63558 3.69334C9.87168 2.93985 11.2912 2.54078 12.7388 2.53977C14.1865 2.53876 15.6065 2.93585 16.8437 3.68761C18.0808 4.43938 19.0875 5.51686 19.7534 6.80224C20.4194 8.08761 20.7191 9.53136 20.6197 10.9756C20.5204 12.4198 20.0258 13.8089 19.19 14.991L14.135 21.74C13.9746 21.9559 13.7657 22.1311 13.5251 22.2515C13.2845 22.3719 13.019 22.4341 12.75 22.433ZM12.742 3.566C11.0519 3.56069 9.42011 4.18409 8.16403 5.315C6.90443 6.43969 6.10164 7.98775 5.90808 9.66527C5.71452 11.3428 6.14366 13.033 7.11403 14.415L12.165 21.142C12.2328 21.2329 12.3209 21.3067 12.4223 21.3575C12.5237 21.4082 12.6356 21.4344 12.749 21.434C12.8627 21.4342 12.9748 21.4078 13.0765 21.3572C13.1782 21.3065 13.2667 21.2328 13.335 21.142L18.379 14.408C19.0672 13.4341 19.4903 12.298 19.6065 11.1112C19.7228 9.92437 19.5284 8.72772 19.0422 7.6388C18.5561 6.54989 17.7951 5.60616 16.834 4.90033C15.8728 4.19451 14.7445 3.75087 13.56 3.613C13.2885 3.58198 13.0154 3.56629 12.742 3.566Z"
                    fill="#613DC1"
                  />
                  <path
                    d="M12.75 13C12.2555 13 11.7722 12.8534 11.3611 12.5787C10.95 12.304 10.6295 11.9135 10.4403 11.4567C10.2511 10.9999 10.2016 10.4972 10.298 10.0123C10.3945 9.52732 10.6326 9.08187 10.9822 8.73223C11.3319 8.3826 11.7773 8.1445 12.2623 8.04804C12.7472 7.95157 13.2499 8.00108 13.7067 8.1903C14.1635 8.37952 14.554 8.69995 14.8287 9.11108C15.1034 9.5222 15.25 10.0055 15.25 10.5C15.25 11.163 14.9866 11.7989 14.5178 12.2678C14.0489 12.7366 13.413 13 12.75 13ZM12.75 9C12.4533 9 12.1633 9.08797 11.9166 9.2528C11.67 9.41762 11.4777 9.65189 11.3642 9.92598C11.2507 10.2001 11.2209 10.5017 11.2788 10.7926C11.3367 11.0836 11.4796 11.3509 11.6893 11.5607C11.8991 11.7704 12.1664 11.9133 12.4574 11.9712C12.7483 12.0291 13.0499 11.9994 13.324 11.8858C13.5981 11.7723 13.8324 11.58 13.9972 11.3334C14.162 11.0867 14.25 10.7967 14.25 10.5C14.25 10.1022 14.092 9.72065 13.8107 9.43934C13.5294 9.15804 13.1478 9 12.75 9Z"
                    fill="#613DC1"
                  />
                </svg>
              </p>
            </div>
            {/* Description */}
            <div className="relative rounded-[15px]">
              <input
                className="relative lg:max-w-[350px] w-full h-[60px] rounded-[15px] px-12  bg-[#613DC11F] focus:bg-transparent placeholder:text-[#613DC1] outline-dashed outline-1 outline-[#cab9b7] ring-inset focus:ring-4 focus:ring-[#613DC13D]"
                type="text"
                name="description"
                onChange={handleInputChange}
                required
                placeholder="Message to Invites"
              />
              <p className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.1285 8.17818C16.7287 7.79527 16.2042 7.56939 15.6513 7.54202C15.0984 7.51465 14.5541 7.68762 14.1185 8.02918L12.3375 2.63818C12.1888 2.18239 11.9114 1.77935 11.5388 1.4777C11.1662 1.17604 10.7142 0.98867 10.2375 0.938184L1.65647 0.00818352C1.43406 -0.0151439 1.20925 0.0115528 0.998494 0.08632C0.787736 0.161087 0.596361 0.282033 0.438376 0.440305C0.280391 0.598577 0.159794 0.790172 0.0854102 1.00107C0.0110265 1.21196 -0.0152613 1.43682 0.00847057 1.65918L0.938471 10.2382C0.988348 10.7151 1.1755 11.1674 1.47724 11.5401C1.77898 11.9129 2.18235 12.1901 2.63847 12.3382L8.02847 14.1082C7.69851 14.5117 7.51832 15.0169 7.51847 15.5382C7.52032 16.1344 7.75796 16.7056 8.17952 17.1271C8.60108 17.5487 9.1723 17.7863 9.76847 17.7882C10.3652 17.7862 10.937 17.5487 11.3595 17.1272L17.1295 11.3582C17.3384 11.1493 17.5041 10.9014 17.6172 10.6285C17.7302 10.3556 17.7884 10.0631 17.7884 9.76768C17.7884 9.47229 17.7302 9.17979 17.6172 8.90689C17.5041 8.63398 17.3384 8.38603 17.1295 8.17718L17.1285 8.17818ZM2.94847 11.3882C2.67561 11.2979 2.43442 11.1312 2.2536 10.9078C2.07277 10.6845 1.95992 10.4138 1.92847 10.1282L1.02847 1.73818L5.03847 5.74818C4.96689 5.95767 4.95527 6.183 5.00492 6.39874C5.05457 6.61448 5.16352 6.81206 5.31947 6.96918C5.427 7.08134 5.55585 7.1709 5.69846 7.23259C5.84106 7.29429 5.99455 7.32689 6.14992 7.32848C6.30529 7.33007 6.45942 7.30061 6.60325 7.24184C6.74709 7.18307 6.87774 7.09617 6.98754 6.98623C7.09735 6.8763 7.18409 6.74554 7.24269 6.60163C7.30128 6.45773 7.33055 6.30357 7.32877 6.1482C7.327 5.99283 7.29421 5.83938 7.23234 5.69685C7.17047 5.55432 7.08076 5.42558 6.96847 5.31818C6.8141 5.16192 6.61798 5.05344 6.40356 5.00573C6.18915 4.95803 5.96553 4.97311 5.75947 5.04918L1.73947 1.02918L10.1295 1.92918C10.4159 1.95789 10.6878 2.06974 10.9115 2.25098C11.1351 2.43221 11.301 2.67491 11.3885 2.94918L13.3195 8.80918L8.80947 13.3192L2.94847 11.3882ZM14.6575 8.87818C14.8329 8.70427 15.056 8.58624 15.2984 8.539C15.5409 8.49176 15.792 8.51742 16.0199 8.61276C16.2478 8.70809 16.4423 8.86881 16.5789 9.07464C16.7155 9.28046 16.7881 9.52215 16.7875 9.76918C16.7873 9.93299 16.7546 10.0951 16.6912 10.2462C16.6279 10.3973 16.5352 10.5342 16.4185 10.6492L10.6475 16.4192C10.4096 16.6476 10.0927 16.7751 9.76297 16.7751C9.43324 16.7751 9.1163 16.6476 8.87847 16.4192C8.64714 16.1847 8.51744 15.8686 8.51744 15.5392C8.51744 15.2098 8.64714 14.8937 8.87847 14.6592L14.6575 8.87818Z"
                    fill="#613DC1"
                  />
                </svg>
              </p>
            </div>
          </div>
          {/* right side */}
          <div className="relative w-full h-full  bg-[#613DC11F] rounded-[15px] flex items-center justify-center outline-dashed outline-1 outline-[#cab9b7]">
            <input
              className="absolute left-0 top-0 w-full h-full opacity-0 bg-transparent"
              type="file"
              id=""
              name="image"
              onChange={handleInputChange}
              required
            />
            <div className="w-full lg:w-fit py-2.5 lg:p-2.5 flex justify-center items-center gap-[15px] bg-white lg:rounded-[20px] border-none lg:border lg:border-[#CABEE9]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 23.5V13M16 13L20.5 17.5M16 13L11.5 17.5"
                  stroke="#613DC1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 8.5H10"
                  stroke="#613DC1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  opacity="0.5"
                  d="M1 16C1 8.929 1 5.3935 3.196 3.196C5.395 1 8.929 1 16 1C23.071 1 26.6065 1 28.8025 3.196C31 5.395 31 8.929 31 16C31 23.071 31 26.6065 28.8025 28.8025C26.608 31 23.071 31 16 31C8.929 31 5.3935 31 3.196 28.8025C1 26.608 1 23.071 1 16Z"
                  stroke="#613DC1"
                  strokeWidth="1.5"
                />
              </svg>
              <p className="text-[16px] lg:text-[24px] font-medium text-[#613DC1]">
                {eventDetails.image ? "Upload successfully" : "Upload Image"}
              </p>
            </div>
          </div>
        </div>
        {/* submit button */}
        <button
          className="relative z-50 w-11/12 lg:w-[408px] h-[44.17px] lg:h-[91px] bg-[#91A3FFB2] rounded-[7.77px] lg:rounded-[16px] text-[13.6px] lg:text-[28px] font-bold my-10 me-3 lg:float-right"
          type="submit"
        >
          <span className="w-full h-full flex items-center bg-[#0021C8] rounded-[6.31px] lg:rounded-[13px] mt-3 ms-3 text-white px-5">
            Generate Invite
          </span>
        </button>
      </form>

      {/* Background vectors */}
      <img
        src={yellowVector}
        className="absolute z-10 top-[16%] 2xl:w-full"
        alt=""
      />
      <img
        src={blueVector}
        className="absolute z-10 top-[55%] 2xl:w-full"
        alt=""
      />
      <img
        src={smGiftBox}
        className="absolute z-10 top-[85%] left-0 w-[105.42px] h-[105.42px] lg:w-[152.45px] lg:h-[152.45px]"
        alt=""
      />
      <img
        src={bigGiftBox}
        className="absolute z-10 top-[70%] right-[6%] w-[79.16px] h-[79.16px] lg:w-[236.07px] lg:h-[236.07px]"
        alt=""
      />
      <img
        src={mdGiftBox}
        className="absolute z-10 top-[86%] right-[40%] w-[105.42px] h-[105.42px] lg:w-[204.58px] lg:h-[204.58px]"
        alt=""
      />
    </div>
  );
};

export default InviteForm;
