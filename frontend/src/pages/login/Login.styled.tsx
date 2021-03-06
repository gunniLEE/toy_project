import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';
import urlOfWallpaperbette from '../../assets/wallpaperbette.jpg';

const vertical = css`
    display: flex;
    flex-direction: column;
`;

const center = css`
    justify-content: center;
    align-items: center;
`;

const headerWidth = '130px';

const footerWidth = '100px';

export const DivOfLayoutWrapper = styled.div`
    ${vertical}
    height: 100vh;
    background-image: url(${urlOfWallpaperbette});
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
`;

export const Main = styled.main`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: calc(100vh - (${headerWidth} + ${footerWidth}));
`;

export const Section = styled.section`
    ${vertical}
    align-items: center;
`;

export const Header = styled.header`
    display: flex;
    flex-direction: column;
    height: 130px;
`;

export const Nav = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: end;
    height: 90px;
`;

export const Article = styled.article`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 32px 0 0 0;
    padding: 0 0 32px 0;
`;

export const DivOfLoginForm = styled.div`
    ${vertical}
    ${center}
    width: 100%;
    height: 300px;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    margin: 0 0 10px 0;
    background-color: #fff;
`;

export const DivOfJoinForm = styled.div`
    display: flex;
    flex-direction: row;
    ${center}
    width: 100%;
    height: 63px;
    border: 1px solid #dbdbdb;
    border-radius: 8px; 
    background-color: #fff;
`;

export const ImgOfLogo = styled.img`
    width: 300px;
`;

export const Form = styled.form`
    ${vertical}
    align-items: center;
    width: 348px;
`;

export const Label = styled.label`
    ${vertical}
    width: 268px;
    height: 38px;
    margin: 0 0 6px 0;
`;

export const Span = styled.span`
    position: absolute;
    margin: 0 0 0 7px;
    font-size: 10px;
    line-height: 20px;
    color: #8e8e8e;
`;

export const Input = styled.input`
    height: 100%;
    border: 1px solid;
    border-radius: 3px;
    border-color: #dbdbdb;
    background-color: #fafafa;
    :focus {
        outline: none;
    }
`;

export const Button = styled.button`
    width: 268px;
    height: 30px;
    border: 1px solid;
    border-radius: 4px;
    border-color: #94cf58;
    margin: 8px 0 8px 0;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #94cf58;
    cursor: pointer;
`;

export const P = styled.p`
    font-size: 14px;
`;

export const Link = styled(Link_)`
    font-weight: bold;
    text-decoration: none;
    color: #94cf58;
`;