import {useQueries, useQuery} from "react-query";
import {getMovieDetail, getMovies, IMovieDetail, IMoviesResult} from "../api";
import styled from "styled-components";
import {makeImgPath} from "../utils";
import {motion, AnimatePresence, useViewportScroll} from "framer-motion";
import {useState} from "react";
import {useMatch, useNavigate} from "react-router-dom";


const Wrapper = styled.div`
  background: black;
  padding-bottom: 100px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
  url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 65px;
  padding-top: 10vh;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 45%;
`;

const Slider = styled.div`
  position: relative;
  top: -150px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    transform-origin: left center;
  }

  &:last-child {
    transform-origin: right center;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  font-weight: bold;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieModal = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 58vw;
  right: 0;
  left: 0;
  margin: 0 auto;
  background-color: ${props => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const ModalCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  
`;

const ModalTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 10px;
  font-size: 43px;
  position: relative;
  top: -60px;
`;


const ModalOverview = styled.p`
  padding: 20px;
  top: -70px;
  position: relative;
  color: ${props => props.theme.white.lighter};
`;


// Variants...

// slider variants
const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
}

const boxVariants = {
    normal: {
        scale: 1
    },
    hover: {
        scale: 1.15,
        y: -80,
        transition: {
            delay: 0.5,
            duration: 0.5,
            type: "tween"
        },
    }
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.5,
            type: "tween",
        },
    },
}

const offset = 6;

function Home() {
    // 1. query 에 기본 key 제공. 개수가 한 개가 아니므로 array 로 묶어서 입력. 입력값은 id 로 이용된다.
    // 2. 이후 적절한 fetcher(= api.ts 에 설정한 fetch()) 를 import.
    const bigMovieMatch = useMatch("/movies/:movieId");
    const movieId = `${bigMovieMatch?.params.movieId}`;
    const {data, isLoading} = useQuery<IMoviesResult>(["movies", "nowPlaying"], getMovies);
    // const {data: mvData} = useQuery<IMovieDetail>(["mvDetail"], getMovieDetail());
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    // Modal
    // useHistory 가 react-router-dom 6 부터 deprecate 되었다.
    // useNavigate 가 역할을 대신한다.
    const navigate = useNavigate();

    // leaving 이 true 라면 아무것도 하지 않고, false 라면 else 이하를 실행.
    const increaseIndex = () => {
        if (data) {
            if (leaving) {
                return;
            } else {
                toggleLeaving();
                const totalMovies = data?.results.length - 1;
                const maxIndex = Math.floor(totalMovies / offset) - 1;
                setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
            }
        }
    };

    // increaseIndex 에서 true 가 된 leaving 을 다시 false 로 돌리기 위한 function
    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    };

    // Box Modal

    const {scrollY} = useViewportScroll();

    const onBoxClicked = (movieId: number) => {
        // = history.push("**")
        navigate(`/movies/${movieId}`);
    }
    const onOverlayClicked = () => {
        navigate("/");
    }
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results
        .find((movie) => String(movie.id) === bigMovieMatch.params.movieId);



    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        onClick={increaseIndex}
                        bgPhoto={makeImgPath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        {/* variants 를 이용하여 animation 을 실행하나,
                        component 가 mount 될 때 initial 값이 최초로 실행되는 것을 강제로 막는다. */}
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row
                                key={index}
                                variants={rowVariants}
                                initial={"hidden"}
                                animate={"visible"}
                                exit={"exit"}
                                transition={{type: "tween", duration: 1.2}}
                            >
                                {data?.results.slice(1)
                                    .slice(offset * index, offset * index + offset)
                                    .map(movie => (
                                        <Box
                                            key={movie.id}
                                            layoutId={movie.id + ""}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{type: "tween"}}
                                            onClick={() => onBoxClicked(movie.id)}
                                            bgPhoto={makeImgPath(movie.backdrop_path, "w500")}

                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>

                    <AnimatePresence>
                        {bigMovieMatch?.pattern.end === true ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClicked}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                />
                                <MovieModal
                                    layoutId={bigMovieMatch.params.movieId}
                                    style={{top: scrollY.get() + 50,}}
                                >
                                    {clickedMovie &&
                                    <>
                                        <ModalCover style={{
                                            backgroundImage:
                                                    `linear-gradient(to top, black, transparent), 
                                                    url( ${makeImgPath(clickedMovie.backdrop_path, "w500")})`
                                        }}/>
                                        <ModalTitle>{clickedMovie.title}</ModalTitle>
                                        <ModalOverview>{clickedMovie.overview}</ModalOverview>
                                    </>
                                    }
                                </MovieModal>
                            </>
                        ) : null}
                    </AnimatePresence>

                </>
            )}
        </Wrapper>
    );
}

export default Home;