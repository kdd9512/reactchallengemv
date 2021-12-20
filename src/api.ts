const API_KEY = "b1426df157ad864ca8be1238e7928eab";
const BASE_URL = "https://api.themoviedb.org/3";

// 타입 정의 interface

export interface IMovie {
    backdrop_path: string,
    id: number,
    original_language: string,
    overview: string,
    popularity: number,
    poster_path: string,
    release_date: string,
    title: string,
    vote_average: number,
    vote_count: number,
}

export interface ITV {
    backdrop_path: string;
    first_air_date: string;
    genre_ids: [number, number];
    id: number;
    name: string;
    original_language: string;
    overview: string;
    popularity: number;
    poster_path: string;
    vote_average: number;
    vote_count: number;
}

export interface IMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IMovieDetail {
    genres: {
        id: number;
        name: string;
    };
    original_title: string;
    overview: string;
    poster_path: string;
    production_companies: {
        logo_path: string;
        name: string;
    };
    release_date: string;
    spoken_languages:
        {
            english_name: string;
            name: string;
        };
    vote_average: number;
    vote_count: number;
}

export interface ISearchResult {
    results:
        {
            backdrop_path: string;
            id: number;
            media_type: string;
            original_language: string;
            original_title: string;
            overview: string;
            poster_path: string;
            release_date: string;
            title: string;
            vote_average: number;
            vote_count: number;
        },
}

export interface ITvShowsResult {
    page: number;
    results: ITV[],
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`)
        .then((resp) => resp.json());
}

export function getTvShow() {
    return fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`)
        .then((resp) => resp.json());
}

export function getMovieDetail(movieId: string | undefined) {
    return fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
        .then((resp) => resp.json());
}

export function SearchResult(keyword: string | undefined) {
    return fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}`)
        .then((resp) => resp.json());
}