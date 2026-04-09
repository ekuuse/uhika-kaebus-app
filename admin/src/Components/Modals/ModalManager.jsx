import React, { Suspense, lazy } from "react";

const modals = {
  createevent: lazy(() => import("./CreateEvent")),
  updateevent: lazy(() => import("./UpdateEvent")),
  deleteevent: lazy(() => import("./DeleteEvent")),
  updatecomplaint: lazy(() => import("./UpdateComplaint")),
  createuser: lazy(() => import("./CreateUser")),
  createsundmus: lazy(() => import("./CreateSundmus")),
};

const ModalManager = ({ modal, modalProps = {}, onClose }) => {
  if (!modal) return null;
  const Component = modals[modal];
  if (!Component) {
    console.warn(`ModalManager: unknown modal key "${modal}"`);
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Component {...modalProps} onClose={onClose} />
    </Suspense>
  );
};

export default ModalManager;