import { ActionType } from "../action-types";
import { Action } from "../actions";
interface RepositoriesState {
  loading: boolean;
  error: string | null;
  data: string[];
}

//An action obj is an obj with a type and/or a payload
// interface Action {
//   type: string;
//   payload?: any;
// }

// to make it better we can scope down how to payload looks
//check action/index.ts
const initialState = {
  loading: false,
  error: null,
  data: [],
};

const reducer = (
  state: RepositoriesState = initialState,
  action: Action
): RepositoriesState => {
  switch (action.type) {
    case ActionType.SEARCH_REPOSITORIES:
      return { loading: true, error: null, data: [] };
    case ActionType.SEARCH_REPOSITORIES_SUCCSS:
      return { loading: false, error: null, data: action.payload };
    case ActionType.SEARCH_REPOSITORIES_ERROR:
      return { loading: false, error: action.payload, data: [] };
    default:
      return state;
  }
};

export default reducer;
