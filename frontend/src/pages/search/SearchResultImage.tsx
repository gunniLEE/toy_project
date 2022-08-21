import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ReactModal from 'react-modal';
import doAxiosRequest from '../../functions/doAxiosRequest';
import { re } from '../../functions/re-template-tag';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import * as S from './SearchResultImage.styled';
import * as Svg from '../../components/svg/Svg';

const SearchResultImage = ({ isAuthorized, setIsAuthorized, keyword, setKeyword }: any) => {
    const BASE_URL: string = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    // for location
    const { search } = useLocation();

    // for result
    interface Result {
        meta: any;
        data: any;
    }
    const [result, setResult] = useState<Result>({ meta: {}, data: [] });
    const [modalIsOpen, setModalIsOpen] = useState<Array<boolean>>([]);
    const [keywordForDetectOfSetPageEffect, setKeywordForDetectOfSetPageEffect] = useState<string>(decodeURI(search.split('query=')[1]));
    const [keywordForDetectOfFetchEffect, setKeywordForDetectOfFetchEffect] = useState<string>(decodeURI(search.split('query=')[1]));
    const openModal = (idx: number): void => {
        const newModalIsOpen = [...modalIsOpen];
        newModalIsOpen[idx] = true;
        setModalIsOpen(newModalIsOpen);

        document.body.style.overflow = 'hidden';
    };
    const closeModal = (idx: number): void => {
        const newModalIsOpen = [...modalIsOpen];
        newModalIsOpen[idx] = false;
        setModalIsOpen(newModalIsOpen);

        document.body.style.overflow = '';
    };
    const listRef = useRef<any>();
    const itemsRef = useRef<Array<HTMLLIElement>>([]);

    // for pagination
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(false);
    const loader = useRef(null);

    const handleObserver = useCallback((entries: any) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev: number): number => prev + 1);
        }
    }, []);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) {
            observer.observe(loader.current);
        }
    }, [handleObserver]);

    // for sort
    const listOfOrder = [
        { name: '유사도순', value: 'score' },
        { name: '최신순', value: 'desc' },
        { name: '과거순', value: 'asc' },
    ];
    const [order, setOrder] = useState<string>('score');
    const [orderIsActive, setOrderIsActive] = useState<Array<boolean>>([true, false, false]);
    const [orderForDetectOfFetchEffect, setOrderForDetectOfFetchEffect] = useState<string>('score');

    // for type
    const listOfResultDataTypeMenu = [
        { id: 1, link: `/search/?query=${decodeURI(search.split('query=')[1])}`, name: '전체', svg: <Svg.All active={false} /> },
        { id: 2, link: `/search/document?query=${decodeURI(search.split('query=')[1])}`, name: '문서', svg: <Svg.Document active={false} /> },
        { id: 3, link: `/search/image?query=${decodeURI(search.split('query=')[1])}`, name: '포토', svg: <Svg.Image active={true} /> },
        // { id: 4, link: `/search/video?query=${decodeURI(search.split('query=')[1])}`, name: '영상', svg: <Svg.Video active={false} /> },
    ];

    useEffect(() => {
        setKeyword(decodeURI(search.split('query=')[1]));
        setKeywordForDetectOfSetPageEffect(decodeURI(search.split('query=')[1]));

        setOrder('score');
        setOrderIsActive([true, false, false]);
    }, [search]);

    useEffect(() => {
        setResult({ meta: {}, data: [] });
        setKeywordForDetectOfFetchEffect(decodeURI(search.split('query=')[1]));

        setOrderForDetectOfFetchEffect(order);

        setPage(1);
    }, [order, keywordForDetectOfSetPageEffect]);

    useEffect(() => {
        const fetchData = (): void => { // 나중에 useCallback으로 바꿀까?
            const paramsOfSearch = {
                query: decodeURI(search.split('query=')[1]),
                page,
                order,
                isImageRequest: true,
            };
            setLoading(true);
            doAxiosRequest('GET', `${BASE_URL}/search/keyword`, paramsOfSearch)
                .then((resultData: any): void => {
                    setResult((prev: Result): Result => ({ meta: resultData.data.meta, data: [...prev.data, ...resultData.data.data] }));
                    setModalIsOpen(resultData.data.data.map((): boolean => false));
                }).then(() => {
                    setLoading(false);
                }).catch((err: any) => {
                    setError(err);
                });
            const paramsOfInsert = {
                word: decodeURI(search.split('query=')[1])
            };
            doAxiosRequest('POST', `${BASE_URL}/word`, paramsOfInsert).then((resultData: any): void => {
                console.log(resultData);
            });
        };

        fetchData();
    }, [keywordForDetectOfFetchEffect, orderForDetectOfFetchEffect, page]);

    const imagesOnLoad = (idx: number, arr: any) => {
        const maxCount = listRef.current.dataset.columns;

        const getHeight = (item: HTMLLIElement) => {
            let elmMargin = 0;
            let elmHeight = Math.ceil(item.offsetHeight);

            elmMargin += Math.ceil(parseFloat(getComputedStyle(item).marginTop));
            elmMargin += Math.ceil(parseFloat(getComputedStyle(item).marginBottom));

            return elmHeight + elmMargin;
        }
        const calculateMasonryHeight = (itemsRef: any) => {
            let index = 0;
            const columns: any = [];

            itemsRef.current.forEach((item: HTMLLIElement) => {
                console.log(item);
                if (item) {
                    if (!columns[index]) {
                        columns[index] = getHeight(item);
                    } else {
                        columns[index] += getHeight(item);
                    }
                    index === maxCount - 1 ? index = 0 : index++;
                }
            });
            const maxHeight = Math.max(...columns); // 5개 column 중에 최대 높이
            listRef.current.style.height = maxHeight + 'px';
            itemsRef.current = [];

            console.log(maxHeight);
        };

        if (idx === arr.length - 1) { // 모든 이미지가 로드돼서 사이즈 계산 끝난 시점
            calculateMasonryHeight(itemsRef);
        }
    }

    const onChangeRef = useCallback((element: HTMLLIElement, idx: number) => {
        itemsRef.current[idx] = element;
    }, []);

    const elementsOfESDocument = result.data.length !== 0 ? result.data.map((document: any, idx: number, arr: any): JSX.Element =>
        <S.LiOfImageWrapper ref={(element: HTMLLIElement) => {
            onChangeRef(element, idx);
        }} key={document._id} id={document._id} >
            <S.ImgOfContent onLoad={(): void => { imagesOnLoad(idx, arr); }} src={document._source.thumbnail} onClick={(): void => { openModal(idx); }} />
            <ReactModal isOpen={modalIsOpen[idx]} onRequestClose={(): void => { closeModal(idx); }} preventScroll={false} ariaHideApp={false}>
                <S.DivOfModalWrapper>
                    <S.DivOfSpanModalCloseWrapper>
                        <S.SpanOfModalClose onClick={(): void => { closeModal(idx); }}>&times;</S.SpanOfModalClose>
                    </S.DivOfSpanModalCloseWrapper>
                    <S.DivOfModalTitle>{document._source.title.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                        pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfTitle}</S.StrongOfKeyword>) : pieceOfTitle)}
                    </S.DivOfModalTitle>
                    <S.DivOfModalContent>{document._source.content.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfContent: string) =>
                        pieceOfContent === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfContent}</S.StrongOfKeyword>) : pieceOfContent)}
                    </S.DivOfModalContent>
                    <S.ImgOfModalContent src={document._source.thumbnail} />
                    <S.DivOfModalPCLinkURL>출처 -&nbsp;<S.AOfPCLinkURL href={document._source.pcLinkUrl} target="_blank">{document._source.pcLinkUrl}</S.AOfPCLinkURL></S.DivOfModalPCLinkURL>
                </S.DivOfModalWrapper>
            </ReactModal>
        </S.LiOfImageWrapper>)
        :
        <S.LiOfImageWrapper>
            <h3>검색된 결과가 없습니다.</h3>
        </S.LiOfImageWrapper>;

    const elementsOfResultDataTypeMenu = listOfResultDataTypeMenu.map((resultDataTypeMenu: any): JSX.Element =>
        <S.DivOfResultDataTypeMenuWrapper key={resultDataTypeMenu.id}>
            <S.LinkOfResultDataTypeMenu to={resultDataTypeMenu.link} id={resultDataTypeMenu.id}>
                <S.Span>
                    {resultDataTypeMenu.svg}
                </S.Span>
                {resultDataTypeMenu.name}
            </S.LinkOfResultDataTypeMenu>
        </S.DivOfResultDataTypeMenuWrapper>);

    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.HeaderOfTop>
                    <S.LinkOfLogo to="/" onClick={(): void => { setKeyword(''); }}>
                        <S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    </S.LinkOfLogo>
                    <S.Div>
                        <Input keyword={keyword} setKeyword={setKeyword} layoutName="search" type="image" />
                    </S.Div>
                    <S.Nav>
                        {isAuthorized ?
                            <Dropdown layoutName="search" search={search} setKeyword={setKeyword} setIsAuthorized={setIsAuthorized} />
                            :
                            <S.LinkOfLoginPage to="/login" onClick={(): void => {
                                setKeyword(decodeURI(search.split('query=')[1]));
                            }}>
                                로그인
                            </S.LinkOfLoginPage>}
                    </S.Nav>
                </S.HeaderOfTop>
                <S.HeaderOfBottom>
                    {elementsOfResultDataTypeMenu}
                </S.HeaderOfBottom>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.DivOfLnb>
                        {listOfOrder.map((order: any, idx: number): JSX.Element =>
                            <S.ButtonOfSort
                                orderIsActive={orderIsActive[idx]} onClick={(): void => {
                                    setOrder(order.value);

                                    const newOrderIsActive = listOfOrder.map((): boolean => false);
                                    newOrderIsActive[idx] = true;
                                    setOrderIsActive(newOrderIsActive);
                                }}>
                                {order.name}
                            </S.ButtonOfSort>)}
                    </S.DivOfLnb>
                    <S.UlOfImageListWrapper ref={listRef} data-columns="5">
                        {elementsOfESDocument}
                    </S.UlOfImageListWrapper>
                    {loading && <S.POfLoading>Loading...</S.POfLoading>}
                    {error && <S.POfError>Error!</S.POfError>}
                    <S.DivOfLoader ref={loader} />
                </S.Section>
            </S.Main>
            <Footer layoutName="search" />
        </S.DivOfLayoutWrapper>
    );
};

export default SearchResultImage;