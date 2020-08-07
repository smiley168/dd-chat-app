import React from 'react';
import './StatusBox.css';

const StatusBox = ({signedInUser, onlineMinutes}) => {
  return (
    <div className="signedInInfo">
      <div>{signedInUser.name}</div>
      <p>Online for {onlineMinutes} minutes</p>
    </div>
  );
};

export default StatusBox;
