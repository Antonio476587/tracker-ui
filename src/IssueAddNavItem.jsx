import React from "react";
import { withRouter } from "react-router-dom";
import {
  Modal, NavItem, OverlayTrigger, Tooltip, Glyphicon,
  Form, FormGroup, FormControl, Button, ButtonToolbar, ControlLabel,
} from "react-bootstrap";

import graphQLFetch from "./graphQLFetch.js";
import withToast from "./ToastWrapper.jsx";


class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showing: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };

    const query = `
    mutation issueAdd($issue: IssueInput!){
        issueAdd(issue: $issue)
        {
            id
        }
    }
    `;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { issue }, showError);
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.issueAdd.id}`);
    }
  }

  render() {
    const { showing } = this.state;
    const { user: { signedIn } } = this.props;
    return (
      <React.Fragment>
        <NavItem onClick={this.showModal} disabled={!signedIn}>
          <OverlayTrigger delayShow={1000} placement="left" overlay={<Tooltip id="create-tooltip">create Issue</Tooltip>}>
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="issueAdd" onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel htmlFor="owner">Owner:</ControlLabel>
                <FormControl type="text" name="owner" id="owner" aria-required="true" placeholder="owner" />
              </FormGroup>
              <FormGroup>
                <ControlLabel htmlFor="title">Title:</ControlLabel>
                <FormControl type="text" name="title" id="title" aria-required="true" placeholder="Title" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button type="submit" bsStyle="primary" onClick={this.handleSubmit}>Submit</Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withToast(withRouter(IssueAddNavItem));
