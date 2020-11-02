import React, { useEffect, useState } from "react";
import ViewModeler from "view-modeler";
import { userService } from "_services";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { dialogActions } from "_actions";
import InfoActivity from "components/InfoActivity";

let modeler = null;

const SideDish = (props) => {
  const id_network = props.match.params.id;

  const [curretSelectedElement, setCurretSelectedElement] = useState({});
  const [current_element, setCurrentElement] = useState({});
  const [currentNetwork, setCurrentNetwork] = useState({});

  const { openDialogConfig } = props;

  useEffect(() => {
    if (modeler) {
      clearNetwork();
    }
    getActivity(id_network);
  }, [props.tab_id, id_network]);

  useEffect(() => {

    const getStatusXml = (xml) => {
      var petri_reachability = {};

      var transiction_activity = {};
      var activity_transiction = {};

      var id_elements = {};

      for (var element of xml) {
        //console.log(element)
        if (element["type"] === "custom:start") {
          petri_reachability[element["id"]] = {
            value: 1,
            type: element["type"],
          };
        } else if (element["type"] === "custom:connection") {
          addElement(
            activity_transiction,
            element["source"],
            element["target"]
          );
          addElement(
            transiction_activity,
            element["target"],
            element["source"]
          );
        } else if (
          element["type"] === "custom:atividadeBasica" ||
          element["type"] === "custom:atividadeComposta" ||
          element["type"] === "custom:end"
        ) {
          petri_reachability[element["id"]] = {
            value: 0,
            type: element["type"],
          };
        }

        id_elements[element["id"]] = element;
      }

      return [
        transiction_activity,
        activity_transiction,
        petri_reachability,
        id_elements,
      ];
    };

    const selectActivity = (e) => {
      var vetor_result = getStatusXml(modeler.getCustomElements());
      var activity_elements = vetor_result[3];

      var list_sources_names = [];
      var list_sources_objects = [];

      for (var key in activity_elements) {
        if (
          activity_elements[key].hasOwnProperty("target") &&
          activity_elements[key]["target"] === e.element.id
        ) {
          list_sources_names.push(activity_elements[key]["source"]);
        }
      }
      list_sources_names.forEach(function (key) {
        if (activity_elements[key].hasOwnProperty("suggestion_uuid")) {
          list_sources_objects.push(activity_elements[key]);
        }
      });

      setCurrentElement(e.element);

      if (
        e.element.type === "custom:atividadeBasica" ||
        e.element.type === "custom:start" ||
        e.element.type === "custom:end"
      ) {
        openDialogConfig(
          "activity_info",
          current_element.suggestion_uuid,
          id_network
        );
      } else if (e.element.type === "custom:transicao") {
        //this.props.openDialogConfig("transction_config", null, this.state.id_network);
      }
    };

    const getSubNetwork = (id_subnetwork) => {
      clearNetwork();

      userService.sendGETRequest(
        "/users/activity/subnetwork/get/id",
        { id_activity: id_network, id_subnetwork: id_subnetwork },

        function (result) {
          setTimeout(function () {
            modeler.addCustomElements(JSON.parse(result["all_data"]));
          }, 100);
        }
      );
    };

    modeler = new ViewModeler(
      {
        container: "#canvas_viewer",
        keyboard: {
          bindTo: document,
        },
      },
      selectActivity
    );

    var pizzaDiagram =
      '<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn2:process id="Process_1" isExecutable="false"></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>';

    modeler.importXML(pizzaDiagram, function (err) {
      if (err) {
        console.error("something went wrong:", err);
      }

      var eventBus = modeler.get("eventBus");

      var events = [
        "element.hover",
        "element.out",
        "element.click",
        "element.dblclick",
        "element.mousedown",
        "element.mouseup",
      ];
      events.forEach(function (event) {
        eventBus.on(event, function (e) {
          if (event === "element.dblclick") {
            setCurretSelectedElement(e.element);

            if (e.element.type === "custom:atividadeComposta") {
              getSubNetwork(e.element.businessObject.uuid);
            }
          }
        });
      });

      getActivity(id_network);
    });
  }, [current_element.suggestion_uuid, id_network, openDialogConfig]);

  const getActivity = (id) => {
    userService.sendGETRequest("/users/activity/get/id", { id: id }, function (
      response
    ) {
      setCurrentNetwork(response);
      modeler.addCustomElements(JSON.parse(response["all_data"]));
    });
  };

  const getProperties = (prop) => {
    if (
      current_element["type"] === "custom:start" ||
      current_element.businessObject["type"] === "custom:start"
    ) {
      return "custom:start";
    }

    if (current_element.businessObject && current_element.businessObject[prop])
      return current_element.businessObject[prop];
    if (typeof current_element[prop] !== "undefined")
      return current_element[prop];
    return "";
  };

  const updateProperties = (prop, value) => {
    if (current_element.businessObject) {
      modeler.get("modeling").updateProperties(current_element, {
        [prop]: value,
      });
    }
    var temp = current_element;
    temp[prop] = value;
    setCurrentElement(current_element);
  };

  const clearNetwork = () => {
    modeler.clearAll();

    var pizzaDiagram =
      '<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn2:process id="Process_1" isExecutable="false"></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>';

    modeler.importXML(pizzaDiagram, function (err) {
      if (err) {
        console.error("something went wrong:", err);
      }
    });
  };

  const addElement = (object, key, value) => {
    if (object[key]) {
      object[key].push(value);
    } else {
      object[key] = [value];
    }
  };

  return (
    <div className="content with-diagram" id="js-drop-zone">
      <div
        style={{ height: "calc(100vh - 50px)" }}
        className="canvas"
        id="canvas_viewer"
      ></div>
      <InfoActivity
        curretSelectedElement={curretSelectedElement}
        id_course={currentNetwork.id_course}
        getProperties={getProperties}
        setProperties={updateProperties}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({ dialog: state.dialog });

const mapDispatchToProps = (dispatch) => ({
  openDialogConfig(name, uuid, id_network) {
    dispatch(dialogActions.openDialog(name, uuid, id_network));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SideDish));
