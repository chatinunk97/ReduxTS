# Redux with TS

Project idea : A search engine for NPM

we're calling the NPM packeges repo
since packages is a reserved word in TS

# Implementing Reducer

Start from setting up the reducer
The reducer is where we define which action type does what
Most of the time, to define which the dispatched action does something we setup a reducer function as a switch case style

-- JS style --

```
const reducer = (state: RepositoriesState, action: any) => {
  switch (action.type) {
    case "search_repositories":
      return { loading: true, error: null, data: [] };
    case "search_repositories_success":
      return { loading: false, error: null, data: action.payload };
    case "search_repositories_error":
      return { loading: false, error: action.payload, data: [] };
    default:
      return state;
  }
}
```

Utilize TS

Telling the output of the reducer
well the reducer needs to return the state which we can configure using TS

```
interface RepositoriesState {
  loading: boolean;
  error: string | null;
  data: string[];
}

const reducer = (state: RepositoriesState, action: any): RepositoriesState => {
    ..
    ..
```

# TS with Payload

Sinc we are defining which action does what
we do know how the action object looks like so it will be handy to create interfacs for each action ob
So TS can help us detect error for example if we called action.payload but the action obj of that choic does not have an payload property we will not straight away

```
interface SearchRepositories {
  type: "search_repositories";
}
interface SearchRepositoriesSuccessAction {
  type: "search_repositories_success";
  // a list of NPM packages
  payload: string[];
}
interface SearchRepositoriesErrorAction {
  type: "search_repositories_error";
  // error message as a string
  payload: string;
}
```

Then we apply to the argument that the reducer will get, action obj

```
const reducer = (
  state: RepositoriesState,
  action:
    | SearchRepositories
    | SearchRepositoriesSuccessAction
    | SearchRepositoriesErrorAction
    .
    .
```

Remember that a reducer function is a switch case (or a if /else if)
so it's a "typeguard" for us now

Make it more reuseable using a type

```
type Action =
  | SearchRepositories
  | SearchRepositoriesSuccessAction
  | SearchRepositoriesErrorAction;

const reducer = (
  state: RepositoriesState,
  action: Action
): RepositoriesState => {
```

# Type vs interface vs Object Literal

```
Usage Considerations:

- Use type when you need to create a union, intersection, or a type alias.
- Use interface when defining the shape of an object or when you want to use declaration merging.
- Use object literal syntax for inline type annotations when you don't need to reuse the type definition elsewhere.
```

use ENUM again to avoid typo

```
enum ActionType {
  SEARCH_REPOSITORIES = "search_repositories",
  SEARCH_REPOSITORIES_SUCCSS = "search_repositories_success",
  SEARCH_REPOSITORIES_ERROR = "search_repositories_error",
}
```

# Organizing Folder

We move all the actions definition (interface) to another file
then we have action-types that is again required to create an action

So action's index.ts would import the action-types to define the actions
Then export to the reducers again to construct the reducer's function with TS completely

Just one note about the folder structure
Now we have only index.ts file per each directory
but when the app starts growing we can seperate it like a context in react and then summarize the export in index file

This way of structuring the folder will be more readable and also easy to debug

# Action Creators

Now we've setup

1. Reducers (takes in an action obj and tells what will it do)
2. Defining the Actions this is for using with the Reducers since we're using TS the Reducers function must know what it should expect and what should it produce as a result

So now we are going to setup the action creators which will be the one who
creates the action and dispatch (send it to the reducer) and do stuff

# Axios

Before going into Action Creators let's clarify some Axios stuff

```
      const { data } = await axios.get(
        "https://registry.npmjs.org/-/v1/search",
        {
          params: {
            text: term,
          },
        }
      );
```

In Axios we can configure the "params" object which this doesn't refer to the
https Path Parameter but it's the Query Parameters

Path Parameters like

```
/users/{userId}
```

and Query Parameters are like

```
/search?query=searchTerm&limit=10
```

# Action Creator : Dispatching actions

We are breaking now the process in to 3 possible ways of dispatching
which are the same as the action types

When we're fetching data there are 3 possible ways that we want to display the data

1. It's loading (fetching)
2. It's OK => Display the data
3. It's NG => Display Error

so This searchRepositories is just a function that returns a async function that
dispatch actions in this order

1. Ivoked => dispatch the action of type SEARCH_REPOSITORES
   Now it will display loading clear current data / clear error message

2. The function goes to the next stop which is the trycatch
   the trycatch begins to fetch the data using axios

Now there are 2 possible outcome

2.1 OK => dispatch an action of type SEARCH_REPO...\_SUCCESS
then it begins the return a new state showing loading false and the data

2.2 NG => dispath an action of type SEARCH\_....ERROR
showing loading false and then the error message

