import React from "react";
import "./aboutSection.css";
import Profile from "../../../images/Profile.png";
import {  Typography, Avatar } from "@material-ui/core";
import { AiFillInstagram,AiFillLinkedin } from "react-icons/ai";

const About = () => {
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={Profile}
              alt="Founder"
            />
            <Typography>Abhijeet Manale</Typography>
          </div>
          <div className="aboutSectionContainer2">
          <Typography component="h2">My Profile</Typography>
          <a href="https://www.linkedin.com/in/abhijeet-manale-024074241/" target="blank">
              <AiFillLinkedin className="linkedinSvgIcon" />
            </a>
          <a href="https://www.instagram.com/abhi_2et/" target="blank">
              <AiFillInstagram className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;