import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from '../syntax-highlight/syntax-highlight';
import './_markdown-render.scss';
import RemarkMathPlugin from 'remark-math';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

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
                <BlockMath math={props.value} />,
            inlineMath: (props) =>
                <InlineMath math={props.value} />
        }
    };
    
    return (

        <div className='markdown-render'>
            <ReactMarkdown {...newProps}/>
        </div>
        
    );
}
// this is new
export default MdRender;