import React, { useState } from "react";
import "./SecurityTab.css";

export default function SecurityTab({ accountName }) {
  const [shareFriendsList, setShareFriendsList] = useState(false);
  const [shareLocationInfo, setShareLocationInfo] = useState(false);
  const [enableTwoFactorAuth, setEnableTwoFactorAuth] = useState(false);
  const [receiveSecurityAlerts, setReceiveSecurityAlerts] = useState(false);

  const handleToggleChange = (setter) => (e) => {
    setter(e.target.checked);
  };

  return (
    <div className="security-tab">
      <h2>Security Settings</h2>
      <div className="form-group">
        <label htmlFor="shareFriendsList">Share Friends List</label>
        <input
          type="checkbox"
          id="shareFriendsList"
          checked={shareFriendsList}
          onChange={handleToggleChange(setShareFriendsList)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="shareLocationInfo">Share Location Info</label>
        <input
          type="checkbox"
          id="shareLocationInfo"
          checked={shareLocationInfo}
          onChange={handleToggleChange(setShareLocationInfo)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="enableTwoFactorAuth">Enable Two-Factor Authentication</label>
        <input
          type="checkbox"
          id="enableTwoFactorAuth"
          checked={enableTwoFactorAuth}
          onChange={handleToggleChange(setEnableTwoFactorAuth)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="receiveSecurityAlerts">Receive Security Alerts</label>
        <input
          type="checkbox"
          id="receiveSecurityAlerts"
          checked={receiveSecurityAlerts}
          onChange={handleToggleChange(setReceiveSecurityAlerts)}
        />
      </div>
    </div>
  );
}