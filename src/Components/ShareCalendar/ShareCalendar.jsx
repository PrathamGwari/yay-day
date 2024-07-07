import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import yellowVector from "../../assets/yellowVector.png";
import blueVector from "../../assets/blueVector.png";
import smGiftBox from "../../assets/smGiftBox.png";
import bigGiftBox from "../../assets/bigGiftBox.png";
import mdGiftBox from "../../assets/bigGiftBox.png";

const ShareCalendar = () => {
  const [linkCopy, setLinkCopy] = useState(null);
  const locationBrowser = useLocation();
  const data = locationBrowser.state;
  const {
    title,
    location,
    description,
    image,
    date,
    time,
    duration,
    startDateTime,
    endDateTime,
    showImage,
    partyTime,
  } = data;

  let event = {
    kind: "calendar#event",
    summary: title,
    location: location,
    description: `${description}`,
    start: {
      dateTime: startDateTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endDateTime,
      timeZone: "Asia/Kolkata",
    },
    recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
    attendees: [
      { email: "prathamgwari.pg@gmail.com", responseStatus: "needsAction" },
    ],
    reminders: {
      useDefault: true,
    },
    guestsCanSeeOtherGuests: true,
  };

  const gapi = window.gapi;
  const google = window.google;
  const CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_APP_API_KEY;

  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  const accessToken = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  let gapiInited = false,
    gisInited = false,
    tokenClient;

  useEffect(() => {
    //const expiryTime = new Date().getTime() + expiresIn * 1000;
    gapiLoaded();
    gisLoaded();
  }, []);

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;

    if (accessToken && expiresIn) {
      gapi.client.setToken({
        access_token: accessToken,
        expires_in: expiresIn,
      });
      listUpcomingEvents();
    }
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });

    gisInited = true;
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById("content").innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById("content").innerText = "No events found.";
      return;
    }
    // Flatten to string to display
    const output = events.reduce(
      (str, event) =>
        `${str}${event.summary} (${
          event.start.dateTime || event.start.date
        })\n`,
      "Events:\n"
    );
    document.getElementById("content").innerText = output;
  }

  function handleAuthAddEvent() {
    tokenClient.callback = async (resp) => {
      // ............authentication of google calendar..................
      if (resp.error) {
        throw resp;
      }
      await listUpcomingEvents();
      const { access_token, expires_in } = gapi.client.getToken();
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);

      // ............add event in google calendar..................
      var request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
        sendUpdates: "all",
      });
      request.execute(
        (event) => {
          setLinkCopy(event.htmlLink);
          //copy the link
          navigator.clipboard.writeText(event.htmlLink);
          alert("Text copied to clipboard");
        },
        (error) => {
          console.error(error);
        }
      );
    };

    if (!(accessToken && expiresIn)) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }

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
      <div className="w-11/12 md:w-7/12 lg:max-w-[863px] lg:w-full mx-auto p-4">
        {/* content input */}
        <div className="w-full h-full lg:w-full flex flex-col lg:flex-row items-start gap-8 mx-auto relative z-50 p-4 lg:p-2 lg:outline-dashed lg:outline-1 lg:outline-black rounded-[15px] shadow-2xl shadow-[#4AFF6929] lg:shadow-none">
          {/* left side */}
          <img
            className="w-full lg:w-6/12 h-full object-center rounded-[11px] "
            src={showImage}
            alt=""
          />
          {/* right side */}
          <div className="w-full flex flex-col gap-2 text-[16px] md:text-[24px]">
            {/* title */}
            <p className="relative text-[24px] text-[#5600FF] font-medium leading-[66px]">
              {title}
            </p>

            <div className="relative">
              <span className="text-[16px] text-[#613DC1]">Party Venue</span>
              <p className="text-[24px] font-light leading-[24px] text-black">
                {location}
              </p>
            </div>

            <div className="relative">
              <span className="text-[16px] text-[#613DC1]">
                Date of the Party
              </span>
              <p className="text-[24px] font-light leading-[24px] text-black">
                {date}
              </p>
            </div>

            <div className="relative">
              <span className="text-[16px] text-[#613DC1]">
                Time of the Party
              </span>
              <p className="text-[24px] font-light leading-[24px] text-black">
                {partyTime}
              </p>
            </div>

            <div className="relative">
              <span className="text-[16px] text-[#613DC1]">
                Message to the Invites
              </span>
              <p style={{marginBottom: "10px"}} className="text-[24px] font-light leading-[24px] text-black">
                {description}
              </p>
            </div>
          </div>
        </div>
        {/* submit button */}
        <div className="flex gap-3 justify-end">
          <button
            className={`relative z-50  bg-[#91A3FFB2] rounded-[7.77px] lg:rounded-[16px] text-[13.6px] lg:text-[28px] font-bold my-10 me-2 lg:float-right`}
            onClick={() => {
              navigator.clipboard.writeText(linkCopy);
            }}
          >
            <p className="w-full h-full flex items-center gap-3 bg-white rounded-[6.31px] lg:rounded-[13px] mt-2 ms-2 text-white p-[6.8px] lg:p-[14.5px] shadow-lg">
              <svg
                className="w-[29px] h-[29px] lg:w-[61px] lg:h-[61px]"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_163_202)">
                  <path
                    d="M18.8894 36.7516L36.745 18.896C37.0564 18.5846 37.4261 18.3376 37.833 18.169C38.2399 18.0005 38.676 17.9137 39.1164 17.9137C39.5568 17.9137 39.9929 18.0005 40.3998 18.169C40.8067 18.3376 41.1764 18.5846 41.4879 18.896C41.7993 19.2074 42.0463 19.5771 42.2148 19.984C42.3834 20.3909 42.4701 20.827 42.4701 21.2675C42.4701 21.7079 42.3834 22.144 42.2148 22.5509C42.0463 22.9578 41.7993 23.3275 41.4879 23.6389L23.6323 41.4945C23.0033 42.1234 22.1503 42.4768 21.2608 42.4768C20.3714 42.4768 19.5183 42.1234 18.8894 41.4945C18.2604 40.8655 17.9071 40.0125 17.9071 39.123C17.9071 38.2336 18.2604 37.3805 18.8894 36.7516ZM55.4375 4.94635C52.2951 1.81106 48.0374 0.0502625 43.5984 0.0502625C39.1595 0.0502625 34.9017 1.81106 31.7594 4.94635L23.3561 13.3413C22.7271 13.9702 22.3738 14.8232 22.3738 15.7127C22.3738 16.6022 22.7271 17.4552 23.3561 18.0841C23.985 18.7131 24.8381 19.0664 25.7275 19.0664C26.617 19.0664 27.47 18.7131 28.099 18.0841L36.4883 9.6976C37.4211 8.76462 38.5285 8.0245 39.7474 7.5195C40.9662 7.0145 42.2726 6.75452 43.5919 6.75439C44.9112 6.75426 46.2176 7.01399 47.4365 7.51875C48.6555 8.0235 49.763 8.76341 50.696 9.69621C51.629 10.629 52.3691 11.7364 52.8741 12.9553C53.3791 14.1741 53.6391 15.4805 53.6392 16.7998C53.6394 18.1191 53.3796 19.4255 52.8749 20.6445C52.3701 21.8634 51.6302 22.971 50.6974 23.9039L42.2969 32.2877C41.668 32.9166 41.3146 33.7697 41.3146 34.6591C41.3146 35.5486 41.668 36.4016 42.2969 37.0306C42.9259 37.6595 43.7789 38.0129 44.6684 38.0129C45.5578 38.0129 46.4109 37.6595 47.0398 37.0306L55.4319 28.644C58.5688 25.4997 60.3298 21.2391 60.3283 16.7976C60.3267 12.3562 58.5627 8.0968 55.4236 4.95472L55.4375 4.94635ZM32.2866 42.298L23.8973 50.6901C22.9643 51.6229 21.8568 52.3628 20.6378 52.8676C19.4189 53.3723 18.1125 53.632 16.7932 53.6319C15.4739 53.6318 14.1675 53.3718 12.9487 52.8668C11.7298 52.3618 10.6224 51.6217 9.68958 50.6887C7.80571 48.8045 6.7475 46.249 6.74776 43.5845C6.74802 40.9201 7.80673 38.3648 9.69098 36.481L18.0775 28.0916C18.3889 27.7802 18.636 27.4105 18.8045 27.0036C18.9731 26.5967 19.0598 26.1606 19.0598 25.7202C19.0598 25.2798 18.9731 24.8437 18.8045 24.4368C18.636 24.0299 18.3889 23.6602 18.0775 23.3488C17.7661 23.0373 17.3964 22.7903 16.9895 22.6218C16.5826 22.4532 16.1465 22.3665 15.7061 22.3665C15.2657 22.3665 14.8295 22.4532 14.4227 22.6218C14.0158 22.7903 13.6461 23.0373 13.3346 23.3488L4.95367 31.7465C1.81375 34.8867 0.0499093 39.1457 0.0501709 43.5865C0.0504325 48.0273 1.81478 52.2861 4.95507 55.426C8.09536 58.5659 12.3544 60.3298 16.7951 60.3295C21.2359 60.3292 25.4947 58.5649 28.6346 55.4246L37.0212 47.0353C37.6501 46.4063 38.0035 45.5533 38.0035 44.6638C38.0035 43.7744 37.6501 42.9213 37.0212 42.2924C36.3922 41.6635 35.5392 41.3101 34.6497 41.3101C33.7603 41.3101 32.9072 41.6635 32.2783 42.2924L32.2866 42.298Z"
                    fill="#AFBCFE"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_163_202"
                    x="0.0501709"
                    y="0.0502625"
                    width="60.6213"
                    height="60.6225"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="0.171611" dy="0.171611" />
                    <feGaussianBlur stdDeviation="0.0858057" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_163_202"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_163_202"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </p>
          </button>

          <button
            className="relative z-50 w-11/12 lg:w-[408px] h-[44.17px] lg:h-[91px] bg-[#91A3FFB2] rounded-[7.77px] lg:rounded-[16px] text-[13.6px] lg:text-[28px] font-bold my-10 me-3 lg:float-right "
            onClick={handleAuthAddEvent}
          >
            <p className="w-full h-full flex items-center gap-1 md:gap-3 bg-[#0021C8] rounded-[6.31px] lg:rounded-[13px] mt-3 ms-3 text-white px-2 md:px-5">
              <span> Share Calendar Link</span>
              <svg
                className="w-5 lg:w-10 h-5 lg:h-10"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_163_197)">
                  <path
                    d="M0.846946 19.7606C0.846015 23.1214 1.72415 26.4029 3.39392 29.2953L0.687256 39.1778L10.8007 36.526C13.598 38.0489 16.7321 38.8468 19.917 38.847H19.9254C30.4393 38.847 38.9979 30.2915 39.0024 19.7757C39.0045 14.68 37.0218 9.88837 33.4197 6.28341C29.8181 2.67876 25.0282 0.692557 19.9246 0.690231C9.40943 0.690231 0.851442 9.24527 0.847101 19.7606"
                    fill="url(#paint0_linear_163_197)"
                  />
                  <path
                    d="M0.165891 19.7544C0.164806 23.2361 1.07442 26.635 2.80372 29.631L0 39.8678L10.4761 37.1209C13.3626 38.6947 16.6126 39.5245 19.9195 39.5257H19.9281C30.8192 39.5257 39.6853 30.6625 39.6899 19.7702C39.6918 14.4915 37.6378 9.5276 33.907 5.79349C30.1757 2.05984 25.2144 0.00217054 19.9281 0C9.03504 0 0.170233 8.86202 0.165891 19.7544ZM6.40465 29.115L6.01349 28.4941C4.36915 25.8795 3.50124 22.8581 3.50248 19.7557C3.50605 10.7022 10.8741 3.33643 19.9343 3.33643C24.3219 3.33829 28.4453 5.04868 31.5467 8.15194C34.6479 11.2555 36.3544 15.3811 36.3533 19.769C36.3493 28.8225 28.9811 36.1891 19.9281 36.1891H19.9216C16.9738 36.1876 14.0828 35.396 11.5616 33.9L10.9616 33.5442L4.74481 35.1741L6.40465 29.1149V29.115Z"
                    fill="url(#paint1_linear_163_197)"
                  />
                  <path
                    d="M14.9888 11.4958C14.6189 10.6736 14.2296 10.6571 13.8778 10.6426C13.5897 10.6302 13.2604 10.6312 12.9314 10.6312C12.6021 10.6312 12.0671 10.755 11.6148 11.2488C11.1621 11.7431 9.88647 12.9375 9.88647 15.3668C9.88647 17.7963 11.6559 20.144 11.9026 20.4738C12.1496 20.8029 15.3186 25.9478 20.3375 27.927C24.5086 29.5718 25.3575 29.2447 26.2628 29.1622C27.1682 29.08 29.1843 27.9681 29.5956 26.815C30.0072 25.6622 30.0072 24.674 29.8838 24.4674C29.7604 24.2617 29.4311 24.1381 28.9373 23.8913C28.4434 23.6443 26.0158 22.4498 25.5632 22.285C25.1105 22.1203 24.7814 22.0381 24.4521 22.5326C24.1228 23.0262 23.1772 24.1381 22.889 24.4674C22.601 24.7975 22.3128 24.8386 21.8192 24.5916C21.3251 24.3439 19.7348 23.8231 17.8482 22.1411C16.3803 20.8322 15.3893 19.216 15.1012 18.7216C14.8131 18.2279 15.0704 17.9603 15.3179 17.7143C15.5398 17.493 15.8119 17.1377 16.059 16.8495C16.3052 16.5611 16.3874 16.3554 16.5521 16.026C16.7169 15.6964 16.6344 15.4081 16.5111 15.1611C16.3874 14.9141 15.4279 12.4721 14.9888 11.4958Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_163_197"
                    x1="1916.45"
                    y1="3849.45"
                    x2="1916.45"
                    y2="0.690231"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#1FAF38" />
                    <stop offset="1" stopColor="#60D669" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_163_197"
                    x1="1984.5"
                    y1="3986.78"
                    x2="1984.5"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F9F9F9" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                  <clipPath id="clip0_163_197">
                    <rect width="39.6899" height="40" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </p>
          </button>
        </div>

        <pre
          id="content"
          style={{ whiteSpace: "pre-wrap", display: "none" }}
        ></pre>
      </div>

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

export default ShareCalendar;
