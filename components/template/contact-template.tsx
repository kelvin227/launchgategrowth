import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  trackingId: string;
}

export function EmailTemplate({ firstName, trackingId }: EmailTemplateProps) {
  return (
    <div>
      <h1>We received your contact request</h1>
      <p>Hi {firstName},</p>
      <p>
        Thank you for reaching out. Your contact request has been received, and
        an admin will respond to you as soon as possible.
      </p>
      <p>Your tracking Id is: {trackingId}, you can use your tracking id to track your request</p>
      <p>We appreciate your patience.</p>
    </div>
  );
}