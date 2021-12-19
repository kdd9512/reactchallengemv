const API_KEY = "b1426df157ad864ca8be1238e7928eab";
const BASE_URL = "https://api.themoviedb.org/3";

// 타입 정의 interface

export interface IMovie {
    backdrop_path:string,
    id:number,
    original_language:string,
    overview:string,
    popularity:number,
    poster_path:string,
    release_date:string,
    title:string,
    vote_average:number,
    vote_count: number,
}

export interface IMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results:IMovie[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`)
        .then((resp) => resp.json());
}

