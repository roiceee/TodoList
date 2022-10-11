import { ChangeEvent, useCallback, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import TaskInterface from "../../interfaces/task-interface";
import {
  getPriorityColor,
  getStatusColor,
  getDeadlineColor,
} from "../../styles/style-scripts/task-styles-util";
import formatDate from "../../utils/dateFormatter";
import {
  processDeadline,
  processDescription,
  processPriority,
  processTaskStatus,
} from "../../utils/task-utils";
import DescriptionPopover from "./description-popover";
import EditTaskDiv from "./edit-task-div";

interface TaskViewModalProps {
  task: TaskInterface;
  show: boolean;
  onHide: () => void;
  editTaskHandler: (updatedTask: TaskInterface) => void;
  deleteTaskHandler: (taskToBeDeleted: TaskInterface) => void;
  taskIsDoneToggler: (isDone: boolean, task: TaskInterface) => void;
}

function TaskViewModal({
  task,
  show,
  onHide,
  editTaskHandler,
  deleteTaskHandler,
  taskIsDoneToggler,
}: TaskViewModalProps) {
  const [isOnEditState, setIsOnEditState] = useState<boolean>(false);
  const [isOnDeleteState, setIsOnDeleteState] = useState<boolean>(false);

  const setToEditMode = useCallback(() => {
    setIsOnEditState(true);
  }, []);

  const setToViewMode = useCallback(() => {
    setIsOnEditState(false);
  }, []);

  const setToDeleteMode = useCallback(() => {
    setIsOnDeleteState(true);
  }, []);

  const cancelDeleteMode = useCallback(() => {
    setIsOnDeleteState(false);
  }, []);

  const deleteTaskButtonHandler = useCallback(() => {
    deleteTaskHandler(task);
  }, [deleteTaskHandler, task]);

  const markIsDoneHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;

      taskIsDoneToggler(isChecked, task);
    },
    [taskIsDoneToggler, task]
  );

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      aria-labelledby="task-view-modal"
    >
      <Modal.Header className={`${getPriorityColor(task)} text-light`}>
        <Modal.Title id="task-view-modal" style={{ fontSize: "1.2rem" }}>
          {!isOnEditState && "Task Details"}
          {isOnEditState && "Edit Task"}
        </Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={onHide}
        ></button>
      </Modal.Header>
      {!isOnEditState && (
        <>
          <Modal.Body>
            <div>
              <div></div>
              <div style={{ fontSize: "1.1rem", overflowWrap: "break-word" }}>
                <b>Title:</b> {task.title}
              </div>
              <hr className="my-2" />
              <div className="mb-1">
                <DescriptionPopover title="Task Description" task={task} />
              </div>
              <div style={{ fontSize: "0.9rem" }}>
                <div className="mb-1">
                  <b>Status:</b>{" "}
                  <span className={getStatusColor(task)}>
                    {processTaskStatus(task)}
                  </span>
                </div>
                <div className="mb-1">
                  <b>Priority:</b> {processPriority(task)}
                </div>
                <div className="mb-1">
                  <b>Date Created: </b> {formatDate(task.dateCreated)}
                </div>
                <div className="mb-1">
                  <b>Deadline:</b>{" "}
                  <span className={getDeadlineColor(task)}>
                    {processDeadline(task)}
                  </span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!isOnDeleteState && (
              <>
                <div style={{ marginRight: "auto" }} className="d-flex gap-2">
                  <Form.Check
                    type="checkbox"
                    label="Mark as Done"
                    onChange={markIsDoneHandler}
                    checked={task.isDone}
                  />
                </div>
                <Button variant="gray" onClick={setToDeleteMode}>
                  Delete
                </Button>
                <Button variant="warning" onClick={setToEditMode}>
                  Edit
                </Button>
              </>
            )}
            {isOnDeleteState && (
              <>
                <h6 className="mx-3">Delete this task?</h6>
                <Button variant="gray" onClick={cancelDeleteMode}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={deleteTaskButtonHandler}>
                  Delete
                </Button>
              </>
            )}
          </Modal.Footer>
        </>
      )}
      {isOnEditState && (
        <EditTaskDiv
          task={task}
          onEditTaskButtonClick={editTaskHandler}
          onCancelEditButtonClick={setToViewMode}
        />
      )}
    </Modal>
  );
}

export default TaskViewModal;
