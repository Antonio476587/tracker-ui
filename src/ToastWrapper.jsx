import React from "react";

import Toast from "./Toast.jsx";

export default function withToast(OriginalComponent) {
  return class ToastWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showingToast: false, toastMessage: "", toastType: "success",
      };
      this.dismissToast = this.dismissToast.bind(this);
      this.showSuccess = this.showSuccess.bind(this);
      this.showError = this.showError.bind(this);
    }

    dismissToast() {
      this.setState({ showingToast: false });
    }

    showSuccess(message) {
      this.setState({ showingToast: true, toastMessage: message, toastType: "success" });
    }

    showError(message) {
      this.setState({ showingToast: true, toastMessage: message, toastType: "danger" });
    }

    render() {
      const { showingToast, toastMessage, toastType } = this.state;
      return (
        <React.Fragment>
          <OriginalComponent
            showError={this.showError}
            showSuccess={this.showSuccess}
            dismissToast={this.dismissToast}
            {...this.props}
          />
          <Toast bsStyle={toastType} showing={showingToast} onDismiss={this.dismissToast}>
            {toastMessage}
          </Toast>
        </React.Fragment>
      );
    }
  };
}
