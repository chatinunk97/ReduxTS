import { ActionType } from "../action-types";

interface SearchRepositories {
  type: ActionType.SEARCH_REPOSITORIES;
}
interface SearchRepositoriesSuccessAction {
  type: ActionType.SEARCH_REPOSITORIES_SUCCSS;
  // a list of NPM packages
  payload: string[];
}
interface SearchRepositoriesErrorAction {
  type: ActionType.SEARCH_REPOSITORIES_ERROR;
  // error message as a string
  payload: string;
}

export type Action =
  | SearchRepositories
  | SearchRepositoriesSuccessAction
  | SearchRepositoriesErrorAction;
