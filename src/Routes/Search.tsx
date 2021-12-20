import {useLocation} from "react-router-dom";
import {useQuery} from "react-query";
import {ISearchResult, SearchResult} from "../api";


function Search(result:object) {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");

    return (
        <>
            {}
        </>
    );
}

export default Search;