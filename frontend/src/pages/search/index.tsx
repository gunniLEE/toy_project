import { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchResultAll from './SearchResultAll';
import SearchResultDocument from './SearchResultDocument';
import SearchResultImage from './SearchResultImage';
// import SearchResultVideo from './SearchResultVideo';

const Search = ({ keyword, setKeyword }: any) => {
    const isChangedType = useRef<boolean>(false);

    return (
        <Routes>
            <Route path="" element={<SearchResultAll keyword={keyword} setKeyword={setKeyword} type="" isChangedType={isChangedType} />} />
            <Route path="/document" element={<SearchResultDocument keyword={keyword} setKeyword={setKeyword} type="document" isChangedType={isChangedType} />} />
            <Route path="/image" element={<SearchResultImage keyword={keyword} setKeyword={setKeyword} isChangedType={isChangedType} />} />
            {/* <Route path="/video" element={<SearchResultVideo keyword={keyword} setKeyword={setKeyword} type="video" isChangedType={isChangedType} />} /> */}
        </Routes>
    );
};

export default Search;