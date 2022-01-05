import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Alert,
} from "react-bootstrap";

import graphQLFetch from "./graphQLFetch.js";
import NumbInput from "./NumInput.jsx";
import DateInput from "./DateInput.jsx";
import TextInput from "./TextInput.jsx";
import store from "./store.js";
import withToast from "./ToastWrapper.jsx";
import UserContext from "./UserContext.jsx";

class IssueEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = ` query issue($id: Int!) {
      issue(id: $id) {
        id title status owner
        effort created due description
      }
    }`;
    const { params: { id } } = match;
    const data = await graphQLFetch(query, { id }, showError);
    return data;
  }

  constructor() {
    super();
    const issue = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      issue,
      invalidFields: {},
      showingValidation: false,
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  }

  componentDidMount() {
    const { issue } = this.state;
    if (issue == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(e, naturalValue) {
    const { name, value: textValue } = e.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  }

  onValidityChange(e, valid) {
    const { name } = e.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { issue, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const { id, created, ...changes } = issue;
    const query = `
    mutation issueUpdate($id: Int!, $changes: IssueUpdateInputs!){
      issueUpdate(id:$id, changes:$changes){
        id status owner effort created
        due title description
      }
    }`;

    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id, changes }, showError);
    if (data) {
      this.setState({ issue: data.issueUpdate });
      showSuccess("updated issue successfully");
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await IssueEdit.fetchData(match, null, showError);

    this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { issue } = this.state;
    if (issue == null) return null;

    const { issue: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>Please correct invalid fields before submiting.</Alert>
      );
    }

    const { issue: { status, owner } } = this.state;
    const { issue: { effort, created, due } } = this.state;
    const { issue: { title, description } } = this.state;
    const user = this.context;

    return (

      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing issue: ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} htmlFor="created">Created:</Col>
              <Col sm={9}>
                <FormControl.Static
                  name="created"
                  id="created"
                >
                  {created.toDateString()}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} htmlFor="status">Status:</Col>
              <Col sm={9}>
                <FormControl
                  id="status"
                  name="status"
                  componentClass="select"
                  onChange={this.onChange}
                  value={status}
                >
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} htmlFor="owner">Owner:</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="owner"
                  id="owner"
                  value={owner}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} htmlFor="effort">Effort:</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumbInput}
                  name="effort"
                  id="effort"
                  value={effort}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup validationState={invalidFields.due ? "error" : null}>
              <Col componentClass={ControlLabel} sm={3} htmlFor="due">Due:</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="due"
                  id="due"
                  value={due}
                  onChange={this.onChange}
                  key={id}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup validationState={title.length < 3 ? "error" : null}>
              <Col componentClass={ControlLabel} sm={3} htmlFor="title">Title:</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="title"
                  id="title"
                  value={title}
                  onChange={this.onChange}
                  key={id}
                  size={50}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} htmlFor="description">Description:</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="description"
                  id="description"
                  value={description}
                  onChange={this.onChange}
                  key={id}
                  tag="textarea"
                  rows={4}
                  cols={50}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit" disabled={!user.signedIn}>Submit</Button>
                  <LinkContainer to="/issues">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>
                {validationMessage}
              </Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/edit/${id - 1}`}>Prev</Link>
          {"  "}
          <Link to={`/edit/${id + 1}`}>Next</Link>
        </Panel.Footer>
      </Panel>
    );
  }
}

IssueEdit.contextType = UserContext;

const IssueEditWithToast = withToast(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;

export default IssueEditWithToast;
