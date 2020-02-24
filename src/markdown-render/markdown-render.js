import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from '../syntax-highlight/syntax-highlight';
import './_markdown-render.scss';
import MathJax from 'react-mathjax';
import RemarkMathPlugin from 'remark-math';


const MdRender = props => {
    const newProps = {
        ...props,
        escapeHtml: false, // enable html rendering
        plugins: [
            RemarkMathPlugin,
        ],
        renderers: {
            ...props.renderers,
            code: CodeBlock,
            math: (props) => 
                <MathJax.Node formula={props.value} />,
            inlineMath: (props) =>
                <MathJax.Node inline formula={props.value} />
        }
    };
    
    return (

        <div className='markdown-render'>
            <MathJax.Provider input="tex">
                <ReactMarkdown {...newProps}/>
            </MathJax.Provider>  
        </div>
        
    );
}
// this is new
export default MdRender;