/**
 * Contains an animation for loading the website.
 */

import logo from "@/assets/img/Schaffer_logo.svg";
function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src={logo} alt="XPlore Schaffer Logo" className="w-32 h-32 animate-spin" />
    </div>
  );
}

export default Loading;
