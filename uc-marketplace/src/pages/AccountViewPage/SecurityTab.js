import React, { useState, useEffect } from "react";
import "./SecurityTab.css";

export default function SecurityTab({ accountName }) {
  const [shareFriendsList, setShareFriendsList] = useState(false);
  const [shareLocationInfo, setShareLocationInfo] = useState(false);
  const [enableTwoFactorAuth, setEnableTwoFactorAuth] = useState(false);
  const [receiveSecurityAlerts, setReceiveSecurityAlerts] = useState(false);

  useEffect(() => {
    const savedShareFriendsList = JSON.parse(localStorage.getItem(`${accountName}_shareFriendsList`));
    const savedShareLocationInfo = JSON.parse(localStorage.getItem(`${accountName}_shareLocationInfo`));
    const savedEnableTwoFactorAuth = JSON.parse(localStorage.getItem(`${accountName}_enableTwoFactorAuth`));
    const savedReceiveSecurityAlerts = JSON.parse(localStorage.getItem(`${accountName}_receiveSecurityAlerts`));

    if (savedShareFriendsList !== null) setShareFriendsList(savedShareFriendsList);
    if (savedShareLocationInfo !== null) setShareLocationInfo(savedShareLocationInfo);
    if (savedEnableTwoFactorAuth !== null) setEnableTwoFactorAuth(savedEnableTwoFactorAuth);
    if (savedReceiveSecurityAlerts !== null) setReceiveSecurityAlerts(savedReceiveSecurityAlerts);
  }, [accountName]);

  const handleToggleChange = (setter, key) => (e) => {
    const value = e.target.checked;
    setter(value);
    localStorage.setItem(`${accountName}_${key}`, JSON.stringify(value));
  };

  return (
    <div className="security-tab">
      <h2>Security Settings</h2>
      <div className="form-group">
        <label htmlFor="shareFriendsList">Share Friends List</label>
        <label className="switch">
          <input
            type="checkbox"
            id="shareFriendsList"
            checked={shareFriendsList}
            onChange={handleToggleChange(setShareFriendsList, "shareFriendsList")}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="shareLocationInfo">Share Location Info</label>
        <label className="switch">
          <input
            type="checkbox"
            id="shareLocationInfo"
            checked={shareLocationInfo}
            onChange={handleToggleChange(setShareLocationInfo, "shareLocationInfo")}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="enableTwoFactorAuth">Enable Two-Factor Authentication</label>
        <label className="switch">
          <input
            type="checkbox"
            id="enableTwoFactorAuth"
            checked={enableTwoFactorAuth}
            onChange={handleToggleChange(setEnableTwoFactorAuth, "enableTwoFactorAuth")}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="receiveSecurityAlerts">Receive Security Alerts</label>
        <label className="switch">
          <input
            type="checkbox"
            id="receiveSecurityAlerts"
            checked={receiveSecurityAlerts}
            onChange={handleToggleChange(setReceiveSecurityAlerts, "receiveSecurityAlerts")}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
}