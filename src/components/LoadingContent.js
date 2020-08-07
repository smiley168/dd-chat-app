import React from 'react';

const LoadingContent = () => {
  return (
    <div className="ui segment">
      <div className="ui active inverted dimmer">
        <div className="ui large text loader">Loading data... Please wait...</div>
      </div>
    </div>
  );
};

export default LoadingContent;
