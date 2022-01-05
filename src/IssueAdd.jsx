import React from "react";
import {
  Form, FormControl, FormGroup, ControlLabel, Button,
} from "react-bootstrap";
import PropTypes from "prop-types";

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.addIssue;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const { createIssue } = this.props;
    createIssue(issue);
    form.owner.value = ""; form.title.value = "";
  }

  render() {
    return (
      <Form inline name="addIssue" onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel for="owner">Owner:</ControlLabel>
          {"  "}
          <FormControl type="text" name="owner" id="owner" aria-required="true" placeholder="owner" />
        </FormGroup>
        {"  "}
        <FormGroup>
          <ControlLabel for="title">Title:</ControlLabel>
          {"  "}
          <FormControl type="text" name="title" id="title" aria-required="true" placeholder="Title" />
        </FormGroup>
        {"  "}
        <Button type="submit" aria-roledescription="button">Submit</Button>
      </Form>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};
