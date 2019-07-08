import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

require("./SheetList.css");

class DateListComponent extends React.Component {
  makeDateButton(dateName) {
    return (
      <Button
        key={dateName.index}
        bsStyle="default"
        block
        onClick={() => this.props.onSelectDate(dateName)}
      >
        {dateName.fieldName}
      </Button>
    );
  }

  render() {
    console.log(this.props.dateNames);

    const dateButtons = this.props.dateNames.map(dateName =>
      this.makeDateButton(dateName)
    );
    return <div>{dateButtons}</div>;
  }
}

DateListComponent.displayName = "DateListComponent";

DateListComponent.propTypes = {
  onSelectDate: PropTypes.func,
  dateNames: PropTypes.array
};

export default DateListComponent;
