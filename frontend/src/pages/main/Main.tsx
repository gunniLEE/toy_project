import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import * as S from './Main.styled';

const Main = ({ keyword, setKeyword }: any) => {
    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.Nav>
                    <S.LinkOfLoginPage to="/login">로그인</S.LinkOfLoginPage>
                </S.Nav>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    <S.Div>
                        <Input layoutName="main" type="" keyword={keyword} setKeyword={setKeyword} />
                        {/* <S.ButtonOfSearchTypeWrapper>
                            <S.Button onClick={() => { alert('서비스 준비중입니다.'); }}>선수별 검색</S.Button>
                            <S.Button onClick={() => { alert('서비스 준비중입니다.'); }}>챔피언별 검색</S.Button>
                            <S.Button onClick={() => { alert('서비스 준비중입니다.'); }}>팀별 검색</S.Button>
                        </S.ButtonOfSearchTypeWrapper> */}
                    </S.Div>
                </S.Section>
            </S.Main>
            <Footer layoutName="main" />
        </S.DivOfLayoutWrapper>
    );
};

export default Main;