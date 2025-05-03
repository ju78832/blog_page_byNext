import * as React from "react";

interface EmailTemplateProps {
  code: string;
  email: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  code,
  email,
}) => {
  return (
    <div>
      <h1>Welcome, {email}!</h1>
      <p>Thank you for signing up. Please verify your email address.</p>
      <p>
        Your verification code is: <strong>{code}</strong>
      </p>
    </div>
  );
};
