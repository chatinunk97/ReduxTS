import { useState } from "react";
import { useTypeSelector } from "../hooks/useTypedSelector";
// import { useDispatch } from "react-redux";
// import { actionCreators } from "../state";
import { useActions } from "../hooks/useActions";

const RepositoriesList: React.FC = () => {
  const [term, setTerm] = useState("");
  // const dispatch = useDispatch();
  const { searchRepositories } = useActions();

  const { data, error, loading } = useTypeSelector(
    (state) => state.repositories
  );
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchRepositories(term);
    // dispatch(actionCreators.searchRepositories(term) as any);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={term} onChange={(e) => setTerm(e.target.value)} />
        <button>Search</button>
      </form>
      <div>
        {error && <h3>{error}</h3>}
        {loading && <h3>loading...</h3>}
        {!error && !loading && (
          <ul>
            {data.map((el) => (
              <li key={el}>{el}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default RepositoriesList;
