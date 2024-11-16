import React from 'react';
import './ListingDetailsModal.css';

export default function ListingDetailsModal({ show, onClose, listingId }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Listing {listingId} Details</h2>
        <p>Details for listing {listingId} will go here.</p>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
