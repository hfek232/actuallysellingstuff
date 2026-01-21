import React from "react";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({ children, className = "" }) => (
  <div
    className={`mx-auto w-full max-w-4xl px-4 ${className}`}
    style={{ boxSizing: "border-box" }}
  >
    {children}
  </div>
);

export default MaxWidthWrapper;