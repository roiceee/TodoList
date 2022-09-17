import Modal from "react-bootstrap/Modal";
import TaskInterface from "../../interfaces/task-interface";
import _ from "lodash";
import {
  processDeadline,
  processDescription,
  processPriority,
  processTaskStatus,
} from "../../utils/task-utils";
import utilStyles from "../../styles/modules/util-styles.module.scss";
import { useCallback } from "react";
import Button from "react-bootstrap/Button";
import DescriptionPopover from "./description-accordion";

interface TaskViewModalProps {
  task: TaskInterface;
  show: boolean;
  onHide: () => void;
}

function TaskViewModal({ task, show, onHide }: TaskViewModalProps) {
  const getTaskUnderlineColor = useCallback(() => {
    switch (task.priority) {
      case "high":
        return utilStyles.underlineDanger;
      case "medium":
        return utilStyles.underlineWarning;
      case "low":
        return utilStyles.underlineInfo;
      default:
        return utilStyles.underline;
    }
  }, [task.priority]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      aria-labelledby="task-view-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="task-view-modal" style={{ fontSize: "1rem" }}>
          Task Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div></div>
          <div style={{ fontSize: "1.3rem", overflowWrap: "break-word" }}>
            <b>Title:</b> {task.title}
          </div>
          <hr className="my-2"></hr>
          <DescriptionPopover
            title="Task Description"
            description={processDescription(task.description)}
          />
          <div className={`${getTaskUnderlineColor()}`}>
            <b>Priority:</b> {processPriority(task.priority)}
          </div>
          <div>
            <b>Status:</b> {processTaskStatus(task.isDone)}
          </div>
          <div>
            <b>Deadline:</b> {processDeadline(task.deadline)}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning">Edit</Button>
        <Button variant="danger">Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskViewModal;
