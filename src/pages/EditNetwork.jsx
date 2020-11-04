import React, { Component } from "react";

import CustomModeler from "custom-modeler";
import atidPackage from "assets/json/qa.json";

import "assets/css/style.css";
import "assets/css/diagram-js.css";
import "assets/css/vendor/bpmn-font/css/bpmn-embedded.css";

import {
  deadlockManager
} from 'algorithms/findDeadlock.jsx';

import { userService } from "_services";
import { dialogActions } from "_actions";
import { IconButton, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import Stack from "algorithms/stack";
import ConfigNode from "components/ConfigNode";
import ConfigTransiction from "components/ConfigTransiction";
import { connect } from 'react-redux';
import {
  toast,
  Bounce
} from 'react-toastify';

import EditName from "components/network/EditName";

library.add(fab, fas, far);

class EditNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networks: new Stack(),
      title_network: "",
      current_element: {},
      associated_activities: [],
    };
    this.modeler = {};

    this.selectActivity = this.selectActivity.bind(this);
    this.getProperties = this.getProperties.bind(this);
    this.updateProperties = this.updateProperties.bind(this);
  }

  componentDidMount() {
    var id_network = this.props.id;
    const that = this;

    this.setState({ id_network });

    var modeler = new CustomModeler(
      {
        container: "#canvas",
        keyboard: {
          bindTo: document
        },
        moddleExtensions: {
          atid: atidPackage
        }
      },
      this.selectActivity);

    this.modeler = modeler;

    var pizzaDiagram =
      '<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn2:process id="Process_1" isExecutable="false"></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>';
    let getSubNetwork = this.getSubNetwork;


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
        "element.mouseup"
      ];
      events.forEach(function (event) {
        eventBus.on(event, function (e) {
          if (event === "element.dblclick") {
            if (e.element.type === "custom:atividadeComposta") {
              getSubNetwork(e.element.businessObject.uuid);
            }
          }
        });
      });

      that.getActivity(id_network);
    });


  }

  saveNetwork = (id, all_data) => {
    userService.sendPOSTRequest("/users/activity/save",
      {
        id: id,
        data: all_data,
      },
      function (response) {
        toast("Rede salva.", {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'bottom-right',
          type: 'success'
        });
      });
  }

  saveButton = () => {
    console.log(this.modeler.getCustomElements())
    console.log(JSON.stringify(this.modeler.getCustomElements()))

    if (this.state.networks.isEmpty())
      this.saveNetwork(this.state.id_network, JSON.stringify(this.modeler.getCustomElements()));

    else {
      var modelo = this.modeler.getCustomElements();
      var name_id = this.state.subNetworkID;

      var temp = this.state.networks;
      var tempArray = temp.getArray();

      do {
        userService.saveSubActivity(this.state.id_network, name_id, JSON.stringify(modelo));
        var m = temp.pop();
        name_id = m.key;
        modelo = m.value;
      } while (temp.length() > 0);
      temp.setArray(tempArray);

      this.saveNetwork(this.state.id_network, JSON.stringify(modelo));
    }

    //this.validar( this.modeler.getCustomElements() );
  }

  updateProperties = (prop, value) => {
    if (this.state.current_element.businessObject) {
      this.modeler.get("modeling").updateProperties(this.state.current_element, {
        [prop]: value
      });
    }
    var temp = this.state.current_element;
    temp[prop] = value;
    this.setState({ current_element: temp });

  };

  getProperties = prop => {
    const { current_element } = this.state;
    if (current_element.businessObject && current_element.businessObject[prop])
      return current_element.businessObject[prop];
    if (typeof current_element[prop] !== "undefined")
      return current_element[prop];
    return "";
  };

  clearNetwork() {
    this.modeler.clearAll();
    var pizzaDiagram =
      '<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn2:process id="Process_1" isExecutable="false"></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>';
    this.modeler.importXML(pizzaDiagram, function (err) {
      if (err) {
        console.error("something went wrong:", err);
      }
    });
  }

  getStatusXml(xml) {
    var petri_reachability = {};

    var transiction_activity = {};
    var activity_transiction = {};

    var id_elements = {};

    for (const element of xml) {
      //console.log(element)
      if (element["type"] === "custom:start") {
        petri_reachability[element["id"]] = { value: 1, type: element["type"] };
      } else if (element["type"] === "custom:connection") {
        this.addElement(
          activity_transiction,
          element["source"],
          element["target"]
        );
        this.addElement(
          transiction_activity,
          element["target"],
          element["source"]
        );
      } else if (
        element["type"] === "custom:atividadeBasica" ||
        element["type"] === "custom:atividadeComposta" ||
        element["type"] === "custom:end"
      ) {
        petri_reachability[element["id"]] = { value: 0, type: element["type"] };
      }

      id_elements[element["id"]] = element;
    }

    return [
      transiction_activity,
      activity_transiction,
      petri_reachability,
      id_elements
    ];
  }

  setTitle(name) {
    this.setState({ title_network: name });
  }

  backToNetwork = () => {
    this.saveSubNetwork(this.state.subNetworkID);
    this.clearNetwork();

    var networks = this.state.networks;
    var customElements = networks.pop();

    this.setState({ networks });

    var este = this;
    setTimeout(function () {
      este.setState({ subNetworkID: customElements.key });
      este.modeler.addCustomElements(customElements.value);
    }, 100);
  };

  addElement(object, key, value) {
    if (object[key]) {
      object[key].push(value);
    } else {
      object[key] = [value];
    }
  }

  selectActivity(e) {

    var vetor_result = this.getStatusXml(this.modeler.getCustomElements());
    var activity_elements = vetor_result[3];

    var list_sources_names = [];
    var list_sources_objects = [];

    for (var key in activity_elements) {
      if (activity_elements[key].hasOwnProperty("target") && activity_elements[key]["target"] === e.element.id) {
        list_sources_names.push(activity_elements[key]["source"]);
      }
    }
    list_sources_names.forEach(function (key) {
      if (activity_elements[key].hasOwnProperty("suggestion_uuid")) {
        list_sources_objects.push(activity_elements[key]);
      }
    })


    this.setState({
      current_element: e.element,
      openConfigNode: true,
      associated_activities: list_sources_objects,
    });

    if (e.element.type === "custom:atividadeBasica") {
      this.props.openDialogConfig("activity_config", this.state.current_element.suggestion_uuid, this.state.id_network);
    }
    else if (e.element.type === "custom:transicao") {
      this.props.openDialogConfig("transction_config", null, this.state.id_network);
    }
  }

  toggleFullScreen(elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
      if (elem.requestFullScreen) {
        elem.requestFullScreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  getActivity(id) {
    const that = this;

    userService.sendGETRequest(
      "/users/activity/get/id",
      { id: id },
      function (response) {

        that.setState({ title_network: response["name"] });

        that.modeler.addCustomElements(JSON.parse(response["all_data"]));

      }
    );
  }

  getSubNetwork = id_subnetwork => {
    var networks = this.state.networks;
    networks.push({
      key: this.state.subNetworkID,
      value: this.modeler.getCustomElements()
    });

    this.setState({ networks });

    this.clearNetwork();
    var este = this;
    userService.sendGETRequest(
      "/users/activity/subnetwork/get/id",
      { id_activity: this.state.id_network, id_subnetwork: id_subnetwork },

      function (result) {
        este.setState({ subNetworkID: result["uuid"] });

        setTimeout(function () {
          este.modeler.addCustomElements(JSON.parse(result["all_data"]));
        }, 100);
      }
    );
  };

  saveSubNetwork = id_subnetwork => {
    userService.sendPOSTRequest("/users/activity/subnetwork/save", {
      id_activity: this.state.id_network,
      id_subnetwork: id_subnetwork,
      data: JSON.stringify(this.modeler.getCustomElements())
    });
  };

  validar = (xml) => {
    var vetor_result = this.getStatusXml(xml);

    var transiction_activity = vetor_result[0];
    var activity_transiction = vetor_result[1];

    //var petri_reachability = vetor_result[2];
    //var id_names = vetor_result[3];

    //network_petris.checkNext( petri_reachability, activity_transiction, transiction_activity, id_names , this.handleClickVariant);
    deadlockManager.checkErrors(activity_transiction, transiction_activity);
  }

  render() {
    const { title_network, id_network } = this.state;

    return (
      <div className="App">
        <div>
          <div
            style={{ textAlign: "left", width: "50%", display: "inline-block" }}
          >
            {!this.state.networks.isEmpty() && (
              <Tooltip title="Voltar">
                <IconButton onClick={this.backToNetwork} aria-label="Salvar">
                  <FontAwesomeIcon
                    color="#000"
                    size="lg"
                    icon={["fas", "arrow-circle-left"]}
                  />
                </IconButton>
              </Tooltip>
            )}
            <EditName
              setTitle={this.setTitle.bind(this)}
              id_network={id_network}
              content={
                <div>
                  <FontAwesomeIcon
                    color="#000"
                    size="lg"
                    icon={["fas", "pencil-alt"]}
                    style={{ marginRight: 5 }}
                  />{" "}
                  {title_network}
                </div>
              }
            />
          </div>
          <div
            className=""
            style={{
              textAlign: "right",
              width: "50%",
              display: "inline-block"
            }}
          >
            <Tooltip title="Salvar" onClick={this.saveButton.bind(this)}>
              <IconButton aria-label="Salvar">
                <FontAwesomeIcon
                  color="#000"
                  size="lg"
                  icon={["fas", "save"]}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Expandir"
              onClick={() => this.toggleFullScreen(document.body)}>
              <IconButton aria-label="Expandir">
                <FontAwesomeIcon
                  color="#000"
                  size="lg"
                  icon={["fas", "expand-arrows-alt"]}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div className="content with-diagram" id="js-drop-zone">
          <div
            style={{ height: "calc(100vh - 50px)", minHeight: 470 }}
            className="canvas"
            id="canvas"
          ></div>
        </div>

        <ConfigNode getProperties={this.getProperties} setProperties={this.updateProperties} />
        <ConfigTransiction associated_activities={this.state.associated_activities} getProperties={this.getProperties} setProperties={this.updateProperties} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ dialog: state.dialog });

const mapDispatchToProps = dispatch => ({
  openDialogConfig(name, uuid, id_network) {
    dispatch(dialogActions.openDialog(name, uuid, id_network))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditNetwork);
