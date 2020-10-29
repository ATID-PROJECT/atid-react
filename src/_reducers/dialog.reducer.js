import { dialogConstants } from '../_constants';


export function dialog(state = [], action) {
  switch (action.type) {
    case dialogConstants.OPEN:
      return {
        type: 'opened',
        name: action.name,
        uuid: action.uuid,
        id_network: action.id_network,
      };
    case dialogConstants.CLOSE:
      return {
        type: 'closed',
        name: action.name,
        uuid: "",
        id_network: "",
      };
    default:
      return state
  }
}