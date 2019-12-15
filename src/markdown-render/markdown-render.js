import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from '../syntax-highlight/syntax-highlight';

const MdRender = props => {
    const newProps = {
        ...props,
        escapeHtml: false, // enable html rendering
        renderers: {
            ...props.renderers,
            code: CodeBlock
        }
    };
    return (
        <div>
            <ReactMarkdown {...newProps}/>
        </div>
        
    );
}
// this is new
export default MdRender;