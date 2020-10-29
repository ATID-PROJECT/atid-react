import { dialogConstants } from '../_constants';

function openDialog(name, uuid, id_network) {
    return {
      type: dialogConstants.OPEN,
      name: name,
      uuid: uuid,
      id_network: id_network,
    }
}
function closeDialog(name) {
    return {
      type: dialogConstants.CLOSE,
      name: name,
      uuid: "",
      id_network: "",
    }
}

export const dialogActions = {
    openDialog,
    closeDialog,
};