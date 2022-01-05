import React from "react";
import { withRouter } from "react-router-dom";
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import UserContext from "./UserContext.jsx";

// eslint-disable-next-line react/prefer-stateless-function
class IssueRowPlain extends React.Component {
  render() {
    const {
      issue, location: { search }, closeIssue, deleteIssue, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/issues/${issue.id}`, search };

    const editToolTip = (
      <Tooltip id="edit-tooltip" placement="top">Edit Issue</Tooltip>
    );
    const closeToolTip = (
      <Tooltip id="close-tooltip" placement="top">Close Issue</Tooltip>
    );
    const deleteToolTip = (
      <Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>
    );

    function onClose(e) {
      e.preventDefault();
      closeIssue(index);
    }

    function onDelete(e) {
      e.preventDefault();
      deleteIssue(index);
    }

    const tableRow = (
      <tr>
        <td>{issue.id}</td>
        <td>{issue.status}</td>
        <td>{issue.owner}</td>
        <td>{issue.effort}</td>
        <td>{issue.created ? issue.created.toDateString() : ""}</td>
        <td>{issue.due ? issue.due.toDateString() : ""}</td>
        <td>{issue.title}</td>
        <td>
          <LinkContainer to={`/edit/${issue.id}`}>
            <OverlayTrigger delayShow={1000} overlay={editToolTip}>
              <Button bsSize="xsmall">
                <Glyphicon glyph="edit" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
          {"   "}
          <OverlayTrigger delayShow={1000} overlay={closeToolTip}>
            <Button bsSize="xsmall" type="button" onClick={onClose} disabled={disabled}>
              <Glyphicon glyph="remove" />
            </Button>
          </OverlayTrigger>
          {" | "}
          <OverlayTrigger delayShow={1000} overlay={deleteToolTip}>
            <Button bsSize="xsmall" type="button" onClick={onDelete} disabled={disabled}>
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>
    );

    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

IssueRowPlain.contextType = UserContext;
const IssueRow = withRouter(IssueRowPlain);
delete IssueRow.contextType;

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
  const issueRows = issues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      closeIssue={closeIssue}
      deleteIssue={deleteIssue}
      index={index}
    />
  ));
  return (

    <Table className="bordered-table" bordered condensed hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Effort</th>
          <th>Created</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </Table>
  );
}
