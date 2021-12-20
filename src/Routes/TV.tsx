import styled from "styled-components";
import {AnimatePresence, motion, useViewportScroll} from "framer-motion";
import {useMatch, useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import {getTvShow,ITvShowsResult} from "../api";
import {useEffect, useState} from "react";
import {makeImgPath} from "../utils";

const TvWrapper = styled.div`
  background: black;
  padding-bottom: 100px;
`;

const TvLoader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TvBanner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
  url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const TvTitle = styled.h2`
  font-size: 65px;
  padding-top: 10vh;
  margin-bottom: 20px;
`;

const TvOverview = styled.p`
  font-size: 25px;
  width: 45%;
`;

const TvSlider = styled.div`
  position: relative;
  top: -150px;
`;

const TvRow = styled(motion.div)`
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const TvBox = styled(motion.div)<{ bgPhoto: string }>`
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

const TvInfo = styled(motion.div)`
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

const TvOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const TvModal = styled(motion.div)`
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

const TvModalCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;

`;

const TvModalTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 10px;
  font-size: 43px;
  position: relative;
  top: -60px;
`;


const TvModalOverview = styled.p`
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

function TV() {
    // 1. query 에 기본 key 제공. 개수가 한 개가 아니므로 array 로 묶어서 입력. 입력값은 id 로 이용된다.
    // 2. 이후 적절한 fetcher(= api.ts 에 설정한 fetch()) 를 import.
    const bigTvMatch = useMatch("/tv/:tvId");
    const {data, isLoading} = useQuery<ITvShowsResult>(["TV", "onTheAir"], getTvShow);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    // Modal
    // useHistory 가 react-router-dom 6 부터 deprecate 되어 useNavigate 가 역할을 대신한다.
    const navigate = useNavigate();

    // leaving 이 true 라면 아무것도 하지 않고, false 라면 else 이하를 실행.
    const increaseIndex = () => {
        if (data) {
            if (leaving) {
                return;
            } else {
                toggleLeaving();
                const totalTvs = data?.results.length - 1;
                const maxIndex = Math.floor(totalTvs / offset) -1;
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

    const onBoxClicked = async (TvId: number) => {
        // = history.push("**")
        navigate(`/tv/${TvId}`);

    }
    const onOverlayClicked = () => {
        navigate("/tv");
    }
    const clickedTv = bigTvMatch?.params.tvId && data?.results
        .find((tv) => String(tv.id) === bigTvMatch.params.tvId);



    return (
        <TvWrapper>
            {isLoading ? (
                <TvLoader>Loading...</TvLoader>
            ) : (
                <>
                    <TvBanner
                        onClick={increaseIndex}
                        bgPhoto={makeImgPath(data?.results[0].backdrop_path || "")}
                    >
                        <TvTitle>{data?.results[0].name}</TvTitle>
                        <TvOverview>{data?.results[0].overview}</TvOverview>
                    </TvBanner>
                    <TvSlider>
                        {/* variants 를 이용하여 animation 을 실행하나,
                        component 가 mount 될 때 initial 값이 최초로 실행되는 것을 강제로 막는다. */}
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <TvRow
                                key={index}
                                variants={rowVariants}
                                initial={"hidden"}
                                animate={"visible"}
                                exit={"exit"}
                                transition={{type: "tween", duration: 1.2}}
                            >
                                {data?.results.slice(1)
                                    // offset 6 index 19
                                    .slice(offset * index, offset * index + offset)
                                    .map(tv => (
                                        <TvBox
                                            key={tv.id}
                                            layoutId={tv.id + ""}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{type: "tween"}}
                                            onClick={() => onBoxClicked(tv.id)}
                                            bgPhoto={makeImgPath(tv.backdrop_path, "w400")}
                                        >
                                            <TvInfo variants={infoVariants}>
                                                <h4>{tv.name}</h4>
                                            </TvInfo>
                                        </TvBox>
                                    ))
                                }
                            </TvRow>
                        </AnimatePresence>
                    </TvSlider>

                    <AnimatePresence>
                        {bigTvMatch?.pattern.end === true ? (
                            <>
                                <TvOverlay
                                    onClick={onOverlayClicked}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                />
                                <TvModal
                                    layoutId={bigTvMatch.params.tvId}
                                    style={{top: scrollY.get() + 50,}}
                                >
                                    {clickedTv &&
                                    <>
                                        <TvModalCover style={{
                                            backgroundImage:
                                                `linear-gradient(to top, black, transparent), 
                                                    url( ${makeImgPath(clickedTv.backdrop_path, "w500")})`
                                        }}/>
                                        <TvModalTitle>{clickedTv.name}</TvModalTitle>
                                        <TvModalOverview>{clickedTv.overview ? clickedTv.overview : "No Overview"}</TvModalOverview>
                                    </>
                                    }
                                </TvModal>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </TvWrapper>
    );
}

export default TV;