```
export const searchRepositories = (term: string) => {
  return async (dispatch: any) => {
    dispatch({
      type: ActionType.SEARCH_REPOSITORIES,
    });

    try {
      const { data } = await axios.get(
        "https://registry.npmjs.org/-/v1/search",
        {
          params: {
            text: term,
          },
        }
      );

      const names = data.objects.map((result: any) => {
        return result.package.name;
      });

      dispatch({
        type: ActionType.SEARCH_REPOSITORIES_SUCCSS,
        payload: names,
      });
    } catch (error) {
      //Checking whether error is an Intance of class Error
      if (error instanceof Error) {
        dispatch({
          type: ActionType.SEARCH_REPOSITORIES_ERROR,
          payload: error.message,
        });
      }
    }
  };
};

```

But now our dispatch type is Any which is not helping us very much
if we change the the payload to something that does not match the Action definition in our action folder TS does not tell us
So we will be using a Generic type here

```
import { Action } from "../actions";
import { Dispatch } from "redux";
.
.
.
export const searchRepositories = (term: string) => {
  return async (dispatch: Dispatch<Action>) => {
    .
    .

```

Now if we are going to call a dispatch with a type SUCCESS
our payload must be string[] only

This is linked back to our Action definition

The dispatching action obj must match one of this interface
so if the type is SUCCESS there's only one way to successfully fullfill this interface which is to have payload of type string[]

```
export type Action =
  | SearchRepositories
  | SearchRepositoriesSuccessAction
  | SearchRepositoriesErrorAction;


```

# Redux Store

Now we setup the Action creator, time to wire up everything

- CombineReducer (Wiring up every reducer together)

```
export const store = createStore(reducers, {}, applyMiddleware(thunk));
// createStore( <reducer> , <initialState> , applyMiddleware(<middleWare>))

```

thunk is a middleware to handle async stuff in redux

# Provider

Now we setup everything time to give acccess to the store to components

```
export default function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>Search for a package</h1>
        <RepositoriesList />
      </div>
    </Provider>
  );
}
```

# useDispatch

useDispatch allow us to dispatch function so we can dispatch an action creator
It is used with an action creator

Now in order to dispatch we need to specify which action in the action creator we want to use (in this case there's only 1 ; searchRepo)

```
  const dispatch = useDispatch();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(actionCreators.searchRepositories(term) as any);
  };
```

in the action creator's index.ts we export it normally so we got an object out of it so we need to .searchRepo

The reason why we can just use dispatch without referencing the store
is because we already tell that this component is related to the store in App.tsx

\*Look it at a context provider way it's simillar

```
  <Provider store={store}>
      <div>
        <h1>Search for a package</h1>
        <RepositoriesList />
      </div>
    </Provider>
```

But it's too long to type all useDispatch and actionCreators
so we gonna utilize the custom Hook (like in useContext for components under a context provider)

```
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

export const useActions = () => {
  const dispatch = useDispatch();

  bindActionCreators(actionCreators, dispatch);
};


```

Technically it's just putting all code in a custom hook file to reuse it easily

# useSelector from React-redux

```
import { useSelector } from "react-redux";
const state = useSelector((state) => state);

#Again we don't need to call or to refer to the state because this component is already under <Provider store={store}> ...
#A hook to access the redux store's state. This hook takes a selector function as an argument. The selector is called with the store state.
```

Getting entire STATE from our Redux Store
we can use the useSelector to scope down which item we want from the store

The problem now us the 'state' in the useSelector argument
React-Redux will never know what the states looks like
for example if we have multiple reducers and it looks completely different that TS can't help us debug the code

so if you want a shortcut => use type any which is meaningless since we are using TS to help us with the type thing

The solution is below

So we go to the reducer and use the TS built-in helper Utility type
basically just saying that this Type is the type that comes out of that function

```
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";
import repositoriesReducer from "./repositoriesReducer";

const reducers = combineReducers({
  repositories: repositoriesReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;


```

If we hover above RootState it will now show

```
type RootState = {
    repositories: RepositoriesState;
}
```

Now we can ust plug this RootState in the state type annotation BUT
it's not that useable and we do have custom hook like above (useDispatch) so we're going to create a custom hook for this one as well

```
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

export const useTypeSelector: TypedUseSelectorHook<RootState> = useSelector;

```

We can plug it in to the RepositoriesList

```
import { useTypeSelector } from "../hooks/useTypedSelector";
.
.
.
const state = useTypeSelector((state) => state.repositories);

```

Well this is the way the document says to communicate type information over React-Redux

Good practice to take from this Project

1. Create a root file index.ts for every repo to centralize the exporting / importing
2. Communicating type over component may be very challenging = > Follow the document ! (look at the customHook file : useTypedSelector.ts)
