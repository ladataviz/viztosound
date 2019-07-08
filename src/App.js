import React from "react";
import { Button } from "react-bootstrap";
import LoadingIndicatorComponent from "./LoadingIndicatorComponent";
import SheetListComponent from "./SheetListComponent";
import DateListComponent from "./DateListComponent";
import MeasureListComponent from "./MeasureListComponent";
import p0 from "./Piano-C1.ogg";
import p1 from "./Piano-C2.ogg";
import p2 from "./Piano-C3.ogg";
import p3 from "./Piano-C4.ogg";
import p4 from "./Piano-C5.ogg";
import p5 from "./Piano-C6.ogg";
import p6 from "./Piano-C7.ogg";

require("./App.css");
/* global tableau */
var piano0 = "p0";
var piano1 = "p1";
var piano2 = "p2";
var piano3 = "p3";
var piano4 = "p4";
var piano5 = "p5";
var piano6 = "p6";

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedSheet: undefined,
      selectedDateIndex: undefined,
      selectedMeasureIndex: undefined,
      musicTable: [],
      dateNames: [],
      sheetNames: [],
      measureNames: [],
      rows: [],
      headers: [],
      dataKey: 1,
      filteredFields: [],
      dashboardName: ""
    };

    this.unregisterEventFn = undefined;
  }

  componentWillMount() {
    this.loadSound();

    tableau.extensions.initializeAsync().then(() => {
      const selectedSheet = tableau.extensions.settings.get("sheet");
      const sheetNames = tableau.extensions.dashboardContent.dashboard.worksheets.map(
        worksheet => worksheet.name
      );
      const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
      const sheetSelected = !!selectedSheet;

      this.setState({
        isLoading: sheetSelected,
        selectedSheet: selectedSheet,
        sheetNames: sheetNames,
        dashboardName: dashboardName
      });

      if (sheetSelected) {
        this.loadDates();
      }
    });
  }

  getSelectedSheet(selectedSheet) {
    const sheetName = selectedSheet || this.state.selectedSheet;
    return tableau.extensions.dashboardContent.dashboard.worksheets.find(
      worksheet => worksheet.name === sheetName
    );
  }

  onSelectSheet(sheetName) {
    tableau.extensions.settings.set("sheet", sheetName);
    this.setState({ isLoading: true });
    tableau.extensions.settings.saveAsync().then(() => {
      this.setState(
        { selectedSheet: sheetName, filteredFields: [] },
        this.loadDates.bind(this)
      );
    });
  }

  onSelectDate(dateName) {
    console.log(dateName.index);
    this.setState({ isLoading: true });
    tableau.extensions.settings.saveAsync().then(() => {
      this.setState(
        { selectedDateIndex: dateName.index },
        this.loadMeasures.bind(this)
      );
    });
  }

  onSelectMeasure(measureName) {
    tableau.extensions.settings.saveAsync().then(() => {
      this.setState({ selectedMeasureIndex: measureName.index });
    });
  }

  loadDates() {
    if (this.unregisterEventFn) {
      this.unregisterEventFn();
    }

    const worksheet = this.getSelectedSheet();
    worksheet.getSummaryDataAsync().then(sumdata => {
      // Get the first DataTable for our selected marks (usually there is just one)
      const worksheetData = sumdata;

      const dates = worksheetData.columns.filter(
        columns =>
          columns.dataType === "date" || columns.dataType === "date-time"
      );

      this.setState({
        dateNames: dates,
        isLoading: false
      });

      this.forceUpdate();
    });
  }

  loadMeasures() {
    if (this.unregisterEventFn) {
      this.unregisterEventFn();
    }

    const worksheet = this.getSelectedSheet();
    worksheet.getSummaryDataAsync().then(sumdata => {
      // Get the first DataTable for our selected marks (usually there is just one)
      const worksheetData = sumdata;

      console.log(worksheetData);
      const measures = worksheetData.columns.filter(
        columns => columns.dataType === "float" || columns.dataType === "int"
      );

      this.setState({
        measureNames: measures,
        isLoading: false
      });

      this.forceUpdate();
    });
  }

  play() {
    if (this.unregisterEventFn) {
      this.unregisterEventFn();
    }

    const worksheet = this.getSelectedSheet();
    worksheet.getSummaryDataAsync().then(sumdata => {
      // Get the first DataTable for our selected marks (usually there is just one)
      const worksheetData = sumdata;

      const dateIndex = this.state.selectedDateIndex;
      const measureIndex = this.state.selectedMeasureIndex;
      console.log(worksheetData);

      const musicTable = worksheetData.data
        .map(
          x =>
            x[measureIndex].value != "%missing%" && [
              x[dateIndex].value,
              x[measureIndex].value
            ]
        )
        .filter(x => x)
        .sort()
        .map(x => x[1]);
      console.log(musicTable);
      this.playSound(musicTable);
    });

    this.forceUpdate();
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  loadSound() {
    window.createjs.Sound.registerSound(p0, piano0);
    window.createjs.Sound.registerSound(p1, piano1);
    window.createjs.Sound.registerSound(p2, piano2);
    window.createjs.Sound.registerSound(p3, piano3);
    window.createjs.Sound.registerSound(p4, piano4);
    window.createjs.Sound.registerSound(p5, piano5);
    window.createjs.Sound.registerSound(p6, piano6);
  }

  playSound(musicTable) {
    let min = Math.min(...musicTable);
    let max = Math.max(...musicTable);
    let diff = max - min;
    let step = diff / 7;

    for (let i = 0; i < musicTable.length; i++) {
      this.sleep(300);
      let value = musicTable[i];
      if (value < min + step) window.createjs.Sound.play(piano0);
      else if (value < min + 2 * step) window.createjs.Sound.play(piano1);
      else if (value < min + 3 * step) window.createjs.Sound.play(piano2);
      else if (value < min + 4 * step) window.createjs.Sound.play(piano2);
      else if (value < min + 5 * step) window.createjs.Sound.play(piano3);
      else if (value < min + 6 * step) window.createjs.Sound.play(piano5);
      else if (value < min + 6 * step) window.createjs.Sound.play(piano5);
      else window.createjs.Sound.play(piano6);
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicatorComponent msg="Loading" />;
    }

    if (!this.state.selectedSheet) {
      return (
        <div>
          <h3>
            Choose a Sheet from{" "}
            <span className="sheet_name">{this.state.dashboardName}</span>
          </h3>

          <SheetListComponent
            sheetNames={this.state.sheetNames}
            onSelectSheet={this.onSelectSheet.bind(this)}
          />
        </div>
      );
    }

    if (!(this.state.selectedDateIndex + 1)) {
      return (
        <div>
          <h3>
            Choose a Date from{" "}
            <span className="sheet_name">{this.state.selectedSheet}</span>
          </h3>

          <DateListComponent
            dateNames={this.state.dateNames}
            onSelectDate={this.onSelectDate.bind(this)}
          />
        </div>
      );
    }

    if (!(this.state.selectedMeasureIndex + 1)) {
      return (
        <div>
          <h3>
            Choose a Measure from{" "}
            <span className="sheet_name">{this.state.selectedSheet}</span>
          </h3>

          <MeasureListComponent
            measureNames={this.state.measureNames}
            onSelectMeasure={this.onSelectMeasure.bind(this)}
          />
        </div>
      );
    }

    return (
      <div>
        <Button onClick={() => this.play()}>Play</Button>
      </div>
    );
  }
}

export default AppComponent;
