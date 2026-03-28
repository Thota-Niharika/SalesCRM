import React from 'react';
import useAuthStore from '../../store/useAuthStore';

// Higher order component / Wrapper to check permissions
export default function CanDo({ permission, allowedRoles, children, fallback = null, disableOnly = false }) {
  const { role, hasPermission } = useAuthStore();

  let isAllowed = false;

  if (allowedRoles && allowedRoles.includes(role)) {
    isAllowed = true;
  }

  if (permission && hasPermission(permission)) {
    isAllowed = true;
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  if (disableOnly) {
    // If we only want to disable the children, clone it and set disabled=true
    // Note: Children must be a valid React element that accepts `disabled` prop
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { disabled: true, className: `${children.props.className} opacity-50 cursor-not-allowed` });
    }
    return <div className="opacity-50 cursor-not-allowed pointer-events-none">{children}</div>;
  }

  return fallback;
}
