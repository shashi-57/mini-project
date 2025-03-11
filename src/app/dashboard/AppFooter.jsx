import React from 'react';
import * as dayjs from 'dayjs';
import packageJson from './../../../package.json';

const AppFooter = (props) => {
  return (
    <div className="layout-footer" style={{ display: 'flex', justifyContent: 'space-between', height: '55px' }}>
      <div>
        <span className="footer-text">{process.env.REACT_APP_APP_NAME}</span>
        <img src={require('./../../logo.png')} alt="" height="25px" />
      </div>
    </div>
  );
}

export default React.memo(AppFooter);
