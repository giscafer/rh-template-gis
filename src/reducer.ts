import { ACTION, ACTION_TYPE } from './def';

function reducer(state: any, action: ACTION) {
  switch (action.type) {
    case ACTION_TYPE.CONFIG:
      return { ...state, config: action['config'] };

    case ACTION_TYPE.MAP:
      return { ...state, map: action['map'] };

    case ACTION_TYPE.LOADING:
      return { ...state, loading: action['loading'] };

    case ACTION_TYPE.CURRENTGROUPSHOW:
      return { ...state, currentGroupShow: action['currentGroupShow'] };

    default:
      break;
  }

  return state;
}

export default reducer;
