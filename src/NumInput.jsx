
import React from "react";

function format(num) {
  return num != null ? num.toString() : "";
}

function unformat(str) {
  const val = parseInt(str, 10);
  return Number.isNaN(val) ? null : val;
}


export default class NumberInput extends React.Component {
  constructor(props) {
    super();
    this.state = { value: format(props.value) };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur(e) {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(e, unformat(value));
  }

  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({ value: e.target.value });
    }
  }

  render() {
    const { value } = this.state;

    return (
      <input type="text" {...this.props} onChange={this.onChange} onBlur={this.onBlur} value={value} />
    );
  }
}
