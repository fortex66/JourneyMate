import React from "react";

const Companion_Item = ({
  id,
  title,
  location,
  tag,
  start_date,
  finish_date,
  content,
  personnel,
}) => {
  return (
    <div className="Companion_Item">
      <div className="info_Wrapper">
        <div className="title">{title}</div>
        <div className="location">{location}</div>
        <div className="tag">{tag}</div>
        <div className="start_date">{start_date}</div>
        <div className="finish_date">{finish_date}</div>
        <div className="content">{content}</div>
        <div className="personnel">{personnel}</div>
      </div>
    </div>
  );
};
export default Companion_Item;
