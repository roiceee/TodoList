import { useRouter } from "next/router";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import UserTypeContext from "../../src/contexts/user-context";
import ProjectInterface from "../../src/interfaces/project-interface";
import ProjectArrayInterface from "../../src/interfaces/project-array-interface";
import formatDate from "../../src/utils/dateFormatter";
import LoadingNotice from "../../src/components/util-components/loading-notice";
import {
  retrieveFromStorage,
  saveToStorage,
} from "../../src/utils/local-storage-util";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ProjectControl from "../../src/components/tasks-page-components/project-control";
import ErrorNotice from "../../src/components/util-components/error-notice";
import HeadWrapper from "../../src/components/head-wrapper";
import AddTaskModal from "../../src/components/tasks-page-components/add-task-modal";
import Button from "react-bootstrap/Button";
import createProjectObject from "../../src/defaults/default-project";
import createProjectArrayObject from "../../src/defaults/default-project-array-";
import TaskCard from "../../src/components/tasks-page-components/task-card";
import TaskInterface from "../../src/interfaces/task-interface";
import styles from "../../src/styles/modules/tasks-page.module.scss";
import EditProjectModal from "../../src/components/tasks-page-components/edit-project-modal";
import BodyLayoutOne from "../../src/components/body-layout-one";
import StickyHeader from "../../src/components/util-components/sticky-header";
import DescriptionPopover from "../../src/components/tasks-page-components/description-popover";

function TasksPage() {
  const router = useRouter();
  const { userTypeState, setUserStateType } = useContext(UserTypeContext);
  const [projectArrayState, setProjectArrayState] =
    useState<ProjectArrayInterface>(createProjectArrayObject());
  const [currentProjectState, setCurrentProjectState] =
    useState<ProjectInterface>(createProjectObject());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addTaskModalState, setAddTaskModalState] = useState<boolean>(false);

  const [editProjectModalState, setEditProjectModalState] =
    useState<boolean>(false);

  const renderedTasks = useMemo((): JSX.Element | Array<JSX.Element> => {
    const taskCards = currentProjectState?.tasks.map((task) => {
      return <TaskCard key={task.title} task={task} />;
    });
    return taskCards;
  }, [currentProjectState]);

  const showAddTaskModal = useCallback(() => {
    setAddTaskModalState(true);
  }, []);

  const hideAddTaskModal = useCallback(() => {
    setAddTaskModalState(false);
  }, []);

  const showEditProjectModal = useCallback(() => {
    setEditProjectModalState(true);
  }, []);

  const hideEditProjectModal = useCallback(() => {
    setEditProjectModalState(false);
  }, []);

  const updateCurrentProjectOnProjectArrayState = useCallback(
    (updatedProject: ProjectInterface) => {
      setProjectArrayState((prevProjectArrayState) => {
        const prevProjectArrayStateCopy = { ...prevProjectArrayState };
        const updatedProjects = prevProjectArrayStateCopy.projects.map(
          (project) => {
            if (project.id === updatedProject.id) {
              updatedProject.lastModified = new Date();
              return updatedProject;
            }
            return project;
          }
        );
        const newProjectArrayState = {
          projects: updatedProjects,
        };
        saveToStorage(userTypeState, newProjectArrayState);
        return newProjectArrayState;
      });
      hideEditProjectModal();
    },
    [userTypeState, hideEditProjectModal, setProjectArrayState]
  );

  const addTaskToProject = useCallback(
    (newTask: TaskInterface) => {
      setCurrentProjectState((prevProjectState) => {
        const newProjectState = {
          ...prevProjectState,
          tasks: [...prevProjectState.tasks, newTask],
        };
        updateCurrentProjectOnProjectArrayState(newProjectState);
        return newProjectState;
      });
      hideAddTaskModal();
    },
    [updateCurrentProjectOnProjectArrayState, hideAddTaskModal]
  );

  useEffect(() => {
    const projects = retrieveFromStorage(userTypeState);
    setProjectArrayState(projects);
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!projectArrayState) {
      return;
    }
    const matchedProject = projectArrayState.projects.find((project) => {
      return project.id === router.query.id;
    });
    setCurrentProjectState(matchedProject!);
    setIsLoading(false);
  }, [router.query.id, projectArrayState]);

  if (isLoading) {
    return <LoadingNotice />;
  }

  if (!currentProjectState) {
    if (!isLoading) {
      return;
    }
    return <ErrorNotice />;
  }

  console.log(currentProjectState)
  return (
    <>
      <Container>
        <HeadWrapper title={`Projects | ${router.query.id}`} />
        <BodyLayoutOne
          leftElements={
            <Row className="sticky-wrapper position-sticky sticky-top bg-light py-2">
              <Row>
                <h2 style={{ overflowWrap: "break-word" }}>
                  {currentProjectState.title}
                </h2>
                <div className={styles.descriptionDiv}>
                  {currentProjectState.description === "" && (
                    <span>No description</span>
                  )}
                  {currentProjectState.description !== "" && (
                    <DescriptionPopover
                      description={currentProjectState.description}
                    />
                  )}
                </div>
                <p>
                  Date created: {formatDate(currentProjectState.dateCreated)}
                </p>
                <ProjectControl editProjectHandler={showEditProjectModal} />
              </Row>
              <hr className="mx-auto my-1 mb-2" />
              <div>
                <Button variant="action" onClick={showAddTaskModal}>
                  Add Task
                </Button>
              </div>
            </Row>
          }
          rightElements={
            <Row className="px-2 gap-2 justify-content-center pt-2">
              <StickyHeader title="Tasks" />
              {currentProjectState.tasks.length === 0 && (
                <p className="text-center">Create a task to get started!</p>
              )}
              {renderedTasks}
            </Row>
          }
        />
      </Container>
      <AddTaskModal
        showState={addTaskModalState}
        onHide={hideAddTaskModal}
        onAddTaskButtonClick={addTaskToProject}
        currentProjectState={currentProjectState}
      />
      <EditProjectModal
        showState={editProjectModalState}
        onHide={hideEditProjectModal}
        projectArrayState={projectArrayState}
        projectObject={currentProjectState}
        onEditProjectButtonClick={updateCurrentProjectOnProjectArrayState}
      />
    </>
  );
}

export default TasksPage;
