function fixValues(obj) {
  for (var property in obj) {
    if (obj[property] == null) {
      delete obj[property];
    }

    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object") {
        fixValues(obj[property]);
      }
    }
  }
}

function delete_item(obj, search_property, value) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object") {
        if (
          obj[property].hasOwnProperty(search_property) &&
          obj[property][search_property] === value
        ) {
          delete obj[property];
          return;
        } else {
          delete_item(obj[property], search_property, value);
        }
      }
    }
  }
}

function update_item(obj, id, new_property, value) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object") {
        update_item(obj[property], id, new_property, value);
      } else if (property === "id" && obj[property] === id) {
        obj[new_property] = value;
      }
    }
  }
}

export {
    fixValues, 
    delete_item,
    update_item
};