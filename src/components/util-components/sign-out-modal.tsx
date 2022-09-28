import { useCallback, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface SignOutModalProps {
  show: boolean;
  onHide: () => void;
  signOutHandler: () => void;
}

function SignOutModal({ show, onHide, signOutHandler }: SignOutModalProps) {
  const onSignOutButtonClick = useCallback(() => {
    signOutHandler();
    onHide();
  }, [signOutHandler, onHide]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="sign-out-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="sign-out-modal">Sign Out</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">Are you sure you want to sign out?</div>
        <div style={{fontSize: "0.9rem"}} className="text-danger">
          Note: This would load the projects stored in the local storage instead.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="gray" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="action" onClick={onSignOutButtonClick}>
          Sign Out
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignOutModal;
