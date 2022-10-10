import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

interface BodyLayoutOneProps {
  leftElements: JSX.Element | Array<JSX.Element>;
  rightElements: JSX.Element | Array<JSX.Element>;
}

function BodyLayoutOne({ leftElements, rightElements }: BodyLayoutOneProps) {
  return (
    <Row className="mt-4">
      <Col lg={5}>{leftElements}
      </Col>
      <Col lg={1}></Col>
      <Col lg={6}>{rightElements}</Col>
    </Row>
  );
}

export default BodyLayoutOne;
