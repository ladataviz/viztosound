import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

require("./SheetList.css");

class MeasureListComponent extends React.Component {
  makeMeasureButton(measureName) {
    return (
      <Button
        key={measureName.index}
        bsStyle="default"
        block
        onClick={() => this.props.onSelectMeasure(measureName)}
      >
        {measureName.fieldName}
      </Button>
    );
  }

  render() {
    const measureButtons = this.props.measureNames.map(measureName =>
      this.makeMeasureButton(measureName)
    );
    return <div>{measureButtons}</div>;
  }
}

MeasureListComponent.displayName = "MeasureListComponent";

MeasureListComponent.propTypes = {
  onSelectMeasure: PropTypes.func,
  measureNames: PropTypes.array
};

export default MeasureListComponent;
